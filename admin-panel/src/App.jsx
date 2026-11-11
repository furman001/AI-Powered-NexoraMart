import { Component } from "react";
import AnalyticsPage from "./AnalyticsPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./CartContext";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import CategoriesPage from "./CategoriesPage";
import ProductsPage from "./ProductsPage";
import StorefrontPage from "./StorefrontPage";
import ProductDetailPage from "./ProductDetailPage";
import CartPage from "./CartPage";
import AdminOrdersPage from "./AdminOrdersPage";
import OrderDetailPage from "./OrderDetailPage";
import InvoicesPage from "./InvoicesPage";
import CheckoutPage from "./CheckoutPage";
import OrderSuccessPage from "./OrderSuccessPage";
import TrackOrderPage from "./TrackOrderPage";
import OrderConfirmationPage from "./OrderConfirmationPage";
import SupportPage from "./SupportPage";
import AboutPage from "./AboutPage";
import CustomerInvoicePage from "./CustomerInvoicePage";
import MyOrdersPage from "./MyOrdersPage";
import PaymentSuccessPage from "./PaymentSuccessPage";
import PaymentCancelledPage from "./PaymentCancelledPage";
import { WishlistProvider } from "./WishlistContext";
import WishlistPage from "./WishlistPage";
import ReviewsPage from "./ReviewsPage";
import QuestionsPage from "./QuestionsPage";
import SupportMessagesPage from "./SupportMessagesPage";
import WebsiteSettingsPage from "./WebsiteSettingsPage";




class ErrorBoundary extends Component {
  constructor(props) {
    super(props);



    this.state = {
      error: null,
    };
  }



  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }



  componentDidCatch(error, errorInfo) {
    console.error("App error:", error, errorInfo);
  }



  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-950 p-10 text-white">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
            <h1 className="text-2xl font-black text-red-300">
              Application Error
            </h1>



            <p className="mt-4 text-slate-300">
              The page could not load because of a JavaScript error.
            </p>



            <pre className="mt-6 overflow-auto rounded-2xl bg-slate-900 p-5 text-sm text-red-300">
              {String(this.state.error)}
            </pre>



            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }



    return this.props.children;
  }
}





export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path="/" element={<StorefrontPage />} />


                <Route path="/about" element={<AboutPage />} />


                <Route path="/support" element={<SupportPage />} />


                <Route path="/cart" element={<CartPage />} />


                <Route
                  path="/wishlist"
                  element={<WishlistPage />}
                />


                <Route
                  path="/product/:slug"
                  element={<ProductDetailPage />}
                />


                <Route
                  path="/checkout"
                  element={<CheckoutPage />}
                />


                <Route
                  path="/payment-success"
                  element={<PaymentSuccessPage />}
                />


                <Route
                  path="/payment-cancelled"
                  element={<PaymentCancelledPage />}
                />


                <Route
                  path="/order-success/:orderId"
                  element={<OrderSuccessPage />}
                />


                <Route
                  path="/track-order"
                  element={<TrackOrderPage />}
                />


                <Route
                  path="/order-confirmation/:orderId"
                  element={<OrderConfirmationPage />}
                />


                <Route path="/login" element={<LoginPage />} />


                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute>
                      <CategoriesPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <ProductsPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrdersPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/invoices"
                  element={
                    <ProtectedRoute>
                      <InvoicesPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute>
                      <ReviewsPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/admin/questions"
                  element={
                    <ProtectedRoute>
                      <QuestionsPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/admin/support-messages"
                  element={
                    <ProtectedRoute>
                      <SupportMessagesPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <WebsiteSettingsPage />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/admin"
                  element={
                    <Navigate to="/products" replace />
                  }
                />


                <Route
                  path="/invoice/:orderId"
                  element={<CustomerInvoicePage />}
                />


                <Route
                  path="/my-orders"
                  element={<MyOrdersPage />}
                />


                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}