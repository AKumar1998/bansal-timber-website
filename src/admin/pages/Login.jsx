export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Admin Login</h1>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg shadow"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

