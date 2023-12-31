import express from "express";
import { verifyToken, isAdmin } from "./verification.js";
import * as Controller from "../controllers/comController.js";
const router = express.Router();
router.get("/:comm_id", Controller.get_comment);
router.get("/:comm_id/like", Controller.get_comment_likes);
router.post("/:comm_id/like", verifyToken, Controller.post_comment_like);
router.patch("/:comm_id", verifyToken, Controller.patch_comment);
router.delete("/:comm_id", verifyToken, Controller.delete_comment);
router.delete("/:comm_id/like", verifyToken, Controller.delete_comment_like);
export default router;
