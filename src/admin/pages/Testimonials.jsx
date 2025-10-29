export default function Testimonials() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Testimonials</h1>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow">
          + Add Testimonial
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <p className="text-gray-500">Testimonials will be listed here.</p>
      </div>
    </div>
  );
}

