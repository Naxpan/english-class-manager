import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/attendance";
const CLASS_API = "http://localhost:3000/api/classes";
const TEACHER_API = "http://localhost:3000/api/users?role=teacher";

function AttendanceManager() {
  const [attendances, setAttendances] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    classCode: "",
    date: "",
    teacher: "",
    students: [],
    note: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Lấy danh sách điểm danh
  const fetchAttendances = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setAttendances(data.data || []))
      .finally(() => setLoading(false));
  };

  // Lấy danh sách lớp và giáo viên
  const fetchClasses = () => {
    fetch(CLASS_API)
      .then((res) => res.json())
      .then((data) => setClasses(data.data || []));
  };
  const fetchTeachers = () => {
    fetch(TEACHER_API, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setTeachers(data.data || []));
  };

  // Lấy danh sách học viên của lớp khi chọn lớp
  function handleClassChange(e) {
    const classCode = e.target.value;
    setForm({ ...form, classCode, students: [] });
    const selectedClass = classes.find((c) => c.classCode === classCode);
    if (selectedClass && selectedClass.students) {
      setForm((f) => ({
        ...f,
        students: selectedClass.students.map((s) => ({
          studentCode: s.studentCode,
          fullName: s.fullName,
          status: "present",
          note: "",
        })),
      }));
    }
  }

  useEffect(() => {
    fetchAttendances();
    fetchClasses();
    fetchTeachers();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleStudentStatus(idx, value) {
    setForm((f) => {
      const students = [...f.students];
      students[idx].status = value;
      return { ...f, students };
    });
  }

  function handleStudentNote(idx, value) {
    setForm((f) => {
      const students = [...f.students];
      students[idx].note = value;
      return { ...f, students };
    });
  }

  // Thêm hoặc cập nhật điểm danh
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
              : "✅ Lưu điểm danh thành công!"
          );
          fetchAttendances();
          setForm({
            classCode: "",
            date: "",
            teacher: "",
            students: [],
            note: "",
          });
          setEditingId(null);
        } else {
          setMessage(data.message || "❌ Có lỗi xảy ra!");
        }
      })
      .catch(() => setMessage("❌ Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  }

  // Sửa điểm danh
  function handleEdit(a) {
    setForm({
      classCode: a.classCode,
      date: a.date ? a.date.slice(0, 10) : "",
      teacher: a.teacher,
      students: a.students || [],
      note: a.note || "",
    });
    setEditingId(a._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Xóa điểm danh
  function handleDelete(id) {
    if (window.confirm("Bạn chắc chắn muốn xóa bản ghi này?")) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAttendances((prev) => prev.filter((a) => a._id !== id));
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
        Quản lý chấm công & điểm danh
      </h2>
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
            <label className="block text-sm font-medium mb-1">Lớp học</label>
            <select
              name="classCode"
              value={form.classCode}
              onChange={handleClassChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Chọn lớp</option>
              {classes.map((c) => (
                <option key={c._id} value={c.classCode}>
                  {c.className} ({c.classCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Giáo viên xác nhận
            </label>
            <select
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Chọn giáo viên xác nhận</option>
              {teachers.map((t) => (
                <option key={t._id} value={t.fullName}>
                  {t.fullName}
                </option>
              ))}
            </select>
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
          <div className="col-span-2">
            <table className="min-w-full border-collapse rounded-xl shadow border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2">Mã học viên</th>
                  <th className="border px-4 py-2">Họ tên</th>
                  <th className="border px-4 py-2">Trạng thái</th>
                  <th className="border px-4 py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {form.students.map((s, idx) => (
                  <tr key={s.studentCode}>
                    <td className="border px-4 py-2">{s.studentCode}</td>
                    <td className="border px-4 py-2">{s.fullName}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={s.status}
                        onChange={(e) =>
                          handleStudentStatus(idx, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="present">Có mặt</option>
                        <option value="absent">Vắng</option>
                        <option value="late">Đi trễ</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        value={s.note}
                        onChange={(e) => handleStudentNote(idx, e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Ghi chú"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-end col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {editingId ? "Cập nhật" : "Lưu điểm danh"}
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
              <th className="border px-4 py-2">Ngày</th>
              <th className="border px-4 py-2">Lớp</th>
              <th className="border px-4 py-2">Giáo viên xác nhận</th>
              <th className="border px-4 py-2">Ghi chú</th>
              <th className="border px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((a) => (
              <tr
                key={a._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="border px-4 py-2">
                  {a.date ? new Date(a.date).toLocaleDateString("vi-VN") : ""}
                </td>
                <td className="border px-4 py-2">{a.classCode}</td>
                <td className="border px-4 py-2">{a.teacher}</td>
                <td className="border px-4 py-2">{a.note}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="mr-2 text-blue-600"
                    onClick={() => handleEdit(a)}
                    disabled={loading}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(a._id)}
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

export default AttendanceManager;
