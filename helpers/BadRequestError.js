import HttpError from "./HttpError";

export const BadRequestError = (error, req, res, next) => {
    if (error) {
        const errorMessage = error.details
            .map((detail) => detail.message)
            .join("; ");
        throw HttpError(400, errorMessage);
    }
}