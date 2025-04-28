import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';

import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Logo from './Logo';
import '../styles/AuthStyles.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  ;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(formData));
    if (result.payload && !result.error) {
      navigate('/HomeMain'); // Navigate to home page after successful login
    }
  };
//   const handleSubmit = async (e) => {
//   try {
//     const result = await dispatch(loginUser(formData));
//     if (result.payload && !result.error) {
//       // Store token in localStorage
//       localStorage.setItem('token', result.payload.token);
//       localStorage.setItem('user', JSON.stringify(result.payload.user));
//       navigate('/HomeMain');
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//   }
// };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    const [googleError, setGoogleError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse || !tokenResponse.access_token) {
        setGoogleError('Invalid token received from Google');
        return;
      }

      try {
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        
        const { name, email, picture, sub: googleId } = userInfoResponse.data;

        const response = await axios.post('http://localhost:4000/api/userGoggleLogin', {
          name,
          email,
          picture,
          googleId,
        });

        if (!response.data || !response.data.token) {
          throw new Error('Invalid response from server');
        }

        const token = response.data.token;
        
        try {
          const decoded = jwtDecode(token);
          const userId = decoded._id;
          if (!userId) {
            throw new Error('Invalid user ID in token');
          }

          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          setGoogleError(null);
          navigate('/HomeMain');
        } catch (tokenError) {
          console.error('Token decode error:', tokenError);
          setGoogleError('Failed to process authentication token');
        }
      } catch (error) {
        console.error('Google login error:', error);
        setGoogleError(error.response?.data?.error || error.message || 'Failed to authenticate with Google');
      }
    },
    onError: () => {
      console.error('Google Login Failed');
      setGoogleError('Failed to authenticate with Google');
    },
  });
  return (
    <>
      <Logo />
      <div className="auth-page-container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h4 className="auth-title">Login</h4>
            <p className="auth-subtitle">Welcome back! Please sign in.</p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 password-container" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  label="Remember Me"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
              </div>
              {error && <div className="error-message">{error}</div>}
              {/* <Button variant="success" type="submit" className="auth-button w-100">
              Login
            </Button> */}
              {/* {/ <Button variant="success" type="submit" disabled={isLoading} className="auth-button w-100"> /} */}
              <Button type="submit" disabled={isLoading} className="z_button w-100">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="divider">
                <span>OR</span>
              </div>

              {googleError && <div className="alert alert-danger mb-3">{googleError}</div>}
              <div className="social-login-buttons">
                <Button 
                  variant="outline-secondary" 
                  className="social-button w-100 mb-2"
                  onClick={() => login()}
                >
                  <FcGoogle className="social-icon" /> Sign in with Google
                </Button>
                <Button variant="outline-secondary" className="social-button w-100 mt-2">
                  <FaFacebook className="social-icon text-primary" /> Sign in with Facebook
                </Button>
              </div>
            </Form>

            <div className="auth-footer">
              <p>Don't have any account? <Link to="/register" className="create-account-link">Create Account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
