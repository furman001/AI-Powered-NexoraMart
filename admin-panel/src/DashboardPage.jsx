import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import { useAuth } from "./AuthContext";




const categoryColors = [
  "from-blue-500 to-cyan-400",
  "from-fuchsia-500 to-pink-400",
  "from-emerald-500 to-lime-400",
  "from-orange-500 to-amber-400",
  "from-violet-500 to-indigo-400",
  "from-rose-500 to-red-400",
];




export default function DashboardPage() {
  const { admin, logout } = useAuth();


  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);


  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentError, setRecentError] = useState("");




  useEffect(() => {
    async function loadData() {
      try {
        const categoriesResponse = await api.get("/categories/");
        const productsResponse = await api.get("/products/");
        const ordersResponse = await api.get("/orders/");


        setCategories(categoriesResponse.data || []);
        setProducts(productsResponse.data || []);
        setOrders(ordersResponse.data || []);
      } catch (error) {
        console.error(error);
      }
    }


    loadData();
  }, []);




  useEffect(() => {
    async function loadRecentOrdersAndStock() {
      setRecentError("");


      try {
        const ordersResponse = await api.get(
          "/analytics/recent-orders"
        );


        setRecentOrders(ordersResponse.data || []);
      } catch (ordersError) {
        console.error(ordersError);
        setRecentError("Could not load recent orders");
      }


      try {
        const productsResponse = await api.get(
          "/analytics/low-stock-products"
        );


        setLowStockProducts(productsResponse.data || []);
      } catch (productsError) {
        console.error(productsError);
        setRecentError("Could not load low stock alerts");
      }
    }


    loadRecentOrdersAndStock();
  }, []);




  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    }


    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }


    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);




  const activeProducts = products.filter(
    (product) => product.is_active
  ).length;


  const lowStockCount = products.filter(
    (product) => product.stock <= 5
  ).length;


  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total_amount || 0),
    0
  );


  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;


  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed"
  ).length;


  const shippedOrders = orders.filter(
    (order) => order.status === "shipped"
  ).length;


  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;


  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;




  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-72 flex-col bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 p-6 text-white md:flex">
        <div className="animate-fade-up mb-10">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-xl font-black">
            N
          </div>


          <h1 className="text-xl font-black">NexoraMart</h1>
          <p className="text-sm text-slate-400">Admin Panel</p>
        </div>


        <nav className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl bg-white/10 px-4 py-3 font-semibold backdrop-blur transition duration-300 hover:translate-x-1 hover:bg-white/20"
          >
            Dashboard
          </Link>


          <Link
            to="/analytics"
            className="rounded-xl px-4 py-3 text-slate-300 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
          >
            Analytics
          </Link>


          <Link
            to="/categories"
            className="rounded-xl px-4 py-3 text-slate-300 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
          >
            Categories
          </Link>


          <Link
            to="/products"
            className="rounded-xl px-4 py-3 text-slate-300 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
          >
            Products
          </Link>


          <Link
            to="/orders"
            className="rounded-xl px-4 py-3 text-slate-300 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
          >
            Orders
          </Link>


          <Link
            to="/invoices"
            className="rounded-xl px-4 py-3 text-slate-300 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
          >
            Invoices
          </Link>


          <Link
            to="/admin/questions"
            className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-bold text-white transition hover:scale-105"
          >
            Customer Questions
          </Link>


          <Link
            to="/admin/support-messages"
            className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-bold text-white transition hover:scale-105"
          >
            Support Messages
          </Link>
        </nav>


        <div className="mt-auto">
          <div className="animate-fade-up mb-5 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="font-bold">{admin?.full_name}</p>
            <p className="text-xs text-slate-400">{admin?.email}</p>
          </div>


          <button
            onClick={logout}
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-3 font-bold transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30"
          >
            Logout
          </button>
        </div>
      </aside>



      <main className="flex-1 p-6 md:p-10">
        <header className="animate-fade-up mb-10">
          <h1 className="animate-gradient-text bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
            Admin Dashboard
          </h1>


          <p className="mt-2 text-slate-600">
            Welcome back, {admin?.full_name}
          </p>
        </header>



        {recentError && (
          <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-600">
            {recentError}
          </div>
        )}



        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="dashboard-card animate-fade-up rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80">Total Revenue</p>
              <span className="text-2xl">💰</span>
            </div>


            <p className="mt-3 text-4xl font-black">
              Rs {totalRevenue.toLocaleString()}
            </p>


            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-full animate-progress-bar bg-white/80" />
            </div>
          </div>


          <div className="dashboard-card animate-fade-up rounded-3xl bg-gradient-to-br from-fuchsia-600 to-pink-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80">Total Orders</p>
              <span className="text-2xl">🧾</span>
            </div>


            <p className="mt-3 text-4xl font-black">
              {orders.length}
            </p>


            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-full animate-progress-bar bg-white/80" />
            </div>
          </div>


          <div className="dashboard-card animate-fade-up rounded-3xl bg-gradient-to-br from-emerald-600 to-lime-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80">Delivered Orders</p>
              <span className="text-2xl">✅</span>
            </div>


            <p className="mt-3 text-4xl font-black">
              {deliveredOrders}
            </p>


            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-full animate-progress-bar bg-white/80" />
            </div>
          </div>


          <div className="dashboard-card animate-fade-up rounded-3xl bg-gradient-to-br from-orange-600 to-amber-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80">Pending Orders</p>
              <span className="text-2xl">⏳</span>
            </div>


            <p className="mt-3 text-4xl font-black">
              {pendingOrders}
            </p>


            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-full animate-progress-bar bg-white/80" />
            </div>
          </div>
        </div>



        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="dashboard-card animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Categories
            </p>


            <p className="mt-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-4xl font-black text-transparent">
              {categories.length}
            </p>
          </div>


          <div className="dashboard-card animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Products
            </p>


            <p className="mt-3 bg-gradient-to-r from-fuchsia-600 to-pink-500 bg-clip-text text-4xl font-black text-transparent">
              {products.length}
            </p>
          </div>


          <div className="dashboard-card animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Active Products
            </p>


            <p className="mt-3 bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-4xl font-black text-transparent">
              {activeProducts}
            </p>
          </div>


          <div className="dashboard-card animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Low Stock
            </p>


            <p className="mt-3 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-4xl font-black text-transparent">
              {lowStockCount}
            </p>
          </div>
        </div>



        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          <section className="dashboard-card animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>


              <Link
                to="/orders"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
              >
                View All
              </Link>
            </div>


            {recentOrders.length === 0 ? (
              <p className="text-slate-500">
                No recent orders found.
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          {order.customer_name}
                        </p>


                        <p className="text-sm text-slate-500">
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
                        <p className="font-black text-blue-600">
                          Rs{" "}
                          {Number(
                            order.total_amount || 0
                          ).toLocaleString()}
                        </p>


                        <p className="text-xs font-bold uppercase text-slate-500">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>


          <section className="dashboard-card animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Low Stock Alerts
              </h2>


              <Link
                to="/products"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
              >
                Manage Products
              </Link>
            </div>


            {lowStockProducts.length === 0 ? (
              <p className="text-slate-500">
                All products have healthy stock.
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {product.name}
                      </p>


                      <p className="text-sm text-slate-500">
                        Stock: {product.stock}
                      </p>
                    </div>


                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : "Low Stock"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>



        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Categories
            </h2>


            <Link
              to="/categories"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              Manage
            </Link>
          </div>


          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`dashboard-card animate-fade-up rounded-3xl bg-gradient-to-br ${
                  categoryColors[
                    index % categoryColors.length
                  ]
                } p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-black backdrop-blur">
                  {category.name.charAt(0).toUpperCase()}
                </div>


                <h3 className="text-xl font-bold">
                  {category.name}
                </h3>


                <p className="mt-1 text-sm opacity-80">
                  {category.slug}
                </p>


                <p className="mt-4 text-sm font-semibold opacity-90">
                  {products.filter(
                    (product) =>
                      product.category_id === category.id
                  ).length}{" "}
                  products
                </p>
              </div>
            ))}
          </div>
        </section>



        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Products
            </h2>


            <Link
              to="/products"
              className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              Manage
            </Link>
          </div>


          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="dashboard-card animate-fade-up group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {product.image_url ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage({
                        url: product.image_url,
                        name: product.name,
                      })
                    }
                    className="relative block w-full cursor-zoom-in overflow-hidden"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />


                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-semibold text-white opacity-0 transition duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                      Click to view full screen
                    </span>
                  </button>
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500">
                    No image
                  </div>
                )}


                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    {product.name}
                  </h3>


                  <p className="mt-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Rs {Number(product.price || 0).toLocaleString()}
                  </p>


                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      Stock: {product.stock}
                    </span>


                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        product.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.is_active
                        ? "Active"
                        : "Hidden"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>



      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white transition duration-300 hover:scale-110 hover:bg-white/20"
          >
            ×
          </button>


          <div
            onClick={(event) => event.stopPropagation()}
            className="animate-fade-up max-h-[90vh] max-w-5xl"
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-h-[80vh] w-auto rounded-2xl border border-white/10 object-contain shadow-2xl"
            />


            <p className="mt-4 text-center text-lg font-semibold text-white">
              {selectedImage.name}
            </p>


            <p className="text-center text-sm text-slate-400">
              Click outside or press Escape to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}