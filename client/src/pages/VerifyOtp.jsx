import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/verify-otp", { email, otp });
      if (data.success) {
        alert("OTP Verified! Set a new password");
        navigate("/reset-password", { state: { email } });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error verifying OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
      <form
        onSubmit={handleVerify}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="font-medium text-2xl text-center">Verify OTP</h2>
        <input
          type="number"
          placeholder="Enter OTP"
          className="p-2 border border-gray-500 rounded-md focus:outline-none"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
