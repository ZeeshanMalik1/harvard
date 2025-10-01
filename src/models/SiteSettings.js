import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  image: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  link: { type: String, default: "" },
});

const siteSettingsSchema = new mongoose.Schema(
  {
    sliderImages: {
      type: [sliderSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
