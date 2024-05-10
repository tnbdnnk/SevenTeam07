// import mongoose from "mongoose";
// import "dotenv/config";
// import app from './app.js';

// mongoose.set("strictQuery", false);

// const DB_URI = process.env.DB_URI;

// mongoose
//   .connect(DB_URI)
//   .then(() => {
//     console.log("Database connection success");
//     app.listen(process.env.PORT, () => {
//       console.log('Server is running')
//     })
//   })
//   .catch((error) => {
//     console.error("Database connection error:", error);
//     process.exit(1);
//   });

import mongoose from "mongoose";
import "dotenv/config";

  // require('dotenv').config();
  import app from "./app.js";

  mongoose.set("strictQuery", true);

  mongoose
    .connect(process.env.DB_URI)
    .then(app.listen(process.env.PORT, () => console.log("Server running")))
    .catch((err) => {
      console.log(err.message);
      process.exit();
    });