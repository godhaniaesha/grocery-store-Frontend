import React, { useEffect, useRef, useState } from "react";
import { Button, Container, InputGroup, Form } from "react-bootstrap";
import { IoEyeOff } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import Header from "../container/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SellerRegister() {
  const [Steps, setSteps] = useState(0);
  const [email, setEmailOTP] = useState("");
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Password is required"),
  });

  // otp verification code -------------
  const [verificationCodePhone, setverificationCodePhone] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef([]);

  const SellerRegister = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/createAdmin",
        values
      );
      // console.log("Register", response);
      if (response.data.success) {
        setSteps(1);
      }
      localStorage.setItem("userId", response.data.data._id);
      localStorage.setItem("token", response.data.token);
      // console.log("email", response.data.data.email);
      setEmailOTP(response.data.data.email);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleVerifyPhone = async () => {
    const code = verificationCodePhone.join("");
    try {
      const response = await axios.post(
        "http://localhost:4000/api/emailOtpVerify",
        {
          email: email,
          otp: code,
        }
      );
      // console.log("OTP Verification", response);
      if (response.data.success) {
        navigate("/seller/seller-gst");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResendPhone = (e) => {
    e.preventDefault();
    try {
      const response = axios.post("http://localhost:4000/api/resendRegisterOtp", {
        email: email,
      });
      // console.log("Resend verification code response", response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* header */}
      <Header />

      {/* Register page */}
      {Steps === 0 && (
        <div className="k-register-form" style={{ marginTop: "100px" }}>
          <Container className="d-flex justify-content-center align-items-center">
            <div
              className="bg-white p-4 rounded shadow"
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <div className="text-center mb-4">
                <h2>Register</h2>
                <p>Register your account to start selling</p>
              </div>

              <Formik
                initialValues={{
                  mobileNo: "",
                  email: "",
                  password: "",
                  filledSteps: 1,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("Form values:", values);
                  SellerRegister(values);
                  setSubmitting(false);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="mobileNo"
                        placeholder="Mobile number"
                        value={values.mobileNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.mobileNo && errors.mobileNo}
                        className="rounded"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobileNo}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Id</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Id"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                        className="rounded"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Set Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={values.showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Set Password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && errors.password}
                          className="rounded"
                        />
                        <Button
                          variant=""
                          onClick={() =>
                            handleChange({
                              target: {
                                name: "showPassword",
                                value: !values.showPassword,
                              },
                            })
                          }
                          className="border-0 bg-transparent"
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "38%",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                          }}
                        >
                          {values.showPassword ? (
                            <MdRemoveRedEye size={20} />
                          ) : (
                            <IoEyeOff size={20} />
                          )}
                        </Button>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
    
                        {touched.password && errors.password && (
                        <div className="text-danger">{errors.password}</div>
                      )}
                    </Form.Group>

                    <div className="my-3">
                      <Button
                        type="submit"
                        className="w-100 py-2 z_button mt-3"
                       
                        disabled={isSubmitting}
                      >
                        Register
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Container>
          <div className="k-terms k-text-gray text-center">
            <p>
              By clicking you agree to our{" "}
              <span className="text-black ">Terms & Condition</span> and{" "}
              <span className="text-black">Privacy Policy</span>
            </p>
          </div>
        </div>
      )}

      {/* register otp verify code */}
      {Steps === 1 && (
        <div className="container">
          <div className="k-verification-container">
            <div className="text-center">
              <h1 className="k-heading">Verify OTP</h1>
              <p className="k-instruction">
                We've sent a code to your email <strong>{email}</strong>.<br />
                Please enter it below to verify your email.
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
                  onChange={(e) =>
                    handleInputChangePhone(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDownPhone(index, e)}
                />
              ))}
            </div>
            <button className="z_button w-100" onClick={handleVerifyPhone}>
              Verify OTP
            </button>
            <p className="k-resend-text mt-4">
              Didn't received code?{" "}
              <a href="#" className="k-resend-link" onClick={handleResendPhone}>
                Resend
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default SellerRegister;
