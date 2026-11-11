import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "./api";




export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");




  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Order ID is missing");
      return;
    }


    let isActive = true;


    async function loadOrder() {
      try {
        const response = await api.get(
          `/orders/track/${orderId}`
        );


        if (!isActive) {
          return;
        }


        setOrder(response.data);
      } catch (loadError) {
        console.error(loadError);


        if (isActive) {
          setError("Could not load order confirmation");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }


    loadOrder();


    return () => {
      isActive = false;
    };
  }, [orderId]);




  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading confirmation...
      </div>
    );
  }



  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 text-white">
        <p className="text-2xl font-bold text-red-400">
          {error}
        </p>


        <Link
          to="/"
          className="rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition hover:scale-105"
        >
          Back to Store
        </Link>
      </div>
    );
  }



  const orderItems = order.items || [];


  const subtotal = orderItems.reduce(
    (total, item) =>
      total + Number(item.total_price || 0),
    0
  );


  const orderTotal = Number(order.total_amount || 0);


  const deliveryFee = Math.max(
    0,
    orderTotal - subtotal
  );




  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-16 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-emerald-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />



      <main className="relative mx-auto max-w-4xl">
        <div className="confirm-fade-up rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-emerald-500/20 backdrop-blur-xl">
          <div className="confirm-success-pulse mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-5xl">
            ✅
          </div>


          <span className="mt-8 inline-block animate-pulse rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
            Order Received
          </span>


          <h1 className="confirm-text-glow mt-6 bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-400 bg-clip-text text-5xl font-black text-transparent">
            Order Placed!
          </h1>


          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Thank you for shopping with NexoraMart. Your order has
            been received successfully.
          </p>



          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
              Your Order ID
            </p>


            <p className="mt-3 break-all font-mono text-lg font-bold text-white">
              {order.id}
            </p>


            <p className="mt-4 text-sm text-slate-400">
              Save this Order ID to track your order later.
            </p>
          </div>



          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-fuchsia-600/20 to-purple-600/20 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Order Status
              </p>


              <p className="mt-3 text-2xl font-black text-white">
                {order.status
                  ? order.status.toUpperCase()
                  : "PENDING"}
              </p>
            </div>


            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-600/20 via-purple-600/20 to-blue-600/20 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Order Total
              </p>


              <p className="mt-3 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-2xl font-black text-transparent">
                Rs {orderTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>



        <div className="confirm-fade-up mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent">
            Order Receipt
          </h2>


          <div className="mt-7 space-y-5">
            {orderItems.length === 0 ? (
              <p className="text-slate-400">
                No order items were found.
              </p>
            ) : (
              orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div>
                    <p className="font-bold text-white">
                      {item.product_name}
                    </p>


                    <p className="mt-1 text-sm text-slate-400">
                      {item.quantity} × Rs{" "}
                      {Number(item.unit_price || 0).toLocaleString()}
                    </p>
                  </div>


                  <p className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text font-black text-transparent">
                    Rs{" "}
                    {Number(item.total_price || 0).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>



          <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                Subtotal
              </span>


              <span className="font-bold text-white">
                Rs {subtotal.toLocaleString()}
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                Delivery Fee
              </span>


              {deliveryFee === 0 ? (
                <span className="font-bold text-emerald-400">
                  Free
                </span>
              ) : (
                <span className="font-bold text-white">
                  Rs {deliveryFee.toLocaleString()}
                </span>
              )}
            </div>


            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-lg font-black text-white">
                Total
              </span>


              <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
                Rs {orderTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>



        <div className="confirm-fade-up mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
            Order Actions
          </h2>


          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <Link
              to={`/invoice/${order.id}`}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 text-center font-bold text-white shadow-2xl shadow-emerald-500/30 transition duration-300 hover:scale-[1.02]"
            >
              View Invoice
            </Link>


            <Link
              to={`/track-order?order_id=${order.id}`}
              className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 px-6 py-4 text-center font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-[1.02]"
            >
              Track Order
            </Link>


            <Link
              to="/"
              className="w-full rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center font-bold text-white transition duration-300 hover:scale-[1.02] hover:bg-white/10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>



        <div className="confirm-fade-up mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent">
            What Happens Next?
          </h2>


          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl">📦</div>


              <p className="mt-3 font-bold text-white">
                Order Confirmed
              </p>


              <p className="mt-2 text-sm text-slate-400">
                Your order has been received.
              </p>
            </div>


            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl">🚚</div>


              <p className="mt-3 font-bold text-white">
                Order Processing
              </p>


              <p className="mt-2 text-sm text-slate-400">
                We prepare your items for delivery.
              </p>
            </div>


            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl">📍</div>


              <p className="mt-3 font-bold text-white">
                Track Anytime
              </p>


              <p className="mt-2 text-sm text-slate-400">
                Use your Order ID to check progress.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}