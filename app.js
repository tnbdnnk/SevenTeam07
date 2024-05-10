// import "dotenv/config";

// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// // import "./db.js";

// // import swaggerUi from 'swagger-ui-express';
// // import swaggerJSDoc from "swagger-jsdoc";

// import authRouter from "./routes/authRouter.js";

// const app = express();

// app.use(morgan("tiny"));
// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// // const options = {
// //     definition: {
// //         openapi: '3.0.0',
// //         info: {
// //             title: 'Project TaskPro API by SevenTeam07',
// //             version: '1.0.0'
// //         },
// //         servers: [
// //             {
// //                 url: "http://localhost:3000",
// //             }
// //         ]
// //     },
// //     apis: ['./routes/authRouter.js'],
// // };

// // const specs = swaggerJSDoc(options);

// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// app.use("/api/users", authRouter);

// app.use((_, res) => {
//     res.status(404).json({ message: "Route Not Found" });
// });

// app.use((err, req, res, next) => {
//     const { status = 500, message = "Server Error" } = err;
//     res.status(status).json({ message });
// });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //     console.log(`Server is running. Use our API on port: ${PORT}`);
// // });

// export default app;

import express from 'express';
import logger from 'morgan';
import cors from 'cors';
// import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import authRouter from "./routes/authRouter.js";
import boardsRouter from "./routes/boardsRouter.js";
import cardsRouter from "./routes/cardsRouter.js";
import columnsRouter from "./routes/columnsRouter.js";
// import swaggerDocument from './swagger.json' assert { type: 'json' };

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Project TaskPro API by SevenTeam07',
//             version: '1.0.0'
//         },
//         servers: [
//             {
//                 url: "http://localhost:3000",
//             }
//         ]
//     },
//     apis: ['./routes/authRouter.js'],
// };

// const specs = swaggerJSDoc(options);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/api/users', usersRouter);
// app.use('/api/water', waterRouter);
app.use("/api/users", authRouter);
app.use("/api/boards", boardsRouter);
app.use("/api/columns", columnsRouter);
app.use("/api/cards", cardsRouter);


app.use((req, res) => {
    res.status(404).json({ message: 'Service not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

export default app;