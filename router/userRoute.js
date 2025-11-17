import express from 'express';
//import user from '../model/user.js';
import { createUser } from '../controller/userController.js';
import { loginUser } from '../controller/userController.js';


const userRouter = express.Router();


userRouter.post('/register',  createUser);
userRouter.post('/login',  loginUser);


export default userRouter;  