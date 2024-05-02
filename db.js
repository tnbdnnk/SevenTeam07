import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const DB_URI = process.env.DB_URI;

mongoose
    .connect(DB_URI)
    .then(() => console.log('Database connection success'))
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });