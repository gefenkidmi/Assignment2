"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post_model"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.owner;
    try {
        if (filter) {
            const posts = yield post_model_1.default.find({ owner: filter });
            res.send(posts);
        }
        else {
            const posts = yield post_model_1.default.find();
            res.send(posts);
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const post = yield post_model_1.default.findById(postId);
        if (post != null) {
            res.send(post);
        }
        else {
            res.status(404).send("Post not found");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postBody = req.body;
    try {
        const post = yield post_model_1.default.create(postBody);
        res.status(201).send(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const post = yield post_model_1.default.findByIdAndDelete(postId);
        res.status(200).send(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { content } = req.body;
    try {
        const updatedPost = yield post_model_1.default.findByIdAndUpdate(postId, { content }, { new: true, runValidators: true });
        if (updatedPost) {
            res.send(updatedPost);
        }
        else {
            res.status(404).send("Post not found");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.default = {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
};
//# sourceMappingURL=post_controller.js.map