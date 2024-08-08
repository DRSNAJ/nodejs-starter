import mongoose from "mongoose";
import {logger} from "./logger";

async function connectToDb() {
    try {
        const dbConnectionString = process.env.DB_CONNECTION_STRING;
        if (dbConnectionString) {
            logger.info("Connecting to MongoDB Atlas...");
            await mongoose.connect(dbConnectionString);
            logger.info("Successfully connected to database.");
        } else {
            logger.error("Unable to connect to database: Connection string is missing");
        }
    } catch (error) {
        logger.error("Unable to connect to database:", error);
    }
}

export default connectToDb;
