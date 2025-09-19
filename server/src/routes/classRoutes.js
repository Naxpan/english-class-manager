import express from "express";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents,
  getClassByCode,
  getClassesByBranch,
  seedSampleData,
} from "../controllers/classController.js";

const router = express.Router();

router.get("/", getAllClasses);
router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.get("/:id/students", getClassStudents);
router.get("/code/:classCode", getClassByCode);
router.get("/branch/:branch", getClassesByBranch);
router.post("/seed", seedSampleData);

export default router;
