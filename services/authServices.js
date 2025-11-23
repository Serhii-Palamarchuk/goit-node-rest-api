import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import User from "../models/User.js";
import sendEmail from "../helpers/sendEmail.js";

async function register(email, password) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mp" });
  const verificationToken = nanoid();
  
  const user = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  // Відправка email з посиланням для верифікації
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;
  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });

  return user;
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  if (!user.verify) {
    return { error: "Email not verified" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "23h",
  });

  await user.update({ token });

  return { user, token };
}

async function logout(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  await user.update({ token: null });
  return user;
}

async function updateSubscription(userId, subscription) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  await user.update({ subscription });
  return user;
}

async function updateAvatar(userId, avatarURL) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  await user.update({ avatarURL });
  return user;
}

async function verifyEmail(verificationToken) {
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) {
    return null;
  }

  await user.update({ verify: true, verificationToken: null });
  return user;
}

async function resendVerificationEmail(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  if (user.verify) {
    return { error: "Verification has already been passed" };
  }

  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${user.verificationToken}`;
  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });

  return user;
}

export { 
  register, 
  login, 
  logout, 
  updateSubscription, 
  updateAvatar, 
  verifyEmail, 
  resendVerificationEmail 
};
