import mongoose from "mongoose";
import "dotenv/config";

import app from './app.js';

mongoose.set("strictQuery", true);

const { MONGO_DB, PORT } = process.env;
mongoose
    .connect(MONGO_DB)
    .then(app.listen(PORT, () => console.log(`Server runniing on port: ${PORT}`)))
    .catch((err) => {
        console.log(err.message);
        process.exit();
    });