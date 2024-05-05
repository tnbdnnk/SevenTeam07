import express from 'express';

import authControllers from '../controllers/authControllers.js';

import { userSignupSchema, userSigninSchema, userEmailSchema } from '../schemas/usersSchemas.js';

import validateBody from '../decorators/validateBody.js';
import { upload } from '../middlewares/upload.js';

import authenticate from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(userSignupSchema), authControllers.signup);

authRouter.get('/verify/:verificationToken', authControllers.verify);

authRouter.post('/verify', validateBody(userEmailSchema), authControllers.resendVerify);

authRouter.post('/login', validateBody(userSigninSchema), authControllers.signin);

// authRouter.get("/current", authenticate, authControllers.getCurrent);

// authRouter.post("/logout", authenticate, authControllers.signout);

authRouter.patch('/update', authenticate, upload.single('avatar'), authControllers.updateUser);

export default authRouter;
