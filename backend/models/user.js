import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    marks: { 
        type: Map, 
        of: Number,  // Marks will be stored as numbers for each subject
        default: {}   // Default to an empty object
    },
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
    university: { type: String, default: "" },
    // Gamification fields
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    achievements: [{ 
        name: String, 
        description: String, 
        icon: String, 
        unlockedAt: { type: Date, default: Date.now },
        points: Number
    }],
    badges: [{ 
        name: String, 
        description: String, 
        icon: String, 
        unlockedAt: { type: Date, default: Date.now },
        rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' }
    }],
    stats: {
        sessionsCompleted: { type: Number, default: 0 },
        totalStudyTime: { type: Number, default: 0 }, // in minutes
        subjectsHelped: { type: Number, default: 0 },
        studentsHelped: { type: Number, default: 0 },
        streakDays: { type: Number, default: 0 },
        lastActiveDate: { type: Date, default: Date.now }
    },
    rewards: [{
        name: String,
        description: String,
        icon: String,
        type: { type: String, enum: ['badge', 'achievement', 'bonus'], default: 'badge' },
        unlockedAt: { type: Date, default: Date.now },
        points: Number
    }]
}, {
    timestamps: true
});

// Calculate level based on experience
UserSchema.methods.calculateLevel = function() {
    return Math.floor(this.experience / 100) + 1;
};

// Add experience and recalculate level
UserSchema.methods.addExperience = function(exp) {
    this.experience += exp;
    this.level = this.calculateLevel();
    return this.save();
};

export default mongoose.model("User", UserSchema);
