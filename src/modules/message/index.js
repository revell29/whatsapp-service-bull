import { Router } from "express";
import MessageController from "./MessageController";

const router = Router();

router.post("/sendmessage", MessageController.sendMessage);
router.post("/sendimage", MessageController.sendMessageImage);

export default router;
