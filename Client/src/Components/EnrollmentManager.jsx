import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/enrollments";

function EnrollmentManager() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    studentId: "",
    classCode: "",
    appliedTuition: "",
    tuitionDiscount: "",
    totalAmount: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Lấy danh sách học phí & thu chi
  const fetchEnrollments = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setEnrollments(data.data || []))
      .finally(() => setLoading(false));
  };

  // Lấy danh sách học viên và lớp học để chọn khi thêm/sửa
  const fetchStudents = () => {
    fetch("http://localhost:3000/api/students", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.data || []));
  };
  const fetchClasses = () => {
    fetch("http://localhost:3000/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.data || []));
  };

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchClasses();
  }, []);

  // Lọc theo tên hoặc mã học viên
  const filtered = enrollments.filter(
    (e) =>
      e.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      e.student?.studentCode?.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Thêm hoặc cập nhật khoản thu
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
          fetchEnrollments();
          setForm({
            studentId: "",
            classCode: "",
            appliedTuition: "",
            tuitionDiscount: "",
            totalAmount: "",
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

  // Sửa khoản thu
  function handleEdit(e) {
    setForm({
      studentId: e.student?._id || "",
      classCode: e.classCode || "",
      appliedTuition: e.appliedTuition || "",
      tuitionDiscount: e.tuitionDiscount || "",
      totalAmount: e.totalAmount || "",
      notes: e.notes || "",
    });
    setEditingId(e._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Xóa khoản thu
  function handleDelete(id) {
    if (window.confirm("Bạn chắc chắn muốn xóa khoản thu này?")) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEnrollments((prev) => prev.filter((e) => e._id !== id));
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
        Quản lý học phí & thu chi
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
            <label className="block text-sm font-medium mb-1">Học viên</label>
            <select
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Chọn học viên</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.fullName} ({s.studentCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lớp học</label>
            <select
              name="classCode"
              value={form.classCode}
              onChange={handleChange}
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
            <label className="block text-sm font-medium mb-1">Học phí</label>
            <input
              name="appliedTuition"
              value={form.appliedTuition}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Học phí"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Giảm học phí
            </label>
            <input
              name="tuitionDiscount"
              value={form.tuitionDiscount}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Giảm học phí"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thành tiền</label>
            <input
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Thành tiền"
              required
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
              <th className="border px-4 py-2 text-left">Tên học viên</th>
              <th className="border px-4 py-2 text-left">Lớp</th>
              <th className="border px-4 py-2 text-left">Học phí</th>
              <th className="border px-4 py-2 text-left">Giảm</th>
              <th className="border px-4 py-2 text-left">Thành tiền</th>
              <th className="border px-4 py-2 text-left">Ngày đăng ký</th>
              <th className="border px-4 py-2 text-left">Trạng thái</th>
              <th className="border px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="border px-4 py-2">{e.student?.studentCode}</td>
                <td className="border px-4 py-2">{e.student?.fullName}</td>
                <td className="border px-4 py-2">{e.classInfo?.className}</td>
                <td className="border px-4 py-2">{e.appliedTuition}</td>
                <td className="border px-4 py-2">{e.tuitionDiscount}</td>
                <td className="border px-4 py-2">{e.totalAmount}</td>
                <td className="border px-4 py-2">
                  {e.enrollmentDate
                    ? new Date(e.enrollmentDate).toLocaleDateString("vi-VN")
                    : ""}
                </td>
                <td className="border px-4 py-2">{e.status}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="mr-3 text-blue-600 hover:underline"
                    onClick={() => handleEdit(e)}
                    disabled={loading}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(e._id)}
                    disabled={loading}
                  >
                    Xóa
                  </button>
                  {/* Gợi ý: Thêm nút in biên lai ở đây */}
                  {/* <button className="ml-2 text-green-600" onClick={() => handlePrint(e)}>In biên lai</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnrollmentManager;
