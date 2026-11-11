import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "./api";




const orderTimeline = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];




export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const orderIdFromUrl =
    searchParams.get("order_id") || "";



  const [orderId, setOrderId] = useState(
    orderIdFromUrl
  );


  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");




  async function trackOrder(orderIdToTrack) {
    if (!orderIdToTrack) {
      return;
    }



    setError("");
    setOrder(null);
    setLoading(true);



    try {
      const response = await api.get(
        `/orders/track/${orderIdToTrack.trim()}`
      );



      setOrder(response.data);
    } catch (trackError) {
      console.error(trackError);



      setError(
        trackError.response?.status === 404
          ? "Order not found. Please check your Order ID."
          : "Could not load order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }




  useEffect(() => {
    if (orderIdFromUrl) {
      trackOrder(orderIdFromUrl);
    }
  }, [orderIdFromUrl]);




  async function handleTrackOrder(event) {
    event.preventDefault();



    trackOrder(orderId);
  }




  const orderItems = Array.isArray(order?.items)
    ? order.items
    : [];



  const isCancelled =
    order?.status === "cancelled";



  const currentTimelineIndex = isCancelled
    ? -1
    : orderTimeline.indexOf(order?.status);




  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-80 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />




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
        <div className="track-fade-up text-center">
          <span className="inline-block animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Order Tracking
          </span>



          <h1 className="track-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            Track Your Order
          </h1>



          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Enter the Order ID from your order confirmation to check
            its current status and progress.
          </p>
        </div>




        <form
          onSubmit={handleTrackOrder}
          className="track-fade-up mx-auto mt-12 flex max-w-2xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:flex-row"
        >
          <input
            value={orderId}
            onChange={(event) =>
              setOrderId(event.target.value)
            }
            placeholder="Enter Order ID"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            required
          />


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 px-8 py-3 font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-105 disabled:opacity-60 sm:w-auto"
          >
            {loading
              ? "Checking..."
              : "Track Order"}
          </button>
        </form>




        {error && (
          <div className="track-fade-up mx-auto mt-8 max-w-2xl rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-300">
            {error}
          </div>
        )}




        {loading && !order && (
          <div className="track-fade-up mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
            Loading order details...
          </div>
        )}




        {order && (
          <div className="track-fade-up mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-3xl font-black text-transparent">
                  Order Details
                </h2>



                <p className="mt-2 break-all font-mono text-sm text-slate-400">
                  {order.id}
                </p>
              </div>



              <span
                className={`w-fit rounded-full px-5 py-2 text-sm font-bold ${
                  isCancelled
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                }`}
              >
                {order.status
                  ? order.status.toUpperCase()
                  : "PENDING"}
              </span>
            </div>




            <div className="mt-10">
              <h3 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent">
                Order Progress
              </h3>



              {isCancelled ? (
                <div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                  <p className="font-bold text-red-300">
                    This order has been cancelled.
                  </p>
                </div>
              ) : (
                <div className="mt-8 flex items-center justify-between">
                  {orderTimeline.map(
                    (status, index) => {
                      const isCompleted =
                        index <=
                        currentTimelineIndex;



                      const isCurrent =
                        index ===
                        currentTimelineIndex;



                      return (
                        <div
                          key={status}
                          className="flex flex-1 flex-col items-center"
                        >
                          <div
                            className={`flex size-12 items-center justify-center rounded-full border-2 font-bold transition duration-500 ${
                              isCompleted
                                ? "border-fuchsia-500 bg-gradient-to-br from-fuchsia-600 to-blue-600 text-white shadow-lg shadow-fuchsia-500/30"
                                : "border-white/10 bg-white/5 text-slate-500"
                            }`}
                          >
                            {isCompleted
                              ? "✓"
                              : index + 1}
                          </div>



                          <p
                            className={`mt-3 text-center text-xs font-bold uppercase tracking-widest ${
                              isCurrent
                                ? "text-fuchsia-300"
                                : isCompleted
                                  ? "text-slate-300"
                                  : "text-slate-500"
                            }`}
                          >
                            {status}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>




            <div className="mt-12 overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-sm font-bold uppercase tracking-widest text-slate-400">
                      Product
                    </th>



                    <th className="p-4 text-sm font-bold uppercase tracking-widest text-slate-400">
                      Quantity
                    </th>



                    <th className="p-4 text-right text-sm font-bold uppercase tracking-widest text-slate-400">
                      Total
                    </th>
                  </tr>
                </thead>



                <tbody>
                  {orderItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-6 text-center text-slate-500"
                      >
                        No order items found.
                      </td>
                    </tr>
                  ) : (
                    orderItems.map(
                      (item, index) => (
                        <tr
                          key={item.id}
                          className="track-fade-up border-t border-white/10 transition duration-300 hover:bg-white/5"
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <td className="p-4 font-semibold text-white">
                            {item.product_name}
                          </td>



                          <td className="p-4 text-slate-300">
                            {item.quantity}
                          </td>



                          <td className="p-4 text-right font-bold text-white">
                            Rs{" "}
                            {Number(
                              item.total_price ??
                                item.line_total ??
                                0
                            ).toLocaleString()}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>




            <div className="mt-8 flex items-center justify-between rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-fuchsia-600/20 to-purple-600/20 p-6">
              <span className="text-lg font-black text-white">
                Order Total
              </span>



              <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
                Rs{" "}
                {Number(
                  order.total_amount ?? 0
                ).toLocaleString()}
              </span>
            </div>




            <Link
              to={`/invoice/${order.id}`}
              className="mt-6 block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 py-4 text-center font-bold text-white shadow-2xl shadow-emerald-500/30 transition duration-300 hover:scale-[1.02]"
            >
              View Invoice
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}