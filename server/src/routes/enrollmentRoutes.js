import express from "express";
import {
  getAllEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByClass,
} from "../controllers/enrollmentController.js";
import { authenticate, authorize, checkOwnership } from "../middleware/auth.js";

const router = express.Router();

// Tất cả routes đều cần authenticate
router.use(authenticate);

router.get("/", checkOwnership, getAllEnrollments);
router.post("/", authorize("admin", "teacher"), createEnrollment);
router.put("/:id", authorize("admin", "teacher"), updateEnrollment);
router.delete("/:id", authorize("admin", "teacher"), deleteEnrollment);
router.get("/student/:studentId", getEnrollmentsByStudent);
router.get("/class/:classCode", getEnrollmentsByClass);

export default router;