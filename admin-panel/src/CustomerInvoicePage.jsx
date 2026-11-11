import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "./api";


const invoiceTitles = {
  pending: "Order Pending Invoice",
  confirmed: "Order Confirmed Invoice",
  processing: "Order Processing Invoice",
  shipped: "Order Processing Invoice",
  delivered: "Order Delivered Invoice",
  cancelled: "Order Cancelled Invoice",
};


const statusStyles = {
  pending:
    "from-yellow-500 to-amber-600 shadow-yellow-500/30",
  confirmed:
    "from-blue-600 to-indigo-600 shadow-blue-500/30",
  processing:
    "from-purple-600 to-fuchsia-600 shadow-purple-500/30",
  shipped:
    "from-purple-600 to-fuchsia-600 shadow-purple-500/30",
  delivered:
    "from-emerald-500 to-green-600 shadow-emerald-500/30",
  cancelled:
    "from-red-500 to-rose-600 shadow-red-500/30",
};


export default function CustomerInvoicePage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing from the invoice URL");
      setLoading(false);
      return;
    }

    let isActive = true;

    async function loadInvoice() {
      try {
        const response = await api.get(
          `/orders/track/${orderId}`
        );

        if (!isActive) return;

        setOrder(response.data);
      } catch (loadError) {
        console.error("Invoice load error:", loadError);

        if (isActive) {
          setError(
            loadError.response?.data?.detail ||
              `Could not load invoice. Status: ${
                loadError.response?.status || "Network error"
              }`
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadInvoice();

    return () => {
      isActive = false;
    };
  }, [orderId]);


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading invoice...
      </div>
    );
  }


  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 px-6 text-center text-white">
        <p className="text-2xl font-bold text-red-400">
          {error}
        </p>

        <p className="max-w-lg break-all rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-sm text-slate-300">
          Invoice URL Order ID: {orderId || "Missing"}
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


  const orderItems = Array.isArray(order.items)
    ? order.items
    : [];

  const orderStatus = order.status || "pending";

  const invoiceTitle =
    invoiceTitles[orderStatus] ||
    "Order Invoice";

  const statusGradient =
    statusStyles[orderStatus] ||
    "from-slate-600 to-slate-700 shadow-slate-500/30";


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-14 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-80 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />


      <main className="relative mx-auto max-w-5xl">
        <div className="no-print mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/track-order"
            className="w-fit rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition duration-300 hover:scale-105 hover:bg-white/10"
          >
            ← Back to Tracking
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-fit rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 px-7 py-3 font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-105"
          >
            Print / Save Invoice
          </button>
        </div>


        <div className="invoice-fade-up overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-600 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-black text-white">
                  NexoraMart
                </h1>

                <p className="mt-2 text-white/85">
                  Customer Order Invoice
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">
                  Invoice
                </p>

                <p className="mt-2 break-all font-mono text-sm text-white">
                  {order.id}
                </p>
              </div>
            </div>
          </div>


          <div className="p-8">
            <div className="invoice-fade-up text-center">
              <span
                className={`inline-block rounded-full bg-gradient-to-r px-6 py-2 text-sm font-bold text-white shadow-lg ${statusGradient}`}
              >
                {orderStatus.toUpperCase()}
              </span>

              <h2 className="invoice-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                {invoiceTitle}
              </h2>

              <p className="mt-3 text-slate-300">
                This invoice updates automatically according to
                your current order status.
              </p>
            </div>


            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-black text-white">
                  Order Information
                </h3>

                <div className="mt-4 space-y-3 text-slate-300">
                  <p>
                    <span className="text-slate-500">
                      Order ID:
                    </span>{" "}
                    <span className="break-all font-mono">
                      {order.id}
                    </span>
                  </p>

                  <p>
                    <span className="text-slate-500">
                      Status:
                    </span>{" "}
                    <span className="font-bold text-white">
                      {orderStatus.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-black text-white">
                  Payment Summary
                </h3>

                <div className="mt-4 space-y-3 text-slate-300">
                  <p>
                    <span className="text-slate-500">
                      Subtotal:
                    </span>{" "}
                    Rs{" "}
                    {Number(
                      order.subtotal ??
                        order.total_amount ??
                        0
                    ).toLocaleString()}
                  </p>

                  <p>
                    <span className="text-slate-500">
                      Total Amount:
                    </span>{" "}
                    <span className="font-bold text-white">
                      Rs{" "}
                      {Number(
                        order.total_amount ?? 0
                      ).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>


            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-sm font-bold uppercase tracking-widest text-slate-400">
                      Product
                    </th>

                    <th className="p-4 text-sm font-bold uppercase tracking-widest text-slate-400">
                      Quantity
                    </th>

                    <th className="p-4 text-sm font-bold uppercase tracking-widest text-slate-400">
                      Unit Price
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
                        colSpan={4}
                        className="p-6 text-center text-slate-500"
                      >
                        No order items found.
                      </td>
                    </tr>
                  ) : (
                    orderItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className="invoice-fade-up border-t border-white/10 transition duration-300 hover:bg-white/5"
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

                        <td className="p-4 text-slate-300">
                          Rs{" "}
                          {Number(
                            item.unit_price ?? 0
                          ).toLocaleString()}
                        </td>

                        <td className="p-4 text-right font-bold text-white">
                          Rs{" "}
                          {Number(
                            item.total_price ?? 0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>


            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Subtotal
                  </span>

                  <span className="font-bold text-white">
                    Rs{" "}
                    {Number(
                      order.subtotal ??
                        order.total_amount ??
                        0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-lg font-black text-white">
                    Total
                  </span>

                  <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
                    Rs{" "}
                    {Number(
                      order.total_amount ?? 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>


            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-slate-300">
                Thank you for shopping with NexoraMart.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                This invoice reflects the current status of your
                order.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
