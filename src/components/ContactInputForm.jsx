import { useState } from "react";

export default function ContactInputForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false); // Track submission

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true); // Set success state
    // Optional: reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });

    // Later: send to API / backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-8 md:p-4 rounded-2xl space-y-6"
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

      {/* Contact Number */}
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

      {/* Dropdown */}
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
          <option value="BlockBoards">Block Boards</option>
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
          className={`px-6 py-3 font-semibold rounded-lg focus:ring-2 focus:outline-none transition ${
            submitted
              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
          }`}
        >
          {submitted ? "Submitted" : "Submit"}
        </button>
        {submitted && (
          <p className="mt-2 text-green-700 font-medium">
            ✅ Your form has been submitted!
          </p>
        )}
      </div>
    </form>
  );
}

