import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";


export default function InvoicesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");


  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get("/orders/");
        setOrders(response.data);
      } catch (loadError) {
        setError("Could not load invoices");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);


  async function handleExportCsv() {
    setExportError("");
    setExportLoading(true);

    try {
      const response = await api.get(
        "/orders/export/csv",
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "nexoramart-orders.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (csvError) {
      setExportError(
        csvError.response?.data?.detail ||
          "Could not export orders CSV"
      );
    } finally {
      setExportLoading(false);
    }
  }


  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.customer_name?.toLowerCase() || "";
    const customerId = order.id?.toLowerCase() || "";
    const customerPhone = order.customer_phone || "";

    const matchesSearch =
      customerName.includes(search.toLowerCase()) ||
      customerPhone.includes(search) ||
      customerId.includes(search.toLowerCase());

    const matchesStatus =
      !selectedStatus ||
      order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 p-6 text-white md:p-10">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-cyan-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-purple-600/25 blur-3xl" />


      <div className="relative mx-auto max-w-7xl">
        <div className="analytics-fade-up mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              NexoraMart Admin
            </p>

            <h1 className="analytics-text-glow bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent">
              Invoices
            </h1>

            <p className="mt-3 text-slate-400">
              View, open, print, and export customer order invoices.
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


        <div className="analytics-fade-up mb-6 flex justify-end">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exportLoading}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-3 font-bold text-white transition duration-300 hover:scale-105 disabled:opacity-60"
          >
            {exportLoading
              ? "Preparing CSV..."
              : "Export Orders CSV"}
          </button>
        </div>


        {exportError && (
          <div className="analytics-fade-up mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {exportError}
          </div>
        )}


        <div className="analytics-fade-up mb-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search invoice by customer, phone, or order ID"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none md:col-span-2"
            />

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>


        <div className="analytics-fade-up mb-8 text-sm font-semibold text-slate-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>


        {loading && (
          <div className="analytics-float text-center text-xl font-bold text-slate-300">
            Loading invoices...
          </div>
        )}


        {error && (
          <div className="analytics-fade-up rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}


        {!loading && filteredOrders.length === 0 && !error && (
          <div className="analytics-fade-up rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <p className="text-xl font-bold text-slate-300">
              No invoices found
            </p>

            <p className="mt-2 text-slate-500">
              Try a different search term or order status.
            </p>
          </div>
        )}


        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order, index) => (
            <div
              key={order.id}
              className="analytics-fade-up group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20"
              style={{
                animationDelay: `${index * 90}ms`,
              }}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Invoice
                  </p>

                  <p className="mt-1 font-mono text-sm text-slate-300">
                    {order.id.slice(0, 8)}...
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-slate-300">
                  {order.status}
                </span>
              </div>


              <div className="mb-5">
                <p className="text-lg font-bold">
                  {order.customer_name}
                </p>

                <p className="text-sm text-slate-400">
                  {order.customer_phone}
                </p>

                {order.created_at && (
                  <p className="mt-3 text-sm text-slate-400">
                    {new Date(order.created_at).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>


              <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Total
                </span>

                <span className="text-xl font-black text-cyan-300">
                  Rs {Number(order.total_amount).toLocaleString()}
                </span>
              </div>


              <Link
                to={`/orders/${order.id}`}
                className="block w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-center font-bold text-white transition duration-300 hover:scale-[1.03]"
              >
                View Invoice
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}