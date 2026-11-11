import { Link } from "react-router-dom";
import { useCart } from "./CartContext";


export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();


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
            Continue Shopping
          </Link>
        </div>
      </header>


      <main className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="cart-fade-up mb-12 text-center">
          <span className="inline-block animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Your Selection
          </span>

          <h1 className="cart-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            Shopping Cart
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Review your products, update quantities, and continue to
            checkout.
          </p>
        </div>


        {cartItems.length === 0 ? (
          <div className="cart-fade-up rounded-3xl border border-white/10 bg-white/5 p-14 text-center backdrop-blur-xl">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-6 text-2xl font-black text-white">
              Your cart is empty
            </h2>

            <p className="mt-3 text-slate-400">
              Browse our featured products and add something you love.
            </p>

            <Link
              to="/"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-8 py-3 font-bold text-white transition duration-300 hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="cart-fade-up group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-fuchsia-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-fuchsia-500/20"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="h-28 w-full overflow-hidden rounded-2xl bg-slate-800 sm:w-28">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl">
                          🛍️
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-xl font-bold text-white transition hover:text-cyan-300"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-slate-400">
                        Rs{" "}
                        {Number(item.price).toLocaleString()} each
                      </p>

                      <div className="mt-5 flex items-center gap-4">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="flex size-8 items-center justify-center rounded-lg bg-white/10 font-bold text-white transition hover:scale-110 hover:bg-white/20"
                          >
                            −
                          </button>

                          <span className="w-8 text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="flex size-8 items-center justify-center rounded-lg bg-white/10 font-bold text-white transition hover:scale-110 hover:bg-white/20"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition duration-300 hover:scale-105 hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-2xl font-black text-transparent">
                        Rs{" "}
                        {Number(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={clearCart}
                className="cart-fade-up rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition duration-300 hover:scale-105 hover:bg-red-500/20"
              >
                Clear Cart
              </button>
            </div>


            <div className="cart-fade-up h-fit rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h2 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Items
                  </span>

                  <span className="font-bold text-white">
                    {cartItems.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Subtotal
                  </span>

                  <span className="font-bold text-white">
                    Rs{" "}
                    {Number(cartTotal).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Delivery
                  </span>

                  <span className="font-bold text-emerald-400">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-lg font-black text-white">
                  Total
                </span>

                <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
                  Rs {Number(cartTotal).toLocaleString()}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-8 block w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 py-4 text-center text-lg font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-[1.02]"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="mt-4 block w-full rounded-2xl border border-white/20 bg-white/5 py-3 text-center font-bold text-white transition duration-300 hover:scale-[1.02] hover:bg-white/10"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}