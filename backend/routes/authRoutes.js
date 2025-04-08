import { Router } from "express";
import { signup, login, authenticate } from "../controllers/authController.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  signup(req, res).catch(next);
});

router.post("/login", (req, res, next) => {
  login(req, res).catch(next);
});

router.get("/protected", authenticate, async (req, res, next) => {
  res.send("this is a protected route...");
});

router.post("/authenticate", authenticate);

export default router;
