import mongoose from "mongoose";
import logger from "./logger";

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/yt-clone";

export async function connectToDatabase () {
    try {
        await mongoose.connect(DB_CONNECTION_STRING)
        logger.info("Connected To Database")
    } catch (error) {
        logger.error(error, "Failed to connect to DB")
        process.exit(1);
    }
}

export async function disconnectFromDatabase() {
    await mongoose.connection.close();
    logger.info("Connection closed");
    return;
}