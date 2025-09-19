import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function LoginRegister({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-xl mx-auto mt-16 p-12 bg-white rounded-2xl shadow-2xl border border-blue-100 animate-fade-in">
      {isLogin ? (
        <LoginForm onAuth={onAuth} onSwitch={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default LoginRegister;
