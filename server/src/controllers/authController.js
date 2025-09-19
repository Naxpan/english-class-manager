import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        branch: user.branch,
        assignedClasses: user.assignedClasses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      role,
      branch,
      phone,
      assignedClasses,
    } = req.body;

    // Kiểm tra nếu đây là tài khoản owner đầu tiên
    const existingOwner = await User.findOne({ role: "owner" });

    if (existingOwner && role === "owner") {
      return res.status(400).json({
        success: false,
        message: "Đã tồn tại tài khoản chủ sở hữu trong hệ thống",
      });
    }

    // Nếu không phải owner đầu tiên, cần xác thực
    if (existingOwner) {
      // Chỉ owner và admin mới có thể tạo tài khoản
      if (
        !req.user ||
        (req.user.role !== "owner" && req.user.role !== "admin")
      ) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền tạo tài khoản",
        });
      }

      // Admin chỉ có thể tạo teacher trong chi nhánh của mình
      if (req.user.role === "admin" && (role === "owner" || role === "admin")) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền tạo tài khoản với vai trò này",
        });
      }
    }

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc email đã tồn tại",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
      fullName,
      role: existingOwner ? role : "owner", // Nếu chưa có owner thì tự động set role là owner
      branch,
      phone,
      assignedClasses,
      createdBy: req.user?._id,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        branch: newUser.branch,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo tài khoản",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role,
        branch: req.user.branch,
        assignedClasses: req.user.assignedClasses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
