import User from "../../models/user.js";
import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().min(8).required(),
    age: Joi.string().allow(null, ""),
    gender: Joi.string().allow(null, ""),
    university: Joi.string().allow(null, ""),
    strengths: Joi.array().items(Joi.string()),
    weaknesses: Joi.array().items(Joi.string()),
})

export const updateUser = async (req, res) => {
    try {
        const updateRequest = await userSchema.validateAsync(req.body);
        const user = req.user;

        const result = await User.findOneAndUpdate(
            { email: user.email },
            {
                username: updateRequest.username,
                email: updateRequest.email,
                university: updateRequest.university,
                strengths: updateRequest.strengths,
                weaknesses: updateRequest.weaknesses,
            },
            { new: true }
        );


        console.log(user);
        await user.save();

        return res.status(200).json({ message: "User metrics updated successfully.", user });
    } catch (error) {
        console.error("Update metrics error:", error);
        return res.status(500).json({ message: "Server error while updating metrics." });
    }
}

export const updateMetrics = async (req, res) => {
    try {
        const { strengths, weaknesses } = req.body;
        if (!Array.isArray(strengths) || !Array.isArray(weaknesses)) {
            return res.status(400).json({ message: "Strengths and weaknesses should be arrays of strings." });
        }
        if (!strengths.every(item => typeof item === 'string') || !weaknesses.every(item => typeof item === 'string')) {
            return res.status(400).json({ message: "All items in strengths and weaknesses should be strings." });
        }

        const user = req.user;

        user.strengths = strengths;
        user.weaknesses = weaknesses;

        await user.save();

        return res.status(200).json({ message: "User metrics updated successfully.", user });
    } catch (error) {
        console.error("Update metrics error:", error);
        return res.status(500).json({ message: "Server error while updating metrics." });
    }
};

export const fetchMetrics = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            message: "User metrics fetched successfully.",
            metrics: {
                strengths: user.strengths,
                weaknesses: user.weaknesses,
            },
        });
    } catch (error) {
        console.error("Fetch metrics error:", error);
        return res.status(500).json({ message: "Server error while fetching metrics." });
    }
}

export const fetchMatches = async(req, res) => {
    try {
        const user = req.user;

        console.log('Current User:', {
            id: user._id,
            strengths: user.strengths,
            weaknesses: user.weaknesses
        });

        const userStrengths = user.strengths.map(s => s.trim());
        const userWeaknesses = user.weaknesses.map(w => w.trim());

        // Fetch all users excluding the current user
        const allUsers = await User.find({ _id: { $ne: user._id } });

        const matches = [];

        for (const match of allUsers) {
            console.log('Evaluating match:', {
                id: match._id,
                username: match.username,
                strengths: match.strengths,
                weaknesses: match.weaknesses
            });

            const matchStrengths = match.strengths.map(s => s.trim());
            const matchWeaknesses = match.weaknesses.map(w => w.trim());

            const matchedStrengths = matchStrengths.filter(str => userWeaknesses.includes(str));
            const matchedWeaknesses = matchWeaknesses.filter(weak => userStrengths.includes(weak));

            console.log('Matched Strengths:', matchedStrengths);
            console.log('Matched Weaknesses:', matchedWeaknesses);

            if (matchedStrengths.length > 0 && matchedWeaknesses.length > 0) {
                console.log('Match found:', {
                    id: match._id,
                    username: match.username,
                    strengths: matchedStrengths,
                    weaknesses: matchedWeaknesses
                });

                matches.push({
                    username: match.username,
                    email: match.email,
                    university: match.university,
                    strengths: matchedStrengths,
                    weaknesses: matchedWeaknesses
                });
            } else {
                console.log('No mutual benefit found.');
            }
            console.log('---');
        }

        console.log('Final Matches:', );
        res.json({
            success: true,
            matches: matches
        });

    } catch (error) {

    }
}
