import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { resetPassword } from '../redux/slices/authSlice';
import Logo from './Logo';
import '../styles/AuthStyles.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, passwordResetSuccess } = useSelector((state) => state.auth);
  const email = localStorage.getItem('ForgotEmail'); // Make sure this matches what you set in ForgotPassword

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (passwordResetSuccess) {
      localStorage.removeItem('ForgotEmail'); // Clean up
      navigate('/login');
    }
  }, [passwordResetSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!email) {
      alert('Email not found. Please try the forgot password process again.');
      navigate('/forgot-password');
      return;
    }

    const result = await dispatch(resetPassword({
      email,
      newPassword,
      confirmPassword
    }));

    if (result.payload?.success) {
      // Password reset successful
      localStorage.removeItem('ForgotEmail');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Logo />
      <div className="auth-page-container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h4 className="auth-title">Reset Password</h4>
            <p className="auth-subtitle">Create a unique password different from your previous ones.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 password-container" controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <span className="password-toggle" onClick={toggleNewPasswordVisibility}>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="mb-4 password-container" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Enter Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Button 
                type="submit" 
                className="z_button w-100 mt-4"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;