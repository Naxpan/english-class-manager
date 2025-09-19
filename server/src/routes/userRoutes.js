import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  changePassword,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Tất cả routes đều cần authenticate
router.use(authenticate);

// Owner có thể xem tất cả users
// Admin chỉ có thể xem users trong chi nhánh của mình
router.get("/", authorize("owner", "admin"), getAllUsers);

// Chỉ owner và admin mới có thể tạo user
router.post("/", authorize("owner", "admin"), createUser);

// Update user
router.put("/:id", authorize("owner", "admin"), updateUser);

// Delete user (soft delete)
router.delete("/:id", authorize("owner", "admin"), deleteUser);

// Get user by ID
router.get("/:id", authorize("owner", "admin"), getUserById);

// Change password (user có thể đổi password của mình)
router.put("/:id/change-password", changePassword);

export default router;
