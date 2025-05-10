import mongoose, { Schema } from "mongoose";

const ChatMessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { collection: "chat-messages" });

ChatMessageSchema.pre("save", function(next) {
    if (this.sender.toString() === this.recipient.toString()) {
        return next(new Error("Sender and recipient cannot be the same user"));
    }
    next();
});

export default mongoose.model("ChatMessage", ChatMessageSchema);
