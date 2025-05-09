import React from 'react';
import { Route } from "react-router-dom";
import GardenFresh from "../container/GardenFresh";
import SpecialOffer from "../container/SpecialOffer";
import AppUI from "../container/AppUI";
import ProductDetails from "../container/ProductDetails";
import Menuheader from "../container/Menuheader";
import Category from "../container/Category";
import Subscribe from "../container/Subscribe";
import Footer from "../container/Footer";
import Vegetable from "../container/Vegetable";
import RoleSelection from "../container/RoleSelection";
import MyProfile from "../container/MyProfile";
import ForgotPassword from "../components/ForgotPassword";
import VerifyOTP from "../components/VerifyOTP";
import ResetPassword from "../components/ResetPassword";
import Register from "../components/Register";
import VerifyEmail from "../components/VerifyEmail";
import Slide2 from "../components/Slide2";
import Button from "../components/Button";
import Home from "../components/Home";
import HomeMethod from "../components/HomeMethod";
import Addcart from "../container/Addcart";
import FastKartHeader from "../container/FastKartHeader";
import Aboutus from "../container/Aboutus";
import Termsandcondition from "../container/Termsandcondition";
import Contactus from "../container/Contactus";
import Login from '../components/Login';
import Faqs from '../container/Faqs';
import Checkout from '../container/Checkout';
import Orderdetails from '../container/Orderdetails';
import Thankspopup from '../container/Thankspopup';
import HomeMain from '../components/HomeMain';
import SimilarPro from '../container/SimilarPro';
import VerifyForgot from '../components/VerifyForgot';
import Main from '../container/Main';
import Myorder from '../container/Myorder';
// import MainRoutes from '../container/MainRoutes';

const UserRoutes = [
    // denisha
    <Route path="/GardenFresh" element={<GardenFresh />} />,
    <Route path="/SpecialOffer" element={<SpecialOffer />} />,
    <Route path="/AppUI" element={<AppUI />} />,
    <Route path="/product-details/:id" element={<ProductDetails />} />,
    <Route path="/FastKartHeader" element={<FastKartHeader />} />,
    <Route path="/MyProfile" element={<MyProfile />} />,
    <Route path="/HomeMain" element={<HomeMain />} />,
    <Route path="/Main" element={<Main />} />,
    // <Route path="/MainRoutes" element={<MainRoutes />} />,

    // aesha
    <Route path="/Menuheader" element={<Menuheader />} />,
    <Route path="/Category" element={<Category />} />,
    <Route path="/Subscribe" element={<Subscribe />} />,
    <Route path="/Footer" element={<Footer />} />,
    // <Route path="/Vegetable" element={<Vegetable />} />,
    <Route path="/RoleSelection" element={<RoleSelection />} />,
    <Route path="/MyProfile" element={<MyProfile />} />,
    <Route path="/SimilarPro" element={<SimilarPro />} />,
    <Route path="/Myorder" element={<Myorder />} />,


    // authentication
    <Route path="/login" element={<Login />} />,
    <Route path="/forgot-password" element={<ForgotPassword />} />,
    <Route path="/verify-otp" element={<VerifyOTP />} />,
    <Route path="/reset-password" element={<ResetPassword />} />,
    <Route path="/register" element={<Register />} />,
    <Route path="/verify-email" element={<VerifyEmail />} />,
    <Route path="/verify-forgot" element={<VerifyForgot />} />,

    // Krupali
    <Route path="/Slider2" element={<Slide2 />} />,
    <Route path="/Button" element={<Button />} />,
    <Route path="/Home" element={<Home />} />,
    <Route path="/HomeMethod" element={<HomeMethod />} />,
    <Route path="/Addcart" element={<Addcart />} />,
    <Route path="/Button" element={<Button />} />,
    <Route path="/Home" element={<Home />} />,
    <Route path="/orderdetails" element={<Orderdetails />} />,
    <Route path="/Thankspopup" element={<Thankspopup />} />,

    // akshy
    <Route path="/Aboutus" element={<Aboutus />} />,
    <Route path="/Terms" element={<Termsandcondition />} />,
    <Route path="/Contact" element={<Contactus />} />,
    <Route path="/Faqs" element={<Faqs />} />,
    <Route path="/Checkout" element={<Checkout />} />

    
];

export default UserRoutes;