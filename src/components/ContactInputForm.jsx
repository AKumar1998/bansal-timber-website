import { useState } from "react";

export default function ContactInputForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const formBody = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formBody.append(key, value);
      });

      const response = await fetch(
        "/api/submit_contact_form.php",
        {
          method: "POST",
          body: formBody,
        }
      );

      const result = await response.json();

      if (result.success) {
        setStatus({ type: "success", message: result.message });
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message: result.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        message: "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-8 md:p-4 rounded-2xl space-y-6 shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Contact Us
      </h2>

      {/* Name */}
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter your name"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter your email"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <label htmlFor="phone" className="mb-1 font-medium text-gray-700">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter your contact number"
        />
      </div>

      {/* Category Dropdown */}
      <div className="flex flex-col">
        <label htmlFor="service" className="mb-1 font-medium text-gray-700">
          Select a Category
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">-- Select the category --</option>
          <option value="Block Boards">Block Boards</option>
          <option value="HDHMR Boards">HDHMR Boards</option>
          <option value="Plywood">Plywood</option>
          <option value="Flush Doors">Flush Doors</option>
          <option value="Batons">Batons</option>
          <option value="Adhesives">Adhesives</option>
          <option value="Mica">Mica</option>
          <option value="Door Skin & Veneer">Door Skin & Veneer</option>
          <option value="Edge Bands">Edge Bands</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col">
        <label htmlFor="message" className="mb-1 font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Write your message here..."
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 font-semibold rounded-lg transition focus:ring-2 focus:outline-none ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Submit"
          )}
        </button>

        {/* Success / Error Message */}
        {status.message && (
          <p
            className={`mt-3 font-medium ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}

