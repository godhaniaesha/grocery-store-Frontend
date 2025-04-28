import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Logo from './Logo';
import '../styles/AuthStyles.css';
import { resendEmailOtp, verifyEmailOtp } from '../redux/slices/emailVerificationSlice';

const VerifyForgot = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  // Change the selector to use emailVerification slice instead of auth
  const { isLoading, error, success } = useSelector((state) => state.emailVerification);
  const email = localStorage.getItem('ForgotEmail');

  useEffect(() => {
    if (success) {
      navigate('/reset-password');
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    const result = await dispatch(verifyEmailOtp({ email, otp: otpValue }));
    if (result.payload && !result.error) {
      navigate('/reset-password');
    }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '', '', '']);
    await dispatch(resendEmailOtp({ email }));
  };

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-container">
        <Logo />
        <div className="auth-form-container">
          <h4 className="auth-title">Verify OTP</h4>
          <p className="auth-subtitle">
            We've sent a code to <strong>{email}</strong>.<br />
            Please enter it to reset your password.
          </p>

          <Form onSubmit={handleSubmit}>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <Form.Control
                  key={index}
                  className="otp-input"
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            <Button 
              type="submit" 
              className="z_button w-100 mt-4" 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            {error && <div className="text-danger mt-2">{error}</div>}
          </Form>

          <div className="resend-container mt-3">
            <p>Didn't receive code? <span className="resend-link" onClick={handleResend}>Resend</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForgot;
