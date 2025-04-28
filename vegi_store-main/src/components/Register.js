import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/userSlice';
import Logo from './Logo';
import '../styles/AuthStyles.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNo: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, registrationSuccess } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (registrationSuccess) {
      navigate('/verify-otp');
    }
    return () => {
      dispatch(clearError());
    };
  }, [registrationSuccess, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      if (result.success) {
        // Store form data temporarily for OTP verification
        sessionStorage.setItem('tempUserData', JSON.stringify(formData));
        navigate('/verify-otp');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <>
      <Logo />
      <div className="auth-page-container">
        <div className="auth-container">

          <div className="auth-form-container">
            <h4 className="auth-title">Register</h4>
            <p className="auth-subtitle">Register your account easily enter your email below</p>
            {error && <Alert variant="danger">{error.message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formFullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMobileNo">
                <Form.Label>Mobile No.</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobileNo"
                  placeholder="Your Mobile No."
                  value={formData.mobileNo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4 password-container" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </Form.Group>

              {/* <Button variant="success" type="submit" className="auth-button w-100"> */}
              <Button variant="success" type="submit" className="z_button w-100">
                Register
              </Button>

              <div className="divider">
                <span>OR</span>
              </div>

              <Button variant="outline-secondary" className="social-button w-100 mb-2">
                <FcGoogle className="social-icon" /> Sign in with Google
              </Button>
              <Button variant="outline-secondary" className="social-button w-100">
                <FaFacebook className="social-icon text-primary" /> Sign in with Facebook
              </Button>
            </Form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
