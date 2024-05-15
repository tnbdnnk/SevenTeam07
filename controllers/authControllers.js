import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as authServices from '../services/authServices.js';

import ctrlWrapper from '../decorators/ctrlWrapper.js';

import HttpError from '../helpers/HttpError.js';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';
import { token } from 'morgan';
import User from '../models/User.js';
import Jimp from 'jimp';
// import {sendEmail} from '../helpers/sendEmail.js';
import cloudinary from '../helpers/cloudinary.js';

import { sendHelpEmail } from '../helpers/sendEmail.js';

const { JWT_SECRET, SENDGRID_FROM } = process.env;

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
  });
  const payload = { id: newUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '48h' });
  await authServices.updateUser({ _id: newUser._id }, { token });

  res.status(201).json({
    token: token,
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
      theme: newUser.theme,
    },
  });
};

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '48h' });
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token: token,
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      theme: user.theme,
    },
  });
};

const getCurrent = async (req, res, next) => {
  try {
    const { name, email, avatarURL, theme } = req.user;
    if (!email) {
      throw new Error('User email not found');
    }
    res.json({
      name,
      email,
      avatarURL,
      theme,
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return next(HttpError(401, error.message || 'Error getting current user'));
  }
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: '' });
  if (!_id) {
    throw HttpError(401, 'Not authorized');
  }
  res.status(204).json({});
};

const updateUser = async (req, res) => {
  const { _id: id, email } = req.user;
  console.log(req.body);

  const { name: updateName, email: updateEmail, password: updatePassword } = req.body;
  console.log(updatePassword);

  const { file } = req;
  const isCheckUpdateEmail = await User.findOne({ email: updateEmail });
  if (email !== updateEmail && isCheckUpdateEmail) {
    throw HttpError(409, 'Email in use');
  }
  const isUpdateUserInfo = {
    email: updateEmail,
    name: updateName,
  };
  // if (updateEmail) {
  //   isUpdateUserInfo.email = updateEmail;
  // }
  // if (updateName) {
  //   isUpdateUserInfo.name = updateName;
  // }
  if (updatePassword) {
    isUpdateUserInfo.password = await bcrypt.hash(updatePassword, 10);
  }
  if (file) {
    const { url: avatarURL } = await cloudinary.uploader.upload(file.path, {
      folder: 'avatar',
      public_id: file.filename,
    });
    await fs.unlink(req.file.path);
    isUpdateUserInfo.avatarURL = avatarURL;
  }

  const result = await User.findByIdAndUpdate(id, isUpdateUserInfo);
  if (!result) throw HttpError(404);
  res.json({ name: result.name, email: result.email, avatarURL: result.avatarURL });
};

const updateTheme = async (req, res) => {
  const { _id: id } = req.user;
  const result = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) throw HttpError(404);
  res.json({ theme: result.theme });
};

const sendNeedHelpEmail = async (req, res, next) => {
  const { email, text } = req.body;

  const needHelpEmail = {
    to: 'xalexey.g@gmail.com',
    from: SENDGRID_FROM,
    subject: 'Need Help',
    text: 'Need Help',
    html: `<p>Email: ${email}</p><p>Comment:</p><p>${text}</p>`,
  }

  await sendHelpEmail(needHelpEmail);
  res.status(200).json({
    message: 'Need Help email has been sent',
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(singin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateUser: ctrlWrapper(updateUser),
  updateTheme: ctrlWrapper(updateTheme),
  sendNeedHelpEmail: ctrlWrapper(sendNeedHelpEmail),
};
