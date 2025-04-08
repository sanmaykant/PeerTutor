import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken, verifyToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
    console.log("here");
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists", success: false });
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

    return res.status(201).json({ message: "User registered successfully", success: true, auth_token: token });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const token = generateToken(user);
    return res.status(200).json({ message: "Login successful", success: true, auth_token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const logout = (req, res) => {
  res.clearCookie("auth_token");
  return res.status(200).json({ message: "Logged out successfully", success: true });
};

export const authenticate = async (req, res, next) => {
  const token = req.body.auth_token;

  if (!token) {
    res.status(401).json({ message: "Not authorized", success: false });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: "Not authorized", success: false });
    return;
  }

  if (req.body.authenticating) {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ message: "User does not exist", success: false });
        return;
      }

      res.send({message: "Authorized", "success": true});
      return;
  }

  next();
};
