import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/classes";
const TEACHER_API = "http://localhost:3000/api/users?role=teacher";

function ClassManager() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [branch, setBranch] = useState("");
  const [form, setForm] = useState({
    classCode: "",
    className: "",
    branch: "",
    teacher: "",
    schedule: "",
    shift: "",
    tuitionFee4Weeks: "",
    tuitionFee8Weeks: "",
    tuitionFee12Weeks: "",
    startDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Lấy danh sách lớp học từ backend
  const fetchClasses = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setClasses(data.data || []))
      .finally(() => setLoading(false));
  };

  // Lấy danh sách giáo viên
  const fetchTeachers = () => {
    fetch(TEACHER_API, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setTeachers(data.data || []));
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    console.log("Teachers:", teachers);
  }, [teachers]);

  // Lọc danh sách lớp học
  const filtered = classes.filter((c) => {
    const matchCode = c.classCode
      .toLowerCase()
      .includes(searchCode.toLowerCase());
    const matchBranch = c.branch.toLowerCase().includes(branch.toLowerCase());
    return matchCode && matchBranch;
  });

  // Xử lý thay đổi form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Thêm hoặc cập nhật lớp học
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage(
            editingId ? "Cập nhật thành công!" : "Thêm mới thành công!"
          );
          fetchClasses();
          setForm({
            classCode: "",
            className: "",
            branch: "",
            teacher: "",
            schedule: "",
            shift: "",
            tuitionFee4Weeks: "",
            tuitionFee8Weeks: "",
            tuitionFee12Weeks: "",
            startDate: "",
          });
          setEditingId(null);
        } else {
          setMessage(data.message || "Có lỗi xảy ra!");
        }
      })
      .catch(() => setMessage("Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  }

  // Sửa lớp học
  function handleEdit(c) {
    setForm({ ...c });
    setEditingId(c._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Xóa lớp học
  function handleDelete(id) {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setClasses((prev) => prev.filter((c) => c._id !== id));
            setMessage("Xóa thành công!");
          } else {
            setMessage(data.message || "Có lỗi xảy ra!");
          }
        })
        .catch(() => setMessage("Có lỗi xảy ra!"))
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý lớp học</h2>
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
          <input
            name="classCode"
            value={form.classCode}
            onChange={handleChange}
            placeholder="Mã lớp"
            required
            className="border px-2 py-1 rounded"
          />
          <input
            name="className"
            value={form.className}
            onChange={handleChange}
            placeholder="Tên lớp"
            required
            className="border px-2 py-1 rounded"
          />
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="Chi nhánh"
            required
            className="border px-2 py-1 rounded"
          />
          {/* Chọn giáo viên bằng dropdown */}
          <select
            name="teacher"
            value={form.teacher}
            onChange={handleChange}
            required
            className="border px-2 py-1 rounded"
          >
            <option value="">Chọn giáo viên</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.fullName}
              </option>
            ))}
          </select>

          <input
            name="schedule"
            value={form.schedule}
            onChange={handleChange}
            placeholder="Lịch học"
            required
            className="border px-2 py-1 rounded"
          />
          <input
            name="shift"
            value={form.shift}
            onChange={handleChange}
            placeholder="Ca học"
            required
            className="border px-2 py-1 rounded"
          />
          <input
            name="tuitionFee4Weeks"
            value={form.tuitionFee4Weeks}
            onChange={handleChange}
            placeholder="Học phí 4 tuần"
            required
            className="border px-2 py-1 rounded"
          />
          <input
            name="tuitionFee8Weeks"
            value={form.tuitionFee8Weeks}
            onChange={handleChange}
            placeholder="Học phí 8 tuần"
            required
            className="border px-2 py-1 rounded"
          />
          <input
            name="tuitionFee12Weeks"
            value={form.tuitionFee12Weeks}
            onChange={handleChange}
            placeholder="Học phí 12 tuần"
            required
            className="border px-2 py-1 rounded"
          />
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            placeholder="Ngày bắt đầu"
            required
            className="border px-2 py-1 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition col-span-2"
            disabled={loading}
          >
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>
        </form>
      </div>
      {loading && (
        <div className="mb-4 text-blue-600 font-semibold">⏳ Đang xử lý...</div>
      )}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Mã lớp</th>
              <th className="border px-4 py-2 text-left">Tên lớp</th>
              <th className="border px-4 py-2 text-left">Chi nhánh</th>
              <th className="border px-4 py-2 text-left">Giáo viên</th>
              <th className="border px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td className="border px-4 py-2">{c.classCode}</td>
                <td className="border px-4 py-2">{c.className}</td>
                <td className="border px-4 py-2">{c.branch}</td>
                <td className="border px-4 py-2">{c.teacher}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="mr-2 text-blue-600"
                    onClick={() => handleEdit(c)}
                    disabled={loading}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(c._id)}
                    disabled={loading}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClassManager;
