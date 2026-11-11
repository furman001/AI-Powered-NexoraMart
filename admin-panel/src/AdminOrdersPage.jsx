import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";




const statusStyles = {
  pending: {
    badge: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  confirmed: {
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    dot: "bg-blue-400",
  },
  processing: {
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    dot: "bg-purple-400",
  },
  shipped: {
    badge: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    dot: "bg-fuchsia-400",
  },
  delivered: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  cancelled: {
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
    dot: "bg-red-400",
  },
};




export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");




  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get("/orders/");



        setOrders(response.data);
      } catch (loadError) {
        setError("Could not load orders");
      } finally {
        setLoading(false);
      }
    }



    loadOrders();
  }, []);




  async function handleStatusChange(orderId, newStatus) {
    setError("");



    const previousOrders = orders;



    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );



    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
    } catch (statusError) {
      setOrders(previousOrders);


      setError(
        statusError.response?.data?.detail ||
          "Could not update order status"
      );
    }
  }




  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      order.customer_phone.includes(search) ||
      order.id.toLowerCase().includes(search.toLowerCase());


    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;


    return matchesSearch && matchesStatus;
  });




  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total_amount || 0),
    0
  );




  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;




  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;




  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 p-6 text-white md:p-10">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-fuchsia-600/25 blur-3xl" />


      <div className="relative mx-auto max-w-7xl">
        <div className="analytics-fade-up mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
              NexoraMart Admin
            </p>


            <h1 className="analytics-text-glow bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent">
              Orders
            </h1>


            <p className="mt-3 text-slate-400">
              Manage customer orders, shipping details, invoices, and
              order status.
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




        <div className="analytics-fade-up mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-blue-400/40">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Total Orders
            </p>


            <p className="mt-3 text-4xl font-black text-blue-400">
              {orders.length}
            </p>
          </div>


          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-yellow-400/40">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Pending Orders
            </p>


            <p className="mt-3 text-4xl font-black text-yellow-400">
              {pendingOrders}
            </p>
          </div>


          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-purple-400/40">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Processing Orders
            </p>


            <p className="mt-3 text-4xl font-black text-purple-400">
              {processingOrders}
            </p>
          </div>


          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-emerald-400/40">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Total Revenue
            </p>


            <p className="mt-3 text-4xl font-black text-emerald-400">
              Rs {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>




        <div className="analytics-fade-up mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:flex-row md:items-center">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by customer, phone, or order ID"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
          />


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-fuchsia-400 focus:outline-none md:w-56"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>




        {loading && (
          <div className="analytics-float text-center text-xl font-bold text-slate-300">
            Loading orders...
          </div>
        )}


        {error && (
          <div className="analytics-fade-up mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}


        {!loading && filteredOrders.length === 0 && !error && (
          <div className="analytics-fade-up rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <p className="text-xl font-bold text-slate-300">
              No orders found
            </p>


            <p className="mt-2 text-slate-500">
              Orders placed from the storefront will appear here.
            </p>
          </div>
        )}




        <div className="space-y-6">
          {filteredOrders.map((order, index) => {
            const statusStyle =
              statusStyles[order.status] ||
              statusStyles.pending;


            return (
              <div
                key={order.id}
                className="analytics-fade-up group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-fuchsia-400/40 hover:shadow-2xl hover:shadow-fuchsia-500/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Order ID
                    </p>


                    <p className="mt-1 font-mono text-sm text-slate-300">
                      {order.id}
                    </p>


                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                      Placed On
                    </p>


                    <p className="mt-1 text-sm text-slate-300">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Customer
                    </p>


                    <p className="mt-1 text-lg font-bold">
                      {order.customer_name}
                    </p>


                    <p className="text-sm text-slate-400">
                      {order.customer_phone}
                    </p>
                  </div>


                  <div className="max-w-xs">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Shipping Address
                    </p>


                    <p className="mt-1 text-sm text-slate-300">
                      {order.shipping_address}
                    </p>


                    <p className="text-sm text-slate-400">
                      {order.shipping_city}
                    </p>
                  </div>


                  <div className="text-left lg:text-right">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-bold ${statusStyle.badge}`}
                    >
                      <span
                        className={`size-2 rounded-full ${statusStyle.dot}`}
                      />


                      {order.status.toUpperCase()}
                    </span>


                    <p className="mt-3 text-3xl font-black text-blue-400">
                      Rs{" "}
                      {Number(
                        order.total_amount
                      ).toLocaleString()}
                    </p>


                    <Link
                      to={`/orders/${order.id}`}
                      className="mt-4 inline-block rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-5 py-2 font-semibold text-white transition hover:scale-105"
                    >
                      View Invoice
                    </Link>
                  </div>
                </div>




                <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-bold">
                      Order Items
                    </h3>


                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
                        Update Status
                      </label>


                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white focus:border-fuchsia-400 focus:outline-none"
                      >
                        <option value="pending">
                          Pending
                        </option>


                        <option value="confirmed">
                          Confirmed
                        </option>


                        <option value="processing">
                          Processing
                        </option>


                        <option value="shipped">
                          Shipped
                        </option>


                        <option value="delivered">
                          Delivered
                        </option>


                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>
                    </div>
                  </div>




                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 transition duration-300 hover:border-blue-400/30 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.product_name}
                          </p>


                          <p className="text-sm text-slate-400">
                            {item.quantity} × Rs{" "}
                            {Number(
                              item.unit_price || 0
                            ).toLocaleString()}
                          </p>
                        </div>


                        <p className="text-lg font-black text-blue-400">
                          Rs{" "}
                          {Number(
                            item.total_price || 0
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>




                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                      Order Total
                    </span>


                    <span className="text-2xl font-black text-blue-400">
                      Rs{" "}
                      {Number(
                        order.total_amount
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}