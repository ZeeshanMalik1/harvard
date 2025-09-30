import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  date: Date,
  // --- UPDATED FIELD TO STORE MULTIPLE IMAGE URLs ---
  images: { 
    type: [String], // Array of strings to store multiple URLs/paths
    default: []    // Defaults to an empty array
  },
  // --------------------------------------------------
  publishedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true }); 

export default mongoose.model("Event", eventSchema);