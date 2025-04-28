import React, { useEffect, useRef, useState } from "react";
import Header from "../container/Header";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { IoEyeOff } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SellOnLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staps, setstaps] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //   reset password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Userid, SetUserid] = useState("");
  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/allUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log("response", response);
      setUsers(response.data); // Update state with fetched users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
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

      // console.log("Login Response:", response.data);

      // Save data to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("filledSteps", response.data.data.filledSteps);
      localStorage.setItem("userId", response.data.data._id);

      // Handle navigation based on filledSteps
      const filledSteps = response.data.data.filledSteps;

      if (filledSteps === 6 || filledSteps === "6") {
        navigate("/seller/home");
      } else {
        navigate("/seller/seller-gst");
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Consider adding error handling for the user, like:
      setError("Invalid email or password");
    }
  };

  //   verification email js code

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

  const handleforgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/forgotPassword",
        {
          email: email,
        }
      );
      // console.log("forgot password email", response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    try {
      const response = await axios.post(
        "http://localhost:4000/api/emailOtpVerify",
        {
          email: email,
          otp: code,
        }
      );
      // console.log("reset password", response);
      // console.log("User Id", response.data.data._id);
      SetUserid(response.data.data._id);
      // localStorage.setItem("userId", response.data.data._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/resetPassword/${Userid}`,
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      // console.log("reset password", response);
      setstaps(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    // alert("Resending verification code...");
    try {
      const response = axios.post("http://localhost:4000/api/resendEmailOtp", {
        email: email,
      });
      // console.log("Resend verification code response", response); 
      
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Header />

      {/* login form  */}
      {staps == 0 && (
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
                    onClick={() => setstaps(1)}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {/* <Link
                        to="/seller/seller-forget-password"
                      >
                      </Link> */}
                    Forgot Password?
                  </div>
                </Form.Group>

                <div className="mt-4">
                  <Button
                    type="submit"
                    className="w-100 py-2 z_button"
                    // style={{
                    //   background:
                    //     "linear-gradient(180deg, #479529 0%, #0C6C44 100%)",
                    //   borderColor: "#4CAF50",
                    //   fontSize: "1rem",
                    // }}
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

      {/* forget password */}
      {staps == 1 && (
        <div className="k-login-form" style={{ marginTop: "100px" }}>
          <Container className="d-flex justify-content-center align-items-center">
            <div
              className="bg-white p-3 p-md-5 rounded shadow"
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <div className="text-center mb-4">
                <h3 className="k-text-size">Forgot Password?</h3>
                <p className="k-text-gray">
                  To recover your account, please enter your email below.
                </p>
              </div>
              <Form>
                <Form.Group className="my-5">
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

                <div className="mt-4">
                  <Button
                    type="submit"
                    className="w-100 py-2 z_button"
                    onClick={() => {
                      setstaps(2);
                      handleforgotPassword();
                    }}
                  >
                    Send Code
                  </Button>
                </div>
              </Form>
            </div>
          </Container>
        </div>
      )}

      {/* verify email */}
      {staps == 2 && (
        <div className="container">
          <div className="k-verification-container">
            <div className="text-center">
              <h3 className="k-heading">Verify Email</h3>
              <p className="k-instruction">
                We've sent a code to <strong>{email}</strong>.<br />
                Please enter it to verify your email.
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
            <button className="z_button w-100" onClick={handleVerify}>
              <div onClick={() => setstaps(3)}>Verify Email</div>
            </button>
            <p className="k-resend-text mt-3">
              Didn't received code?{" "}
              <a href="#" className="k-resend-link" onClick={handleResend}>
                Resend
              </a>
            </p>
          </div>
        </div>
      )}

      {/* reset password */}
      {staps == 3 && (
        <Container className="d-flex justify-content-center align-items-center k-password-reset-container">
          <Card className="k-password-card shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="text-center mb-2">Reset Password</h3>
              <p className="text-center text-muted mb-4 k-reset-pass-text">
                Create a unique password different from your previous ones.
              </p>

              <Form onSubmit={handleSubmit}>
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
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
}

export default SellOnLogin;
