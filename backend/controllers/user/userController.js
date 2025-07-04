import User from "../../models/user.js";
import ChatMessage from "../../models/chat.js"
import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().min(8).required(),
    age: Joi.string().allow(null, ""),
    gender: Joi.string().allow(null, ""),
    university: Joi.string().allow(null, ""),
    strengths: Joi.array().items(Joi.string()),
    weaknesses: Joi.array().items(Joi.string()),
    marks: Joi.object().pattern(
        Joi.string(),
        Joi.number().min(0).max(100).allow(null)
    ),
});

export const updateUser = async (req, res) => {
    try {
        const updateRequest = await userSchema.validateAsync(req.body);
        const user = req.user; 

        const marks = updateRequest.marks || user.marks; 

        const strengths = [];
        const weaknesses = [];

        for (const subject in marks) {
            const score = parseInt(marks[subject]);
            if (score >= 80) {
                strengths.push(subject); 
            } else {
                weaknesses.push(subject); 
            }
        }

        const updatedUserData = {
            username: updateRequest.username,
            email: updateRequest.email,
            university: updateRequest.university,
            marks: marks,
            strengths: strengths, 
            weaknesses: weaknesses, 
            age: updateRequest.age,
            gender: updateRequest.gender,
        };

        const result = await User.findOneAndUpdate(
            { email: user.email }, 
            updatedUserData, 
            { new: true } 
        );

        const {_id, __v, password, ...updatedUserDataToSend} = result.toJSON();
        console.log(result, updatedUserDataToSend);

        return res.status(200).json({
            message: "User metrics updated successfully.",
            user: updatedUserDataToSend, 
        });

    } catch (error) {
        console.error("Update metrics error:", error);
        return res.status(500).json({ message: "Server error while updating metrics." });
    }
};

export const updateMetrics = async (req, res) => {
    try {
        console.log("Received data:", req.body);

        const { marks } = req.body;
        const user = req.user; 

        if (!user) {
            return res.status(401).json({ message: "Unauthorized." }); 
        }

        if (!marks || typeof marks !== 'object') {
            return res.status(400).json({ message: "Marks should be an object." });
        }

        const strengths = [];
        const weaknesses = [];

        for (const subject in marks) {
            const score = parseInt(marks[subject]);
            if (score >= 80) {
                strengths.push(subject);
            } else {
                weaknesses.push(subject);
            }
        }

        user.strengths = strengths;
        user.weaknesses = weaknesses;
        user.marks = marks;

        await user.save();

        console.log("User updated:", user);

        return res.status(200).json({
            message: "User metrics updated successfully.",
            user: user,     
        });
    } catch (error) {
        console.error("Error updating metrics:", error);
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
};

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
};

export const fetchChats = async (req, res) => {
    const user = req.user;
    const otherUser = await User.findOne({ username: req.headers.username });

    const chatMessages = (await ChatMessage.find({
        $or: [
            { sender: user, recipient: otherUser },
            { sender: otherUser, recipient: user },
        ],
    })
        .select("-_id -__v")
        .populate("sender", "username")
        .populate("recipient", "username")
        .sort({ timestmap: 1 }))
        .map(message => ({
            sender: message.sender.username,
            recipient: message.recipient.username,
            message: message.message,
            timestamp: message.timestamp
          }));

    return res.status(200).json({
        success: true,
        messages: chatMessages,
    });
};

export const postEvents = async (req, res) => {
    try {

        const { events } = req.body;
        const user = req.user; 

        user.events=events;
        user.save();

        console.log("Event succesfully saved");
        console.log(req.body);

    return res.status(200).json({
        success: true,
        messages: events,
    });


    } catch (error) {
        console.error("Error updating metrics:", error);
        return res.status(500).json({ message: "Server error while updating metrics." });
    }
};

export const fetchEvents = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            events: user.events,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return res.status(500).json({
            message: "Server error while fetching events.", success: false });
    }
};

export const postRewards = async (req, res) => {
    try{
        const {user}=req.user;
        const rewards=req.body;

        user.rewards=rewards;
        user.save();

        console.log("Success posting rewards");

        return res.status(200).json(
            {
                rewards: user.rewards,
                success: true,
            }
        );
    }
    catch(error) 
    {
        console.error("Error posting rewards:",rewards)
        return res.status(500).json({
            message: "Server error while posting rewards", success: false
        })
    }
};

export const fetchRewards = (req, res) => {
    try {
        const user=req.user;
        return res.status(200).json({
            message: "Succesfully fetched rewards",
            success: true
        })
    }
    catch(error)
    {
        console.log("Error fetching rewards");
        return res.status(500).json({
            message: "Server error in fetching rewards",
            success: false,
        })
    }
};
