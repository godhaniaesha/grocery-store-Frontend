import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Logo from './Logo';
import '../styles/AuthStyles.css';
import { forgotPassword } from '../redux/slices/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, forgotPasswordSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (forgotPasswordSuccess) {
      navigate('/verify-forgot');
      localStorage.setItem('ForgotEmail', email);
    }
  }, [forgotPasswordSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <>
      <Logo />
      <div className="auth-page-container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h4 className="auth-title">Forgot Password?</h4>
            <p className="auth-subtitle">To recover your account, please enter your email below.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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