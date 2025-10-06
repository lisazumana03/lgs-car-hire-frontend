import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../../../services/supportService";

function SupportTicketForm({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    subject: "", 
    message: "",
    userId: user?.id || '',
    userName: user?.name || ''
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        userId: user.id || '',
        userName: user.name || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await create(form); // call your backend service
      alert("Support ticket submitted successfully!");
      navigate("/"); // go back to home (or change as needed)
    } catch (err) {
      console.error("Error submitting ticket:", err);
      alert("Failed to submit ticket.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-white to-blue-200 p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl p-10 border border-blue-300 relative">
        {/* Icon */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <svg
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 20l9-5-9-5-9 5 9 5z"
            />
          </svg>
        </div>

        <h3 className="text-3xl font-extrabold text-green-700 mb-4 text-center drop-shadow">
          Submit a Support Ticket
        </h3>
        
        {/* User Information Display */}
        {user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">User Information</h4>
            <div className="text-sm text-blue-700">
              <p><strong>Name:</strong> {user.name || 'Not available'}</p>
              <p><strong>User ID:</strong> {user.id || 'Not available'}</p>
              <p><strong>Email:</strong> {user.email || 'Not available'}</p>
            </div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="subject"
              className="block text-green-700 font-bold mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full border border-green-400 rounded-xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 placeholder:text-green-400 placeholder:font-semibold bg-white/80 shadow-sm text-gray-900"
              required
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="message"
              className="block text-green-700 font-bold mb-2"
            >
              Describe your issue
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue..."
              className="w-full border border-green-400 rounded-xl px-5 py-3 resize-none focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 placeholder:text-green-400 placeholder:font-semibold bg-white/80 shadow-sm text-gray-900"
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-300 font-bold tracking-wide"
            >
              Submit Ticket
            </button>

            <button
              type="reset"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 font-bold tracking-wide"
              onClick={() => setForm({ subject: "", message: "" })}
            >
              Reset
            </button>

            <button
              type="button"
              className="w-full sm:w-auto bg-gradient-to-r from-gray-300 to-blue-200 text-blue-700 px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:from-blue-100 hover:to-blue-300 transition-all duration-300 font-bold tracking-wide"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupportTicketForm;
