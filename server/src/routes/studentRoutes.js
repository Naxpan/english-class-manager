import express from "express";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByCode,
  getStudentWithEnrollments,
  seedStudentData,
} from "../controllers/studentController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Tất cả routes đều cần authenticate
router.use(authenticate);

router.get("/", getAllStudents);
router.post("/", authorize("admin", "teacher"), createStudent);
router.put("/:id", authorize("admin", "teacher"), updateStudent);
router.delete("/:id", authorize("admin", "teacher"), deleteStudent);
router.get("/code/:studentCode", getStudentByCode);
router.get("/:id/enrollments", getStudentWithEnrollments);
router.post("/seed", authorize("owner"), seedStudentData);

export default router;
