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


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Project TaskPro API by SevenTeam07',
            version: '1.0.0'
        },
        servers: [
            {
                url: "https://project-seventeam07.onrender.com",
            }
        ]
    },
    apis: ['./routes/authRouter.js'],
};

const specs = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
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