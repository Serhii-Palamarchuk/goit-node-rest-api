import jwt from "jsonwebtoken";
import User from "../models/User.js";
import HttpError from "./HttpError.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpError(401, "Not authorized"));
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(id);

    if (!user || user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
