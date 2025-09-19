import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/students";

function StudentManager() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    studentCode: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Lấy danh sách học viên
  const fetchStudents = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Lọc học viên theo tên hoặc mã
  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

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
            editingId ? "✅ Cập nhật thành công!" : "✅ Thêm mới thành công!"
          );
          fetchStudents();
          setForm({
            studentCode: "",
            fullName: "",
            phone: "",
            email: "",
            address: "",
            notes: "",
          });
          setEditingId(null);
        } else {
          setMessage(data.message || "❌ Có lỗi xảy ra!");
        }
      })
      .catch(() => setMessage("❌ Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  }

  function handleEdit(s) {
    setForm({
      studentCode: s.studentCode,
      fullName: s.fullName,
      phone: s.phone,
      email: s.email,
      address: s.address,
      notes: s.notes,
    });
    setEditingId(s._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleDelete(id) {
    if (window.confirm("Bạn chắc chắn muốn xóa học viên này?")) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStudents((prev) => prev.filter((s) => s._id !== id));
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý học viên
      </h2>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded-lg px-4 py-2 w-72"
          placeholder="Tìm tên hoặc mã học viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {message && (
        <div className="mb-4 p-3 rounded-lg text-white font-semibold bg-green-500 shadow">
          {message}
        </div>
      )}
      <div
        ref={formRef}
        className="bg-white p-6 rounded-xl shadow-lg mb-8 border"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã học viên
            </label>
            <input
              name="studentCode"
              value={form.studentCode}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Mã học viên"
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Email"
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Địa chỉ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Ghi chú"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
      {loading && (
        <div className="mb-4 text-blue-600 font-semibold">⏳ Đang xử lý...</div>
      )}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Mã học viên</th>
              <th className="border px-4 py-2 text-left">Họ tên</th>
              <th className="border px-4 py-2 text-left">SĐT</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Địa chỉ</th>
              <th className="border px-4 py-2 text-left">Ghi chú</th>
              <th className="border px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="border px-4 py-2">{s.studentCode}</td>
                <td className="border px-4 py-2">{s.fullName}</td>
                <td className="border px-4 py-2">{s.phone}</td>
                <td className="border px-4 py-2">{s.email}</td>
                <td className="border px-4 py-2">{s.address}</td>
                <td className="border px-4 py-2">{s.notes}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="mr-3 text-blue-600 hover:underline"
                    onClick={() => handleEdit(s)}
                    disabled={loading}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(s._id)}
                    disabled={loading}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500 italic"
                >
                  Không có học viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentManager;
