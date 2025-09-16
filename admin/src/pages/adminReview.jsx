import { useEffect, useState } from "react";
import axios from "axios";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await axios.get(`/api/reviews`);
    setReviews(res.data.reviews);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/reviews/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Reviews</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>User</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r._id}>
              <td>{r.user?.name}</td>
              <td>{r.product?.name}</td>
              <td>{r.rating}</td>
              <td>{r.comment}</td>
              <td>
                <button onClick={() => handleDelete(r._id)} className="text-red-500">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviewsPage;
