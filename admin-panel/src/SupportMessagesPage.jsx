import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";




export default function SupportMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");




  async function loadMessages() {
    try {
      const response = await api.get(
        "/support/admin/messages"
      );



      setMessages(response.data || []);
      setError("");
    } catch (loadError) {
      setError(
        loadError.response?.data?.detail ||
          "Could not load support messages"
      );
    } finally {
      setLoading(false);
    }
  }




  useEffect(() => {
    loadMessages();
  }, []);




  async function handleMarkAsRead(messageId) {
    try {
      await api.patch(
        `/support/admin/messages/${messageId}/read`
      );



      setSuccess("Message marked as read.");
      await loadMessages();
    } catch (updateError) {
      setError(
        updateError.response?.data?.detail ||
          "Could not mark message as read"
      );
    }
  }




  async function handleDeleteMessage(messageId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this support message?"
    );



    if (!confirmed) return;



    try {
      await api.delete(
        `/support/admin/messages/${messageId}`
      );



      setSuccess("Message deleted successfully.");
      await loadMessages();
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.detail ||
          "Could not delete message"
      );
    }
  }




  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading support messages...
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/admin"
            className="text-2xl font-black"
          >
            NexoraMart Admin
          </Link>


          <Link
            to="/admin"
            className="rounded-xl bg-white/10 px-5 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>




      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-4xl font-black text-transparent">
          Support Messages
        </h1>



        <p className="mt-3 text-slate-400">
          Messages submitted by customers through the Contact Us page.
        </p>



        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}



        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {success}
          </div>
        )}



        {messages.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-xl font-bold text-white">
              No support messages yet
            </p>


            <p className="mt-3 text-slate-400">
              Customer messages will appear here after they use the
              Contact Us page.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-1 text-xs font-bold ${
                          message.status === "new"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {message.status.toUpperCase()}
                      </span>


                      <span className="text-sm text-slate-500">
                        {new Date(
                          message.created_at
                        ).toLocaleString()}
                      </span>
                    </div>


                    <p className="mt-4 text-lg font-bold text-white">
                      {message.subject}
                    </p>


                    <p className="mt-2 text-slate-300">
                      {message.message_text}
                    </p>


                    <div className="mt-4 text-sm text-slate-400">
                      <p>
                        <span className="font-bold text-white">
                          From:
                        </span>{" "}
                        {message.customer_name}
                      </p>


                      <p>
                        <span className="font-bold text-white">
                          Email:
                        </span>{" "}
                        {message.customer_email}
                      </p>
                    </div>
                  </div>



                  <div className="flex gap-3">
                    {message.status === "new" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkAsRead(message.id)
                        }
                        className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 font-bold text-white transition hover:scale-105"
                      >
                        Mark as Read
                      </button>
                    )}


                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteMessage(message.id)
                      }
                      className="rounded-xl bg-red-600/20 px-5 py-3 font-bold text-red-300 transition hover:bg-red-600/30"
                    >
                      Delete
                    </button>
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