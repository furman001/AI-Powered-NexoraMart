import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import { useAuth } from "./AuthContext";




export default function ReviewsPage() {
  const { admin, logout } = useAuth();


  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");




  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await api.get(
          "/products/admin/reviews"
        );


        setReviews(response.data || []);
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load reviews");
      } finally {
        setLoading(false);
      }
    }


    loadReviews();
  }, []);




  async function approveReview(reviewId) {
    try {
      const response = await api.patch(
        `/products/admin/reviews/${reviewId}/approve`
      );


      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId ? response.data : review
        )
      );
    } catch (approveError) {
      console.error(approveError);
      setError("Could not approve review");
    }
  }




  async function hideReview(reviewId) {
    try {
      const response = await api.patch(
        `/products/admin/reviews/${reviewId}/hide`
      );


      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId ? response.data : review
        )
      );
    } catch (hideError) {
      console.error(hideError);
      setError("Could not hide review");
    }
  }




  async function deleteReview(reviewId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );


    if (!confirmed) {
      return;
    }


    try {
      await api.delete(
        `/products/admin/reviews/${reviewId}`
      );


      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review.id !== reviewId
        )
      );
    } catch (deleteError) {
      console.error(deleteError);
      setError("Could not delete review");
    }
  }




  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (review.comment || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (review.product?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" &&
        review.is_approved) ||
      (statusFilter === "pending" &&
        !review.is_approved);


    return matchesSearch && matchesStatus;
  });




  const approvedCount = reviews.filter(
    (review) => review.is_approved
  ).length;


  const pendingCount = reviews.filter(
    (review) => !review.is_approved
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
            className="rounded-xl px-4 py-3 text-slate-300 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
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
            to="/reviews"
            className="rounded-xl bg-white/10 px-4 py-3 font-semibold backdrop-blur transition duration-300 hover:translate-x-1 hover:bg-white/20"
          >
            Reviews
          </Link>


          <Link
            to="/invoices"
            className="rounded-xl px-4 py-3 text-slate-300 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
          >
            Invoices
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
          <h1 className="bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent">
            Review Management
          </h1>


          <p className="mt-2 text-slate-600">
            Approve, hide, or delete customer reviews.
          </p>
        </header>


        {error && (
          <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-600">
            {error}
          </div>
        )}


        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2">
            <p className="text-sm opacity-80">Total Reviews</p>
            <p className="mt-3 text-4xl font-black">
              {reviews.length}
            </p>
          </div>


          <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-emerald-600 to-lime-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2">
            <p className="text-sm opacity-80">Approved</p>
            <p className="mt-3 text-4xl font-black">
              {approvedCount}
            </p>
          </div>


          <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-orange-600 to-amber-500 p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2">
            <p className="text-sm opacity-80">Pending</p>
            <p className="mt-3 text-4xl font-black">
              {pendingCount}
            </p>
          </div>
        </div>


        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by customer, product, or review..."
            className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-slate-800 focus:border-fuchsia-500 focus:outline-none"
          />


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 focus:border-fuchsia-500 focus:outline-none sm:w-56"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>


        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center text-xl font-bold text-slate-500">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
            <div className="text-5xl">⭐</div>


            <p className="mt-4 text-xl font-bold text-slate-700">
              No reviews found
            </p>


            <p className="mt-2 text-slate-500">
              Try a different search or status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-blue-600 font-black text-white">
                        {review.customer_name
                          .charAt(0)
                          .toUpperCase()}
                      </div>


                      <div>
                        <p className="font-bold text-slate-900">
                          {review.customer_name}
                        </p>


                        <p className="text-sm text-slate-500">
                          {review.product?.name ||
                            "Product unavailable"}
                        </p>
                      </div>
                    </div>


                    <div className="mt-4 flex items-center gap-2">
                      <span className="font-bold text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>


                      <span className="text-sm text-slate-500">
                        {review.rating}/5
                      </span>
                    </div>


                    {review.comment && (
                      <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-slate-700">
                        {review.comment}
                      </p>
                    )}


                    <p className="mt-3 text-xs text-slate-500">
                      {review.created_at &&
                        new Date(
                          review.created_at
                        ).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                    </p>
                  </div>


                  <div className="flex flex-col gap-3">
                    <span
                      className={`w-fit rounded-full px-4 py-1 text-xs font-bold uppercase ${
                        review.is_approved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.is_approved
                        ? "Approved"
                        : "Pending"}
                    </span>


                    <div className="flex gap-3">
                      {!review.is_approved && (
                        <button
                          type="button"
                          onClick={() =>
                            approveReview(review.id)
                          }
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
                        >
                          Approve
                        </button>
                      )}


                      {review.is_approved && (
                        <button
                          type="button"
                          onClick={() => hideReview(review.id)}
                          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
                        >
                          Hide
                        </button>
                      )}


                      <button
                        type="button"
                        onClick={() => deleteReview(review.id)}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
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