import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "react-form-stepper";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../container/Header";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SellerGstDetails() {
  const otpInputRefs = useRef([]);
  const [isVerified, setIsVerified] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [IsVerify, setIsVerify] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [bankVerificationInProgress, setBankVerificationInProgress] =
    useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [currentUser, setcurrentUser] = useState();
  const navigation = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState("");
  // console.log(currentUser);

  const email = currentUser?.email;
  const phone = currentUser?.mobileNo;
  // console.log("email", phone);

  // Initial form values
  const initialValues = {
    gstNumber: "",
    businessName: "",
    panNumber: "",
    businessType: "",
    businessAddress: "",
    storeName: "",
    ownerName: "",
  };

  // Initial bank details values
  const initialBankValues = {
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
  };

  // Validation schema for GST details using Yup
  const gstValidationSchema = Yup.object({
    gstNumber: Yup.string()
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST Number format"
      )
      .required("GST Number is required"),
    businessName: Yup.string()
      .min(3, "Business Name must be at least 3 characters")
      .required("Business Name is required"),
    panNumber: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number format")
      .required("PAN Number is required"),
    businessType: Yup.string().required("Please select a Business Type"),
    businessAddress: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .required("Business Address is required"),
  });

  // Validation schema for Brand details
  const brandValidationSchema = Yup.object({
    storeName: Yup.string()
      .required("Store name is required")
      .min(2, "Store name must be at least 2 characters")
      .max(100, "Store name must be less than 100 characters"),
    ownerName: Yup.string()
      .required("Owner name is required")
      .min(2, "Owner name must be at least 2 characters")
      .max(100, "Owner name must be less than 100 characters"),
  });

  // Validation schema for Bank details
  const bankValidationSchema = Yup.object({
    bankName:Yup.string().required("Account number is required"),
    accountNumber: Yup.string()
      .matches(/^\d+$/, "Account number must contain only digits")
      .min(9, "Account number must be at least 9 digits")
      .max(18, "Account number must be less than 18 digits")
      .required("Account number is required"),
    confirmAccountNumber: Yup.string()
      .oneOf([Yup.ref("accountNumber")], "Account numbers must match")
      .required("Please confirm your account number"),
    ifscCode: Yup.string()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
      .required("IFSC code is required"),
  });

  //  Validation schema for pickup address
  const pickupAddressValidationSchema = Yup.object({
    room: Yup.string()
      .required("Room/Floor/Building Number is required")
      .min(3, "Room/Floor/Building Number must be at least 3 characters"),
    street: Yup.string()
      .required("Street/Locality is required")
      .min(3, "Street/Locality must be at least 3 characters"),
    landmark: Yup.string(),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[1-9][0-9]{5}$/, "Pincode must be 6 digits"),
    city: Yup.string()
      .required("City is required")
      .min(2, "City must be at least 2 characters"),
    state: Yup.string()
      .required("State is required")
      .min(2, "State must be at least 2 characters"),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const step = currentUser?.data?.filledSteps;

    if (!token) {
      navigation("/seller/seller-register");
      return;
    }

    // Check if user is verified AND has completed all steps (filledSteps = 6)
    if (currentUser?.isVerify && currentUser?.filledSteps === 6) {
      navigation("/seller/home");
    } else {
      // If not fully onboarded (either not verified or filledSteps < 6), 
      // redirect to the seller-gst page
      navigation("/seller/seller-gst");
      setActiveStep(step);
    }
  }, [currentUser]);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/getUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log("response", response.data.data);
      setcurrentUser(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(""); //
    try {
      setFormData({ ...formData, ...values });
      const response = await axios.put(
        "http://localhost:4000/api/setGstNumber",
        {
          gstNumber: values.gstNumber,
          businessName: values.businessName,
          PANNumber: values.panNumber,
          businessType: values.businessType,
          businessAddress: values.businessAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log("Gst Number Response:", response);

      if (response.data && response.data.success) {
        setShowOTPScreen(true);
      } else {
        setError("Failed to verify GST details. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying GST details:", error);
      setError(
        error.response?.data?.message ||
          "Failed to verify GST details. Please check your internet connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOTPInputChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOTPInputKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otpDigits.join("");

    if (enteredOTP.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/emailOtpVerify",
        {
          email: currentUser.email,
          otp: enteredOTP,
          filledSteps: activeStep,
        }
      );

      // console.log("OTP verification response:", response);

      if (response.data.success) {
        setIsVerified(true);
        setActiveStep(2);
        getUsers();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/api/resendOtp", {
        email: email,
      });

      if (response.data.success) {
        alert("OTP has been resent to your email and phone");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again later.");
    }
  };

  const handleBrandSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const updatedFormData = { ...formData, ...values };
      setFormData(updatedFormData);

      const response = await axios.put(
        "http://localhost:4000/api/setBrandDetails",
        {
          storeName: values.storeName,
          ownerName: values.ownerName,
          filledSteps: activeStep,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log("Brand Details Response:", response);

      if (response.data && response.data.success) {
        setSubmitSuccess(true);
        setActiveStep(3);
        getUsers();
      } else {
        setSubmitError("Failed to save brand details. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting brand details:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to save brand details. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleBankDetailsSubmit = async (values, { setSubmitting }) => {
    // console.log('banc', values);
    // setSubmitError(null);
    setBankVerificationInProgress(true);
    
    try {
      const updatedFormData = { ...formData, ...values };
      setFormData(updatedFormData);
      
      // Extract only the needed values to avoid circular references
      const response = await axios.put(
        "http://localhost:4000/api/setBankDetails",
        {
          accountNumber: values.accountNumber,
          IFSCCode: values.ifscCode,
          filledSteps: activeStep,
          bankName: values.bankName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // console.log("Bank Details Response:", response);
      
      if (response.data && response.data.success) {
        setBankVerified(true);
        setActiveStep(4);
        getUsers();
      } else {
        setSubmitError("Failed to verify bank details. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying bank details:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to verify bank details. Please check your information and try again."
      );
    } finally {
      setBankVerificationInProgress(false);
      setSubmitting(false);
    }
  };

  const handlePickupAddressSubmit = async (values, { setSubmitting }) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const updatedFormData = { ...formData, ...values };
      setFormData(updatedFormData);

      const response = await axios.put(
        "http://localhost:4000/api/setPickUpAddress",
        {
          buildingNumber: values.room,
          locality: values.street,
          landmark: values.landmark,
          pincode: values.pincode,
          city: values.city,
          state: values.state,
          filledSteps: activeStep,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log("Pickup Address Response:", response);

      if (response.data && response.data.success) {
        setActiveStep(5);
        getUsers();
      } else {
        setSubmitError("Failed to save pickup address. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting pickup address:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to save pickup address. Please check your information and try again."
      );
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // console.log(isAgreed);

  const handleVerifySubmit = async () => {
    if (!isAgreed) {
      setAgreementError("You must agree to the Seller Agreement before submitting.");
      return;
    }
    setAgreementError("");

    try {
      const response = await axios.put(
        "http://localhost:4000/api/verifyAndSubmit",
        {
          isVerify: isAgreed,
          filledSteps: 6, // Set filledSteps to 6 to indicate complete onboarding
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log("Success:", response.data.data);
      // console.log("isVerify:", response.data.data.isVerify);
      
      if (response.data.data.isVerify) {
        // Only navigate to home if both isVerify is true AND filledSteps is 6
        navigation("/seller/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Header />

      <Container>
        <div className="k-complete-steper mt-4 text-center fs-5 ">
          <p className="fw-medium m-0">
            Complete these steps for easy onboarding
          </p>
        </div>

        <div className="overflow-auto">
          <Stepper
            steps={[
              { label: "Account Creation" },
              { label: "Seller Details" },
              { label: "Brand Details" },
              { label: "Bank Details" },
              { label: "Pickup Address" },
              { label: "Verify & Submit" },
            ]}
            className="k-steper"
            activeStep={currentUser?.filledSteps}
            connectorStateColors
          />
        </div>
      </Container>

      {/* Seller GST Details */}
      <Container>
        {!showOTPScreen && currentUser?.filledSteps === 1 ? (
          <div className="text-center mt-3">
            <div className="k-seller-gst-title">
              <p className="m-0 fw-semibold">Seller Details</p>
            </div>

            <div className="k-seller-gst-subTitle">
              <p className="m-0 text-secondary">
                Enter the primary GST of your Business
              </p>
            </div>
          </div>
        ) : null}

        {!showOTPScreen && currentUser?.filledSteps === 1 && (
          <div className="row k-gst-in mt-3 align-items-center justify-content-center">
            <div className="col-lg-5 col-md-7 mb-5">
              <div className="k-gst-input">
                <Formik
                  initialValues={initialValues}
                  validationSchema={gstValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="gstNumber" className="form-label">
                          GST Number
                        </label>
                        <div className="k-gst-input-group d-flex">
                          <Field
                            type="text"
                            id="gstNumber"
                            name="gstNumber"
                            className={`form-control ${
                              touched.gstNumber && errors.gstNumber
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Enter GST Number"
                          />
                        </div>
                        <ErrorMessage
                          name="gstNumber"
                          component="div"
                          className="text-danger mt-1"
                        />
                      </div>

                      <div className="k-gst-business-details mt-3">
                        <div className="k-business-name mb-2">
                          <label htmlFor="businessName" className="k-gst-label">
                            Business Name
                          </label>
                          <Field
                            type="text"
                            id="businessName"
                            name="businessName"
                            className={`form-control ${
                              touched.businessName && errors.businessName
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Enter Business Name"
                          />
                          <ErrorMessage
                            name="businessName"
                            component="div"
                            className="text-danger mt-1"
                          />
                        </div>

                        <div className="k-pan-num mb-2">
                          <label htmlFor="panNumber" className="k-gst-label">
                            PAN Number
                          </label>
                          <Field
                            type="text"
                            id="panNumber"
                            name="panNumber"
                            className={`form-control ${
                              touched.panNumber && errors.panNumber
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Enter PAN Number"
                          />
                          <ErrorMessage
                            name="panNumber"
                            component="div"
                            className="text-danger mt-1"
                          />
                        </div>

                        <div className="k-business-type mb-2">
                          <label htmlFor="businessType" className="k-gst-label">
                            Business Type
                          </label>
                          <Field
                            as="select"
                            id="businessType"
                            name="businessType"
                            className={`form-control ${
                              touched.businessType && errors.businessType
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="">Select Business Type</option>
                            <option value="proprietorship">
                              Proprietorship
                            </option>
                            <option value="partnership">Partnership</option>
                            <option value="llp">LLP</option>
                            <option value="pvtLtd">Private Limited</option>
                            <option value="publicLtd">Public Limited</option>
                          </Field>
                          <ErrorMessage
                            name="businessType"
                            component="div"
                            className="text-danger mt-1"
                          />
                        </div>

                        <div className="k-business-address mb-2">
                          <label
                            htmlFor="businessAddress"
                            className="k-gst-label"
                          >
                            Registered Business Address
                          </label>
                          <Field
                            as="textarea"
                            id="businessAddress"
                            name="businessAddress"
                            className={`form-control ${
                              touched.businessAddress && errors.businessAddress
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Enter Registered Business Address"
                            rows="3"
                          />
                          <ErrorMessage
                            name="businessAddress"
                            component="div"
                            className="text-danger mt-1"
                          />
                        </div>

                        {error && (
                          <div className="alert alert-danger mt-2">{error}</div>
                        )}

                        <div className="d-grid gap-2">
                          <button
                            type="submit"
                            className="z_button k-gst-btn mt-2"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Verifying..." : "Verify GST"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        )}

        {showOTPScreen && currentUser?.filledSteps === 1 && (
          <div className="k-gst-otp mt-5">
            <div className="text-center">
              <h2 className="k-heading">Verify your GST</h2>
              <p className="k-instruction">
                We have sent a 6-digit verification code to
                <br /> <span className="fw-bold">{phone}</span>
                <br />
                <span className="fw-bold">Email: {email}</span>
                <br />
              </p>
            </div>
            <div className="k-code-input-container">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="k-code-input"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPInputKeyDown(index, e)}
                  disabled={isLoading || isVerified} // Disable inputs after verification
                />
              ))}
            </div>

            {error && (
              <div className="text-danger mt-2 text-center">{error}</div>
            )}

            <div className="d-flex justify-content-center mt-3">
              <button
                className="k-verify-button"
                onClick={handleVerifyOTP}
                disabled={isLoading || isVerified} // Disable button when loading or already verified
              >
                {isLoading
                  ? "Verifying..."
                  : isVerified
                  ? "Verified ✓"
                  : "Submit"}
              </button>
            </div>

            <p className="k-resend-text text-center mt-3">
              Didn't receive code?{" "}
              <button
                className="k-resend-link btn btn-link p-0"
                onClick={handleResendOTP}
                disabled={isLoading}
              >
                Resend
              </button>
            </p>
          </div>
        )}
      </Container>

      {/*Brand Details */}
      {currentUser?.filledSteps === 2 && (
        <Container className="d-flex align-items-center justify-content-center">
          <Row>
            <Col sm={12}>
              <div className="k-brand-details-container">
                <div className="k-brand-title text-center">
                  <h4 className="fw-semibold">Brand Details</h4>
                  <p className="k-text-gray">
                    Your store name will be visible to all buyers of FastKart
                  </p>
                </div>
              </div>
            </Col>
            <Col>
              <div className="k-brand-form">
                <Formik
                  initialValues={{
                    storeName: formData.storeName || "",
                    ownerName: formData.ownerName || "",
                  }}
                  validationSchema={brandValidationSchema}
                  onSubmit={handleBrandSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="k-brand-group">
                        <div className="k-store-name mb-3">
                          <label htmlFor="storeName" className="form-label">
                            Store Name
                          </label>
                          <div className="k-brand-input">
                            <Field
                              type="text"
                              id="storeName"
                              name="storeName"
                              className="form-control"
                              placeholder="Store name"
                            />
                            <ErrorMessage
                              name="storeName"
                              component="div"
                              className="text-danger"
                            />
                            <p className="text-muted small mt-1">
                              E.g. Business Name, Trade Name, Etc.
                            </p>
                          </div>
                        </div>

                        <div className="k-store-name mb-3">
                          <label htmlFor="ownerName" className="form-label">
                            Owner Name
                          </label>
                          <div className="k-brand-input">
                            <Field
                              type="text"
                              id="ownerName"
                              name="ownerName"
                              className="form-control"
                              placeholder="Owner name"
                            />
                            <ErrorMessage
                              name="ownerName"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </div>

                      {submitError && (
                        <div className="alert alert-danger mt-3">
                          {submitError}
                        </div>
                      )}

                      {submitSuccess && (
                        <div className="alert alert-success mt-3">
                          Brand details submitted successfully!
                        </div>
                      )}

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="z_button w-100"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      )}

      {/* Bank Details Section */}
      {currentUser?.filledSteps === 3 && (
        <Container className="d-flex align-items-center justify-content-center">
          <Row>
            <Col sm={12}>
              <div className="k-bank-details-container w-50 mx-auto">
                <div className="k-bank-title text-center">
                  <h4 className="fw-semibold">Bank Details</h4>
                  <p className="k-text-gray">
                    Bank account should be in the name of registered business
                    name or trade name as per GSTIN.
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={12}>
              <div className="k-brand-form w-50 mx-auto">
                <Formik
                  initialValues={{
                    bankName:formData.bankName || "",
                    accountNumber: formData.accountNumber || "",
                    confirmAccountNumber: formData.confirmAccountNumber || "",
                    ifscCode: formData.IFSCCode || "",
                  }}
                  validationSchema={bankValidationSchema}
                  onSubmit={handleBankDetailsSubmit}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="k-brand-group">
                      <div className="k-bank-acc-num mb-3">
                          <label htmlFor="accountNumber" className="form-label">
                            Bank Name
                          </label>
                          <div className="k-brand-input">
                            <Field
                              type="text"
                              id="bankName"
                              name="bankName"
                              className={`form-control ${
                                touched.bankName && errors.bankName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Bank Name"
                            />
                            <ErrorMessage
                              name="bankName"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="k-bank-acc-num mb-3">
                          <label htmlFor="accountNumber" className="form-label">
                            Account Number
                          </label>
                          <div className="k-brand-input">
                            <Field
                              type="text"
                              id="accountNumber"
                              name="accountNumber"
                              className={`form-control ${
                                touched.accountNumber && errors.accountNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Account number"
                            />
                            <ErrorMessage
                              name="accountNumber"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>

                        <div className="k-confrim-bank-acc-num mb-3">
                          <label
                            htmlFor="confirmAccountNumber"
                            className="form-label"
                          >
                            Confirm Account Number
                          </label>
                          <div className="k-brand-input">
                            <Field
                              type="text"
                              id="confirmAccountNumber"
                              name="confirmAccountNumber"
                              className={`form-control ${
                                touched.confirmAccountNumber &&
                                errors.confirmAccountNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Confirm account number"
                            />
                            <ErrorMessage
                              name="confirmAccountNumber"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>

                        <div className="k-ifsc-code mb-3">
                          <label htmlFor="ifscCode" className="form-label">
                            IFSC Code
                          </label>
                          <div className="k-brand-input">
                            <Field
                              type="text"
                              id="ifscCode"
                              name="ifscCode"
                              className={`form-control ${
                                touched.ifscCode && errors.ifscCode
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="IFSC Code"
                            />
                            <ErrorMessage
                              name="ifscCode"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </div>

                      {submitError && (
                        <div className="alert alert-danger mt-3">
                          {submitError}
                        </div>
                      )}

                      {bankVerified && (
                        <div className="alert alert-success mt-3">
                          Bank details verified successfully!
                        </div>
                      )}

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="z_button w-100"
                          disabled={isSubmitting || bankVerificationInProgress}
                        >
                          {bankVerificationInProgress
                            ? "Verifying..."
                            : bankVerified
                            ? "Verified ✓"
                            : "Verify Bank Details"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      )}

      {/* Pickup Address Section */}
      {currentUser?.filledSteps === 4 && (
        <Container className="d-flex align-items-center justify-content-center">
          <Row>
            <Col sm={12}>
              <div className="k-pickup-details-container w-50 mx-auto">
                <div className="k-bank-title text-center">
                  <h4 className="fw-semibold">Pickup Address</h4>
                  <p className="k-text-gray">
                    Products will be picked up from this location for delivery.
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={12}>
              <div className="k-pickup-form w-50 mx-auto">
                <Formik
                  initialValues={{
                    room: formData.room || "",
                    street: formData.street || "",
                    landmark: formData.landmark || "",
                    pincode: formData.pincode || "",
                    city: formData.city || "",
                    state: formData.state || "",
                  }}
                  validationSchema={pickupAddressValidationSchema}
                  onSubmit={handlePickupAddressSubmit}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="k-pickup-group">
                        <div className="k-room mb-3">
                          <label htmlFor="room" className="form-label m-0 mb-1">
                            Room/ Floor/ Building Number
                          </label>
                          <div className="k-room-input">
                            <Field
                              type="text"
                              id="room"
                              name="room"
                              className={`form-control k-input-bg-color ${
                                touched.room && errors.room ? "is-invalid" : ""
                              }`}
                              placeholder="Room/ Floor/ Building Number"
                            />
                            <ErrorMessage
                              name="room"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="k-street mb-3">
                          <label
                            htmlFor="street"
                            className="form-label m-0 mb-1"
                          >
                            Street/ Locality
                          </label>
                          <div className="k-street-input">
                            <Field
                              type="text"
                              id="street"
                              name="street"
                              className={`form-control k-input-bg-color ${
                                touched.street && errors.street
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Street/ Locality"
                            />
                            <ErrorMessage
                              name="street"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="k-landmark">
                          <label
                            htmlFor="landmark"
                            className="form-label m-0 mb-1"
                          >
                            Landmark
                          </label>
                          <div className="k-landmark-input">
                            <Field
                              type="text"
                              id="landmark"
                              name="landmark"
                              className="form-control k-input-bg-color"
                              placeholder="Landmark"
                            />
                            <ErrorMessage
                              name="landmark"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="k-pincode-group mt-3">
                          <div className="d-flex">
                            <div className="me-3">
                              <label
                                htmlFor="pincode"
                                className="form-label m-0 mb-1"
                              >
                                Pincode
                              </label>
                              <div className="k-landmark-input">
                                <Field
                                  type="text"
                                  id="pincode"
                                  name="pincode"
                                  className={`form-control k-input-bg-color ${
                                    touched.pincode && errors.pincode
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="Pincode"
                                />
                                <ErrorMessage
                                  name="pincode"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="city"
                                className="form-label m-0 mb-1"
                              >
                                City
                              </label>
                              <div className="k-landmark-input">
                                <Field
                                  type="text"
                                  id="city"
                                  name="city"
                                  className={`form-control k-input-bg-color ${
                                    touched.city && errors.city
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="City"
                                />
                                <ErrorMessage
                                  name="city"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="k-state mt-2">
                          <label
                            htmlFor="state"
                            className="form-label m-0 mb-1"
                          >
                            State
                          </label>
                          <div className="k-state-input">
                            <Field
                              type="text"
                              id="state"
                              name="state"
                              className={`form-control k-input-bg-color ${
                                touched.state && errors.state
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="State"
                            />
                            <ErrorMessage
                              name="state"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </div>

                      {submitError && (
                        <div className="alert alert-danger mt-3">
                          {submitError}
                        </div>
                      )}

                      <div className="k-pickup-submit">
                        <button
                          type="submit"
                          className="z_button w-100 d-block mt-5"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Continue"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      )}

      {currentUser?.filledSteps === 5 && (
        <Container className="d-flex align-items-center justify-content-center">
          <Row>
            <Col sm={12}>
              <div className="k-verify-details-container w-50 mx-auto">
                <div className="k-verify-title text-center">
                  <h4 className="fw-semibold">Verify & Submit</h4>
                  <p className="k-text-gray">
                    Bank account should be in the name of registered business
                    name or trade name as per GSTIN.
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={12}>
              <div className="k-verify-container w-50 mx-auto">
                <div className="k-veri-details k-text-gray w-75 mx-auto">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <p>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </p>

                  <div className="k-agreement mt-4">
                    <div className="k-agreement-group d-flex">
                      <input
                        type="checkbox"
                        name="agree"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                      />
                      <p className="m-0 ms-2">
                        I agree to comply with FastKart's{" "}
                        <strong className="text-dark">Seller Agreement</strong>.
                      </p>
                    </div>
                    {agreementError && (
                      <div className="text-danger mt-2">{agreementError}</div>
                    )}
                  </div>
                  <div className="k-submit-btn mt-5">
                    <button
                      className="z_button fs-6 d-block w-100"
                      onClick={handleVerifySubmit}
                    >
                      Verify & Submit
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default SellerGstDetails;
