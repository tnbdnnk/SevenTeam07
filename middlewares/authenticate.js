import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { findUser } from "../services/authServices.js";

const {JWT_SECRET} = process.env;

const authenticate = async(req, res, next)=> {
    const { authorization = "" } = req.headers;


    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer" || !token) {
        next(HttpError(401));
    }

    try {
        const isValidToken = jwt.verify(token, JWT_SECRET);
        const user = await findUser({_id: isValidToken.id});
        if (!user || token !== user.accessToken || !user.accessToken)
            throw HttpError(401);
        req.user = user;
        next();
    }
    catch(error) {
        if (
            error.message === "invalid signature" ||
            error.message === "jwt expired" ||
            error.message === "jwt must be provided"
        ) {
            error.status = 401;
            error.message = "Unauthorized";
        }
        next(HttpError(401));
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