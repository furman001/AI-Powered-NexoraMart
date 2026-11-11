import { Link, useSearchParams } from "react-router-dom";



export default function PaymentCancelledPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");



  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-10 text-center backdrop-blur-xl">
        <div className="text-6xl">⚠️</div>


        <h1 className="mt-6 text-3xl font-black text-yellow-300">
          Payment Cancelled
        </h1>


        <p className="mt-4 text-slate-300">
          Your payment was not completed. Your order remains unpaid.
        </p>


        {orderId && (
          <p className="mt-4 text-sm text-slate-400">
            Order ID: {orderId}
          </p>
        )}


        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-yellow-600 px-7 py-3 font-bold text-white transition hover:scale-105"
        >
          Back to Store
        </Link>
      </div>
    </div>
  );
}