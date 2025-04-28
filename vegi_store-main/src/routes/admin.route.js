import { Route, Navigate } from "react-router-dom";
import SellerVerifyEmail from "../admin/container/SellerVerifyEmail";
import SellerResetPassword from "../admin/container/SellerResetPassword";
import SellOnLogin from "../admin/components/SellOnLogin";
import SellerRegister from "../admin/components/SellerRegister";
import SellerOtpVerify from "../admin/components/SellerOtpVerify";
import SellerGstDetails from "../admin/components/SellerGstDetails";
import Layout from "../admin/components/Layout";
import Dashboard from "../admin/components/Dashboard";
import Profile from "../admin/components/Profile";
import Product from "../admin/components/Product";
import Addproduct from "../admin/components/Addproduct";
import ViewOrderRejected from "../admin/components/ViewOrderRejected";
import ViewOrder from "../admin/components/ViewOrder";
import Home from "../admin/components/Home";
import Order from "../admin/components/Order";
import OrderHistory from "../admin/components/OrderHistory";
import Inventory from "../admin/components/Inventory";
import Payment from "../admin/components/Payment";
import ViewOrderHistoryPanding from "../admin/components/ViewOrderHistoryPanding";
import AddInventory from "../admin/components/AddInventory";
import EditInventory from "../admin/components/EditInventory";
import ViewInventory from "../admin/components/ViewInventory";
import ViewProducts from "../admin/components/ViewProducts";

// Create Protected Route component
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("token") !== null;

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/seller/sell-on-login" replace />;
  }

  // If authenticated, render the children components
  return children;
};

// Create a route for authenticated users trying to access login/register pages
const AuthRedirect = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const steps = localStorage.getItem("filledSteps");

  console.log("Authenticated:", isAuthenticated);
  console.log("Filled Steps:", steps);

  // If already authenticated, check filledSteps
  // if (isAuthenticated) {
  //   // Make sure to compare as strings or convert to numbers
  //   if (steps === "6" || parseInt(steps) === 6) {
  //     return <Navigate to="/seller/home" replace />;
  //   }
  //   return <Navigate to="/seller/seller-gst" replace />;
  // }

  // If not authenticated, render the login/register pages
  return children;
};

// List of all public auth routes that should redirect to profile if already logged in
const publicAuthRoutes = [
  { path: "/seller/sell-on-login", element: <SellOnLogin /> },
  { path: "/seller/seller-verify-email", element: <SellerVerifyEmail /> },
  { path: "/seller/seller-reset-password", element: <SellerResetPassword /> },
  { path: "/seller/seller-register", element: <SellerRegister /> },
  { path: "/seller/seller-register-otp", element: <SellerOtpVerify /> },
  { path: "/seller/seller-gst", element: <SellerGstDetails /> },
];

const adminRoute = [
  // Public routes (login, register, password reset) - all with AuthRedirect protection
  ...publicAuthRoutes.map((route) => (
    <Route
      path={route.path}
      element={<AuthRedirect>{route.element}</AuthRedirect>}
    />
  )),

  // Protected routes (require authentication)
  <Route
    path="/seller"
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="profile" element={<Profile />} />
    <Route path="product" element={<Product />} />
    <Route path="order" element={<Order />} />
    <Route path="orderhistory" element={<OrderHistory />} />
    <Route path="inventory" element={<Inventory />} />
    <Route path="payment" element={<Payment />} />
    <Route path="Edit-product/:id" element={<Addproduct />} />
    <Route path="Add-product" element={<Addproduct />} />
    <Route path="view-order/:id" element={<ViewOrder />} />
    <Route path="view-order-rejected" element={<ViewOrderRejected />} />
    <Route
      path="view-order-history-panding/:id"
      element={<ViewOrderHistoryPanding />}
    />
    <Route path="home" element={<Home />} />
    <Route path="addinventory" element={<AddInventory />} />
    <Route path="editinventory/:id" element={<EditInventory />} />
    <Route path="viewinventory/:id" element={<ViewInventory />} />
    <Route path="viewproducts/:id" element={<ViewProducts />} />
  </Route>,
];

export default adminRoute;
