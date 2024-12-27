import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import { Express } from "express";
import request from "supertest";

let app: Express;
let postId: string;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();

  const postResponse = await request(app).post("/posts").send({
    title: "Test Post",
    content: "Test Content",
    owner: "TestOwner",
  });
  postId = postResponse.body._id;
  await commentsModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

let commentId = "";

describe("Comments Tests", () => {
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
    commentId = response.body._id;
  });

  test("Test get comment by postId", async () => {
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

  test("Test Delete Comment", async () => {
    const deleteResponse = await request(app).delete(`/comments/${commentId}`);
    expect(deleteResponse.statusCode).toBe(200);

    const getResponse = await request(app).get(`/comments/${commentId}`);
    expect(getResponse.statusCode).toBe(404);
  });

  test("Test Create Comment fail", async () => {
    const response = await request(app).post("/comments").send({
      owner: "TestOwner",
    });
    expect(response.statusCode).toBe(400);
  });
});
