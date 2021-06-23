import { Router } from "express";
import chat from "./message";

const app = Router();

app.use("/chats", chat);

export default app;
