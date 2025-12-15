export default function AdminDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-600">Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome back, Admin! You have successfully logged in.</p>
      
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-blue-100 rounded-lg">
          <h3 className="font-bold">Total Orders</h3>
          <p className="text-2xl">124</p>
        </div>
        <div className="p-6 bg-green-100 rounded-lg">
          <h3 className="font-bold">Revenue</h3>
          <p className="text-2xl">Rs. 450,000</p>
        </div>
        <div className="p-6 bg-purple-100 rounded-lg">
          <h3 className="font-bold">Pending</h3>
          <p className="text-2xl">5</p>
        </div>
      </div>
    </div>
  );
}