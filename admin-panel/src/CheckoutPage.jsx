import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import api from "./api";




const FREE_DELIVERY_LIMIT = 5000;
const DELIVERY_FEE = 250;




export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();



  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    "cash_on_delivery"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);




  const deliveryFee =
    cartTotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;


  const orderTotal = cartTotal + deliveryFee;




  function validateCheckoutForm() {
    if (!fullName.trim()) {
      return "Please enter your full name.";
    }


    if (!phone.trim()) {
      return "Please enter your phone number.";
    }


    if (!/^[0-9+\-\s()]{10,20}$/.test(phone.trim())) {
      return "Please enter a valid phone number.";
    }


    if (!email.trim()) {
      return "Please enter your email address.";
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }


    if (!address.trim()) {
      return "Please enter your complete shipping address.";
    }


    if (!city.trim()) {
      return "Please enter your city.";
    }


    return "";
  }




  async function handleCheckout(event) {
    event.preventDefault();


    const validationError = validateCheckoutForm();


    if (validationError) {
      setError(validationError);
      return;
    }


    setError("");
    setLoading(true);



    try {
      const payload = {
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        shipping_address: address.trim(),
        shipping_city: city.trim(),
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };



      const response = await api.post("/orders/", payload);



      const placedOrderId =
        response.data?.id ??
        response.data?.order_id ??
        response.data?.order?.id;



      if (!placedOrderId) {
        throw new Error("Order ID was not returned");
      }



      setPlacedOrder({
        id: placedOrderId,
        paymentMethod,
      });



      clearCart();
    } catch (checkoutError) {
      setError(
        checkoutError.response?.data?.detail ||
          checkoutError.message ||
          "Could not place order"
      );
    } finally {
      setLoading(false);
    }
  }




  async function payOnline() {
    if (!placedOrder) {
      return;
    }



    setError("");
    setPaymentLoading(true);



    try {
      const response = await api.post(
        "/payments/create-checkout-session",
        {
          order_id: placedOrder.id,
        }
      );



      const checkoutUrl = response.data?.checkout_url;



      if (!checkoutUrl) {
        throw new Error("Payment URL was not returned");
      }



      window.location.href = checkoutUrl;
    } catch (paymentError) {
      setError(
        paymentError.response?.data?.detail ||
          paymentError.message ||
          "Could not start online payment"
      );



      setPaymentLoading(false);
    }
  }




  function continueWithCashOnDelivery() {
    if (!placedOrder) {
      return;
    }



    navigate(
      `/order-confirmation/${placedOrder.id}`
    );
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



          <Link
            to="/cart"
            className="rounded-xl bg-white/10 px-5 py-2 font-semibold text-white transition duration-300 hover:scale-105 hover:bg-white/20"
          >
            Back to Cart
          </Link>
        </div>
      </header>




      <main className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="checkout-fade-up mb-12 text-center">
          <span className="inline-block animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Secure Checkout
          </span>



          <h1 className="checkout-text-glow mt-6 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            Complete Your Order
          </h1>



          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Enter your shipping details to place your order. Your
            products and order total are shown on the right.
          </p>
        </div>




        {placedOrder ? (
          <div className="checkout-fade-up mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-10 text-center backdrop-blur-xl">
            <div className="text-6xl">🎉</div>



            <h2 className="mt-6 text-3xl font-black text-emerald-300">
              Order Created Successfully
            </h2>



            <p className="mt-4 text-slate-300">
              Choose how you would like to complete this order.
            </p>



            <p className="mt-4 text-sm text-slate-400">
              Order ID: {placedOrder.id}
            </p>



            {error && (
              <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </p>
            )}



            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={payOnline}
                disabled={paymentLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 py-4 text-lg font-bold text-white shadow-2xl shadow-emerald-500/30 transition duration-300 hover:scale-[1.02] disabled:opacity-60"
              >
                {paymentLoading
                  ? "Opening Secure Payment..."
                  : "Pay Online with Card"}
              </button>



              <button
                type="button"
                onClick={continueWithCashOnDelivery}
                className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-[1.02]"
              >
                Continue with Cash on Delivery
              </button>
            </div>



            <p className="mt-6 text-xs text-slate-500">
              Online payments are processed securely by Stripe.
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="checkout-fade-up rounded-3xl border border-white/10 bg-white/5 p-14 text-center backdrop-blur-xl">
            <div className="text-6xl">🛒</div>



            <h2 className="mt-6 text-2xl font-black text-white">
              Your cart is empty
            </h2>



            <p className="mt-3 text-slate-400">
              Add products to your cart before checkout.
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
            <form
              onSubmit={handleCheckout}
              className="checkout-fade-up rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:col-span-2"
            >
              <h2 className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
                Shipping Details
              </h2>



              <div className="mt-8 space-y-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-400">
                    Full Name
                  </span>



                  <input
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
                    required
                  />
                </label>



                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-400">
                    Phone Number
                  </span>



                  <input
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="Enter your phone number"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
                    required
                  />
                </label>



                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-400">
                    Email Address
                  </span>



                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
                    required
                  />
                </label>



                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-400">
                    Shipping Address
                  </span>



                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="Enter your complete shipping address"
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
                    required
                  />
                </label>



                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-400">
                    City
                  </span>



                  <input
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    placeholder="Enter your city"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
                    required
                  />
                </label>
              </div>



              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Payment Method
                </h3>



                <div className="mt-4 space-y-4">
                  <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-fuchsia-400/40">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash_on_delivery"
                      checked={
                        paymentMethod === "cash_on_delivery"
                      }
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      className="size-5 accent-fuchsia-500"
                    />


                    <div>
                      <p className="font-bold text-white">
                        Cash on Delivery
                      </p>


                      <p className="text-sm text-slate-400">
                        Pay when your order is delivered.
                      </p>
                    </div>
                  </label>


                  <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/40">
                    <input
                      type="radio"
                      name="payment_method"
                      value="online_payment"
                      checked={
                        paymentMethod === "online_payment"
                      }
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      className="size-5 accent-cyan-400"
                    />


                    <div>
                      <p className="font-bold text-white">
                        Pay Online with Card
                      </p>


                      <p className="text-sm text-slate-400">
                        Secure online payment through Stripe.
                      </p>
                    </div>
                  </label>
                </div>
              </div>



              {error && (
                <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </p>
              )}



              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 py-4 text-lg font-bold text-white shadow-2xl shadow-fuchsia-500/30 transition duration-300 hover:scale-[1.02] disabled:opacity-60"
              >
                {loading
                  ? "Creating Order..."
                  : "Continue to Payment"}
              </button>
            </form>




            <div className="checkout-fade-up h-fit rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h2 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent">
                Order Summary
              </h2>



              <div className="mt-7 space-y-5">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="checkout-fade-up flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div>
                      <p className="font-bold text-white">
                        {item.name}
                      </p>



                      <p className="mt-1 text-sm text-slate-400">
                        {item.quantity} × Rs{" "}
                        {Number(item.price).toLocaleString()}
                      </p>
                    </div>



                    <p className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text font-black text-transparent">
                      Rs{" "}
                      {Number(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>



              <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
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



                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-400">
                      Free
                    </span>
                  ) : (
                    <span className="font-bold text-white">
                      Rs {deliveryFee.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>



              {deliveryFee > 0 && (
                <p className="mt-4 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
                  Add Rs{" "}
                  {(FREE_DELIVERY_LIMIT - cartTotal).toLocaleString()}{" "}
                  more to get free delivery.
                </p>
              )}



              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-lg font-black text-white">
                  Total
                </span>



                <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
                  Rs {Number(orderTotal).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}