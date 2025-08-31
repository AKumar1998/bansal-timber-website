import { useState } from "react";

export default function ContactInputForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // later: send to API / backend
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* Email */}
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {/* Contact Number */}
      <label htmlFor="phone">Contact Number</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      {/* Dropdown */}
      <label htmlFor="service">Select a Service</label>
      <select
        id="service"
        name="service"
        value={formData.service}
        onChange={handleChange}
      >
        <option value="">-- Select an option --</option>
        <option value="option1">Option One</option>
        <option value="option2">Option Two</option>
        <option value="option3">Option Three</option>
        <option value="option4">Option Four</option>
        <option value="option5">Option Five</option>
      </select>

      {/* Message */}
      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        rows="5"
        value={formData.message}
        onChange={handleChange}
      />

    </form>
  );
}

