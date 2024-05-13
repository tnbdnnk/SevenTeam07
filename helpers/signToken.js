import jwt from 'jsonwebtoken';
const { JWT_SECRET } = process.env;

export const signToken = function () {
    const payload = { id: this._id };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
};
