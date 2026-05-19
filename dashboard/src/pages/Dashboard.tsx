import { useGetOrdersQuery } from '../store/api/ordersApi';
import { useGetProductsQuery } from '../store/api/productsApi';
import { ShoppingBag, ShoppingCart, DollarSign, CalendarCheck } from 'lucide-react';
import { KPISkeleton, TableSkeleton } from '../components/ui/Skeletons';

const Dashboard = () => {
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({ page: 1, limit: 50 });
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ page: 1, limit: 1 });

  const orders = ordersData?.data?.orders || [];

  
  const totalRevenue = orders
    .filter((o: any) => o.status !== 'cancelled')
    .reduce((sum: number, o: any) => sum + o.total_amount, 0);

  
  const today = new Date().toDateString();
  const ordersToday = orders.filter(
    (o: any) => new Date(o.created_at).toDateString() === today
  ).length;

  const totalProducts = productsData?.data?.pagination?.total || 0;

  if (ordersLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <KPISkeleton />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <TableSkeleton rows={5} columns={4} />
        </div>
      </div>
    );
  }

  const kpis = [
    { title: 'Orders Today', value: ordersToday, icon: <CalendarCheck size={24} className="text-blue-600" />, bg: 'bg-blue-100' },
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign size={24} className="text-emerald-600" />, bg: 'bg-emerald-100' },
    { title: 'Active Products', value: totalProducts, icon: <ShoppingBag size={24} className="text-purple-600" />, bg: 'bg-purple-100' },
    { title: 'Total Orders', value: ordersData?.data?.pagination?.total || 0, icon: <ShoppingCart size={24} className="text-amber-600" />, bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-full ${kpi.bg}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{order.id.split('-')[0]}</td>
                  <td className="px-6 py-4">{order.profiles?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">${order.total_amount}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
