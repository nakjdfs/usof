import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as Controller from "../controllers/authController.js";
const router = express.Router();
function generateAccessToken(user) {
    return jwt.sign(user, "ACCESS_TOKEN_SECRET", { expiresIn: "6h" });
}
router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.post("/logout", Controller.logout);
router.post("/password-reset", Controller.passReset);
router.get("/password-reset/:confirm_token", Controller.passConfirm);
router.get("/verify-email/:confirm_token", Controller.emailVerif);
export default router;
