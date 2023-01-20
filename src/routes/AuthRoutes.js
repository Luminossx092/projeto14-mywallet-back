import { signIn, signUp } from "../controller/Auth.js"
import { Router } from 'express'

const authRouter = Router();

authRouter.post("/cadastro", signUp);
authRouter.post("/login", signIn);

export default authRouter;