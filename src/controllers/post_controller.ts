import postModel, { IPost } from "../models/post_model";
import BaseController from "./base_controller";

const postController = new BaseController<IPost>(postModel);

export default postController;
