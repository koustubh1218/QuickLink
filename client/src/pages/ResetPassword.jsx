import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/reset-password", {
        email,
        password,
      });
      if (data.success) {
        alert("Password reset successfully!");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
      <form
        onSubmit={handleReset}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="font-medium text-2xl text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="p-2 border border-gray-500 rounded-md focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
