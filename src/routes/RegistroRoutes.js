import { Router } from "express";
import { CreateNewRegistry, ListUserBalance } from "../controller/Registro.js";

const registroRouter = Router();

registroRouter.post('/balance',CreateNewRegistry);
registroRouter.get('/balance',ListUserBalance);

export default registroRouter;