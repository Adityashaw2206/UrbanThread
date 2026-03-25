// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [expired, setExpired] = useState(false);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/user/reset-password/${token}`,
//         { password },
//         { withCredentials: true },
//       );
//       toast.success("Password reset successful!");
//       navigate("/login");
//     } catch (err) {
//       const msg = err.response?.data?.message;

//       if (msg === "Invalid or expired token") {
//         setExpired(true);
//       } else {
//         toast.error(msg || "Error resetting password");
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 shadow-lg rounded-xl w-96"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center">
//           Reset Password
//         </h2>
//         <input
//           type="password"
//           className="w-full border p-2 mb-4 rounded"
//           placeholder="Enter new password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="bg-green-600 text-white w-full py-2 rounded"
//         >
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    // 🔥 Clear any existing login session
    localStorage.removeItem("token");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/reset-password/${token}`,
        { password },
      );

      toast.success("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "Invalid or expired token") {
        setExpired(true);
      } else {
        toast.error(msg || "Error resetting password");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Expired Token UI
  if (expired) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-96">
          <h2 className="text-2xl font-semibold text-red-600 mb-3">
            Link Expired ❌
          </h2>
          <p className="text-gray-600 mb-5">
            Your password reset link has expired or is invalid.
          </p>

          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  // 🟢 Normal Reset UI
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
