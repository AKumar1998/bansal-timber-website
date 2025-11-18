import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const logoUrl = "https://bansaltimber.com/uploads/company-logos/bansal-logo.png";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMsgType("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("https://bansaltimber.com/api/admin/login.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMsgType("success");
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          localStorage.setItem("adminToken", data.token);
          window.location.href = "/admin";
        }, 1000);
      } else {
        setMsgType("error");
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setMsgType("error");
      setMessage("Network error, please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 animate-fadeIn">

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-center text-sm font-semibold ${
              msgType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <img
            src={logoUrl}
            alt="Company Logo"
            className="h-20 object-contain drop-shadow-sm"
          />
        </div>

        <h2 className="text-xl font-[SagaceMedium] text-center text-gray-800 mb-6 tracking-wide">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <div className="relative">
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF5724] focus:border-[#FF5724] outline-none transition peer"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="absolute left-3 top-[-8px] bg-white px-1 text-xs text-gray-600 peer-focus:text-[#FF5724] transition">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF5724] focus:border-[#FF5724] outline-none transition peer"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="absolute left-3 top-[-8px] bg-white px-1 text-xs text-gray-600 peer-focus:text-[#FF5724] transition">
              Password
            </label>

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black"
            >
              {showPassword ? (
                // Eye Closed Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13.875 18.825a10.05 10.05 0 01-1.875.175C7 19 3.5 14.5 2 12c.637-1.106 1.575-2.318 2.825-3.475M9.88 9.88a3 3 0 104.24 4.24M15 7.757A9.953 9.953 0 0119 12c-.395.69-.933 1.45-1.613 2.175M4.22 4.22l15.56 15.56" />
                </svg>
              ) : (
                // Eye Open Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.39 5 12 5c4.608 0 8.267 2.943 9.542 7-1.275 4.057-4.934 7-9.542 7-4.61 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF5724] hover:bg-[#e64e20]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <style>
        {`
          .animate-fadeIn { animation: fadeIn .4s ease-out; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

