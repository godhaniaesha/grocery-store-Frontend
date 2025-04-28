import React, { useState, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmailOtp, resendEmailOtp } from '../redux/slices/emailVerificationSlice';
import Logo from './Logo';
import '../styles/AuthStyles.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const registeredEmail = useSelector((state) => state.user.registeredEmail);
  const tempUserData = JSON.parse(sessionStorage.getItem('tempUserData') || '{}');
  const userEmail = registeredEmail || tempUserData.email;
  const { error, success } = useSelector((state) => state.emailVerification);

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
    try {
      const result = await dispatch(verifyEmailOtp({
        email: userEmail,
        otp: otpValue
      })).unwrap();

      if (result.success) {
        navigate('/HomeMain');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(resendEmailOtp({ email: userEmail })).unwrap();
      // Reset OTP input fields
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP failed:', error);
    }
  };

  return (
    <>
      <Logo />
      <div className="auth-page-container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h4 className="auth-title">Verify OTP</h4>
            <p className="auth-subtitle">
              We've sent a code to <strong className='z_gmail'>{userEmail}</strong>.<br />
              Please enter it to verify your email.
            </p>

            {error && <Alert variant="danger">OTP does not match</Alert>}

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

              {/* <Button variant="success" type="submit" className="auth-button w-100 mt-4"> */}
              <Button variant="success" type="submit" className="z_button w-100 mt-4">
                Verify OTP
              </Button>
            </Form>

            <div className="resend-container mt-3">
              <p>Didn't received code? <span className="resend-link" onClick={handleResend}>Resend</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOTP;