import { useState } from "react";
import axios from "axios";

function ReviewForm({ onAdd }) {
  const [form, setForm] = useState({ reviewerName: "", comment: "", rating: 0 });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3045/reviews", form)
      .then(res => {
        onAdd(res.data);
        setForm({ reviewerName: "", comment: "", rating: 0 });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-white to-blue-200 p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl p-10 border border-blue-300 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5z" /></svg>
        </div>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center drop-shadow">Leave a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="reviewerName" className="block text-blue-700 font-bold mb-2">Your Name</label>
            <input type="text" id="reviewerName" name="reviewerName" value={form.reviewerName}
              onChange={handleChange} placeholder="Enter your name"
              className="w-full border border-blue-400 rounded-xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 placeholder:font-semibold bg-white/80 shadow-sm text-gray-900" required />
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-blue-700 font-bold mb-2">Your Review</label>
            <textarea id="comment" name="comment" value={form.comment}
              onChange={handleChange} placeholder="Write your review here..."
              className="w-full border border-blue-400 rounded-xl px-5 py-3 resize-none focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 placeholder:font-semibold bg-white/80 shadow-sm text-gray-900" rows={4} required />
          </div>
          <div className="mb-8">
            <label htmlFor="rating" className="block text-blue-700 font-bold mb-2">Rating (1-5)</label>
            <input type="number" id="rating" name="rating" value={form.rating}
              onChange={handleChange} placeholder="Rating (1-5)"
              className="w-full border border-blue-400 rounded-xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 placeholder:text-blue-400 placeholder:font-semibold bg-white/80 shadow-sm text-gray-900" min="1" max="5" required />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-bold tracking-wide">
              Submit
            </button>
            <button type="reset" className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 font-bold tracking-wide" onClick={() => setForm({ reviewerName: "", comment: "", rating: 0 })}>
              Reset
            </button>
            <button type="button" className="w-full sm:w-auto bg-gradient-to-r from-gray-300 to-blue-200 text-blue-700 px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-blue-100 hover:to-blue-300 transition-all duration-300 font-bold tracking-wide" onClick={() => navigate("/")}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ReviewForm;
