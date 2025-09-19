import express from "express";
import { login, register, getProfile } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware để check xem có owner nào chưa
const checkOwnerExists = async (req, res, next) => {
  try {
    const existingOwner = await User.findOne({ role: "owner" });
    req.hasOwner = !!existingOwner;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Route đăng nhập
router.post("/login", login);

// Route đăng ký - cho phép tạo owner đầu tiên mà không cần xác thực
router.post(
  "/register",
  checkOwnerExists,
  (req, res, next) => {
    // Nếu chưa có owner, cho phép đăng ký mà không cần xác thực
    if (!req.hasOwner) {
      return register(req, res);
    }
    // Nếu đã có owner, cần xác thực
    authenticate(req, res, next);
  },
  register
);

// Route lấy profile
router.get("/profile", authenticate, getProfile);

// Route check xem hệ thống đã có owner chưa
router.get("/check-owner", async (req, res) => {
  try {
    const existingOwner = await User.findOne({ role: "owner" });
    res.json({
      success: true,
      hasOwner: !!existingOwner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

export default router;
