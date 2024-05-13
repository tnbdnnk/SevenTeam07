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
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await findUser({_id: id});
        if(!user) {
            return next(HttpError(401, "User not found"));
        }
        if(!user.token) {
            return next(HttpError(401, "Token invalid"));
        }
        req.user = user;
        next();
    }
    catch(error) {
        next(HttpError(401, error.message))
    }
}

export default authenticate;

// const authenticate = async (req, res, next) => {
//   const authorizarionHeader = req.headers.authorization;
//   if (typeof authorizarionHeader === "undefined") {
//     return res.status(401).json({ message: "Authorization header is missing" });
//   }
//   const [bearer, token] = authorizarionHeader.split(" ", 2);
//   if (bearer !== "Bearer" || !token) {
//     return res
//       .status(401)
//       .json({ message: "Invalid authorization header format" });
//   }
//   jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//     if (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({ message: "Token expired error." });
//       }
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     const user = await User.findById(decoded.id);
//     if (!user || !user.token) {
//       return res.status(401).json({ message: "Not authorized" });
//     }
//     req.user = {
//       id: decoded.id,
//       email: decoded.email,
//     };
//     next();
//   });
// };