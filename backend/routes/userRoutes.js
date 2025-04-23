import { Router } from "express";
import {
    updateMetrics,
    fetchMetrics,
    fetchMatches
} from "../controllers/user/userController.js"

const router = Router();

router.post("/metrics", (req, res, next) => {
    updateMetrics(req, res).catch(next);
});
router.get("/metrics", (req, res, next) => {
    fetchMetrics(req, res).catch(next);
})
router.get("/matches", (req, res, next) => {
    fetchMatches(req, res).catch(next);
})

export default router;
