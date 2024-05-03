import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "./db.js";

import authRouter from "./routes/authRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// app.use('/api/users', authRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Server Error" } = err;
    res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
});
