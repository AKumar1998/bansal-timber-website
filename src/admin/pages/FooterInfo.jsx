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

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition";

  useEffect(() => {
    fetch("https://bansaltimber.com/api/footer/get_footer_info.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setForm(data.data);
        }
      });
  }, []);

  const showMessage = (txt, type) => {
    setMessage(txt);
    setMessageType(type);
    if (type !== "loading") {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    showMessage("Saving...", "loading");

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

    const res = await fetch("https://bansaltimber.com/api/footer/reset_footer_info.php", {
      method: "POST"
    });

    const data = await res.json();
    showMessage(data.message, data.success ? "success" : "error");

    if (data.success) {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const msgStyles = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Footer Details</h2>

      {message && (
        <div className={`border p-2 text-center rounded font-medium ${msgStyles[messageType]}`}>
          {message}
        </div>
      )}

      {/* Phone 1 */}
      <div className="bg-white p-4 border rounded-lg space-y-2">
        <label className="font-semibold text-gray-700">Phone 1</label>
        <div className="flex gap-3">
          <input
            className={`${inputClass} w-24`}
            placeholder="Code"
            value={form.phone1_country}
            onChange={(e) => updateField("phone1_country", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Number"
            value={form.phone1_number}
            onChange={(e) => updateField("phone1_number", e.target.value)}
          />
        </div>
      </div>

      {/* Phone 2 */}
      <div className="bg-white p-4 border rounded-lg space-y-2">
        <label className="font-semibold text-gray-700">Phone 2</label>
        <div className="flex gap-3">
          <input
            className={`${inputClass} w-24`}
            placeholder="Code"
            value={form.phone2_country}
            onChange={(e) => updateField("phone2_country", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Number"
            value={form.phone2_number}
            onChange={(e) => updateField("phone2_number", e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <div className="bg-white p-4 border rounded-lg space-y-2">
        <label className="font-semibold text-gray-700">Email</label>
        <input
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </div>

      {/* Address */}
      <div className="bg-white p-4 border rounded-lg space-y-2">
        <label className="font-semibold text-gray-700">Address</label>
        <input
          className={inputClass}
          placeholder="Line 1"
          value={form.address_line1}
          onChange={(e) => updateField("address_line1", e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Line 2"
          value={form.address_line2}
          onChange={(e) => updateField("address_line2", e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Line 3"
          value={form.address_line3}
          onChange={(e) => updateField("address_line3", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button onClick={handleReset} className="px-5 py-2 rounded bg-gray-700 text-white">
          Reset
        </button>
        <button onClick={handleSave} className="px-5 py-2 rounded bg-orange-600 text-white">
          Save Changes
        </button>
      </div>
    </div>
  );
}

