import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile ❌");
      }
    };
    fetchProfile();
  }, []);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendUrl}/api/user/profile`,
        formData,
        { headers: { token } }
      );
      setUser(res.data.user);
      setIsEditing(false); // flip back
      toast.success("Profile updated successfully 🎉");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        className="relative w-96 h-64 [transform-style:preserve-3d] cursor-pointer"
        animate={{ rotateY: isEditing ? 180 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Front Side - Profile View */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          <h2 className="text-xl font-bold mb-2">👤 {user.name}</h2>
          <p className="text-gray-600 mb-1">📧 {user.email}</p>
          <p className="text-gray-500">🆔 {user._id}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Back Side - Edit Form */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h2 className="text-lg font-bold mb-4">Update Profile</h2>
          <form
            onSubmit={handleUpdate}
            className="flex flex-col w-full space-y-3"
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 rounded-lg"
              placeholder="Enter Name"
              required
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border p-2 rounded-lg"
              placeholder="Enter Email"
              required
            />
            <div className="flex justify-between mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
