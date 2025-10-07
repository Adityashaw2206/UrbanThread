  import React, { useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import axios from "axios";
  import { toast } from "react-toastify";

  const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/user/reset-password/${token}`, { password }, { withCredentials: true });
        toast.success("Password reset successful!");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Error resetting password");
      }
    };

    return (
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
          <input
            type="password"
            className="w-full border p-2 mb-4 rounded"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">
            Reset Password
          </button>
        </form>
      </div>
    );
  };

  export default ResetPassword;
