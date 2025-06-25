import User from "../../models/user.js";
import ChatMessage from "../../models/chat.js";

// Enhanced XP calculation based on learning activities
const calculateXP = (activities) => {
    let totalXP = 0;
    
    // Study session XP (time-based)
    if (activities.studyTime) {
        // 1 XP per minute of study time
        totalXP += Math.floor(activities.studyTime / 1);
        
        // Bonus for longer sessions (encourage focused study)
        if (activities.studyTime >= 30) totalXP += 50; // 30+ min bonus
        if (activities.studyTime >= 60) totalXP += 100; // 1+ hour bonus
        if (activities.studyTime >= 120) totalXP += 200; // 2+ hour bonus
    }
    
    // Chat interactions XP
    if (activities.chatMessages) {
        // 5 XP per chat message sent
        totalXP += activities.chatMessages * 5;
        
        // Bonus for active conversations
        if (activities.chatMessages >= 10) totalXP += 25; // 10+ messages bonus
        if (activities.chatMessages >= 50) totalXP += 100; // 50+ messages bonus
    }
    
    // Call/Video sessions XP
    if (activities.callSessions) {
        // 20 XP per call session
        totalXP += activities.callSessions * 20;
        
        // Bonus for longer calls
        if (activities.callDuration) {
            totalXP += Math.floor(activities.callDuration / 5); // 1 XP per 5 minutes
        }
    }
    
    // Learning progress XP (based on subjects and marks improvement)
    if (activities.subjectsLearned) {
        totalXP += activities.subjectsLearned * 15; // 15 XP per subject
    }
    
    if (activities.marksImprovement) {
        totalXP += activities.marksImprovement * 2; // 2 XP per mark improvement
    }
    
    // Consistency bonus (daily login streak)
    if (activities.loginStreak) {
        totalXP += activities.loginStreak * 10; // 10 XP per day streak
    }
    
    // Help others bonus
    if (activities.studentsHelped) {
        totalXP += activities.studentsHelped * 25; // 25 XP per student helped
    }
    
    return totalXP;
};

