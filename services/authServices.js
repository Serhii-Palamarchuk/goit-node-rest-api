import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function register(email, password) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return null;
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

export { register, login, logout, updateSubscription };
