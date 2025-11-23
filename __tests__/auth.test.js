import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import sequelize from "../db/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

describe("POST /api/auth/login", () => {
  let testUser;

  beforeAll(async () => {
    // Підключення до бази даних
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Створення тестового користувача
    const hashedPassword = await bcrypt.hash("testPassword123", 10);
    testUser = await User.create({
      email: "test.login@example.com",
      password: hashedPassword,
      subscription: "starter",
      avatarURL: "//www.gravatar.com/avatar/test.jpg",
    });
  });

  afterAll(async () => {
    // Видалення тестового користувача
    if (testUser) {
      await User.destroy({ where: { id: testUser.id } });
    }
    await sequelize.close();
  });

  it("should return status code 200 on successful login", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test.login@example.com",
      password: "testPassword123",
    });

    expect(response.status).toBe(200);
  });

  it("should return a token in the response", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test.login@example.com",
      password: "testPassword123",
    });

    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  it("should return user object with email and subscription fields of type String", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test.login@example.com",
      password: "testPassword123",
    });

    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("subscription");
    
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
    
    expect(response.body.user.email).toBe("test.login@example.com");
    expect(response.body.user.subscription).toBe("starter");
  });

  it("should return 401 for invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test.login@example.com",
      password: "wrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Email or password is wrong");
  });

  it("should return 401 for non-existent user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "testPassword123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Email or password is wrong");
  });
});
