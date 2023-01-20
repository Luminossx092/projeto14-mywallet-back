import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/AuthRoutes.js";
import registroRouter from "./routes/RegistroRoutes.js";

const app = express();

app.use(json());
app.use(cors());
app.use(authRouter)
app.use(registroRouter)

const PORT = 5000;
app.listen(PORT, () => console.log('servidorestabemobrigado'))