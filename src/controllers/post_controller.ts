import postModel from "../models/post_model";
import { Request, Response } from "express";

const getAllPosts = async (req: Request, res: Response) => {
  const filter = req.query.owner;
  try {
    if (filter) {
      const posts = await postModel.find({ owner: filter });
      res.send(posts);
    } else {
      const posts = await postModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    const post = await postModel.findById(postId);
    if (post != null) {
      res.send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const createPost = async (req: Request, res: Response) => {
  const postBody = req.body;
  try {
    const post = await postModel.create(postBody);
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findByIdAndDelete(postId);
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};


const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id; 
  const { content } = req.body; 

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { content }, 
      { new: true, runValidators: true } 
    );

    if (updatedPost) {
      res.send(updatedPost);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPostById,
};