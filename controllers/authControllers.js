import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import fs from "fs/promises";
import path from "path";

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
        avatarURL: user.avatarURL,
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

    if (result.error) {
      throw HttpError(401, result.error);
    }

    res.status(200).json({
      token: result.token,
      user: {
        email: result.user.email,
        subscription: result.user.subscription,
        avatarURL: result.user.avatarURL,
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
    const { email, subscription, avatarURL } = req.user;

    res.status(200).json({
      email,
      subscription,
      avatarURL,
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
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "File is required");
    }

    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname);
    const filename = `${req.user.id}${ext}`;
    const avatarsDir = path.resolve("public", "avatars");
    const newPath = path.join(avatarsDir, filename);

    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${filename}`;
    const user = await authService.updateAvatar(req.user.id, avatarURL);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.status(200).json({
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await authService.verifyEmail(verificationToken);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);

    if (!result) {
      throw HttpError(404, "User not found");
    }

    if (result.error) {
      throw HttpError(400, result.error);
    }

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};
