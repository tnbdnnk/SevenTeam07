import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

import authRouter from "./routes/authRouter.js";
import boardsRouter from "./routes/boardsRouter.js";
import cardsRouter from "./routes/cardsRouter.js";
import columnsRouter from "./routes/columnsRouter.js";
import swaggerDocument from './swagger.json' assert { type: 'json' };

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/users", authRouter);
app.use("/api/boards", boardsRouter);
app.use("/api/columns", columnsRouter);
app.use("/api/cards", cardsRouter);

app.use((err, req, res, next) => {
    if (typeof err.status !== "undefined" && typeof err.message !== "undefined") {
        res.status(err.status).json({ message: err.message });
    } else {
        console.error(err.stack);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default app;