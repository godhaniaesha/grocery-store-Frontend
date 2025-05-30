import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import ForgotPassword from '../components/ForgotPassword';
import VerifyOTP from '../components/VerifyOTP';
import ResetPassword from '../components/ResetPassword';
import Register from '../components/Register';
import VerifyEmail from '../components/VerifyEmail';
import Home from '../components/Home';
import Button from '../components/Button';
import Invoice from '../components/Invoice';

const AppRoutes = () => {
  return (
    <>
     <Router>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />


        {/* Krupali */}
        <Route path="/home" element={<Home />} />
        

        {/* <Route path="/button" element={<Button />} /> */}
        

      </Routes>
    </Router>
    </>
   
  );
};

export default AppRoutes;
