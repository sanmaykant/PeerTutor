import { Router } from "express";
import userAuth from "./authRoutes.js";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

router.use("/auth", userAuth);

export default router;
