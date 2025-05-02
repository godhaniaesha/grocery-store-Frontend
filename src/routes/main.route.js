// main.route.js
import React from 'react';
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

const MainRoutes = () => {
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
      </Routes>
      <Footer />
    </>
  );
};

export default MainRoutes;
