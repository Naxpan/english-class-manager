import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/book-stock";

function BookStockManager() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    bookName: "",
    price: "",
    branch: "",
    imported: "",
    exported: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Lấy danh sách sách trong kho
  const fetchBooks = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setBooks(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Lọc theo tên sách hoặc chi nhánh
  const filtered = books.filter(
    (b) =>
      b.bookName.toLowerCase().includes(search.toLowerCase()) ||
      b.branch?.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Thêm hoặc cập nhật sách
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
          fetchBooks();
          setForm({
            bookName: "",
            price: "",
            branch: "",
            imported: "",
            exported: "",
          });
          setEditingId(null);
        } else {
          setMessage(data.message || "❌ Có lỗi xảy ra!");
        }
      })
      .catch(() => setMessage("❌ Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  }

  // Sửa sách
  function handleEdit(b) {
    setForm({
      bookName: b.bookName,
      price: b.price,
      branch: b.branch,
      imported: b.imported,
      exported: b.exported,
    });
    setEditingId(b._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Xóa sách
  function handleDelete(id) {
    if (window.confirm("Bạn chắc chắn muốn xóa sách này?")) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBooks((prev) => prev.filter((b) => b._id !== id));
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
        Quản lý kho sách
      </h2>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded-lg px-4 py-2 w-72"
          placeholder="Tìm tên sách hoặc chi nhánh..."
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
            <label className="block text-sm font-medium mb-1">Tên sách</label>
            <input
              name="bookName"
              value={form.bookName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Tên sách"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Giá"
              required
            />
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
            <label className="block text-sm font-medium mb-1">
              Số lượng nhập
            </label>
            <input
              name="imported"
              value={form.imported}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Số lượng nhập"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số lượng xuất
            </label>
            <input
              name="exported"
              value={form.exported}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Số lượng xuất"
              type="number"
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
              <th className="border px-4 py-2 text-left">Tên sách</th>
              <th className="border px-4 py-2 text-left">Giá</th>
              <th className="border px-4 py-2 text-left">Chi nhánh</th>
              <th className="border px-4 py-2 text-left">SL nhập</th>
              <th className="border px-4 py-2 text-left">SL xuất</th>
              <th className="border px-4 py-2 text-left">Tồn kho</th>
              <th className="border px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="border px-4 py-2">{b.bookName}</td>
                <td className="border px-4 py-2">{b.price}</td>
                <td className="border px-4 py-2">{b.branch}</td>
                <td className="border px-4 py-2">{b.imported}</td>
                <td className="border px-4 py-2">{b.exported}</td>
                <td className="border px-4 py-2">
                  {(b.imported || 0) - (b.exported || 0)}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="mr-3 text-blue-600 hover:underline"
                    onClick={() => handleEdit(b)}
                    disabled={loading}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(b._id)}
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
                  Không có sách nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookStockManager;
