import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "admin", enum: ["admin", "editor", "user"] }, // Added enum for clarity
}, { timestamps: true });

export default mongoose.model("User", userSchema);