import mongoose from "mongoose";

async function connectToDb() {
    try {
        const dbConnectionString = process.env.DB_CONNECTION_STRING;
        if (dbConnectionString) {
            console.log("Connecting to MongoDB Atlas...")
            await mongoose.connect(dbConnectionString);
            console.log("Successfully connected to database.")
        } else {
            console.error("Unable to connect to database: Connection string is missing");
        }
    } catch (error) {
        console.error("Unable to connect to database:", error);
    }
}

export default connectToDb;