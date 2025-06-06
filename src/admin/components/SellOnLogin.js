import React, { useEffect, useRef, useState } from "react";
import Header from "../container/Header";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { IoEyeOff } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SellOnLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Keeping email for standard login
  const [password, setPassword] = useState("");
  const [staps, setstaps] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // reset password states
  const [mobileNo, setMobileNo] = useState(""); // New state for mobile number
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Userid, SetUserid] = useState("");
  const [users, setUsers] = useState([]); // This state doesn't seem to be used, can be removed if not needed.

  // Removed getUsers as it's not used in the provided snippet
  // const getUsers = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:4000/api/allUsers", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/userLogin", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("filledSteps", response.data.data.filledSteps);
      localStorage.setItem("userId", response.data.data._id);

      const filledSteps = response.data.data.filledSteps;

      if (filledSteps === 6 || filledSteps === "6") {
        navigate("/seller/home");
      } else {
        navigate("/seller/admin-captcha");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password");
    }
  };

  // verification code states for mobile
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleforgotPassword = async () => {
    try {
      // Changed to send mobile number for forgot password
      const response = await axios.post(
        "http://localhost:4000/api/forgotPassword",
        {
          mobileNo: mobileNo, // Sending mobileNo instead of email
        }
      );
      console.log("forgot password mobile response", response);
    } catch (error) {
      console.error(error);
      setError("Error sending OTP to mobile number.");
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    try {
      // Changed to verify OTP with mobile number
      const response = await axios.post(
        "http://localhost:4000/api/emailOtpVerify", // Assuming a new endpoint for mobile OTP verification
        {
          phone: mobileNo, // Sending mobileNo for verification
          otp: code,
        }
      );
      console.log("OTP verification response", response);
      SetUserid(response.data.data._id);
    } catch (error) {
      console.error(error);
      setError("Invalid OTP or mobile number.");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/resetPassword`,
        {
          mobileNo: mobileNo,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      console.log("reset password", response);
      setstaps(0); // Go back to login screen after successful reset
      alert("Password reset successfully! Please log in with your new password.");
    } catch (error) {
      console.error(error);
      setError("Error resetting password. Please try again.");
    }
  };
  const handleResend = async (e) => {
    e.preventDefault();
    try {
      // Changed to resend OTP to mobile number
      const response = await axios.post("http://localhost:4000/api/resendEmailOtp", { // Assuming a new endpoint for resending mobile OTP
        mobileNo: mobileNo, // Sending mobileNo for resend
      });
      console.log("Resend verification code response", response);
      alert("Verification code resent to your mobile number.");
    } catch (error) {
      console.error(error);
      setError("Error resending verification code.");
    }
  };

  return (
    <>
      <Header />

      {/* login form */}
      {staps === 0 && (
        <div className="k-login-form" style={{ marginTop: "100px" }}>
          <Container className="d-flex justify-content-center align-items-center">
            <div
              className="bg-white p-3 p-md-5 rounded shadow"
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <h3 className="text-center mb-4">Login to get Started</h3>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email Id</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email Id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded k-input-bg-color"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded k-input-bg-color"
                    />
                    <Button
                      variant=""
                      onClick={togglePasswordVisibility}
                      className="border-0 bg-transparent"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "40%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                      }}
                    >
                      {showPassword ? (
                        <IoEyeOff size={20} />
                      ) : (
                        <MdRemoveRedEye size={20} />
                      )}
                    </Button>
                  </InputGroup>
                  <div
                    className="d-flex justify-content-end mt-1 fw-medium text-danger"
                    onClick={() => setstaps(1)} // Changed to setstaps(1) for mobile input
                    style={{ fontSize: "0.9rem", cursor: "pointer" }}
                  >
                    Forgot Password?
                  </div>
                </Form.Group>

                <div className="mt-4">
                  <Button
                    type="submit"
                    className="w-100 py-2 z_button"
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                  {error && (
                    <div className="text-danger mt-2">{error}</div>
                  )}
                </div>
              </Form>
            </div>
          </Container>
        </div>
      )}

      {/* forget password - Mobile Number Input */}
      {staps === 1 && (
        <div className="k-login-form" style={{ marginTop: "100px" }}>
          <Container className="d-flex justify-content-center align-items-center">
            <div
              className="bg-white p-3 p-md-5 rounded shadow"
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <div className="text-center mb-4">
                <h3 className="k-text-size">Forgot Password?</h3>
                <p className="k-text-gray">
                  To recover your account, please enter your mobile number below.
                </p>
              </div>
              <Form>
                <Form.Group className="my-5">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="tel" // Changed to tel type for mobile number
                    placeholder="Mobile Number"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    required
                    className="rounded k-input-bg-color"
                  />
                </Form.Group>

                <div className="mt-4">
                  <Button
                    type="submit"
                    className="w-100 py-2 z_button"
                    onClick={() => {
                      setstaps(2); // Move to OTP verification step
                      handleforgotPassword(); // Send OTP to mobile
                    }}
                  >
                    Send Code
                  </Button>
                  {error && (
                    <div className="text-danger mt-2">{error}</div>
                  )}
                </div>
              </Form>
            </div>
          </Container>
        </div>
      )}

      {/* verify mobile OTP */}
      {staps === 2 && (
        <div className="container">
          <div className="k-verification-container">
            <div className="text-center">
              <h3 className="k-heading">Verify Mobile Number</h3>
              <p className="k-instruction">
                We've sent a code to <strong>{mobileNo}</strong>.<br />
                Please enter it to verify your mobile number.
              </p>
            </div>
            <div className="k-code-input-container my-5">
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
            <Button className="z_button w-100" onClick={() => {
              handleVerify();
              setstaps(3); // Move to reset password step after verification
            }}>
              Verify Code
            </Button>
            <p className="k-resend-text mt-3">
              Didn't receive code?{" "}
              <a href="#" className="k-resend-link" onClick={handleResend}>
                Resend
              </a>
            </p>
            {error && (
              <div className="text-danger mt-2">{error}</div>
            )}
          </div>
        </div>
      )}

      {/* reset password */}
      {staps === 3 && (
        <Container className="d-flex justify-content-center align-items-center k-password-reset-container">
          <Card className="k-password-card shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="text-center mb-2">Reset Password</h3>
              <p className="text-center text-muted mb-4 k-reset-pass-text">
                Create a unique password different from your previous ones.
              </p>

              <Form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup className="k-password-input-group mb-4">
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="k-password-input mb-0 k-input-bg-color"
                    />
                    <Button
                      variant="light"
                      className="k-eye-button border-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <IoEyeOff size={20} />
                      ) : (
                        <MdRemoveRedEye size={20} />
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup className="k-password-input-group">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="k-password-input mb-0 k-input-bg-color"
                    />
                    <Button
                      variant="light"
                      className="k-eye-button border-0"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <IoEyeOff size={20} />
                      ) : (
                        <MdRemoveRedEye size={20} />
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 mt-4 z_button"
                >
                  Reset Password
                </Button>
                {error && (
                  <div className="text-danger mt-2">{error}</div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
}

export default SellOnLogin;