import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/post_model";
import commentsModel from "../models/comments_model";
import { Express } from "express";
import request from "supertest";

let app: Express;
let postId: string;
let commentId: string;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
});

beforeEach(async () => {
  await postModel.deleteMany();
  await commentsModel.deleteMany();

  // יצירת פוסט חדש
  const postResponse = await request(app).post("/posts").send({
    title: "Test Post",
    content: "Test Content",
    owner: "TestOwner",
  });
  postId = postResponse.body._id; // שמירת ID של הפוסט
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Comments Tests", () => {
  test("Test create comment", async () => {
    const response = await request(app).post("/comments").send({
      comment: "Test Comment",
      owner: "TestOwner",
      postId: postId, // שימוש ב-ID של הפוסט שנוצר
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe("Test Comment");
    expect(response.body.owner).toBe("TestOwner");
    commentId = response.body._id; // שמירת ID של התגובה
  });

  test("Test get comments by postId", async () => {
    // יצירת תגובה חדשה
    await request(app).post("/comments").send({
      comment: "Test Comment",
      owner: "TestOwner",
      postId: postId, // שימוש ב-ID של הפוסט שנוצר
    });

    // בדיקת שליפה לפי postId
    const response = await request(app).get(`/comments?postId=${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].comment).toBe("Test Comment");
  });

  test("Test get comment by id", async () => {
    // יצירת תגובה חדשה
    const commentResponse = await request(app).post("/comments").send({
      comment: "Test Comment",
      owner: "TestOwner",
      postId: postId,
    });
    commentId = commentResponse.body._id; // שמירת ID של התגובה

    // בדיקת שליפה לפי ID
    const response = await request(app).get(`/comments/${commentId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe("Test Comment");
  });

  test("Test delete comment", async () => {
    // יצירת תגובה חדשה
    const commentResponse = await request(app).post("/comments").send({
      comment: "Test Comment",
      owner: "TestOwner",
      postId: postId,
    });
    commentId = commentResponse.body._id;

    // מחיקת התגובה
    const deleteResponse = await request(app).delete(`/comments/${commentId}`);
    expect(deleteResponse.statusCode).toBe(200);

    // בדיקת שליפה של התגובה שנמחקה
    const response = await request(app).get(`/comments/${commentId}`);
    expect(response.statusCode).toBe(404);
  });

  test("Test create comment fail", async () => {
    const response = await request(app).post("/comments").send({
      owner: "TestOwner",
    });
    expect(response.statusCode).toBe(400);
  });
});
