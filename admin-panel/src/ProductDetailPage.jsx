import Product3DViewer from "./Product3DViewer";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "./api";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";




export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const navigate = useNavigate();




  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");




  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState("");
  const [questionSuccess, setQuestionSuccess] = useState("");




  const [relatedProducts, setRelatedProducts] = useState([]);



  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] =
    useState([]);




  useEffect(() => {
    if (!slug) return;



    let isActive = true;



    async function loadProduct() {
      try {
        const response = await api.get(
          `/catalog/products/${slug}`
        );



        if (!isActive) return;



        setProduct(response.data);



        if (response.data.images?.length > 0) {
          setSelectedImage(response.data.images[0]);
        } else if (response.data.image_url) {
          setSelectedImage(response.data.image_url);
        }



        await loadReviews(response.data.id);
        await loadQuestions(response.data.id);
        await loadFrequentlyBoughtTogether(response.data.id);
      } catch (loadError) {
        if (isActive) {
          setError("Product not found");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }



    loadProduct();



    return () => {
      isActive = false;
    };
  }, [slug]);




  useEffect(() => {
    if (!slug) return;



    let isActive = true;



    async function loadRelatedProducts() {
      try {
        const response = await api.get(
          `/catalog/products/${slug}/related`
        );



        if (!isActive) return;



        setRelatedProducts(response.data);
      } catch (relatedError) {
        if (isActive) {
          setRelatedProducts([]);
        }
      }
    }



    loadRelatedProducts();



    return () => {
      isActive = false;
    };
  }, [slug]);




  async function loadReviews(productId) {
    try {
      const response = await api.get(
        `/products/${productId}/reviews`
      );



      setReviews(response.data || []);
    } catch (reviewLoadError) {
      console.error(reviewLoadError);
    }
  }




  async function loadQuestions(productId) {
    try {
      const response = await api.get(
        `/questions/products/${productId}`
      );



      setQuestions(response.data || []);
    } catch (questionLoadError) {
      console.error(questionLoadError);
    }
  }




  async function loadFrequentlyBoughtTogether(productId) {
    try {
      const response = await api.get(
        `/recommendations/products/${productId}/frequently-bought-together`
      );



      setFrequentlyBoughtTogether(response.data || []);
    } catch (recommendationError) {
      setFrequentlyBoughtTogether([]);
    }
  }




  async function handleReviewSubmit(event) {
    event.preventDefault();



    setReviewError("");
    setReviewSuccess("");
    setReviewLoading(true);



    try {
      await api.post(`/products/${product.id}/reviews`, {
        customer_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });



      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
      setReviewSuccess(
        "Thank you! Your review has been submitted."
      );



      await loadReviews(product.id);



      const productResponse = await api.get(
        `/catalog/products/${slug}`
      );



      setProduct(productResponse.data);
    } catch (reviewSubmitError) {
      setReviewError(
        reviewSubmitError.response?.data?.detail ||
          "Could not submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  }




  async function handleQuestionSubmit(event) {
    event.preventDefault();



    setQuestionError("");
    setQuestionSuccess("");
    setQuestionLoading(true);



    try {
      await api.post(`/questions/products/${product.id}`, {
        customer_name: questionName,
        question_text: questionText,
      });



      setQuestionName("");
      setQuestionText("");
      setQuestionSuccess(
        "Thank you! Your question has been submitted."
      );
    } catch (questionSubmitError) {
      setQuestionError(
        questionSubmitError.response?.data?.detail ||
          "Could not submit question"
      );
    } finally {
      setQuestionLoading(false);
    }
  }




  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading product...
      </div>
    );
  }




  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 text-white">
        <p className="text-2xl font-bold text-red-400">
          {error}
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




  const descriptionLines = product.description
    ? product.description
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
    : [];


  const modelUrl =
    product.model_url ||
    "https://modelviewer.dev/shared-assets/models/Astronaut.glb";


  const averageRating = Number(
    product.average_rating || 0
  );


  const reviewCount = Number(
    product.review_count || 0
  );




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
            Back to Store
          </Link>
        </div>
      </header>




      <main className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="product-fade-up grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-[450px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-[450px] items-center justify-center bg-slate-800 text-slate-500">
                  No image
                </div>
              )}
            </div>



            {product.images && product.images.length > 1 && (
              <div className="mt-5 grid grid-cols-4 gap-4">
                {product.images.map((imageUrl, index) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`product-fade-up overflow-hidden rounded-2xl border-2 transition duration-300 hover:scale-105 ${
                      selectedImage === imageUrl
                        ? "border-fuchsia-500 shadow-lg shadow-fuchsia-500/30"
                        : "border-white/10 hover:border-cyan-400/40"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}



            {product.video_url && (
              <video
                src={product.video_url}
                controls
                className="product-fade-up mt-8 w-full rounded-3xl border border-white/10"
              />
            )}



            <div className="mt-8">
              <Product3DViewer
                modelUrl={modelUrl}
                productName={product.name}
              />
            </div>
          </div>




          <div>
            <span className="inline-block animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Product Details
            </span>



            <h1 className="product-text-glow mt-5 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
              {product.name}
            </h1>



            <div className="mt-5 flex items-center gap-3">
              <span className="text-xl font-bold text-yellow-400">
                {"★".repeat(
                  Math.round(averageRating)
                )}
                {"☆".repeat(
                  5 - Math.round(averageRating)
                )}
              </span>



              <span className="text-sm text-slate-400">
                {averageRating.toFixed(1)} / 5 ·{" "}
                {reviewCount} review
                {reviewCount === 1 ? "" : "s"}
              </span>
            </div>



            <p className="mt-6 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-4xl font-black text-transparent">
              Rs {Number(product.price || 0).toLocaleString()}
            </p>



            <div className="mt-5">
              <span
                className={`inline-block rounded-full px-5 py-2 text-sm font-bold ${
                  product.stock > 0
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
                }`}
              >
                {product.stock > 0
                  ? `In Stock: ${product.stock}`
                  : "Out of Stock"}
              </span>
            </div>



            {product.stock > 0 && product.stock <= 5 && (
              <div className="mt-4">
                <span className="inline-block animate-pulse rounded-full bg-gradient-to-r from-red-600 to-orange-600 px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
                  Only {product.stock} left
                </span>
              </div>
            )}




            <div className="product-fade-up mt-7 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-5 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
                Product Description
              </h2>



              {descriptionLines.length === 0 ? (
                <p className="text-slate-500">
                  No description available.
                </p>
              ) : (
                <div className="space-y-3">
                  {descriptionLines.map((line, index) => {
                    const isHeading =
                      line.endsWith(":") ||
                      line.startsWith("#") ||
                      line.startsWith("**");



                    const cleanLine = line
                      .replace(/^#+\s*/, "")
                      .replace(/\*\*/g, "");



                    return (
                      <p
                        key={index}
                        className={
                          isHeading
                            ? "text-lg font-bold text-white"
                            : "text-slate-300"
                        }
                      >
                        {cleanLine}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>




            {product.stock > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    isInWishlist(product.id)
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  className={`mb-4 w-full rounded-2xl border py-4 text-lg font-bold transition duration-300 hover:scale-[1.02] ${
                    isInWishlist(product.id)
                      ? "border-fuchsia-500/50 bg-fuchsia-500/20 text-fuchsia-300"
                      : "border-white/10 bg-white/5 text-white hover:border-fuchsia-400/40"
                  }`}
                >
                  {isInWishlist(product.id)
                    ? "♥ Saved to Wishlist"
                    : "♡ Add to Wishlist"}
                </button>


                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    navigate("/cart");
                  }}
                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-[1.02]"
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <div className="mt-8">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl bg-white/10 py-4 text-lg font-bold text-slate-400"
                >
                  Currently Unavailable
                </button>



                <p className="mt-3 text-center text-sm text-slate-500">
                  This product is currently out of stock.
                </p>
              </div>
            )}
          </div>
        </div>




        {frequentlyBoughtTogether.length > 0 && (
          <section className="product-fade-up mt-16">
            <h2 className="bg-gradient-to-r from-emerald-300 via-cyan-400 to-blue-400 bg-clip-text text-3xl font-black text-transparent">
              Frequently Bought Together
            </h2>



            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {frequentlyBoughtTogether.map(
                (recommendedProduct, index) => (
                  <Link
                    key={recommendedProduct.id}
                    to={`/product/${recommendedProduct.slug}`}
                    className="product-fade-up group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/25"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-slate-800">
                      {recommendedProduct.image_url ? (
                        <img
                          src={recommendedProduct.image_url}
                          alt={recommendedProduct.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          🛍️
                        </div>
                      )}
                    </div>



                    <div className="p-5">
                      <h3 className="line-clamp-1 text-lg font-bold text-white">
                        {recommendedProduct.name}
                      </h3>



                      <p className="mt-3 bg-gradient-to-r from-emerald-300 to-cyan-400 bg-clip-text text-xl font-black text-transparent">
                        Rs{" "}
                        {Number(
                          recommendedProduct.price || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>
        )}




        <section className="product-fade-up mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
            Questions & Answers
          </h2>



          <form
            onSubmit={handleQuestionSubmit}
            className="mt-8 space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input
                value={questionName}
                onChange={(event) =>
                  setQuestionName(event.target.value)
                }
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />


              <input
                value={questionText}
                onChange={(event) =>
                  setQuestionText(event.target.value)
                }
                placeholder="Ask a question about this product"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>



            {questionError && (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {questionError}
              </p>
            )}



            {questionSuccess && (
              <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {questionSuccess}
              </p>
            )}



            <button
              type="submit"
              disabled={questionLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 py-4 font-bold text-white shadow-2xl shadow-blue-500/30 transition duration-300 hover:scale-[1.02] disabled:opacity-60"
            >
              {questionLoading
                ? "Submitting..."
                : "Ask Question"}
            </button>
          </form>



          <div className="mt-12 space-y-5">
            <h3 className="text-2xl font-black text-white">
              {questions.length} Answered Question
              {questions.length === 1 ? "" : "s"}
            </h3>



            {questions.length === 0 ? (
              <p className="text-slate-400">
                No answered questions yet. Ask a question and our team
                will respond.
              </p>
            ) : (
              questions.map((question, index) => (
                <div
                  key={question.id}
                  className="product-fade-up rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/10"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 font-black">
                      Q
                    </div>


                    <div>
                      <p className="font-bold text-white">
                        {question.customer_name}
                      </p>


                      <p className="mt-2 text-slate-300">
                        {question.question_text}
                      </p>
                    </div>
                  </div>


                  {(question.answers || []).map((answer) => (
                    <div
                      key={answer.id}
                      className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 font-black">
                          A
                        </div>


                        <p className="font-bold text-emerald-300">
                          {answer.answered_by}
                        </p>
                      </div>


                      <p className="mt-3 text-slate-300">
                        {answer.answer_text}
                      </p>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </section>




        <section className="product-fade-up mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-3xl font-black text-transparent">
            Customer Reviews
          </h2>



          <form
            onSubmit={handleReviewSubmit}
            className="mt-8 space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input
                value={reviewName}
                onChange={(event) =>
                  setReviewName(event.target.value)
                }
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
                required
              />


              <select
                value={reviewRating}
                onChange={(event) =>
                  setReviewRating(Number(event.target.value))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-fuchsia-400 focus:outline-none"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>



            <textarea
              value={reviewComment}
              onChange={(event) =>
                setReviewComment(event.target.value)
              }
              placeholder="Write your review"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
            />



            {reviewError && (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {reviewError}
              </p>
            )}



            {reviewSuccess && (
              <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {reviewSuccess}
              </p>
            )}



            <button
              type="submit"
              disabled={reviewLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 py-4 font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-[1.02] disabled:opacity-60"
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </form>



          <div className="mt-12 space-y-5">
            <h3 className="text-2xl font-black text-white">
              {reviews.length} Review
              {reviews.length === 1 ? "" : "s"}
            </h3>



            {reviews.length === 0 ? (
              <p className="text-slate-400">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="product-fade-up rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-fuchsia-400/40 hover:bg-white/10"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-bold text-white">
                      {review.customer_name}
                    </p>



                    <p className="font-bold text-yellow-400">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>
                  </div>



                  {review.comment && (
                    <p className="mt-3 text-slate-300">
                      {review.comment}
                    </p>
                  )}



                  <p className="mt-3 text-xs text-slate-500">
                    {review.created_at &&
                      new Date(
                        review.created_at
                      ).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>




        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="product-fade-up bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-3xl font-black text-transparent">
              Related Products
            </h2>



            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(
                (relatedProduct, index) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.slug}`}
                    className="product-fade-up group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-fuchsia-400/40 hover:shadow-2xl hover:shadow-fuchsia-500/25"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-slate-800">
                      {relatedProduct.image_url ? (
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          🛍️
                        </div>
                      )}
                    </div>



                    <div className="p-5">
                      <h3 className="line-clamp-1 text-lg font-bold text-white">
                        {relatedProduct.name}
                      </h3>



                      <p className="mt-3 bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-xl font-black text-transparent">
                        Rs{" "}
                        {Number(
                          relatedProduct.price || 0
                        ).toLocaleString()}
                      </p>



                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm font-bold text-yellow-400">
                          {"★".repeat(
                            Math.round(
                              relatedProduct.average_rating || 0
                            )
                          )}
                          {"☆".repeat(
                            5 -
                              Math.round(
                                relatedProduct.average_rating || 0
                              )
                          )}
                        </span>



                        <span className="text-xs text-slate-500">
                          {Number(
                            relatedProduct.average_rating || 0
                          ).toFixed(1)}{" "}
                          / 5
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}