import mongoose, { Schema } from "mongoose";

const UserEvents = new Schema({
    end: {type: String, required: true},
    start: {type: String, required: true},
    title: {type: String, required: true}
});

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
    events: {type: [UserEvents], default: []},
    rewards: {type: [String], default: []}
});

export default mongoose.model("User", UserSchema);
