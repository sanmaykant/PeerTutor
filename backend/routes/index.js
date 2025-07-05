import { Router } from "express";
import userAuth from "./authRoutes.js";
import userRoutes from "./userRoutes.js"
import gamificationRoutes from "./gamificationRoutes.js";
import { authenticate } from "../controllers/authentication/authController.js"
import getMailHtml from "../utils/mailTemplate.js";

import { createTransport } from "nodemailer";

const router = Router();

const getTransporter = () => {
    return createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });
}

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

router.use("/auth", userAuth);
router.use("/user", authenticate, userRoutes);
router.use("/gamification", authenticate, gamificationRoutes);
router.post("/contact", (req, res) => {
    try {
        const { name, email, message } = req.body;
        const mailOptions = {
            to: process.env.EMAIL,
            subject: `New contact request from ${email}`,
            text: message,
            html: getMailHtml(name, email, message),
        };

        const transporter = getTransporter();
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log("mail sent");
                res.status(200).json({ success: true });
            }
        });
    } catch (error) {
        console.error(`Error resolving contact request: ${error}`);
    }
})

export default router;
