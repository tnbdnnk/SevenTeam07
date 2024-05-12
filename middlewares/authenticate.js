import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { findUser } from "../services/authServices.js";

const {JWT_SECRET} = process.env;

const authenticate = async(req, res, next)=> {
    const {authorization} = req.headers;
    if(!authorization) {
        return next(HttpError(401, "Authoriztion header not found"));
    }

    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer") {
        return next(HttpError(401));
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        if (!id) {
        throw new Error("Invalid token: User ID not found");
        }
        const user = await findUser({ _id: id });
        if (!user) {
        throw new Error("User not found");
        }
        if (!user.token) {
        throw new Error("Invalid token");
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return next(HttpError(401, error.message || "Authentication error"));
    }
}

export default authenticate;