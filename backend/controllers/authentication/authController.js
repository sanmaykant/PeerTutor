import bcrypt from "bcryptjs";
import User from "../../models/user.js";
import { generateToken, verifyToken } from "../../utils/jwt.js";
import { signupSchema, loginSchema } from "./validate.js"

const MSG = {
    serverError: "Server Error.",

    // Signup messages
    emailExists: "Email is already registered.",
    signupSuccess: "You are successfully signed up.",
    signupError: "Unable to create your account.",

    // Login messages
    emailNotExist: "Email not found. Invalid login credentials.",
    loginSuccess: "You are successfully logged in.",
    wrongPassword: "Incorrect password.",
    loginError: "Oops! Something went wrong.",

    // Authorization messages
    notAuthorized: "Not authorized.",
    authorized: "",
};

const userNotFound = () => {
    return res.status(400).json({
        message: MSG.emailNotExist,
        reason: "email",
        success: false
    });
}

const emailExists = () => {
    return res.status(400).json({
        message: MSG.emailExists,
        reason: "email",
        success: false,
    });
}

const signupSuccess = (token) => {
    return res.status(201).json({
        message: MSG.signupSuccess,
        success: true,
        auth_token: token,
    });
}

const serverError = () => {
    return res.status(500).json({
        message: MSG.serverError,
        reason: "server",
        success: false,
    });
}

const incorrectPassword = () => {
    return res.status(400).json({
        message: MSG.wrongPassword,
        reason: "password",
        success: false
    });
}

const loginSuccess = (token) => {
    return res.status(200).json({
        message: MSG.loginSuccess,
        success: true,
        auth_token: token,
    });
}

const notAuthorized = () => {
    return res.status(401).json({
        message: "Not authorized",
        reason: "authentication",
        success: false,
    });
}

const authorized = () => {
    return res.send({
        message: MSG.authorized,
        success: true,
    });
}

const invalidSchema = (errorMsg) => {
    res.status(403).json({
        message: errorMsg,
        reason: "schema",
        success: false,
    });
}

export const signup = async (req, res) => {
    try {
        const signupRequest = await signupSchema.validateAsync(req.body);
        const { username, email, password } = signupRequest;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return emailExists();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        try {
            await newUser.save();
            const token = generateToken(newUser);
            return signupSuccess(token);
        } catch (error) {
            console.error("Signup error:", error);
            return serverError();
        }
    } catch (e) {
        let reason = "";
        if (e.isJoi) {
            reason = "schema";
            invalidSchema(e.message);
        }
    }
};

export const login = async (req, res) => {
    try {
        const loginRequest = await loginSchema.validateAsync(req.body);
        const { email, password } = loginRequest;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return userNotFound();
            }

            if (!(await bcrypt.compare(password, user.password))) {
                return incorrectPassword();
            }

            const token = generateToken(user);
            return loginSuccess(token);
        } catch (error) {
            console.error(error);
            return serverError();
        }
    } catch (e) {
        let reason = "";
        if (e.isJoi) {
            reason = "schema";
            return invalidSchema(e.message);
        }
    }
};

export const logout = (req, res) => {
    res.clearCookie("auth_token");
    return res.status(200).json({ message: "Logged out successfully", success: true });
};

export const authenticate = async (req, res, next) => {
    const token = req.body.auth_token;

    if (!token) {
        return notAuthorized();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return notAuthorized();
    }

    if (req.body.authenticating) {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return userNotFound();
        }

        return authorized();
    }

    next();
};
