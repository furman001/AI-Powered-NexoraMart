import { useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import { useWebsiteSettings } from "./WebsiteSettingsContext";




const supportCards = [
  {
    icon: "📦",
    title: "Track Your Order",
    description:
      "Enter your Order ID and instantly check its current progress.",
    buttonText: "Track Order",
    buttonLink: "/track-order",
    gradient:
      "from-blue-600 via-indigo-600 to-purple-600",
    glow: "shadow-blue-500/30",
  },
  {
    icon: "💬",
    title: "WhatsApp Support",
    description:
      "Chat with our support team for quick help with orders and products.",
    buttonText: "Chat Now",
    buttonLink: "https://wa.me/923470095932",
    gradient:
      "from-emerald-500 via-green-600 to-teal-600",
    glow: "shadow-emerald-500/30",
  },
  {
    icon: "✉️",
    title: "Email Support",
    description:
      "Send us your Order ID, product name, and issue details by email.",
    buttonText: "Send Email",
    buttonLink: "furmangtv@gmail.com",
    gradient:
      "from-fuchsia-600 via-pink-600 to-rose-600",
    glow: "shadow-fuchsia-500/30",
  },
  {
    icon: "🔄",
    title: "Returns & Refunds",
    description:
      "Learn how to request a return, exchange, or refund for your order.",
    buttonText: "Get Help",
    buttonLink: "/support",
    gradient:
      "from-orange-500 via-amber-500 to-yellow-500",
    glow: "shadow-amber-500/30",
  },
];




const supportFaqs = [
  {
    question: "How can I track my order?",
    answer:
      "Go to the Track Order page and enter the Order ID you received after placing your order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "You can place orders using Cash on Delivery or the payment method available during checkout.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your city and product availability. You can track your order status anytime.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Orders may be cancelled before shipping. Contact support with your Order ID for assistance.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "Contact support within 48 hours of delivery and include your Order ID, product name, and photos.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can contact us through WhatsApp, email, or submit a message using the contact form below.",
  },
];




export default function SupportPage() {
  const { siteSettings } = useWebsiteSettings();




  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");




  async function handleContactSubmit(event) {
    event.preventDefault();



    setError("");
    setSuccess("");
    setLoading(true);



    try {
      await api.post("/support/messages", {
        customer_name: customerName,
        customer_email: customerEmail,
        subject: subject,
        message_text: messageText,
      });



      setCustomerName("");
      setCustomerEmail("");
      setSubject("");
      setMessageText("");
      setSuccess(
        "Thank you! Your message has been sent. Our support team will contact you soon."
      );
    } catch (submitError) {
      setError(
        submitError.response?.data?.detail ||
          "Could not send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }




  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />




      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            {siteSettings.logo_url ? (
              <img
                src={siteSettings.logo_url}
                alt={siteSettings.site_name}
                className="h-11 w-11 rounded-xl object-cover"
              />
            ) : (
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-blue-600 text-lg font-black text-white">
                N
              </div>
            )}


            <span className="text-2xl font-black">
              {siteSettings.site_name ||
                "NexoraMart"}
            </span>
          </Link>



          <Link
            to="/"
            className="rounded-xl bg-white/10 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:bg-white/20"
          >
            Back to Store
          </Link>
        </div>
      </header>




      <main className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="support-fade-up text-center">
          <span className="inline-block animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            We Are Here To Help
          </span>



          <h1 className="support-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            Customer Support
          </h1>



          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Need help with an order, product, delivery, return, or
            refund? Choose a support option below and our team will
            help you.
          </p>
        </div>




        <div className="mt-14 grid gap-7 md:grid-cols-2">
          {supportCards.map((card, index) => (
            <div
              key={card.title}
              className={`support-fade-up group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${card.gradient} p-8 shadow-2xl ${card.glow} transition duration-500 hover:-translate-y-3 hover:scale-[1.02]`}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/20 blur-2xl transition duration-500 group-hover:scale-150" />


              <div className="relative">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm transition duration-500 group-hover:animate-bounce">
                  {card.icon}
                </div>



                <h2 className="mt-6 text-2xl font-black text-white">
                  {card.title}
                </h2>



                <p className="mt-3 text-white/85">
                  {card.description}
                </p>



                {card.buttonLink.startsWith("/") ? (
                  <Link
                    to={card.buttonLink}
                    className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {card.buttonText}
                  </Link>
                ) : (
                  <a
                    href={card.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {card.buttonText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>




        <section className="support-fade-up mt-20 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
            Contact Us
          </h2>



          <p className="mt-3 text-slate-300">
            Send us a message and our support team will respond as soon
            as possible.
          </p>



          <form
            onSubmit={handleContactSubmit}
            className="mt-8 space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input
                value={customerName}
                onChange={(event) =>
                  setCustomerName(
                    event.target.value
                  )
                }
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />


              <input
                type="email"
                value={customerEmail}
                onChange={(event) =>
                  setCustomerEmail(
                    event.target.value
                  )
                }
                placeholder="Your email address"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>



            <input
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              placeholder="Subject"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              required
            />


            <textarea
              value={messageText}
              onChange={(event) =>
                setMessageText(event.target.value)
              }
              placeholder="Write your message"
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              required
            />


            {error && (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </p>
            )}


            {success && (
              <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {success}
              </p>
            )}


            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 py-4 font-bold text-white shadow-2xl shadow-blue-500/30 transition duration-300 hover:scale-[1.02] disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : "Send Message"}
            </button>
          </form>
        </section>




        <section className="mt-20">
          <div className="support-fade-up text-center">
            <h2 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-4xl font-black text-transparent">
              Frequently Asked Questions
            </h2>



            <p className="mt-3 text-slate-300">
              Quick answers to the most common customer questions.
            </p>
          </div>



          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {supportFaqs.map(
              (faq, index) => (
                <div
                  key={faq.question}
                  className="support-fade-up group rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-fuchsia-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-fuchsia-500/20"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-blue-600 font-black text-white">
                      ?
                    </span>



                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {faq.question}
                      </h3>



                      <p className="mt-2 text-slate-300">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>




        <section className="support-fade-up mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-600 p-10 text-center shadow-2xl shadow-fuchsia-500/30">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Still Need Help?
          </h2>



          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Our support team is ready to assist you with your{" "}
            {siteSettings.site_name ||
              "NexoraMart"}{" "}
            order.
          </p>



          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/track-order"
              className="rounded-xl bg-white px-7 py-3 font-bold text-slate-900 transition duration-300 hover:scale-105"
            >
              Track Order
            </Link>



            <a
              href="https://wa.me/923470095932"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/40 bg-white/10 px-7 py-3 font-bold text-white transition duration-300 hover:scale-105 hover:bg-white/20"
            >
              WhatsApp Support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}