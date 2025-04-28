import React, { useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmailOtp, clearEmailVerificationState, resendEmailOtp } from '../redux/slices/emailVerificationSlice';
import Logo from './Logo';
import '../styles/AuthStyles.css';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const { isLoading, error, success } = useSelector((state) => state.emailVerification);
  const { registeredEmail } = useSelector((state) => state.user);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    const result = await dispatch(verifyEmailOtp({ email: registeredEmail, otp: otpValue }));
    if (result.payload && !result.error) {
      navigate('/HomeMain');
    }
  };

  const handleResend = async () => {
    dispatch(clearEmailVerificationState());
    setOtp(['', '', '', '', '', '']);
    const result = await dispatch(resendEmailOtp({ email: registeredEmail }));
    if (result.error) {
      // Error is automatically handled by the reducer
      return;
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-container">
        <Logo />
        <div className="auth-form-container">
          <h4 className="auth-title">Verify OTP</h4>
          <p className="auth-subtitle">
            We've sent a code to <strong>{registeredEmail}</strong>.<br />
            Please enter it to verify your email.
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
              variant="success" 
              type="submit" 
              className="auth-button w-100 mt-4" 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            {error && <div className="text-danger mt-2">{error}</div>}
          </Form>

          <div className="resend-container mt-3">
            <p>Didn't received code? <span className="resend-link" onClick={handleResend}>Resend</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;