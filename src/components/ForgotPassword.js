import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Logo from './Logo';
import '../styles/AuthStyles.css';
import { forgotPassword } from '../redux/slices/authSlice';

const ForgotPassword = () => {
  const [mobileNo, setMobileNo] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, forgotPasswordSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (forgotPasswordSuccess) {
      navigate('/verify-forgot');
      localStorage.setItem('ForgotMobile', mobileNo);
    }
  }, [forgotPasswordSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(mobileNo));
  };

  return (
    <>
      <Logo />
      <div className="auth-page-container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h4 className="auth-title">Forgot Password?</h4>
            <p className="auth-subtitle">To recover your account, please enter your mobile number below.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="formMobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Your Mobile Number"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  required
                />
              </Form.Group>

              <Button 
                type="submit" 
                className="z_button w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;