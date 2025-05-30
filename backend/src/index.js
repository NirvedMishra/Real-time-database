import dotenv from "dotenv";
import { app } from "./app.js";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import { setupSocket } from "./socket.js";
import http from "http";
import { resumeTrackingForActiveUsers } from "./dbTracker/Mongodb.js";

const connectDB = async () => {
    try {
        console.log(`\nDB_NAME: ${DB_NAME}`)
        console.log(`\nConnecting to MongoDB at ${process.env.USER_DB_URI}${DB_NAME}`)
        const connectionInstance = await mongoose.connect(`${process.env.USER_DB_URI}${DB_NAME}`)
        console.log(`\n MongoDB connected ! DB host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error: ", error);
        process.exit(1)
    }
}

dotenv.config({
    path:"../.env"
});

const server = http.createServer(app);
console.log(process.env.USER_DB_URI)
connectDB().then(async () => {
    await resumeTrackingForActiveUsers();
    setupSocket(server);
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
})