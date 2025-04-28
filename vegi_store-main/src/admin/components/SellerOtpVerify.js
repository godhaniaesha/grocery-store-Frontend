import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function SellerOtpVerify() {
  const [verificationCodePhone, setverificationCodePhone] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef([]);

  // Initialize the refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleInputChangePhone = (index, value) => {
    // Only allow single characters
    if (value.length > 1) {
      value = value.charAt(0);
    }
    // Update the verification code array
    const newverificationCodePhone = [...verificationCodePhone];
    newverificationCodePhone[index] = value;
    setverificationCodePhone(newverificationCodePhone);
    // Auto-focus next input when a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDownPhone = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !verificationCodePhone[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyPhone = () => {
    const code = verificationCodePhone.join("");
    alert(`Verification code submitted: ${code}`);
    // Here you would typically send the code to your backend for verification
  };

  const handleResendPhone = (e) => {
    e.preventDefault();
    alert("Resending verification code...");
    // Here you would implement the logic to resend the code
  };

  return (
    <>
      <div className="container">
        <div className="k-verification-container">
          <div className="text-center">
            <h1 className="k-heading">Verify OTP</h1>
            <p className="k-instruction">
              We’ve sent a code to <strong>+1 56565 56565</strong>.<br />
              Please enter it to verify your Mobile No.
            </p>
          </div>
          <div className="k-code-input-container">
            {verificationCodePhone.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                className="k-code-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChangePhone(index, e.target.value)}
                onKeyDown={(e) => handleKeyDownPhone(index, e)}
              />
            ))}
          </div>
          <button className="k-verify-button" onClick={handleVerifyPhone}>
            <Link to={"/seller/seller-reset-password"}>Verify OTP</Link>
          </button>
          <p className="k-resend-text">
            Didn't received code?{" "}
            <a href="#" className="k-resend-link" onClick={handleResendPhone}>
              Resend
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default SellerOtpVerify;
