const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

// Create the connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Get the default connection
        const db = mongoose.connection;

        // Bind connection to error event (to get notification of connection errors)
        db.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        // Connection successful events
        db.on('connected', () => {
            console.log('MongoDB connected to the database');
        });

        db.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // If Node process ends, close the MongoDB connection
        process.on('SIGINT', async () => {
            try {
                await db.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (error) {
                console.error('Error closing MongoDB connection:', error);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;