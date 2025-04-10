import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { startTracking } from "../dbTracker/Mongodb.js";
import { MongoClient } from "mongodb";
import { stopTracking } from "../dbTracker/Mongodb.js";

const registerDB = asynchandler(async (req, res) => {
    const dbName = req.body.dbName;
    const userId = req.user._id;
    const connectionString = req.body.connectionString;
    if (!dbName || !connectionString) {
        throw new ApiError(400, "Database name and connection string are required");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    if(!user.isVerified){
        throw new ApiError(400, "User not verified");
    }
    if(user.dbString){
        await stopTracking(userId);
    }
    user.dbString = connectionString;
    user.dbName = dbName;
    try {
        await startTracking(userId, connectionString, dbName);
    } catch (error) {
        throw new ApiError(400, error);
        
    }
    user.isTracking = true;
    await user.save();
   
    return res.status(200).json(new ApiResponse(200, {}, "Database registered successfully"));
});

const giveRealTimeUpdates = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(400, "User not found");
    }
    if(!user.dbString){
        throw new ApiError(400, "Database not registered");
    }
    if(!user.isVerified){
        throw new ApiError(400, "User not verified");
    }
    const dbUpdates = user.dbUpdates;

    return res.status(200).json(new ApiResponse(200, dbUpdates, "Real time updates sent successfully"));
});

const deleteDB = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(400, "User not found");
    }
    if(!user.dbString){
        throw new ApiError(400, "Database not registered");
    }
    if(!user.isVerified){
        throw new ApiError(400, "User not verified");
    }
    user.dbString = null;
    user.dbName = null;
    user.dbUpdates = [];
    user.isTracking = false;
    stopTracking(userId);

    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "Database deleted successfully"));
})

export{registerDB, giveRealTimeUpdates, deleteDB}