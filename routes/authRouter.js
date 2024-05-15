import express from 'express';
import multer from 'multer';
import authControllers from '../controllers/authControllers.js';

import {
  userSignupSchema,
  userSigninSchema,
  // userEmailSchema,
  userUpdateSchema,
  userThemeUpdateSchema,
  needHelpEmailSchema,
} from '../schemas/usersSchemas.js';

import validateBody from '../decorators/validateBody.js';
import { upload } from '../middlewares/upload.js';

import authenticate from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(userSignupSchema), authControllers.signup);

// authRouter.get('/verify/:verificationToken', authControllers.verify);
// authRouter.post('/verify', validateBody(userEmailSchema), authControllers.resendVerify);

authRouter.post('/login', validateBody(userSigninSchema), authControllers.signin);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post('/logout', authenticate, authControllers.signout);

authRouter.patch(
  '/update',
  authenticate,
  upload.single('avatar'),
  validateBody(userUpdateSchema),
  authControllers.updateUser
);

authRouter.patch(
  '/theme',
  authenticate,
  validateBody(userThemeUpdateSchema),
  authControllers.updateTheme
);

authRouter.post('/help', validateBody(needHelpEmailSchema), authControllers.sendNeedHelpEmail);

export default authRouter;
