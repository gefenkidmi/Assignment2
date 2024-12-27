import initApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/users_model";
import { Express } from "express";
import request from "supertest";

let app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

let userId = "";

describe("Users Tests", () => {
  test("Users test get all - empty", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create User", async () => {
    const response = await request(app).post("/users").send({
      email: "test@example.com",
      username: "testuser",
      password: "securepassword",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("test@example.com");
    userId = response.body._id;
  });

  test("Test get user by id", async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.username).toBe("testuser");
  });

  test("Test get user by id - not found", async () => {
    const response = await request(app).get(`/users/invalidId`);
    expect(response.statusCode).toBe(404);
  });

  test("Test Create User 2", async () => {
    const response = await request(app).post("/users").send({
      email: "test2@example.com",
      username: "testuser2",
      password: "securepassword2",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Users test get all 2", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete User", async () => {
    const deleteResponse = await request(app).delete(`/users/${userId}`);
    expect(deleteResponse.statusCode).toBe(200);

    const getResponse = await request(app).get(`/users/${userId}`);
    expect(getResponse.statusCode).toBe(404);
  });

  test("Test Create User fail - missing fields", async () => {
    const response = await request(app).post("/users").send({
      username: "testuser",
    });
    expect(response.statusCode).toBe(400);
  });
});
