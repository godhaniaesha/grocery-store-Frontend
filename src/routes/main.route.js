// main.route.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchHeader from '../container/SearchHeader';
import Main from '../container/Main';
import Vegetable from '../container/Vegetable';
import Aboutus from '../container/Aboutus';
import Footer from '../container/Footer';
import ProductDetails from '../container/ProductDetails';
import FAQ from '../container/FAQ';
import PrivacyPolicy from '../container/PrivacyPolicy';
import Addcart from '../container/Addcart';
import Wishlist from '../container/Wishlist';
import MyAccount from '../container/MyAccount';
import Contactus from '../container/Contactus';
import PopularCategories from '../container/PopularCategories';
import Bestseller from '../container/Bestseller';
import LoadingSpinner from '../components/LoadingSpinner';
import Checkout from '../container/Checkout';

const MainRoutes = () => {
  const [loading, setLoading] = useState(true);

  // લોડિંગ સ્થિતિ સેટ કરવા માટે useEffect નો ઉપયોગ કરો
  React.useEffect(() => {
    // સાઇટ લોડ થયા પછી લોડિંગ બંધ કરો
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
        <Route path="/Addcart" element={<Addcart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/MyAccount" element={<MyAccount />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/PopularCategories" element={<PopularCategories />} />
        <Route path="/Bestsellers" element={<Bestseller />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </>
  );
};

export default MainRoutes;
