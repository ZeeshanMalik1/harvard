import express from "express";
import GalleryItem from "../models/GalleryItem.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "a_very_secure_secret_key_12345";

// --- Multer Configuration (for single file 'image') ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
    req.fileValidationError = "Only image files are allowed!";
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
}).single("image"); // Key remains 'image'

// --- File Cleanup Helper Function ---
const cleanupUploadedFile = (file) => {
  if (file && file.path) {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(`Failed to delete orphaned file: ${file.path}`, err);
      }
    });
  }
};

// --- Middleware for Protected Routes (Authentication Check) ---
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};

// -----------------------------------------------------------------

// @route   GET /api/gallery
// @desc    Get all gallery items (Public)
router.get("/", async (req, res) => {
  try {
    const items = await GalleryItem.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching gallery items" });
  }
});

// @route   POST /api/gallery
// @desc    Upload a new image (Protected)
router.post("/", protect, (req, res) => {
  upload(req, res, async (err) => {
    // Handle Multer/FileFilter errors
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer Error: ${err.message}` });
    } else if (err || req.fileValidationError) {
      return res
        .status(400)
        .json({ error: req.fileValidationError || "An unknown file upload error occurred." });
    }

    // Check if a file was successfully uploaded by Multer
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    // Get the path saved by Multer
    const imageUrl = `/uploads/${req.file.filename}`;

    try {
      // Save the image URL to MongoDB
      const newItem = new GalleryItem({ imageUrl });
      const createdItem = await newItem.save();

      res.status(201).json(createdItem);
    } catch (dbError) {
      // DB save failed: Cleanup the uploaded file
      cleanupUploadedFile(req.file);
      console.error(dbError);
      res.status(400).json({
        error: "Error saving image URL to DB (File cleaned)",
        details: dbError.message,
      });
    }
  });
});

// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery item and its file (Protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    await item.deleteOne();

    // Delete the physical file
    const filePath = item.imageUrl.replace("/uploads/", "uploads/");
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting physical file: ${filePath}`, err);
      }
    });

    res.json({ message: "Gallery item removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting gallery item" });
  }
});

export default router;
