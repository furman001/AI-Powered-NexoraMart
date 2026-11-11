import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";




const statusColors = {
  pending: "from-amber-500 to-orange-500",
  confirmed: "from-blue-600 to-cyan-500",
  shipped: "from-fuchsia-600 to-purple-600",
  delivered: "from-emerald-600 to-green-500",
  cancelled: "from-rose-600 to-red-500",
};




export default function AnalyticsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salesOverview, setSalesOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");




  useEffect(() => {
    async function loadData() {
      try {
        const productsResponse = await api.get("/products/");
        const categoriesResponse = await api.get("/categories/");
        const salesResponse = await api.get(
          "/analytics/sales-overview"
        );
        const ordersResponse = await api.get(
          "/analytics/recent-orders"
        );


        setProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        setSalesOverview(salesResponse.data);
        setRecentOrders(ordersResponse.data || []);
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load analytics data");
      } finally {
        setLoading(false);
      }
    }


    loadData();
  }, []);




  const analytics = useMemo(() => {
    const totalProducts = products.length;


    const publishedProducts = products.filter(
      (product) => product.status === "published"
    ).length;


    const draftProducts = products.filter(
      (product) => product.status === "draft"
    ).length;


    const archivedProducts = products.filter(
      (product) => product.status === "archived"
    ).length;


    const totalStock = products.reduce(
      (total, product) =>
        total + Number(product.stock || 0),
      0
    );


    const inventoryValue = products.reduce(
      (total, product) =>
        total +
        Number(product.price || 0) *
          Number(product.stock || 0),
      0
    );


    const productsWithImages = products.filter(
      (product) =>
        (product.images && product.images.length > 0) ||
        product.image_url
    ).length;


    const productsWithVideos = products.filter(
      (product) => product.video_url
    ).length;


    const categoryCounts = categories.map((category) => {
      const count = products.filter(
        (product) => product.category_id === category.id
      ).length;


      return {
        id: category.id,
        name: category.name,
        count,
      };
    });


    return {
      totalProducts,
      publishedProducts,
      draftProducts,
      archivedProducts,
      totalStock,
      inventoryValue,
      productsWithImages,
      productsWithVideos,
      categoryCounts,
    };
  }, [products, categories]);




  const revenueTrend = salesOverview?.revenue_trend || [];


  const maxTrendRevenue = Math.max(
    1,
    ...revenueTrend.map((item) => Number(item.revenue || 0))
  );


  const totalWeeklyRevenue = revenueTrend.reduce(
    (total, item) => total + Number(item.revenue || 0),
    0
  );


  const maxProductRevenue = Math.max(
    1,
    ...(salesOverview?.top_products || []).map(
      (item) => Number(item.revenue || 0)
    )
  );




  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="analytics-float text-2xl font-black text-white">
          Loading analytics...
        </div>
      </div>
    );
  }




  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 p-6 text-white md:p-10">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-3xl" />


      <div className="relative mx-auto max-w-7xl">
        <div className="analytics-fade-up mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
              NexoraMart Insights
            </p>


            <h1 className="analytics-text-glow bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent">
              Analytics Dashboard
            </h1>


            <p className="mt-3 max-w-xl text-slate-400">
              Track revenue, orders, product performance, inventory,
              and category distribution in real time.
            </p>
          </div>


          <Link
            to="/dashboard"
            className="group inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold backdrop-blur transition duration-300 hover:scale-105 hover:border-white/25 hover:bg-white/15"
          >
            Back to Dashboard
            <span className="transition duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>


        {error && (
          <div className="analytics-fade-up mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="analytics-card analytics-fade-up rounded-3xl bg-gradient-to-br from-emerald-600 to-lime-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm opacity-80">Total Revenue</p>


            <p className="mt-3 text-4xl font-black">
              Rs{" "}
              {Number(
                salesOverview?.total_revenue || 0
              ).toLocaleString()}
            </p>
          </div>


          <div className="analytics-card analytics-fade-up rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm opacity-80">Total Orders</p>


            <p className="mt-3 text-4xl font-black">
              {Number(
                salesOverview?.total_orders || 0
              ).toLocaleString()}
            </p>
          </div>


          <div className="analytics-card analytics-fade-up rounded-3xl bg-gradient-to-br from-fuchsia-600 to-pink-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm opacity-80">
              Average Order Value
            </p>


            <p className="mt-3 text-4xl font-black">
              Rs{" "}
              {Number(
                salesOverview?.average_order_value || 0
              ).toLocaleString()}
            </p>
          </div>


          <div className="analytics-card analytics-fade-up rounded-3xl bg-gradient-to-br from-orange-600 to-amber-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm opacity-80">Inventory Value</p>


            <p className="mt-3 text-4xl font-black">
              Rs{" "}
              {Number(
                analytics.inventoryValue || 0
              ).toLocaleString()}
            </p>
          </div>
        </div>


        <div className="analytics-fade-up mt-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/70 p-8 shadow-2xl shadow-fuchsia-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-white">
                Revenue - Last 7 Days
              </h2>


              <p className="mt-2 text-slate-400">
                Daily revenue from non-cancelled orders.
              </p>
            </div>


            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300">
              Total: Rs {totalWeeklyRevenue.toLocaleString()}
            </div>
          </div>


          <div className="analytics-revenue-chart mt-10 flex h-72 items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 sm:gap-5">
            {revenueTrend.map((item, index) => {
              const revenue = Number(item.revenue || 0);


              const heightPercentage =
                maxTrendRevenue > 0
                  ? (revenue / maxTrendRevenue) * 100
                  : 0;


              return (
                <div
                  key={item.date}
                  className="group flex flex-1 flex-col items-center justify-end gap-3"
                >
                  <span className="text-xs font-bold text-slate-300 transition duration-300 group-hover:text-white">
                    Rs {revenue.toLocaleString()}
                  </span>


                  <div className="flex h-full w-full items-end">
                    <div
                      className="analytics-revenue-bar w-full"
                      style={{
                        height: `${Math.max(
                          6,
                          heightPercentage
                        )}%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>


                  <span className="text-xs font-semibold text-slate-400 transition duration-300 group-hover:text-white">
                    {item.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>


          <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <span className="text-sm font-semibold text-slate-400">
              Highest daily revenue
            </span>


            <span className="font-black text-fuchsia-300">
              Rs {maxTrendRevenue.toLocaleString()}
            </span>
          </div>
        </div>


        <div className="analytics-fade-up mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-black">
              Order Status Breakdown
            </h2>


            <div className="mt-7 space-y-5">
              {[
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => {
                const statusData =
                  salesOverview?.status_breakdown?.[status];


                const orderCount = Number(
                  statusData?.orders || 0
                );


                const totalOrders = Number(
                  salesOverview?.total_orders || 0
                );


                const percentage =
                  totalOrders > 0
                    ? Math.round(
                        (orderCount / totalOrders) * 100
                      )
                    : 0;


                return (
                  <div key={status}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold capitalize text-white">
                        {status}
                      </span>


                      <span className="text-sm text-slate-400">
                        {orderCount} orders · {percentage}%
                      </span>
                    </div>


                    <div className="h-4 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          statusColors[status]
                        }`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-black">
              Top Selling Products
            </h2>


            {(salesOverview?.top_products || []).length === 0 ? (
              <p className="mt-6 text-slate-400">
                No product sales data available yet.
              </p>
            ) : (
              <div className="mt-7 space-y-6">
                {salesOverview.top_products.map(
                  (product, index) => (
                    <div key={product.product_name}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-bold text-white">
                          {product.product_name}
                        </span>


                        <span className="text-sm text-slate-400">
                          {product.quantity_sold} sold · Rs{" "}
                          {Number(
                            product.revenue || 0
                          ).toLocaleString()}
                        </span>
                      </div>


                      <div className="h-4 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600"
                          style={{
                            width: `${
                              (Number(product.revenue || 0) /
                                maxProductRevenue) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>


        <div className="analytics-fade-up mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black">
                Products by Category
              </h2>


              <p className="mt-2 text-slate-400">
                See how your catalog is distributed across categories.
              </p>
            </div>


            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300">
              {categories.length} categories
            </div>
          </div>


          {analytics.categoryCounts.length === 0 ? (
            <p className="text-slate-400">
              No categories available yet.
            </p>
          ) : (
            <div className="space-y-7">
              {analytics.categoryCounts.map((category, index) => {
                const percentage =
                  analytics.totalProducts > 0
                    ? Math.round(
                        (category.count /
                          analytics.totalProducts) *
                          100
                      )
                    : 0;


                return (
                  <div
                    key={category.id}
                    className="analytics-fade-up group"
                    style={{
                      animationDelay: `${index * 120}ms`,
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-blue-600 font-black">
                          {category.name.charAt(0).toUpperCase()}
                        </div>


                        <span className="text-lg font-bold">
                          {category.name}
                        </span>
                      </div>


                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-semibold text-slate-300">
                        {category.count} products · {percentage}%
                      </span>
                    </div>


                    <div className="h-4 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 transition duration-500 group-hover:brightness-125"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        <div className="analytics-fade-up mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black">Recent Orders</h2>


            <Link
              to="/orders"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white"
            >
              View All
            </Link>
          </div>


          {recentOrders.length === 0 ? (
            <p className="text-slate-400">
              No recent orders found.
            </p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        {order.customer_name}
                      </p>


                      <p className="text-sm text-slate-400">
                        {order.created_at &&
                          new Date(
                            order.created_at
                          ).toLocaleString("en-PK", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                      </p>
                    </div>


                    <div className="text-right">
                      <p className="font-black text-cyan-300">
                        Rs{" "}
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString()}
                      </p>


                      <p className="text-xs font-bold uppercase text-slate-400">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}