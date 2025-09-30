import express from "express";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs"; // Import the file system module for cleanup

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "a_very_secure_secret_key_12345";

// --- Multer Configuration --
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    console.log("Incoming file:", file.originalname, file.mimetype); // debug log

    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: fileFilter 
}).array('images', 10);

// --- File Cleanup Helper Function ---
// This function deletes all files that Multer successfully uploaded for this request
const cleanupUploadedFiles = (files) => {
    if (files && files.length > 0) {
        files.forEach(file => {
            // fs.unlink removes the file from the disk
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error(`Failed to delete orphaned file: ${file.path}`, err);
                }
            });
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
    } else if (!token) {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};
// -----------------------------------------------------------------

// @route   GET /api/events/
// 💡 NEW ROUTE: Fetch all events (Used by LatestNews.js)
router.get('/', async (req, res) => {
    try {
        // Find all events and sort them by date (e.g., newest first)
        const events = await Event.find().sort({ date: -1 });
        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching all events:", err);
        res.status(500).json({ message: "Server error occurred while fetching events list." });
    }
});
// -----------------------------------------------------------------

// @route   GET /api/events/:id
// ✅ YOUR CORRECT SINGLE-EVENT FETCH ROUTE (Used by EventDetail.js)
router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        
        // Find the event by its MongoDB _id
        const event = await Event.findById(eventId); 

        // CRITICAL CHECK: If the event is null, send 404
        if (!event) {
            return res.status(404).json({ message: `Event with ID: ${eventId} not found.` }); 
        }

        // Success: Send the event data
        res.status(200).json(event);

    } catch (err) {
        // Handles CastError (invalid ID format) or other database issues
        console.error("Error fetching event:", err);
        
        if (err.name === 'CastError') {
             // 400 Bad Request is appropriate for an invalid ID format
             return res.status(400).json({ message: "Invalid ID format provided." });
        }
        
        res.status(500).json({ message: "Server error occurred." });
    }
});

// @route   POST /api/events
router.post("/", protect, (req, res) => {
    upload(req, res, async (err) => {
        // 2. Handle Multer and FileFilter errors
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Multer Error: ${err.message}` });
        } else if (err) {
            console.error("Upload error:", err.message);
            return res.status(400).json({ 
                error: err.message || 'File upload failed.'
            });
        }

        // --- Core Application Logic Starts Here ---
        const { title, date } = req.body; 
        const description = req.body.description || "";
        
        // Input validation for event data
        if (!title || !date) {
            // Validation failed: Cleanup the files saved by Multer
            cleanupUploadedFiles(req.files);
            return res.status(400).json({ error: "Title and Date are required." });
        }
        
        // If validation passes, process the files
        const images = req.files ? 
            req.files.map(file => `/uploads/${file.filename}`) : 
            [];
            
        try {
            // Save the event data and image paths to MongoDB
            const newEvent = new Event({ title, description, date, images }); 
            const createdEvent = await newEvent.save();

            res.status(201).json(createdEvent);
        } catch (dbError) {
            // Database save failed (e.g., Mongoose validation): Cleanup files
            cleanupUploadedFiles(req.files);
            console.error(dbError);
            res.status(400).json({ error: "Error creating event in DB (Files cleaned)", details: dbError.message });
        }
    });
});

// @route   DELETE /api/events/:id
router.delete("/:id", protect, async (req, res) => {
    try {
        // 1. Find the event to get image paths
        const eventToDelete = await Event.findById(req.params.id);

        if (!eventToDelete) {
            return res.status(404).json({ error: "Event not found" });
        }

        // 2. Delete physical files associated with the event
        if (eventToDelete.images && eventToDelete.images.length > 0) {
            eventToDelete.images.forEach(imagePath => {
                // Remove '/uploads/' prefix to get the relative path
                const relativePath = imagePath.replace('/uploads/', 'uploads/');
                fs.unlink(relativePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete file: ${relativePath}`, err);
                        // NOTE: Do not stop execution for file delete error, continue deleting DB record.
                    }
                });
            });
        }

        // 3. Delete the document from the database
        await Event.deleteOne({ _id: req.params.id });
        
        res.json({ message: "Event and associated files removed" });

    } catch (err) {
        console.error("Error deleting event:", err);
        // CastError for invalid ID format will hit here
        res.status(500).json({ error: "Server error deleting event" });
    }
});

export default router;