import { useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";


export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelError, setCancelError] = useState("");


  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setOrders(null);
    setLoading(true);

    try {
      const response = await api.get(
        `/orders/customer/${phone.trim()}`
      );

      setOrders(response.data);
    } catch (searchError) {
      setError(
        searchError.response?.data?.detail ||
          "Could not load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  async function handleCancelOrder(orderId) {
    setCancelMessage("");
    setCancelError("");
    setCancellingOrderId(orderId);

    try {
      const response = await api.patch(
        `/orders/customer/${orderId}/cancel`,
        {
          customer_phone: phone.trim(),
        }
      );

      setCancelMessage(
        response.data.message || "Order cancelled successfully"
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "cancelled",
              }
            : order
        )
      );
    } catch (cancelError) {
      setCancelError(
        cancelError.response?.data?.detail ||
          "Could not cancel order"
      );
    } finally {
      setCancellingOrderId(null);
    }
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-fuchsia-600/25 blur-3xl" />


      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-black">
            NexoraMart
          </Link>

          <Link
            to="/"
            className="rounded-xl bg-white/10 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:bg-white/20"
          >
            Back to Store
          </Link>
        </div>
      </header>


      <main className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="myorders-fade-up text-center">
          <span className="inline-block animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Order History
          </span>

          <h1 className="myorders-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            My Orders
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Enter the phone number you used during checkout to view
            your orders.
          </p>
        </div>


        <form
          onSubmit={handleSearch}
          className="myorders-fade-up mx-auto mt-12 flex max-w-2xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:flex-row"
        >
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter your phone number"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 px-8 py-3 font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-105 disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Searching..." : "Find Orders"}
          </button>
        </form>


        {error && (
          <div className="myorders-fade-up mx-auto mt-8 max-w-2xl rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-300">
            {error}
          </div>
        )}


        {orders && orders.length === 0 && (
          <div className="myorders-fade-up mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <div className="text-5xl">📦</div>

            <h2 className="mt-5 text-2xl font-black text-white">
              No orders found
            </h2>

            <p className="mt-3 text-slate-400">
              We could not find any orders for this phone number.
            </p>
          </div>
        )}


        {cancelMessage && (
          <div className="myorders-fade-up mx-auto mt-8 max-w-2xl rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-emerald-300">
            {cancelMessage}
          </div>
        )}

        {cancelError && (
          <div className="myorders-fade-up mx-auto mt-8 max-w-2xl rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-300">
            {cancelError}
          </div>
        )}


        {orders && orders.length > 0 && (
          <div className="mt-12 space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="myorders-fade-up rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-fuchsia-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-fuchsia-500/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                      Order ID
                    </p>

                    <p className="mt-2 break-all font-mono text-sm text-white">
                      {order.id}
                    </p>

                    <p className="mt-4 text-sm text-slate-400">
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString("en-PK", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Date not available"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-5 py-2 text-sm font-bold ${
                      order.status === "cancelled"
                        ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                    }`}
                  >
                    {order.status
                      ? order.status.toUpperCase()
                      : "PENDING"}
                  </span>
                </div>


                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-lg font-black text-white">
                    Total:{" "}
                    <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
                      Rs{" "}
                      {Number(
                        order.total_amount ?? 0
                      ).toLocaleString()}
                    </span>
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={`/track-order`}
                      className="rounded-xl border border-white/20 bg-white/5 px-5 py-2 text-center font-semibold text-white transition duration-300 hover:scale-105 hover:bg-white/10"
                    >
                      Track
                    </Link>

                    <Link
                      to={`/invoice/${order.id}`}
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 text-center font-bold text-white transition duration-300 hover:scale-105"
                    >
                      View Invoice
                    </Link>

                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2 text-center font-bold text-red-300 transition duration-300 hover:scale-105 hover:bg-red-500/20 disabled:opacity-60"
                      >
                        {cancellingOrderId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}