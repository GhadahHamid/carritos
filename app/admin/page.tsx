import { prisma } from "@/lib/db";
import { addProduct, deleteProduct, updateProduct, updateOrderStatus } from "@/app/adminActions";
import { Suspense } from "react";
import Image from "next/image";

async function DashboardStats() {
  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const productCount = await prisma.product.count();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-300">
        <p className="text-sm font-bold text-gray-500 mb-1">Total Revenue</p>
        <h3 className="text-3xl font-extrabold text-[#1E3A8A]">${totalRevenue.toFixed(2)}</h3>
      </div>
      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-300">
        <p className="text-sm font-bold text-gray-500 mb-1">Total Orders</p>
        <h3 className="text-3xl font-extrabold text-[#1E3A8A]">{totalOrders}</h3>
      </div>
      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-300">
        <p className="text-sm font-bold text-gray-500 mb-1">Products in Store</p>
        <h3 className="text-3xl font-extrabold text-[#1E3A8A]">
          {productCount}
        </h3>
      </div>
    </div>
  );
}

async function ProductTable() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h2 className="font-bold text-[#1E3A8A]">Inventory Management</h2>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 text-xs border-b border-gray-300">
            <th className="p-4 font-bold uppercase tracking-wider">Product</th>
            <th className="p-4 font-bold uppercase tracking-wider">Category</th>
            <th className="p-4 font-bold uppercase tracking-wider">Price ($)</th>
            <th className="p-4 font-bold uppercase tracking-wider">Stock</th>
            <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition">
              <td className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-lg overflow-hidden flex items-center justify-center shrink-0 relative">
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      sizes="40px"
                      className="object-cover mix-blend-multiply" 
                    />
                  ) : (
                    <span className="text-lg">🛍️</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#1E3A8A] text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{product.description}</p>
                </div>
              </td>
              <td className="p-4 text-sm font-medium text-gray-600">{product.category.name}</td>
              <td className="p-4">
                <form action={updateProduct} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={product.id} />
                  <input type="number" name="price" step="0.01" defaultValue={product.price} className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#F97316]" />
                  <button type="submit" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200">Save</button>
                </form>
              </td>
              <td className="p-4">
                <form action={updateProduct} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="price" value={product.price} />
                  <input type="number" name="stock" defaultValue={product.stock} className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#F97316]" />
                  <button type="submit" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200">Save</button>
                </form>
              </td>
              <td className="p-4 text-right">
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" className="text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function OrderTable() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h2 className="font-bold text-[#1E3A8A]">Recent Orders</h2>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 text-xs border-b border-gray-300">
            <th className="p-4 font-bold uppercase tracking-wider">Customer</th>
            <th className="p-4 font-bold uppercase tracking-wider">Region</th>
            <th className="p-4 font-bold uppercase tracking-wider">Total</th>
            <th className="p-4 font-bold uppercase tracking-wider">Status</th>
            <th className="p-4 font-bold uppercase tracking-wider text-right">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition">
              <td className="p-4">
                <p className="font-bold text-[#1E3A8A] text-sm">{order.customerName}</p>
                <p className="text-xs text-gray-500">{order.phoneNumber}</p>
                <p className="text-xs text-gray-400 truncate max-w-[200px]">{order.address}</p>
              </td>
              <td className="p-4 text-sm font-medium text-gray-600 capitalize">
                {order.region ? order.region.replace('-', ' ') : "Unknown"}
              </td>              
              <td className="p-4 font-extrabold text-[#1E3A8A]">${order.total.toFixed(2)}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <form action={updateOrderStatus} className="flex items-center justify-end gap-2">
                  <input type="hidden" name="id" value={order.id} />
                  <select name="status" defaultValue={order.status} className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <button type="submit" className="text-xs bg-gray-800 text-white px-2 py-1 rounded font-bold hover:bg-black">Set</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="p-8 text-center text-gray-500">No orders yet.</p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16 pt-8">
      <div className="max-w-[1400px] mx-auto px-8">
        
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-[#1E3A8A]">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your shop, inventory, and sales</p>
        </div>

        <Suspense fallback={<p className="text-gray-500">Loading stats...</p>}>
          <DashboardStats />
        </Suspense>

        {/* Tables now take full width */}
        <div className="w-full space-y-8">
          <Suspense fallback={<p className="text-gray-500">Loading inventory...</p>}>
            <ProductTable />
          </Suspense>
          
          <Suspense fallback={<p className="text-gray-500">Loading orders...</p>}>
            <OrderTable />
          </Suspense>
        </div>

      </div>
    </main>
  );
}