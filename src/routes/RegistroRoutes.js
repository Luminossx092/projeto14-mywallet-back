import { Router } from "express";
import { CreateNewRegistry, ListUserBalance } from "../controller/Registro.js";
import { authValidation } from "../middleware/AuthMiddleware.js";
import { ValidateMiddleware } from "../middleware/ValidateMiddleware.js";
import { RegistroSchema } from "../Model/RegistroSchema.js";

const registroRouter = Router();
registroRouter.use(authValidation)
registroRouter.post('/balance',ValidateMiddleware(RegistroSchema),CreateNewRegistry);
registroRouter.get('/balance',ListUserBalance);

export default registroRouter;