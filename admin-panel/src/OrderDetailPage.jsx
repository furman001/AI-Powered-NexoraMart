import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "./api";




const orderTimeline = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];




const statusColors = {
  pending: "from-amber-500 to-orange-500",
  confirmed: "from-blue-600 to-cyan-500",
  processing: "from-purple-600 to-fuchsia-500",
  shipped: "from-fuchsia-600 to-purple-600",
  delivered: "from-emerald-600 to-green-500",
  cancelled: "from-rose-600 to-red-500",
};




export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  const [statusValue, setStatusValue] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");



  const [statusHistory, setStatusHistory] = useState([]);




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
          `/orders/${orderId}`
        );



        if (!isActive) {
          return;
        }



        setOrder(response.data);
        setStatusValue(response.data.status);



        await loadStatusHistory();
      } catch (loadError) {
        console.error(loadError);



        if (isActive) {
          setError("Order not found");
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




  async function loadStatusHistory() {
    try {
      const response = await api.get(
        `/orders/${orderId}/status-history`
      );



      setStatusHistory(response.data || []);
    } catch (historyError) {
      console.error(historyError);
      setStatusHistory([]);
    }
  }




  async function handleStatusUpdate(event) {
    const newStatus = event.target.value;



    setStatusValue(newStatus);
    setStatusError("");
    setStatusSuccess("");
    setStatusLoading(true);



    try {
      const response = await api.patch(
        `/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );



      setOrder(response.data);
      setStatusValue(response.data.status);
      setStatusSuccess(
        `Order status updated to ${response.data.status.toUpperCase()}`
      );



      await loadStatusHistory();
    } catch (updateError) {
      console.error(updateError);



      setStatusError(
        updateError.response?.data?.detail ||
          "Could not update order status"
      );



      setStatusValue(order?.status || "");
    } finally {
      setStatusLoading(false);
    }
  }




  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading order details...
      </div>
    );
  }




  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 text-white">
        <p className="text-2xl font-bold text-red-400">
          {error || "Order not found"}
        </p>



        <Link
          to="/orders"
          className="rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition hover:scale-105"
        >
          Back to Orders
        </Link>
      </div>
    );
  }




  const orderItems = Array.isArray(order.items)
    ? order.items
    : [];



  const isCancelled = order.status === "cancelled";



  const currentTimelineIndex = isCancelled
    ? -1
    : orderTimeline.indexOf(order.status);



  const statusGradient =
    statusColors[order.status] ||
    "from-slate-600 to-slate-500";




  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="no-print mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link
            to="/orders"
            className="w-fit rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:scale-105"
          >
            ← Back to Orders
          </Link>



          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/invoice/${order.id}`}
              className="w-fit rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-3 font-bold text-white transition hover:scale-105"
            >
              View Invoice
            </Link>



            <button
              type="button"
              onClick={() => window.print()}
              className="w-fit rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-6 py-3 font-bold text-white transition hover:scale-105"
            >
              Print Invoice
            </button>
          </div>
        </div>




        <div className="print-invoice overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div
            className={`bg-gradient-to-r ${statusGradient} p-10 text-white`}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black backdrop-blur">
                    N
                  </div>



                  <div>
                    <h1 className="text-3xl font-black">
                      NexoraMart
                    </h1>



                    <p className="text-sm text-white/80">
                      Order Details
                    </p>
                  </div>
                </div>
              </div>



              <div className="text-left md:text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                  Order ID
                </p>



                <p className="break-all font-mono text-sm font-bold">
                  {order.id}
                </p>



                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/70">
                  Order Date
                </p>



                <p className="text-sm">
                  {order.created_at
                    ? new Date(
                        order.created_at
                      ).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>




          <div className="grid gap-8 p-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-black text-slate-900">
                Customer Details
              </h2>



              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Name
                  </p>



                  <p className="font-bold text-slate-800">
                    {order.customer_name}
                  </p>
                </div>



                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Phone
                  </p>



                  <p className="text-slate-700">
                    {order.customer_phone}
                  </p>
                </div>



                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Email
                  </p>



                  <p className="break-all text-slate-700">
                    {order.customer_email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>



            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-black text-slate-900">
                Shipping Address
              </h2>



              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Address
                  </p>



                  <p className="text-slate-700">
                    {order.shipping_address}
                  </p>
                </div>



                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    City
                  </p>



                  <p className="text-slate-700">
                    {order.shipping_city}
                  </p>
                </div>
              </div>
            </div>
          </div>




          <div className="no-print px-8 pb-8">
            <h3 className="text-lg font-black text-slate-900">
              Order Progress
            </h3>



            {isCancelled ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="font-bold text-red-700">
                  This order has been cancelled.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-between">
                {orderTimeline.map((status, index) => {
                  const isCompleted =
                    index <= currentTimelineIndex;



                  const isCurrent =
                    index === currentTimelineIndex;



                  return (
                    <div
                      key={status}
                      className="flex flex-1 flex-col items-center"
                    >
                      <div
                        className={`flex size-11 items-center justify-center rounded-full border-2 font-bold transition duration-300 ${
                          isCompleted
                            ? "border-transparent bg-gradient-to-br from-fuchsia-600 to-blue-600 text-white shadow-lg shadow-fuchsia-500/30"
                            : "border-slate-300 bg-white text-slate-400"
                        }`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>



                      <p
                        className={`mt-3 text-center text-xs font-bold uppercase tracking-wide ${
                          isCurrent
                            ? "text-fuchsia-600"
                            : isCompleted
                              ? "text-slate-700"
                              : "text-slate-400"
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>




          <div className="px-8 pb-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Product
                    </th>



                    <th className="p-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Quantity
                    </th>



                    <th className="p-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Price
                    </th>



                    <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-slate-500">
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
                    orderItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-200"
                      >
                        <td className="p-4 font-semibold text-slate-800">
                          {item.product_name}
                        </td>



                        <td className="p-4 text-slate-600">
                          {item.quantity}
                        </td>



                        <td className="p-4 text-slate-600">
                          Rs{" "}
                          {Number(
                            item.unit_price ??
                              item.price ??
                              0
                          ).toLocaleString()}
                        </td>



                        <td className="p-4 text-right font-bold text-slate-900">
                          Rs{" "}
                          {Number(
                            item.total_price ??
                              item.line_total ??
                              0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>




          <div className="grid gap-8 border-t border-slate-200 p-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-black text-slate-900">
                Payment Details
              </h2>



              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">
                    Payment Method
                  </span>



                  <span className="font-bold text-slate-800">
                    {(
                      order.payment_method ||
                      "cash_on_delivery"
                    )
                      .replace(/_/g, " ")
                      .toUpperCase()}
                  </span>
                </div>



                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">
                    Payment Status
                  </span>



                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      order.payment_status === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment_status || "unpaid"}
                  </span>
                </div>
              </div>
            </div>



            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-black text-slate-900">
                Order Summary
              </h2>



              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">
                    Subtotal
                  </span>



                  <span className="font-bold text-slate-900">
                    Rs{" "}
                    {Number(
                      order.subtotal ?? 0
                    ).toLocaleString()}
                  </span>
                </div>



                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">
                    Delivery
                  </span>



                  <span className="font-bold text-emerald-600">
                    {Number(order.shipping_fee || 0) === 0
                      ? "Free"
                      : `Rs ${Number(
                          order.shipping_fee
                        ).toLocaleString()}`}
                  </span>
                </div>



                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-lg font-black text-slate-900">
                    Total
                  </span>



                  <span className="bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
                    Rs{" "}
                    {Number(
                      order.total_amount ?? 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>




          <div className="border-t border-slate-200 bg-white p-8">
            <h2 className="text-lg font-black text-slate-900">
              Order Status History
            </h2>



            <p className="mt-1 text-sm text-slate-500">
              Every order status change is recorded here.
            </p>



            {statusHistory.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="font-bold text-slate-700">
                  No status history yet
                </p>


                <p className="mt-2 text-sm text-slate-500">
                  Change the order status to create the first history
                  record.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {statusHistory.map((history, index) => (
                  <div
                    key={history.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase text-white">
                          {index + 1}
                        </span>


                        <p className="font-bold text-slate-800">
                          {history.previous_status || "Created"}{" "}
                          → {history.new_status}
                        </p>
                      </div>


                      <p className="text-sm text-slate-500">
                        {new Date(
                          history.created_at
                        ).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>


                    <p className="mt-3 text-sm text-slate-600">
                      <span className="font-bold text-slate-800">
                        Changed by:
                      </span>{" "}
                      {history.changed_by || "System"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>




          <div className="no-print border-t border-slate-200 bg-slate-50 p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Update Order Status
                </h3>



                <p className="mt-1 text-sm text-slate-500">
                  Changing the status will notify the customer by email.
                </p>
              </div>



              <div className="w-full md:w-72">
                <select
                  value={statusValue}
                  onChange={handleStatusUpdate}
                  disabled={statusLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800"
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



            {statusLoading && (
              <p className="mt-4 text-sm font-semibold text-blue-600">
                Updating order status...
              </p>
            )}



            {statusError && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                {statusError}
              </p>
            )}



            {statusSuccess && (
              <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                {statusSuccess}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}