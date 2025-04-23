import { Router } from "express";
import userAuth from "./authRoutes.js";
import userRoutes from "./userRoutes.js"
import { authenticate } from "../controllers/authentication/authController.js"

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

router.use("/auth", userAuth);
router.use("/user", authenticate, userRoutes);

export default router;
