import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
await axios.post("/api/auth/forgot-password", { email });

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/users/forgot-password", { email });
      if (data.success) {
        alert("OTP sent to email!");
        navigate("/verify-otp", { state: { email } });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error sending OTP");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="font-medium text-2xl text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="p-2 border border-gray-500 rounded-md focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
