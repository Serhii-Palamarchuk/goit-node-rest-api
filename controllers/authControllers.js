import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);

    if (!user) {
      throw HttpError(409, "Email in use");
    }

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (!result) {
      throw HttpError(401, "Email or password is wrong");
    }

    res.status(200).json({
      token: result.token,
      user: {
        email: result.user.email,
        subscription: result.user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await authService.logout(req.user.id);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const user = await authService.updateSubscription(req.user.id, subscription);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};
