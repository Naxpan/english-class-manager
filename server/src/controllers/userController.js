import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    let query = { isActive: true };
    if (req.query.role) {
      query.role = req.query.role;
    }
    const users = await User.find(query).select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách user" });
  }
};

export const createUser = async (req, res) => {
  try {
    // Chỉ owner mới được tạo tài khoản
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Chỉ owner mới được phép tạo tài khoản",
      });
    }

    const {
      username,
      email,
      password,
      fullName,
      role,
      branch,
      assignedClasses,
      phone,
    } = req.body;

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username hoặc email đã tồn tại",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
      fullName,
      role,
      branch,
      assignedClasses,
      phone,
      createdBy: req.user._id,
    });

    await newUser.save();

    // Trả về user mà không có password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Tạo người dùng thành công",
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo người dùng",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...updateData } = req.body;

    // Tìm user cần update
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Kiểm tra quyền update
    if (req.user.role === "admin") {
      // Admin không thể update owner hoặc admin khác
      if (existingUser.role === "owner" || existingUser.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền cập nhật người dùng này",
        });
      }
      // Admin chỉ có thể update user trong chi nhánh của mình
      if (existingUser.branch !== req.user.branch) {
        return res.status(403).json({
          success: false,
          message: "Không thể cập nhật user ở chi nhánh khác",
        });
      }
    }

    // Nếu có password mới, hash nó
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Cập nhật người dùng thành công",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật người dùng",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Kiểm tra quyền xóa
    if (req.user.role === "admin") {
      if (existingUser.role === "owner" || existingUser.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền xóa người dùng này",
        });
      }
      if (existingUser.branch !== req.user.branch) {
        return res.status(403).json({
          success: false,
          message: "Không thể xóa user ở chi nhánh khác",
        });
      }
    }

    // Không cho phép user tự xóa chính mình
    if (existingUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa chính mình",
      });
    }

    // Soft delete
    await User.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa người dùng",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate("createdBy", "fullName");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Kiểm tra quyền xem
    if (req.user.role === "admin") {
      if (user.branch !== req.user.branch) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền xem user ở chi nhánh khác",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin người dùng",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // User chỉ có thể đổi password của chính mình, trừ owner/admin có thể đổi password của user khác
    if (
      req.user._id.toString() !== id &&
      req.user.role !== "owner" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thay đổi mật khẩu của người dùng khác",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Nếu user đổi password của chính mình, cần verify current password
    if (req.user._id.toString() === id) {
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu hiện tại không đúng",
        });
      }
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(id, { password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: "Thay đổi mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thay đổi mật khẩu",
      error: error.message,
    });
  }
};
