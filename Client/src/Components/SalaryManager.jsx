import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/salaries";

function SalaryManager() {
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    month: "",
    teacher: "",
    classCode: "",
    classLevel: "",
    salaryPerSession: "",
    sessionCount: "",
    totalSalary: "",
    note: "",
    salaryFactor: "1",
  });
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Lấy danh sách lương
  const fetchSalaries = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setSalaries(data.data || []))
      .finally(() => setLoading(false));
  };

  // Lấy danh sách giáo viên
  const fetchTeachers = () => {
    fetch("http://localhost:3000/api/users?role=teacher", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setTeachers(data.data || []));
  };

  useEffect(() => {
    fetchSalaries();
    fetchTeachers();
  }, []);

  // Lọc theo tên giáo viên hoặc mã lớp
  const filtered = salaries.filter(
    (s) =>
      s.teacher?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.classCode?.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Tính tổng lương tự động
  useEffect(() => {
    const total =
      (parseFloat(form.salaryPerSession) || 0) *
      (parseInt(form.sessionCount) || 0) *
      (parseFloat(form.salaryFactor) || 1);
    setForm((f) => ({ ...f, totalSalary: total ? total.toString() : "" }));
    // eslint-disable-next-line
  }, [form.salaryPerSession, form.sessionCount, form.salaryFactor]);

  // Thêm hoặc cập nhật lương
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
          fetchSalaries();
          setForm({
            month: "",
            teacher: "",
            classCode: "",
            classLevel: "",
            salaryPerSession: "",
            sessionCount: "",
            totalSalary: "",
            note: "",
            salaryFactor: "1",
          });
          setEditingId(null);
        } else {
          setMessage(data.message || "❌ Có lỗi xảy ra!");
        }
      })
      .catch(() => setMessage("❌ Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  }

  // Sửa lương
  function handleEdit(s) {
    setForm({
      month: s.month || "",
      teacher: s.teacher?._id || "",
      classCode: s.classCode || "",
      classLevel: s.classLevel || "",
      salaryPerSession: s.salaryPerSession || "",
      sessionCount: s.sessionCount || "",
      totalSalary: s.totalSalary || "",
      note: s.note || "",
      salaryFactor: s.salaryFactor?.toString() || "1",
    });
    setEditingId(s._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Xóa lương
  function handleDelete(id) {
    if (window.confirm("Bạn chắc chắn muốn xóa bảng lương này?")) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSalaries((prev) => prev.filter((s) => s._id !== id));
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
        Quản lý bảng lương
      </h2>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded-lg px-4 py-2 w-72"
          placeholder="Tìm giáo viên hoặc mã lớp..."
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
              Tháng (YYYY-MM)
            </label>
            <input
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Tháng (YYYY-MM)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giáo viên</label>
            <select
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Chọn giáo viên</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã lớp</label>
            <input
              name="classCode"
              value={form.classCode}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Mã lớp"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cấp độ lớp</label>
            <input
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Cấp độ lớp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lương/buổi</label>
            <input
              name="salaryPerSession"
              value={form.salaryPerSession}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Lương/buổi"
              type="number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số buổi dạy
            </label>
            <input
              name="sessionCount"
              value={form.sessionCount}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Số buổi dạy"
              type="number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hệ số lương
            </label>
            <input
              name="salaryFactor"
              value={form.salaryFactor}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Hệ số lương"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thành tiền</label>
            <input
              name="totalSalary"
              value={form.totalSalary}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-100"
              placeholder="Thành tiền"
              type="number"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <input
              name="note"
              value={form.note}
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
              <th className="border px-4 py-2 text-left">Tháng</th>
              <th className="border px-4 py-2 text-left">Giáo viên</th>
              <th className="border px-4 py-2 text-left">Mã lớp</th>
              <th className="border px-4 py-2 text-left">Cấp độ</th>
              <th className="border px-4 py-2 text-left">Lương/buổi</th>
              <th className="border px-4 py-2 text-left">Số buổi</th>
              <th className="border px-4 py-2 text-left">Hệ số</th>
              <th className="border px-4 py-2 text-left">Thành tiền</th>
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
                <td className="border px-4 py-2">{s.month}</td>
                <td className="border px-4 py-2">
                  {s.teacher?.fullName || ""}
                </td>
                <td className="border px-4 py-2">{s.classCode}</td>
                <td className="border px-4 py-2">{s.classLevel}</td>
                <td className="border px-4 py-2">{s.salaryPerSession}</td>
                <td className="border px-4 py-2">{s.sessionCount}</td>
                <td className="border px-4 py-2">{s.salaryFactor}</td>
                <td className="border px-4 py-2">{s.totalSalary}</td>
                <td className="border px-4 py-2">{s.note}</td>
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
                  colSpan="10"
                  className="text-center py-4 text-gray-500 italic"
                >
                  Không có bảng lương nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalaryManager;
