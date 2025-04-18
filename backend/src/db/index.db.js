import mongoose from 'mongoose';
import DB_NAME from '../constants.js';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(`Error in DB connection: ${error}`);
        throw error;
    }
};

export default connectDB;
