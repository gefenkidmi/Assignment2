import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/post_model";
import { Express } from "express";
import request from "supertest";

let app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
});

beforeEach(async () => {
  console.log("Clearing posts...");
  await postModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

let postId: string;

describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      owner: "TestOwner",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    postId = response.body._id;
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get(`/posts?owner=TestOwner`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
  });

  test("Test get post by id", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
  });

  test("Test Create Post 2", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post 2",
      content: "Test Content 2",
      owner: "TestOwner2",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Posts test get all 2", async () => {
    await request(app).post("/posts").send({
      title: "Test Post 1",
      content: "Content 1",
      owner: "Owner 1",
    });
    await request(app).post("/posts").send({
      title: "Test Post 2",
      content: "Content 2",
      owner: "Owner 2",
    });

    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete Post", async () => {
    const deleteResponse = await request(app).delete(`/posts/${postId}`);
    expect(deleteResponse.statusCode).toBe(200);

    const getResponse = await request(app).get(`/posts/${postId}`);
    expect(getResponse.statusCode).toBe(404);
  });

  test("Test Create Post fail", async () => {
    const response = await request(app).post("/posts").send({
      content: "Test Content 2",
    });
    expect(response.statusCode).toBe(400);
  });
});