// Get leaderboard with enhanced scoring
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .select('username points level experience stats achievements badges')
            .sort({ points: -1, level: -1, experience: -1 })
            .limit(50);

        // Calculate additional stats for each user
        const enhancedLeaderboard = await Promise.all(
            leaderboard.map(async (user, index) => {
                // Get chat activity for this user
                const chatCount = await ChatMessage.countDocuments({
                    $or: [
                        { sender: user._id },
                        { recipient: user._id }
                    ]
                });

                // Calculate learning efficiency score
                const learningEfficiency = calculateLearningEfficiency(user.stats, chatCount);
                
                return {
                    rank: index + 1,
                    username: user.username,
                    points: user.points,
                    level: user.level,
                    experience: user.experience,
                    stats: user.stats,
                    achievements: user.achievements.length,
                    badges: user.badges.length,
                    chatActivity: chatCount,
                    learningEfficiency: learningEfficiency,
                    totalScore: user.points + learningEfficiency
                };
            })
        );

        // Re-sort by total score
        enhancedLeaderboard.sort((a, b) => b.totalScore - a.totalScore);

        res.json({
            success: true,
            leaderboard: enhancedLeaderboard.map((user, index) => ({
                ...user,
                rank: index + 1
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Calculate learning efficiency score
const calculateLearningEfficiency = (stats, chatCount) => {
    let efficiency = 0;
    
    // Time efficiency (more time = higher efficiency, but with diminishing returns)
    if (stats.totalStudyTime) {
        efficiency += Math.min(stats.totalStudyTime * 0.5, 500); // Cap at 500 points
    }
    
    // Session consistency
    if (stats.sessionsCompleted) {
        efficiency += stats.sessionsCompleted * 10;
    }
    
    // Social learning (chat activity)
    efficiency += chatCount * 2;
    
    // Help others (teaching is learning)
    if (stats.studentsHelped) {
        efficiency += stats.studentsHelped * 30;
    }
    
    return Math.floor(efficiency);
};

// Get user's gamification data with enhanced stats
export const getUserGamification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('username points level experience achievements badges stats rewards');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get chat activity
        const chatCount = await ChatMessage.countDocuments({
            $or: [
                { sender: user._id },
                { recipient: user._id }
            ]
        });

        // Calculate learning efficiency
        const learningEfficiency = calculateLearningEfficiency(user.stats, chatCount);

        // Calculate progress to next level
        const expForNextLevel = (user.level * 100) - user.experience;
        const progressToNextLevel = ((user.level * 100) - expForNextLevel) / (user.level * 100) * 100;

        res.json({
            success: true,
            data: {
                username: user.username,
                points: user.points,
                level: user.level,
                experience: user.experience,
                expForNextLevel,
                progressToNextLevel,
                achievements: user.achievements,
                badges: user.badges,
                stats: {
                    ...user.stats,
                    chatMessages: chatCount,
                    learningEfficiency: learningEfficiency
                },
                rewards: user.rewards
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Enhanced session completion with detailed activity tracking
export const completeSession = async (req, res) => {
    try {
        const { 
            duration, 
            subjects, 
            studentsHelped, 
            chatMessages = 0,
            callSessions = 0,
            callDuration = 0,
            marksImprovement = 0,
            loginStreak = 1
        } = req.body;
        
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update stats
        user.stats.sessionsCompleted += 1;
        user.stats.totalStudyTime += duration || 0;
        user.stats.subjectsHelped += subjects || 0;
        user.stats.studentsHelped += studentsHelped || 0;
        user.stats.streakDays = Math.max(user.stats.streakDays, loginStreak);

        // Calculate XP based on comprehensive activities
        const activities = {
            studyTime: duration || 0,
            chatMessages: chatMessages,
            callSessions: callSessions,
            callDuration: callDuration,
            subjectsLearned: subjects || 0,
            marksImprovement: marksImprovement,
            loginStreak: loginStreak,
            studentsHelped: studentsHelped || 0
        };

        const sessionXP = calculateXP(activities);
        const sessionPoints = Math.floor(sessionXP * 0.8); // Convert XP to points

        user.points += sessionPoints;
        await user.addExperience(sessionXP);

        // Check for achievements based on comprehensive stats
        const newAchievements = [];
        
        if (user.stats.sessionsCompleted === 1) {
            newAchievements.push({
                name: "First Session",
                description: "Complete your first study session",
                icon: "🎯",
                points: 50
            });
        }
        
        if (user.stats.sessionsCompleted === 10) {
            newAchievements.push({
                name: "Dedicated Learner",
                description: "Complete 10 study sessions",
                icon: "🔥",
                points: 100
            });
        }

        if (user.stats.totalStudyTime >= 60) {
            newAchievements.push({
                name: "Hour Master",
                description: "Study for 1 hour total",
                icon: "⏰",
                points: 75
            });
        }

        if (chatMessages >= 50) {
            newAchievements.push({
                name: "Social Learner",
                description: "Send 50 chat messages",
                icon: "💬",
                points: 80
            });
        }

        if (callSessions >= 5) {
            newAchievements.push({
                name: "Video Caller",
                description: "Complete 5 video call sessions",
                icon: "📹",
                points: 120
            });
        }

        if (user.stats.studentsHelped >= 5) {
            newAchievements.push({
                name: "Mentor",
                description: "Help 5 students",
                icon: "🤝",
                points: 150
            });
        }

        // Add new achievements
        newAchievements.forEach(achievement => {
            if (!user.achievements.find(a => a.name === achievement.name)) {
                user.achievements.push(achievement);
                user.points += achievement.points;
            }
        });

        await user.save();

        res.json({
            success: true,
            message: "Session completed successfully!",
            sessionXP,
            sessionPoints,
            newAchievements,
            newPoints: user.points,
            newLevel: user.level,
            stats: user.stats,
            activities: activities
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Track chat activity
export const trackChatActivity = async (req, res) => {
    try {
        const { messageCount = 1 } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Award XP for chat activity
        const chatXP = messageCount * 5;
        const chatPoints = Math.floor(chatXP * 0.8);

        user.points += chatPoints;
        await user.addExperience(chatXP);

        await user.save();

        res.json({
            success: true,
            message: "Chat activity tracked!",
            chatXP,
            chatPoints,
            newPoints: user.points
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Track call activity
export const trackCallActivity = async (req, res) => {
    try {
        const { duration, callType = 'video' } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Award XP for call activity
        const callXP = 20 + Math.floor(duration / 5); // Base 20 XP + 1 XP per 5 minutes
        const callPoints = Math.floor(callXP * 0.8);

        user.points += callPoints;
        await user.addExperience(callXP);

        // Update call stats
        if (!user.stats.callSessions) user.stats.callSessions = 0;
        if (!user.stats.totalCallTime) user.stats.totalCallTime = 0;
        
        user.stats.callSessions += 1;
        user.stats.totalCallTime += duration || 0;

        await user.save();

        res.json({
            success: true,
            message: "Call activity tracked!",
            callXP,
            callPoints,
            newPoints: user.points,
            stats: user.stats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Award points and experience
export const awardPoints = async (req, res) => {
    try {
        const { points, experience, reason } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const oldLevel = user.level;
        user.points += points || 0;
        await user.addExperience(experience || 0);
        const newLevel = user.level;

        // Check for level up
        let levelUpMessage = null;
        if (newLevel > oldLevel) {
            levelUpMessage = `Congratulations! You've reached level ${newLevel}!`;
        }

        res.json({
            success: true,
            message: `Awarded ${points} points and ${experience} experience for ${reason}`,
            levelUpMessage,
            newPoints: user.points,
            newLevel: user.level,
            newExperience: user.experience
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Claim reward
export const claimReward = async (req, res) => {
    try {
        const { rewardId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const reward = user.rewards.find(r => r._id.toString() === rewardId);
        if (!reward) {
            return res.status(404).json({ success: false, message: "Reward not found" });
        }

        // Add reward points
        user.points += reward.points || 0;
        await user.save();

        res.json({
            success: true,
            message: `Claimed ${reward.name} for ${reward.points} points!`,
            newPoints: user.points
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get available rewards
export const getAvailableRewards = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate available rewards based on user stats
        const availableRewards = [];

        if (user.stats.sessionsCompleted >= 5 && !user.rewards.find(r => r.name === "Session Master")) {
            availableRewards.push({
                name: "Session Master",
                description: "Complete 5 study sessions",
                icon: "📚",
                type: "achievement",
                points: 200
            });
        }

        if (user.stats.studentsHelped >= 3 && !user.rewards.find(r => r.name === "Helper")) {
            availableRewards.push({
                name: "Helper",
                description: "Help 3 students",
                icon: "🤝",
                type: "badge",
                points: 150
            });
        }

        if (user.level >= 5 && !user.rewards.find(r => r.name === "Level 5")) {
            availableRewards.push({
                name: "Level 5",
                description: "Reach level 5",
                icon: "⭐",
                type: "achievement",
                points: 300
            });
        }

        res.json({
            success: true,
            availableRewards
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 