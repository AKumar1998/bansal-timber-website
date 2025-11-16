import { useEffect, useState } from "react";

export default function FooterInfoAdmin() {
  const [form, setForm] = useState({
    phone1_country: "",
    phone1_number: "",
    phone2_country: "",
    phone2_number: "",
    email: "",
    address_line1: "",
    address_line2: "",
    address_line3: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // loading | success | error

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition";

  // Load existing data
  useEffect(() => {
    fetch("https://bansaltimber.com/api/footer/get_footer_info.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setForm(data.data);
      });
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    if (type !== "loading") {
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2500);
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    showMessage("Saving changes...", "loading");

    const res = await fetch("https://bansaltimber.com/api/footer/update_footer_info.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    showMessage(data.message, data.success ? "success" : "error");
  };

  const handleReset = async () => {
    if (!window.confirm("Reset footer info to default?")) return;

    showMessage("Resetting...", "loading");

    const res = await fetch("https://bansaltimber.com/api/footer/reset_footer_info.php", {
      method: "POST"
    });

    const data = await res.json();
    showMessage(data.message, data.success ? "success" : "error");

    if (data.success) {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const messageStyle = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold mb-2 tracking-wide text-gray-800">Footer Details</h2>

      {message && (
        <div
          className={`border rounded-md p-2 text-center font-medium ${messageStyle[messageType]}`}
        >
          {message}
        </div>
      )}

      {/* Phone Group */}
      <div className="bg-white shadow-sm border rounded-lg p-5 space-y-6">
        {/* Phone 1 */}
        <div>
          <label className="font-semibold text-gray-700 block mb-2">Phone 1</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Country"
              className={`${inputClass} w-24`}
              value={form.phone1_country}
              onChange={(e) => updateField("phone1_country", e.target.value)}
            />
            <input
              type="text"
              placeholder="Number"
              className={inputClass}
              value={form.phone1_number}
              onChange={(e) => updateField("phone1_number", e.target.value)}
            />
          </div>
        </div>

        {/* Phone 2 */}
        <div>
          <label className="font-semibold text-gray-700 block mb-2">Phone 2</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Country"
              className={`${inputClass} w-24`}
              value={form.phone2_country}
              onChange={(e) => updateField("phone2_country", e.target.value)}
            />
            <input
              type="text"
              placeholder="Number"
              className={inputClass}
              value={form.phone2_number}
              onChange={(e) => updateField("phone2_number", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="bg-white shadow-sm border rounded-lg p-5 space-y-2">
        <label className="font-semibold text-gray-700 block mb-2">Email</label>
        <input
          type="email"
          placeholder="example@mail.com"
          className={inputClass}
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </div>

      {/* Address */}
      <div className="bg-white shadow-sm border rounded-lg p-5 space-y-2">
        <label className="font-semibold text-gray-700 block mb-2">Address</label>
        <input
          type="text"
          placeholder="Address Line 1"
          className={inputClass}
          value={form.address_line1}
          onChange={(e) => updateField("address_line1", e.target.value)}
        />
        <input
          type="text"
          placeholder="Address Line 2"
          className={inputClass}
          value={form.address_line2}
          onChange={(e) => updateField("address_line2", e.target.value)}
        />
        <input
          type="text"
          placeholder="Address Line 3"
          className={inputClass}
          value={form.address_line3}
          onChange={(e) => updateField("address_line3", e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-md bg-gray-700 text-white hover:bg-black transition"
        >
          Reset
        </button>

        <button
          onClick={handleSave}
          disabled={messageType === "loading"}
          className="px-6 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-400 transition"
        >
          {messageType === "loading" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

