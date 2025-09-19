import Class from "../models/Class.js";
import Student from "../models/Student.js";

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách lớp học",
      error: error.message,
    });
  }
};

export const createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();

    res.status(201).json({
      success: true,
      message: "Tạo lớp học thành công",
      data: newClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo lớp học",
      error: error.message,
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật lớp học thành công",
      data: updatedClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật lớp học",
      error: error.message,
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await Class.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa lớp học thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa lớp học",
      error: error.message,
    });
  }
};

export const getClassStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const students = await Student.find({
      registeredClass: id,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách học viên",
      error: error.message,
    });
  }
};

export const getClassByCode = async (req, res) => {
  try {
    const { classCode } = req.params;
    const classData = await Class.findOne({
      classCode: classCode,
      isActive: true,
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin lớp học",
      error: error.message,
    });
  }
};

export const getClassesByBranch = async (req, res) => {
  try {
    const { branch } = req.params;
    const classes = await Class.find({
      branch: branch,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách lớp học theo chi nhánh",
      error: error.message,
    });
  }
};

export const seedSampleData = async (req, res) => {
  try {
    const sampleClasses = [
      {
        classCode: "BTC2HLR3",
        className: "Pre - Starters 3",
        tuitionFee4Weeks: 600000,
        tuitionFee12Weeks: 1650000,
        tuitionFee8Weeks: 1200000,
        branch: "Bình Thạnh",
        schedule: "Thứ 7CN",
        shift: "Ca 2",
        teacher: "Mr. Hào",
        startDate: new Date("2024-01-15"),
      },
      {
        classCode: "BT35NDR1",
        className: "Pre - Starters 1",
        tuitionFee4Weeks: 550000,
        tuitionFee12Weeks: 1650000,
        tuitionFee8Weeks: 1100000,
        branch: "Bình Thạnh",
        schedule: "Thứ 3 + 5",
        shift: "Ca 1",
        teacher: "Ms. Nhiên",
        startDate: new Date("2024-01-10"),
      },
    ];

    // Xóa dữ liệu cũ và thêm dữ liệu mẫu
    await Class.deleteMany({});
    const createdClasses = await Class.insertMany(sampleClasses);

    res.status(201).json({
      success: true,
      message: "Đã tạo dữ liệu mẫu thành công",
      data: createdClasses,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo dữ liệu mẫu",
      error: error.message,
    });
  }
};
