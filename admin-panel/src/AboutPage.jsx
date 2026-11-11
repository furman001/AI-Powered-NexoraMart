import { Link } from "react-router-dom";
import { useWebsiteSettings } from "./WebsiteSettingsContext";




const aboutFeatures = [
  {
    icon: "🚚",
    title: "Fast Delivery",
    description:
      "We process orders quickly and provide order tracking so customers always know their order status.",
    gradient:
      "from-blue-600 via-indigo-600 to-purple-600",
    glow: "shadow-blue-500/30",
  },
  {
    icon: "🛡️",
    title: "Secure Shopping",
    description:
      "Customer information is handled carefully, and orders are processed through a secure system.",
    gradient:
      "from-emerald-500 via-green-600 to-teal-600",
    glow: "shadow-emerald-500/30",
  },
  {
    icon: "⭐",
    title: "Quality Products",
    description:
      "We focus on reliable products, clear descriptions, customer reviews, and a smooth shopping experience.",
    gradient:
      "from-fuchsia-600 via-pink-600 to-rose-600",
    glow: "shadow-fuchsia-500/30",
  },
  {
    icon: "💬",
    title: "Customer Support",
    description:
      "Our support team helps customers with orders, products, delivery, returns, and general questions.",
    gradient:
      "from-orange-500 via-amber-500 to-yellow-500",
    glow: "shadow-amber-500/30",
  },
];




const aboutStats = [
  {
    value: "100%",
    label: "Customer Focused",
  },
  {
    value: "24/7",
    label: "Order Tracking",
  },
  {
    value: "Easy",
    label: "Shopping Experience",
  },
  {
    value: "Secure",
    label: "Order Processing",
  },
];




export default function AboutPage() {
  const { siteSettings } = useWebsiteSettings();




  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-80 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />



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
        <div className="about-fade-up text-center">
          <span className="inline-block animate-pulse rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-300">
            About{" "}
            {siteSettings.site_name ||
              "NexoraMart"}
          </span>


          <h1 className="about-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            Shopping Made Simple,
            <br />
            Secure & Reliable
          </h1>


          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
            {siteSettings.site_name ||
              "NexoraMart"}{" "}
            is a modern online store designed to give
            customers a smooth shopping experience—from discovering
            products to placing orders and tracking deliveries.
          </p>
        </div>



        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutStats.map((stat, index) => (
            <div
              key={stat.label}
              className="about-fade-up rounded-3xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/20"
              style={{
                animationDelay: `${index * 120}ms`,
              }}
            >
              <p className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
                {stat.value}
              </p>


              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>



        <section className="mt-20">
          <div className="about-fade-up text-center">
            <h2 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-4xl font-black text-transparent">
              Why Shop With Us?
            </h2>


            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              We combine a clean shopping experience with reliable
              order handling and customer-focused support.
            </p>
          </div>


          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {aboutFeatures.map(
              (feature, index) => (
                <div
                  key={feature.title}
                  className={`about-fade-up group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${feature.gradient} p-8 shadow-2xl ${feature.glow} transition duration-500 hover:-translate-y-3 hover:scale-[1.02]`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/20 blur-2xl transition duration-500 group-hover:scale-150" />


                  <div className="relative">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm transition duration-500 group-hover:animate-bounce">
                      {feature.icon}
                    </div>


                    <h3 className="mt-6 text-2xl font-black text-white">
                      {feature.title}
                    </h3>


                    <p className="mt-3 text-white/85">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>



        <section className="about-fade-up mt-20 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                Our Mission
              </h2>


              <p className="mt-5 text-slate-300">
                Our mission is to make online shopping simple,
                transparent, and enjoyable. We want every customer to
                easily find products, understand what they are buying,
                place orders confidently, and track their purchase
                until delivery.
              </p>


              <p className="mt-4 text-slate-400">
                We continue improving{" "}
                {siteSettings.site_name ||
                  "NexoraMart"}{" "}
                with better product
                information, customer reviews, order tracking, and
                support options.
              </p>


              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/"
                  className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-7 py-3 font-bold text-white transition duration-300 hover:scale-105"
                >
                  Shop Now
                </Link>


                <Link
                  to="/support"
                  className="rounded-xl border border-white/20 bg-white/5 px-7 py-3 font-bold text-white transition duration-300 hover:scale-105 hover:bg-white/10"
                >
                  Contact Support
                </Link>
              </div>
            </div>


            <div className="rounded-3xl bg-gradient-to-br from-blue-600/20 via-fuchsia-600/20 to-purple-600/20 p-8">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    🛍️
                  </span>


                  <p className="font-bold text-white">
                    Easy Product Discovery
                  </p>
                </div>


                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    🧾
                  </span>


                  <p className="font-bold text-white">
                    Clear Order Invoices
                  </p>
                </div>


                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    📍
                  </span>


                  <p className="font-bold text-white">
                    Real-Time Order Tracking
                  </p>
                </div>


                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    🤝
                  </span>


                  <p className="font-bold text-white">
                    Customer-First Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        <section className="about-fade-up mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-600 p-10 text-center shadow-2xl shadow-fuchsia-500/30">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Ready to Explore{" "}
            {siteSettings.site_name ||
              "NexoraMart"}
            ?
          </h2>


          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Browse our latest products, add items to your cart, and
            enjoy a simple checkout experience.
          </p>


          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="rounded-xl bg-white px-7 py-3 font-bold text-slate-900 transition duration-300 hover:scale-105"
            >
              Start Shopping
            </Link>


            <Link
              to="/track-order"
              className="rounded-xl border border-white/40 bg-white/10 px-7 py-3 font-bold text-white transition duration-300 hover:scale-105 hover:bg-white/20"
            >
              Track Order
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}