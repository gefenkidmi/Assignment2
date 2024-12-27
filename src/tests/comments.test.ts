import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import postModel from "../models/post_model";
import { Express } from "express";
import request from "supertest";

let app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await commentsModel.deleteMany(); // מחיקת כל התגובות
  await postModel.deleteMany(); // מחיקת כל הפוסטים (אם יש קשר לפוסטים)
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

let commentId = "";
let postId = "";

describe("Comments Tests", () => {
  test("Setup: Create Post for Comments", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      owner: "TestOwner",
    });
    expect(response.statusCode).toBe(201);
    postId = response.body._id;
  });

  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app).post("/comments").send({
      comment: "Test Comment",
      owner: "TestOwner",
      postId: postId,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe("Test Comment");
    expect(response.body.owner).toBe("TestOwner");
    commentId = response.body._id;
  });

  test("Test get comments by postId", async () => {
    const response = await request(app).get(`/comments?postId=${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].comment).toBe("Test Comment");
  });

  test("Test get comment by id", async () => {
    const response = await request(app).get(`/comments/${commentId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe("Test Comment");
  });

  test("Test Create Comment Fail", async () => {
    const response = await request(app).post("/comments").send({
      owner: "TestOwner",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Delete Comment", async () => {
    const response = await request(app).delete(`/comments/${commentId}`);
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get(`/comments/${commentId}`);
    expect(response2.statusCode).toBe(404);
  });
});
