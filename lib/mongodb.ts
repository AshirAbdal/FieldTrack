// lib/mongodb.ts
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let isConnected = false;
let nativeClient: MongoClient | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (isConnected) {
    return mongoose;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI);
    isConnected = connection.connection.readyState === 1;
    
    // Get the native client from Mongoose connection
    nativeClient = connection.connection.getClient();
    
    console.log("MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed.");
  }
};

export const getNativeClient = (): Promise<MongoClient> => {
  if (!nativeClient) {
    throw new Error("Database not initialized! Call connectDB first.");
  }
  return Promise.resolve(nativeClient);
};