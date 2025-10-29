export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-semibold mt-2 text-gray-800">124</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-gray-500 text-sm">Total Blogs</h3>
          <p className="text-3xl font-semibold mt-2 text-gray-800">12</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-gray-500 text-sm">Testimonials</h3>
          <p className="text-3xl font-semibold mt-2 text-gray-800">8</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-gray-500 text-sm">Categories</h3>
          <p className="text-3xl font-semibold mt-2 text-gray-800">9</p>
        </div>
      </div>
    </div>
  );
}

