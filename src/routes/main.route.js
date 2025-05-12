// main.route.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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

const MainRoutes = () => {
  const [loading, setLoading] = useState(true);
  
  // Add Redux state subscriptions
  const auth = useSelector(state => state.auth);
  const cart = useSelector(state => state.addcart);
  const wishlist = useSelector(state => state.wishlist);
  const user = useSelector(state => state.user);
  const orders = useSelector(state => state.order);
  const products = useSelector(state => state.product);
  const categories = useSelector(state => state.category);
  const addresses = useSelector(state => state.address);

  // Loading effect
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Effect to handle auth state changes
  useEffect(() => {
    if (auth.error) {
      // Handle auth errors
      console.log('Auth error:', auth.error);
    }
  }, [auth]);

  // Effect to handle cart updates
  useEffect(() => {
    if (cart.cartItems) {
      // Handle cart updates
      console.log('Cart updated:', cart.cartItems.length);
    }
  }, [cart.cartItems]);

  // Effect to handle wishlist updates
  useEffect(() => {
    if (wishlist.wishlistItems) {
      // Handle wishlist updates
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
      </Routes>
      <Footer />
    </>
  );
};

export default MainRoutes;
