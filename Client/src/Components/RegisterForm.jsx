import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/auth";

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    branch: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasOwner, setHasOwner] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/check-owner`)
      .then((res) => res.json())
      .then((data) => setHasOwner(data.hasOwner));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Đăng ký thành công! Hãy đăng nhập.");
          setTimeout(() => onSwitch(), 1000);
        } else {
          setMessage(data.message || "Đăng ký thất bại");
        }
      })
      .catch(() => setMessage("Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  }

  if (hasOwner) {
    return (
      <div className="text-center text-red-600 font-semibold">
        Chỉ owner hoặc admin đã đăng nhập mới được phép tạo tài khoản mới.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 flex items-center justify-center gap-2">
        <svg
          className="w-9 h-9 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        Đăng ký
      </h2>
      {message && (
        <div className="mb-4 text-center text-base font-semibold text-red-600 bg-red-50 border border-red-200 rounded py-3 px-4">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Tên đăng nhập"
          className="w-full border border-blue-200 focus:border-blue-500 rounded px-4 py-3 text-lg transition outline-none"
          required
          autoComplete="username"
        />
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Họ tên"
          className="w-full border border-blue-200 focus:border-blue-500 rounded px-4 py-3 text-lg transition outline-none"
          required
          autoComplete="name"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-blue-200 focus:border-blue-500 rounded px-4 py-3 text-lg transition outline-none"
          required
          autoComplete="email"
          type="email"
        />
        <input
          name="branch"
          value={form.branch}
          onChange={handleChange}
          placeholder="Chi nhánh"
          className="w-full border border-blue-200 focus:border-blue-500 rounded px-4 py-3 text-lg transition outline-none"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="w-full border border-blue-200 focus:border-blue-500 rounded px-4 py-3 text-lg transition outline-none"
          type="tel"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
          className="w-full border border-blue-200 focus:border-blue-500 rounded px-4 py-3 text-lg transition outline-none"
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white py-3 text-lg rounded-lg font-semibold shadow transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-6 w-6 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Đang xử lý...
            </span>
          ) : (
            "Đăng ký"
          )}
        </button>
      </form>
      <div className="mt-8 text-center">
        <button
          className="text-blue-600 hover:text-indigo-600 underline font-medium transition text-lg"
          onClick={onSwitch}
        >
          Đã có tài khoản? Đăng nhập
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
