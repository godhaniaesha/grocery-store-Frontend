import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";

function SellerVerifyEmail() {
  const [verificationCode, setVerificationCode] = useState([
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

  const handleInputChange = (index, value) => {
    // Only allow single characters
    if (value.length > 1) {
      value = value.charAt(0);
    }
    // Update the verification code array
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
    // Auto-focus next input when a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join("");
    alert(`Verification code submitted: ${code}`);
    // Here you would typically send the code to your backend for verification
  };

  const handleResend = (e) => {
    e.preventDefault();
    alert("Resending verification code...");
    // Here you would implement the logic to resend the code
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="k-verification-container">
          <div className="text-center">
            <h1 className="k-heading">Verify Email</h1>
            <p className="k-instruction">
              We've sent a code to <strong>martin123@gmail.com</strong>.<br />
              Please enter it to verify your email.
            </p>
          </div>
          <div className="k-code-input-container">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                className="k-code-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <button className="k-verify-button" onClick={handleVerify}>
            Verify Email
          </button>
          <p className="k-resend-text">
            Didn't received code?{" "}
            <a href="#" className="k-resend-link" onClick={handleResend}>
              Resend
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default SellerVerifyEmail;
