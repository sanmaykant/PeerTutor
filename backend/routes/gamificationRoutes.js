import express from "express";
import {
    getLeaderboard,
    getUserGamification,
    awardPoints,
    completeSession,
    claimReward,
    getAvailableRewards,
    trackChatActivity,
    trackCallActivity
} from "../controllers/gamification/gamificationController.js";
import { verifyToken } from "../controllers/authentication/authController.js";

const router = express.Router();

// Get leaderboard
router.get("/leaderboard", getLeaderboard);

// Get user's gamification data
router.get("/user", verifyToken, getUserGamification);

// Award points and experience
router.post("/award", verifyToken, awardPoints);

// Complete a study session
router.post("/session", verifyToken, completeSession);

// Track chat activity
router.post("/chat", verifyToken, trackChatActivity);

// Track call activity
router.post("/call", verifyToken, trackCallActivity);

// Claim reward
router.post("/claim", verifyToken, claimReward);

// Get available rewards
router.get("/rewards", verifyToken, getAvailableRewards);

export default router; 