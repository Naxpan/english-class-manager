import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";

export const getAllEnrollments = async (req, res) => {
  try {
    let query = { isActive: true };

    // Teacher chỉ xem enrollment trong lớp được gán
    if (req.user.role === "teacher") {
      query.classCode = { $in: req.user.assignedClasses };
    }

    // Admin chỉ xem enrollment trong chi nhánh
    if (req.user.role === "admin") {
      const classes = await Class.find({ branch: req.user.branch }).select("classCode");
      const classCodes = classes.map((c) => c.classCode);
      query.classCode = { $in: classCodes };
    }

    const enrollments = await Enrollment.find(query)
      .populate("student", "studentCode fullName phone")
      .populate("classInfo", "className teacher")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đăng ký",
      error: error.message,
    });
  }
};

export const createEnrollment = async (req, res) => {
  try {
    const { studentId, classCode, ...enrollmentData } = req.body;

    // Kiểm tra học sinh tồn tại
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    // Kiểm tra lớp học tồn tại
    const classInfo = await Class.findOne({ classCode, isActive: true });
    if (!classInfo) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    // Kiểm tra quyền
    if (req.user.role === "teacher") {
      if (!req.user.assignedClasses.includes(classCode)) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền tạo đăng ký cho lớp này",
        });
      }
    }

    if (req.user.role === "admin") {
      if (classInfo.branch !== req.user.branch) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền tạo đăng ký cho lớp này",
        });
      }
    }

    // Kiểm tra học sinh đã đăng ký lớp này chưa
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      classCode,
      status: "active",
      isActive: true,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Học sinh đã đăng ký lớp này",
      });
    }

    const newEnrollment = new Enrollment({
      student: studentId,
      classInfo: classInfo._id,
      classCode,
      ...enrollmentData,
      createdBy: req.user._id,
    });

    await newEnrollment.save();

    // Cập nhật số lượng học sinh trong lớp
    await Class.findByIdAndUpdate(classInfo._id, {
      $inc: { studentCount: 1 },
    });

    const populatedEnrollment = await Enrollment.findById(newEnrollment._id)
      .populate("student", "studentCode fullName phone")
      .populate("classInfo", "className teacher");

    res.status(201).json({
      success: true,
      message: "Đăng ký lớp học thành công",
      data: populatedEnrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo đăng ký",
      error: error.message,
    });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đăng ký",
      });
    }

    // Kiểm tra quyền
    if (req.user.role === "teacher") {
      if (!req.user.assignedClasses.includes(enrollment.classCode)) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền cập nhật đăng ký này",
        });
      }
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("student", "studentCode fullName phone")
      .populate("classInfo", "className teacher");

    res.status(200).json({
      success: true,
      message: "Cập nhật đăng ký thành công",
      data: updatedEnrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật đăng ký",
      error: error.message,
    });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đăng ký",
      });
    }

    // Kiểm tra quyền
    if (req.user.role === "teacher") {
      if (!req.user.assignedClasses.includes(enrollment.classCode)) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền xóa đăng ký này",
        });
      }
    }

    await Enrollment.findByIdAndUpdate(id, { isActive: false });

    // Giảm số lượng học sinh trong lớp
    await Class.findByIdAndUpdate(enrollment.classInfo, {
      $inc: { studentCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Xóa đăng ký thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa đăng ký",
      error: error.message,
    });
  }
};

export const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const enrollments = await Enrollment.find({
      student: studentId,
      isActive: true,
    })
      .populate("classInfo", "className teacher schedule shift branch")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lịch sử đăng ký",
      error: error.message,
    });
  }
};

export const getEnrollmentsByClass = async (req, res) => {
  try {
    const { classCode } = req.params;

    // Kiểm tra quyền
    if (req.user.role === "teacher") {
      if (!req.user.assignedClasses.includes(classCode)) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền xem lớp này",
        });
      }
    }

    const enrollments = await Enrollment.find({
      classCode,
      isActive: true,
    })
      .populate("student", "studentCode fullName phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đăng ký",
      error: error.message,
    });
  }
};