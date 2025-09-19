import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/users";

function UserManager({ user }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "admin",
    branch: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user list
  const fetchUsers = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add or update user
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage(
            editingId
              ? "✅ Cập nhật thành công!"
              : "✅ Tạo tài khoản thành công!"
          );
          fetchUsers();
          setForm({
            username: "",
            password: "",
            fullName: "",
            email: "",
            role: "admin",
            branch: "",
            phone: "",
          });
          setEditingId(null);
        } else {
          setMessage(data.message || "❌ Có lỗi xảy ra!");
        }
      })
      .catch(() => setMessage("❌ Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  }

  // Edit user
  function handleEdit(u) {
    setForm({
      username: u.username,
      password: "",
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      branch: u.branch,
      phone: u.phone,
    });
    setEditingId(u._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Delete user
  function handleDelete(id) {
    if (window.confirm("Bạn chắc chắn muốn xóa tài khoản này?")) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUsers((prev) => prev.filter((u) => u._id !== id));
            setMessage("✅ Xóa thành công!");
          } else {
            setMessage(data.message || "❌ Có lỗi xảy ra!");
          }
        })
        .catch(() => setMessage("❌ Có lỗi xảy ra!"))
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
        >
          ← Quay lại
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý tài khoản hệ thống
      </h2>

      {/* Message */}
      {message && (
        <div className="mb-4 p-3 rounded-lg text-white font-semibold bg-green-500 shadow">
          {message}
        </div>
      )}

      {/* Form */}
      <div
        ref={formRef}
        className="bg-white p-6 rounded-xl shadow-lg mb-8 border"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên đăng nhập
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Tên đăng nhập"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Họ tên"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Email"
              type="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Số điện thoại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="admin">Admin bậc thấp</option>
              <option value="teacher">Giáo viên</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chi nhánh</label>
            <input
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Chi nhánh"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder={
                editingId ? "Mật khẩu mới (bỏ trống nếu không đổi)" : "Mật khẩu"
              }
              required={!editingId}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {editingId ? "Cập nhật" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mb-4 text-blue-600 font-semibold">⏳ Đang xử lý...</div>
      )}

      {/* User table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Tên đăng nhập</th>
              <th className="border px-4 py-2 text-left">Họ tên</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Vai trò</th>
              <th className="border px-4 py-2 text-left">Chi nhánh</th>
              <th className="border px-4 py-2 text-left">Số điện thoại</th>
              <th className="border px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="border px-4 py-2">{u.username}</td>
                <td className="border px-4 py-2">{u.fullName}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.role}</td>
                <td className="border px-4 py-2">{u.branch}</td>
                <td className="border px-4 py-2">{u.phone}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="inline-flex items-center gap-1 mr-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg shadow hover:bg-blue-600 hover:text-white transition font-semibold"
                    onClick={() => handleEdit(u)}
                    disabled={loading}
                    title="Sửa tài khoản"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: 18 }}
                    ></span>
                    Sửa
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg shadow hover:bg-red-600 hover:text-white transition font-semibold"
                    onClick={() => handleDelete(u._id)}
                    disabled={loading}
                    title="Xóa tài khoản"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: 18 }}
                    ></span>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500 italic"
                >
                  Chưa có tài khoản nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManager;
