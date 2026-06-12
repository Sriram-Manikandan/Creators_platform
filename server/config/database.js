import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUri = process.env.NODE_ENV === 'test'
            ? process.env.MONGODB_URI_TEST || process.env.MONGODB_URI
            : process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MongoDB connection string is not defined');
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5005,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
};

export default connectDB;