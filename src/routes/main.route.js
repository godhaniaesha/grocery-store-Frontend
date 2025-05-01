// main.route.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchHeader from '../container/SearchHeader';
import Main from '../container/Main';
import Vegetable from '../container/Vegetable';
import Aboutus from '../container/Aboutus';
import Footer from '../container/Footer';
import ProductDetails from '../container/ProductDetails';
import Faqs from '../container/Faqs';

const MainRoutes = () => {
  return (
    <>
      <SearchHeader />
      <Routes>
        <Route path="/Main" element={<Main />} />
        <Route path="/Vegetable" element={<Vegetable />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/FAQ" element={<Faqs />} />
        {/* <Route path="/wishlist" element={<whish />} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default MainRoutes;
