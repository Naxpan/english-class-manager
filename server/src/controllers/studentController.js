import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách học sinh",
      error: error.message,
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    // Kiểm tra mã học sinh đã tồn tại
    const existingStudent = await Student.findOne({
      studentCode: req.body.studentCode,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Mã học sinh đã tồn tại",
      });
    }

    const newStudent = new Student({
      ...req.body,
      createdBy: req.user._id,
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Tạo học sinh thành công",
      data: newStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo học sinh",
      error: error.message,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật học sinh thành công",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật học sinh",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Xóa học sinh thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa học sinh",
      error: error.message,
    });
  }
};

export const getStudentByCode = async (req, res) => {
  try {
    const { studentCode } = req.params;
    const student = await Student.findOne({
      studentCode,
      isActive: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin học sinh",
      error: error.message,
    });
  }
};

export const getStudentWithEnrollments = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    const enrollments = await Enrollment.find({
      student: id,
      isActive: true,
    })
      .populate("classInfo", "className teacher schedule shift branch")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        student,
        enrollments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin học sinh",
      error: error.message,
    });
  }
};

export const seedStudentData = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thực hiện chức năng này",
      });
    }

    const sampleStudents = [
      {
        studentCode: "HV001",
        fullName: "Nguyễn Văn A",
        phone: "0123456789",
        email: "nguyenvana@email.com",
        address: "123 Nguyễn Văn Cừ, Bình Thạnh",
        dateOfBirth: new Date("1990-01-15"),
        parentName: "Nguyễn Văn B",
        parentPhone: "0123456788",
        notes: "Học sinh chăm chỉ",
      },
      {
        studentCode: "HV002",
        fullName: "Trần Thị B",
        phone: "0987654321",
        email: "tranthib@email.com",
        address: "456 Điện Biên Phủ, Bình Thạnh",
        dateOfBirth: new Date("1995-05-20"),
        parentName: "Trần Văn C",
        parentPhone: "0987654320",
        notes: "Cần theo dõi thêm",
      },
    ];

    await Student.deleteMany({});
    const createdStudents = await Student.insertMany(sampleStudents);

    res.status(201).json({
      success: true,
      message: "Đã tạo dữ liệu mẫu học sinh thành công",
      data: createdStudents,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo dữ liệu mẫu học sinh",
      error: error.message,
    });
  }
};
