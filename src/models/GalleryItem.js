import mongoose from "mongoose";
const gallerySchema = new mongoose.Schema({
  imageUrl: {   // ✅ consistent everywhere
    type: String,
    required: true
  },
}, { timestamps: true });

export default mongoose.model("GalleryItem", gallerySchema);
