import { Link } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";



export default function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();



  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-blue-600/25 blur-3xl" />



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



      <main className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="bg-gradient-to-r from-pink-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent">
            My Wishlist
          </h1>


          <p className="mt-4 text-slate-300">
            Save products you love and buy them later.
          </p>
        </div>



        {wishlistItems.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-14 text-center backdrop-blur-xl">
            <div className="text-6xl">💖</div>


            <h2 className="mt-6 text-2xl font-black text-white">
              Your wishlist is empty
            </h2>


            <p className="mt-3 text-slate-400">
              Tap the heart icon on any product to save it here.
            </p>


            <Link
              to="/"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-8 py-3 font-bold text-white transition duration-300 hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              <button
                type="button"
                onClick={clearWishlist}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-semibold text-red-300 transition duration-300 hover:scale-105 hover:bg-red-500/20"
              >
                Clear Wishlist
              </button>
            </div>


            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-fuchsia-400/40"
                >
                  <Link
                    to={`/product/${product.slug}`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-slate-800">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          🛍️
                        </div>
                      )}
                    </div>
                  </Link>


                  <div className="p-5">
                    <Link
                      to={`/product/${product.slug}`}
                    >
                      <h2 className="line-clamp-1 text-lg font-bold text-white">
                        {product.name}
                      </h2>
                    </Link>


                    <p className="mt-3 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-2xl font-black text-transparent">
                      Rs{" "}
                      {Number(
                        product.price
                      ).toLocaleString()}
                    </p>


                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 py-3 font-bold text-white transition duration-300 hover:scale-105 disabled:opacity-60"
                      >
                        {product.stock > 0
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(product.id)
                        }
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 font-bold text-red-300 transition duration-300 hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}