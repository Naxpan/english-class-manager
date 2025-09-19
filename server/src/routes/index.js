import express from "express";
import studentRoutes from "./studentRoutes.js";
import classRoutes from "./classRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/classes", classRoutes);

export default router;
