import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// NOTE: Correct the import path to the auth routes file
import authRoutes from "../routes/authRoutes.js"; 
import eventRoutes from "../routes/eventRoutes.js";
import galleryRoutes from "../routes/galleryRoutes.js";
import teacherRoutes from "../routes/teacherroutes.js"; 
import siteSettings from "../routes/siteSettings.js"
// import path from 'path'; // Needed if serving static react files

const app = express();

// 1. Static file serving (e.g., /uploads) - Place early


// Middleware
app.use(cors({
    origin: "*", // Allow requests only from your React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json()); // Body parser for JSON payloads

// 2. API Routes - Place here (after middleware and static file access)
app.use("/api/auth", authRoutes); 
app.use("/api/events", eventRoutes); // <-- All event logic is correctly mapped here
app.use("/api/gallery", galleryRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/site-settings", siteSettings);
app.use('/uploads', express.static('uploads'));
// 3. Optional: Generic Frontend Catch-All (Place LAST)
/* // If you are also serving your React build from this Express server, 
// a catch-all route should go here. If this is missing or misplaced, 
// it is the source of the HTML 404 response.
// Example:
app.get('*', (req, res) => {
    // This serves the React app's index.html for all non-API routes.
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); 
}); 
*/


// DB connect
mongoose.connect("mongodb://127.0.0.1:27017/harvard_db")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("DB Error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
