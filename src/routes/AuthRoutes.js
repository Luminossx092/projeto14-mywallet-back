import { signIn, signUp } from "../controller/Auth.js"
import { Router } from 'express'
import { ValidateMiddleware } from "../middleware/ValidateMiddleware.js";
import { CadastroSchema } from "../Model/CadastroSchema.js";

const authRouter = Router();

authRouter.post("/cadastro",ValidateMiddleware(CadastroSchema), signUp);
authRouter.post("/login", signIn);

export default authRouter;