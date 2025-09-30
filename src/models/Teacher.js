import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
    imageUrl: {   
    type: String,
  },
  fb_link: String,
  whatsapp_app: String,
  twitter_link: String,
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);
