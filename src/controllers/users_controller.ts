import userModel, { IUser } from "../models/users_model";
import BaseController from "./base_controller";

const usersController = new BaseController<IUser>(userModel);

export default usersController;
