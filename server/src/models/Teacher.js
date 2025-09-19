import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Teacher", teacherSchema);

import Teacher from "../models/Teacher.js";

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi khi lấy danh sách giáo viên",
        error: error.message,
      });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ success: false, message: "Email giáo viên đã tồn tại" });
    }
    const newTeacher = new Teacher({ fullName, email, phone });
    await newTeacher.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Tạo giáo viên thành công",
        data: newTeacher,
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Lỗi khi tạo giáo viên",
        error: error.message,
      });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTeacher) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy giáo viên" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật giáo viên thành công",
        data: updatedTeacher,
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Lỗi khi cập nhật giáo viên",
        error: error.message,
      });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndUpdate(id, { isActive: false });
    res
      .status(200)
      .json({ success: true, message: "Xóa giáo viên thành công" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi khi xóa giáo viên",
        error: error.message,
      });
  }
};
