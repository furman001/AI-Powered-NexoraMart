import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";




export default function StorefrontPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addedProductId, setAddedProductId] = useState(null);
  const { cartCount, addToCart } = useCart();
  const { wishlistCount } = useWishlist();




  const [flashSaleEndTime] = useState(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 6);
    endTime.setMinutes(0);
    endTime.setSeconds(0);
    return endTime.getTime();
  });


  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });


  const [purchaseNotification, setPurchaseNotification] =
    useState(null);




  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesResponse = await api.get("/categories/");
        setCategories(categoriesResponse.data || []);
      } catch (loadError) {
        console.error(loadError);
      }
    }


    loadCategories();
  }, []);




  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");


      try {
        const params = {
          page: currentPage,
          limit: 12,
          in_stock_only: inStockOnly,
          sort: sortBy,
        };


        if (search) {
          params.search = search;
        }


        if (selectedCategoryId) {
          params.category_id = selectedCategoryId;
        }


        if (minPrice !== "") {
          params.min_price = Number(minPrice);
        }


        if (maxPrice !== "") {
          params.max_price = Number(maxPrice);
        }


        const countResponse = await api.get(
          "/catalog/products/count",
          { params }
        );


        const totalProducts = Number(countResponse.data || 0);


        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(totalProducts / 12)
        );


        setTotalPages(calculatedTotalPages);


        const response = await api.get("/catalog/products", {
          params,
        });


        setProducts(response.data || []);
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load products");
      } finally {
        setLoading(false);
      }
    }


    loadProducts();
  }, [
    search,
    selectedCategoryId,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    currentPage,
  ]);




  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategoryId,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);




  useEffect(() => {
    function updateCountdown() {
      const difference = flashSaleEndTime - Date.now();


      if (difference <= 0) {
        setTimeLeft({
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }


      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);


      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }


    updateCountdown();


    const countdownInterval = setInterval(updateCountdown, 1000);


    return () => clearInterval(countdownInterval);
  }, [flashSaleEndTime]);




  useEffect(() => {
    const purchaseNotifications = [
      {
        name: "A customer",
        city: "Lahore",
        product: "Wireless Headset",
      },
      {
        name: "A customer",
        city: "Karachi",
        product: "Smart Watch",
      },
      {
        name: "A customer",
        city: "Islamabad",
        product: "Bluetooth Speaker",
      },
      {
        name: "A customer",
        city: "Multan",
        product: "Gaming Mouse",
      },
    ];


    let notificationIndex = 0;


    function showNotification() {
      const notification = purchaseNotifications[notificationIndex];


      setPurchaseNotification(notification);


      notificationIndex =
        (notificationIndex + 1) % purchaseNotifications.length;


      setTimeout(() => {
        setPurchaseNotification(null);
      }, 6000);
    }


    showNotification();


    const notificationInterval = setInterval(showNotification, 15000);


    return () => clearInterval(notificationInterval);
  }, []);




  useEffect(() => {
    if (!addedProductId) {
      return;
    }


    const timeout = setTimeout(() => {
      setAddedProductId(null);
    }, 2000);


    return () => clearTimeout(timeout);
  }, [addedProductId]);




  function goToPage(pageNumber) {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      pageNumber === currentPage
    ) {
      return;
    }


    setCurrentPage(pageNumber);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }




  function handleAddToCart(product) {
    if (!product || !product.stock || product.stock <= 0) {
      return;
    }


    addToCart(product);
    setAddedProductId(product.id);
  }




  function getProductImage(product) {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }


    if (product.image_url) {
      return product.image_url;
    }


    return null;
  }




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


          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:border-cyan-400/40"
            >
              About
            </Link>


            <Link
              to="/support"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:border-cyan-400/40"
            >
              Support
            </Link>


            <Link
              to="/my-orders"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:border-cyan-400/40"
            >
              My Orders
            </Link>


            <Link
              to="/track-order"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:border-cyan-400/40"
            >
              Track Order
            </Link>


            <Link
              to="/wishlist"
              className="relative rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:border-fuchsia-400/40"
            >
              Wishlist


              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-fuchsia-600 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>


            <Link
              to="/cart"
              className="relative rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105"
            >
              Cart


              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>


            <Link
              to="/products"
              className="rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>




      <main className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="store-fade-up mb-10 overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 p-6 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <span className="inline-block animate-pulse rounded-full bg-gradient-to-r from-red-600 to-orange-600 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                Flash Sale
              </span>


              <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
                Limited-Time Offers
              </h2>


              <p className="mt-2 text-slate-300">
                Hurry! These deals are available for a short time only.
              </p>
            </div>


            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
                <p className="text-2xl font-black text-yellow-300">
                  {timeLeft.hours}
                </p>


                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Hours
                </p>
              </div>


              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
                <p className="text-2xl font-black text-yellow-300">
                  {timeLeft.minutes}
                </p>


                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Minutes
                </p>
              </div>


              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center">
                <p className="text-2xl font-black text-yellow-300">
                  {timeLeft.seconds}
                </p>


                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Seconds
                </p>
              </div>
            </div>
          </div>
        </div>




        <div className="store-fade-up mb-14 text-center">
          <span className="inline-block animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Welcome to NexoraMart
          </span>


          <h1 className="store-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            Featured Products
          </h1>


          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Discover high-quality products with fast delivery, secure
            ordering, and a smooth shopping experience.
          </p>


          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/about"
              className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-7 py-3 font-bold text-white transition duration-300 hover:scale-105"
            >
              Learn About Us
            </Link>


            <Link
              to="/support"
              className="rounded-xl border border-white/20 bg-white/5 px-7 py-3 font-bold text-white transition duration-300 hover:scale-105 hover:bg-white/10"
            >
              Customer Support
            </Link>
          </div>
        </div>




        <div className="store-fade-up mb-12 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none md:col-span-2"
            />


            <select
              value={selectedCategoryId}
              onChange={(event) =>
                setSelectedCategoryId(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="">All Categories</option>


              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>


          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min Price"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />


            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max Price"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />


            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low_to_high">
                Price: Low to High
              </option>
              <option value="price_high_to_low">
                Price: High to Low
              </option>
              <option value="rating_high_to_low">
                Rating: High to Low
              </option>
            </select>


            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) =>
                  setInStockOnly(event.target.checked)
                }
                className="size-5 accent-cyan-400"
              />


              <span className="text-sm font-semibold text-white">
                In Stock Only
              </span>
            </label>
          </div>
        </div>




        {loading && (
          <div className="analytics-float text-center text-xl font-bold text-slate-300">
            Loading products...
          </div>
        )}


        {error && (
          <div className="store-fade-up mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-300">
            {error}
          </div>
        )}


        {!loading && products.length === 0 && !error && (
          <div className="store-fade-up rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <div className="text-5xl">🛍️</div>


            <p className="mt-4 text-xl font-bold text-slate-300">
              No products found
            </p>


            <p className="mt-2 text-slate-500">
              Try a different search term, price range, or category.
            </p>
          </div>
        )}


        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const productImage = getProductImage(product);
            const rating = Number(product.average_rating || 0);
            const reviewCount = Number(product.review_count || 0);


            return (
              <div
                key={product.id}
                className="store-fade-up group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-fuchsia-400/40 hover:shadow-2xl hover:shadow-fuchsia-500/25"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-fuchsia-500/20 blur-2xl transition duration-500 group-hover:scale-150" />


                <Link to={`/product/${product.slug}`}>
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-slate-800 text-slate-500">
                      No image
                    </div>
                  )}
                </Link>


                <div className="relative p-6">
                  <Link to={`/product/${product.slug}`}>
                    <h2 className="text-lg font-bold text-white">
                      {product.name}
                    </h2>
                  </Link>


                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= Math.round(rating)
                              ? "text-yellow-400"
                              : "text-slate-600"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>


                    <span className="text-xs font-semibold text-slate-400">
                      {rating.toFixed(1)}
                    </span>


                    <span className="text-xs text-slate-500">
                      ({reviewCount} reviews)
                    </span>
                  </div>


                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="mt-3 inline-block animate-pulse rounded-full bg-gradient-to-r from-red-600 to-orange-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Only {product.stock} left
                    </span>
                  )}


                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {product.description || "No description"}
                  </p>


                  <p className="mt-5 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-2xl font-black text-transparent">
                    Rs {Number(product.price || 0).toLocaleString()}
                  </p>


                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.stock || product.stock <= 0}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-sm font-bold text-white transition duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {addedProductId === product.id
                        ? "Added ✓"
                        : "Add to Cart"}
                    </button>


                    <Link
                      to={`/product/${product.slug}`}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition duration-300 hover:scale-105 hover:border-fuchsia-400/40"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>




        {!loading && products.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition duration-300 hover:scale-105 disabled:opacity-40"
            >
              Previous
            </button>


            <span className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-bold text-cyan-300">
              Page {currentPage} of {totalPages}
            </span>


            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition duration-300 hover:scale-105 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}


        {purchaseNotification && (
          <div className="purchase-notification fixed bottom-6 left-6 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-fuchsia-500/20 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-xl">
                🛍️
              </div>


              <div>
                <p className="text-sm font-bold text-white">
                  {purchaseNotification.name} from{" "}
                  {purchaseNotification.city}
                </p>


                <p className="text-xs text-slate-400">
                  just purchased {purchaseNotification.product}
                </p>


                <p className="mt-1 text-xs text-emerald-400">
                  A few minutes ago
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}