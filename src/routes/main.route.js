// main.route.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchHeader from '../container/SearchHeader';
import Main from '../container/Main';
import Vegetable from '../container/Vegetable';
import Aboutus from '../container/Aboutus';
import Footer from '../container/Footer';
import ProductDetails from '../container/ProductDetails';
import FAQ from '../container/FAQ';
import PrivacyPolicy from '../container/PrivacyPolicy';
import Wishlist from '../container/Wishlist';
import MyAccount from '../container/MyAccount';
import Contactus from '../container/Contactus';
import PopularCategories from '../container/PopularCategories';
import Bestseller from '../container/Bestseller';
import LoadingSpinner from '../components/LoadingSpinner';
import Checkout from '../container/Checkout';
import AddcartDesign from '../container/AddcartDesign';
import Myorder from '../container/Myorder';
import MyAddresses from '../components/MyAddresses';
import Thankspopup from '../container/Thankspopup';
import SliderCaptcha from '../container/SliderCaptcha';

const MainRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Load verification status from localStorage and watch for changes
  useEffect(() => {
    const checkVerification = () => {
      const verified = localStorage.getItem('isVerified') === 'true';
      setIsVerified(verified);
    };

    // Initial check
    checkVerification();

    // Set up event listener for storage changes
    window.addEventListener('storage', checkVerification);

    return () => {
      window.removeEventListener('storage', checkVerification);
    };
  }, []);

  // Redux state (not strictly needed here but kept as in your original code)
  const auth = useSelector(state => state.auth);
  const cart = useSelector(state => state.addcart);
  const wishlist = useSelector(state => state.wishlist);

  // Load verification status from localStorage
  useEffect(() => {
    const verified = localStorage.getItem('isVerified') === 'true';
    setIsVerified(verified);
  }, []);

  // Simulate initial loading spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Optionally track auth/cart/wishlist changes
  useEffect(() => {
    if (auth.error) {
      console.log('Auth error:', auth.error);
    }
  }, [auth]);

  useEffect(() => {
    if (cart.cartItems) {
      console.log('Cart updated:', cart.cartItems.length);
    }
  }, [cart.cartItems]);

  useEffect(() => {
    if (wishlist.wishlistItems) {
      console.log('Wishlist updated:', wishlist.wishlistItems.length);
    }
  }, [wishlist.wishlistItems]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SearchHeader />
      <Routes>
        {/* SliderCaptcha route should always be accessible */}
        <Route path="/SliderCaptcha" element={<SliderCaptcha />} />
        
        {/* Protected routes that require verification */}
        {isVerified ? (
          <>
            <Route path="/Main" element={<Main />} />
            <Route path="/Vegetable" element={<Vegetable />} />
            <Route path="/Aboutus" element={<Aboutus />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/MyAccount" element={<MyAccount />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/PopularCategories" element={<PopularCategories />} />
            <Route path="/Bestsellers" element={<Bestseller />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/AddcartDesign" element={<AddcartDesign />} />
            <Route path="/Myorder" element={<Myorder />} />
            <Route path="/MyAddresses" element={<MyAddresses />} />
            <Route path="/Thankspopup" element={<Thankspopup />} />
            
            {/* Redirect root to Main for verified users */}
            <Route path="/" element={<Navigate to="/Main" />} />
            
            {/* Catch all other routes and redirect to Main for verified users */}
            <Route path="*" element={<Navigate to="/Main" />} />
          </>
        ) : (
          <>
            {/* For unverified users, only allow SliderCaptcha and redirect others */}
            <Route path="/" element={<Navigate to="/SliderCaptcha" />} />
            <Route path="*" element={<Navigate to="/SliderCaptcha" />} />
          </>
        )}
      </Routes>
      <Footer />
    </>
  );
};

export default MainRoutes;
