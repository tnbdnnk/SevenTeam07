import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";
import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import { token } from "morgan";
import User from "../models/User.js"
import Jimp from 'jimp';
import sendEmail from "../helpers/sendEmail.js"


const { JWT_SECRET, PROJECT_URL } = process.env;

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await authServices.signup({ ...req.body, password: hashPassword, verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);
    res.status(201).json({
        user: {
        name: newUser.name,    
        email: newUser.email,
        }
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await authServices.findUser({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found")
    }

    await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken: "" });

    res.status(200).json({
        message: "Verification successful"
    })
}

const resendVerify = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (!email) {
        throw HttpError(400, "missing required field email");
    }
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(200).json({
        message: "Verification email sent"
    })
}

const singin = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verify");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;

    const payload = {
        id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "48h" });
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token: token,
        user: {name: user.name ,email: user.email },
    })
}

// const getCurrent = async (req, res) => {
//     const { subscription , email } = req.user;
//     if(!email) {
//         throw HttpError(401, "Not authorized");
//     }
//     res.json({
//         email,
//         subscription,
//     })
// }

// const signout = async (req, res) => {
//     const { _id } = req.user;
//     await authServices.updateUser({ _id }, { token: "" });
//     if(!_id) {
//         throw HttpError(401, "Not authorized");
//     }
//     res.status(204).json({

//     })
// }


export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    signin: ctrlWrapper(singin),
    // getCurrent: ctrlWrapper(getCurrent),
    // signout: ctrlWrapper(signout),
}