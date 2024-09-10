// Import required modules
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the MongoDB URI from environment variables
const dbURI = process.env.MONGODB_URI as string;

// Define an asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(dbURI, {
    });
    console.log("MongoDB connected");
  } catch (error) {
    // Log any connection errors
    console.error("MongoDB connection error:", error);
  }
};

// Export the connectDB function for use in other modules
export default connectDB;