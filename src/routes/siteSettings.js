import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "a_very_secure_secret_key_12345";

// --- Middleware for Protected Routes ---
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  return res.status(401).json({ error: "Not authorized, no token" });
};

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- GET /api/site-settings ---
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings(); // defaults from schema
      await settings.save();
    }

    res.status(200).json(settings);
  } catch (err) {
    console.error("Error fetching site settings:", err);
    res.status(500).json({ message: "Server error occurred while fetching site settings." });
  }
});

// --- PUT /api/site-settings ---
router.put("/", protect, upload.any(), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const numSlides = parseInt(req.body.numSlides) || 3;
    const updatedSlides = [];

    for (let i = 0; i < numSlides; i++) {
      const title = req.body[`sliderImages[${i}][title]`] || "";
      const description = req.body[`sliderImages[${i}][description]`] || "";
      const link = req.body[`sliderImages[${i}][link]`] || "";

      let imagePath = req.body[`sliderImages[${i}][image]`] || "";
      if (req.files && req.files[i]) {
        imagePath = `/uploads/${req.files[i].filename}`;
      }

      updatedSlides.push({ image: imagePath, title, description, link });
    }

    settings.sliderImages = updatedSlides;
    const updatedSettings = await settings.save();

    res.status(200).json(updatedSettings);
  } catch (err) {
    console.error("Error updating site settings:", err);
    res.status(500).json({ error: "Server error updating site settings" });
  }
});

export default router;
