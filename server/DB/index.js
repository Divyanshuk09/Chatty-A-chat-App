import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MONGODB Connected:${mongoose.connection.host}`);
    } catch (error) {
        console.log(`MONGODB Error: ${error.message}`);
        process.exit(1);
    }
}
