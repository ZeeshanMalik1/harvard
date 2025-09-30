import express from "express";
import Teacher from "../models/Teacher.js"; // Import the new Teacher model
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs"; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "a_very_secure_secret_key_12345";

// --- Multer Configuration (Single File 'image') ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the 'uploads' directory exists in the server root!
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
    req.fileValidationError = 'Only image files are allowed!';
  }
};

// Expects key 'image' from the frontend FormData
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: fileFilter 
}).single('image'); 

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
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};
// -----------------------------------------------------------------

// @route   GET /api/teachers
// @desc    Get all teachers (Public)
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find({}).sort({ name: 1 });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching teachers" });
  }
});

// @route   POST /api/teachers
// @desc    Create a new teacher profile with image upload (Protected)
router.post("/", protect, (req, res) => {
    upload(req, res, async (err) => {
        // Handle Multer/FileFilter errors
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Multer Error: ${err.message}` });
        } else if (err || req.fileValidationError) {
            return res.status(400).json({ error: req.fileValidationError || 'An unknown file upload error occurred.' });
        }
        
        // Extract all fields from req.body
        const { name, role, fb_link, whatsapp_app, twitter_link } = req.body;
        
        // 1. Validation for required text field
        if (!name) {
             cleanupUploadedFile(req.file);
             return res.status(400).json({ error: "Teacher name is required." });
        }

        // 2. Prepare imageUrl
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        // The model allows imageUrl to be null, but we require a file for creation:
        if (!imageUrl) { 
             return res.status(400).json({ error: "Teacher image file is required for upload." });
        }

        try {
            // 3. Save the profile data
            const newTeacher = new Teacher({ 
                name, 
                role: role || 'Faculty Member', 
                imageUrl, 
                fb_link, 
                whatsapp_app, 
                twitter_link 
            }); 
            const createdTeacher = await newTeacher.save();

            res.status(201).json(createdTeacher);
        } catch (dbError) {
            // 4. DB save failed: Cleanup the uploaded file
            cleanupUploadedFile(req.file);
            console.error(dbError);
            res.status(400).json({ error: "Error saving teacher profile to DB (File cleaned)", details: dbError.message });
        }
    });
});

// @route   DELETE /api/teachers/:id
// @desc    Delete a teacher profile and its image file (Protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher profile not found" });
    }

    const imagePathUrl = teacher.imageUrl;
    
    // Delete the database record
    await teacher.deleteOne();
    
    // Delete the physical file if it exists
    if (imagePathUrl) {
        // Correct path to match local filesystem (uploads/filename.jpg)
        const filePath = imagePathUrl.replace('/uploads/', 'uploads/');
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting physical file: ${filePath}`, err);
            }
        });
    }
    
    res.json({ message: "Teacher profile removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting teacher profile" });
  }
});

export default router;
