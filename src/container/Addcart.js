import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  Form,
  Modal,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { createCart, deleteCart, getallMyCarts, updateCart } from '../redux/slices/cart.Slice';
import { FaArrowRight, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  selectCurrency,
  selectCurrencySymbol,
  convertPrice,
} from "../redux/slices/currency.Slice";

import "../styles/denisha.css";
import "../styles/Home.css";
// import '../styles/x_app.css'
import brocolli from "../img/Kassets/Broccoli.png";
import Delete from "../img/Kassets/Delete.png";
import { FiPlus } from "react-icons/fi";
import { Formik, Field, ErrorMessage, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import FastKartHeader from "./FastKartHeader";
import LogoHeader from "./LogoHeader";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupons } from "../redux/slices/coupon.Slice";
import { createOrder } from "../redux/slices/order.Slice";
import { createAddress, getUserAddresses, updateAddress } from "../redux/slices/address.Slice";

function Addcart({ setIsCheckoutPage, setIsCartPage }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCurrency = useSelector(selectCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const { conversionRates } = useSelector((state) => state.currency);
  const { cartItems = [] } = useSelector((state) => state.addcart);
  console.log(cartItems,"cartItems");
  const convertPriceValue = (amount) => {
    if (!amount || isNaN(amount)) return 0;

    // Parse the amount to ensure it's a number
    const numAmount = parseFloat(amount);

    // Convert from USD to selected currency
    return (numAmount * conversionRates[selectedCurrency]).toFixed(2);
  };

  // Format price with appropriate currency symbol
  const formatPrice = (amount) => {
    if (!amount || isNaN(amount)) return `${currencySymbol}0`;

    const convertedAmount = convertPriceValue(amount);
    return `${currencySymbol}${convertedAmount}`;
  };

  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const userCartItems = useSelector((state) =>
    (state.addcart.cartItems || []).filter((item) => item.userId === userId)
  );

  const [show, setShow] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(1);
  // Add state for the applied coupon
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });
  useEffect(() => {
    dispatch(getallMyCarts());
    dispatch(getAllCoupons());
    dispatch(getUserAddresses());
  }, [dispatch]);
  // Function to remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("appliedCoupon");
  };

  // Modals
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSelectAddressModal, setShowSelectAddressModal] = useState(false);
  const addresses = useSelector((state) => state.address.addresses);
  // Add state for saved addresses with localStorage implementation
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const storedSelectedAddress = localStorage.getItem("selectedAddress");
      if (storedSelectedAddress) {
        const parsedAddress = JSON.parse(storedSelectedAddress);
        const existingAddress = addresses.find(
          (addr) => addr._id === parsedAddress._id
        );
        if (existingAddress) {
          setSelectedAddress(existingAddress);
        } else {
          setSelectedAddress(addresses[0]);
        }
      } else {
        setSelectedAddress(addresses[0]);
      }
    }
  }, [addresses]);
  // Fetch addresses from API on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/allMyAddress", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch addresses");
        const data = await response.json();
        setSavedAddresses(data.data || []);

        // Set selected address if exists in localStorage
        const storedSelectedAddress = localStorage.getItem("selectedAddress");
        if (storedSelectedAddress && data.data.length > 0) {
          const parsedAddress = JSON.parse(storedSelectedAddress);
          const existingAddress = data.data.find(
            (addr) => addr._id === parsedAddress._id
          );
          if (existingAddress) setSelectedAddress(existingAddress);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Broccoli - Organically Grown",
      weight: "250 g",
      price: 35,
      qty: 1,
      img: brocolli,
    },
    {
      id: 2,
      name: "Carrots - Fresh Farm",
      weight: "500 g",
      price: 25,
      qty: 2,
      img: brocolli,
    },
    {
      id: 3,
      name: "Tomatoes - Organic",
      weight: "1 kg",
      price: 40,
      qty: 1,
      img: brocolli,
    },
  ]);

  const updateQuantity = async (cartId, type) => {
    try {
      const cartItem = cartItems.find((item) => item._id === cartId);
      if (!cartItem) return;

      // Calculate new quantity
      const newQuantity =
        type === "increase"
          ? cartItem.quantity + 1
          : Math.max(1, cartItem.quantity - 1);

      // Only update if quantity has changed
      if (newQuantity !== cartItem.quantity) {
        const result = await dispatch(
          updateCart({
            cartId: cartId,
            quantity: newQuantity,
          })
        ).unwrap();

        if (result.success) {
          // Refresh cart items to get updated data
          dispatch(getallMyCarts());
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const deleteItem = async (cartId) => {
    try {
      if (!cartId) {
        console.error("Invalid cart ID provided for deletion");
        return;
      }

      // Dispatch deleteCart action
      const result = await dispatch(deleteCart(cartId)).unwrap();

      if (result && result.success) {
        // Refresh cart items after successful deletion
        dispatch(getallMyCarts());
      } else {
        console.error(
          "Failed to delete cart item:",
          result?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Coupons
  // Remove this line since it's already declared above
  // Add this near your other useSelector calls at the top of the component
  const coupons = useSelector((state) => state.coupons.coupons);

  const [couponInput, setCouponInput] = useState("");

  // Remove duplicate useEffect and useState for coupons

  // Update the calculateTotals function
  // Remove the first calculateTotals function and keep this updated version
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item?.productVarientData?.[0]?.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);

    const platformFee = 10;
    const discount = appliedCoupon
      ? (subtotal * appliedCoupon.coupenDiscount) / 100
      : 0;
    const deliveryCharges = 0; // FREE delivery

    const grandTotal = Math.max(
      0,
      subtotal - discount + platformFee + deliveryCharges
    );

    return {
      subtotal,
      discount,
      platformFee,
      deliveryCharges,
      grandTotal,
    };
  };

  // Update handleApplyCoupon to use the new discount calculation
  // Update handleApplyCoupon function
  const handleApplyCoupon = () => {
    if (!couponInput || !coupons) {
      alert("Please enter a valid coupon code");
      return;
    }

    const selectedCouponData = coupons.find(
      (coupon) => coupon.title?.toLowerCase() === couponInput.toLowerCase()
    );

    if (selectedCouponData) {
      const subtotal = cartItems.reduce((total, item) => {
        return (
          total +
          (item.productVarientData?.[0]?.price || 0) * (item.quantity || 0)
        );
      }, 0);

      const discountAmount =
        (subtotal * selectedCouponData.coupenDiscount) / 100;

      const couponToApply = {
        ...selectedCouponData,
        discount: discountAmount,
      };

      setAppliedCoupon(couponToApply);

      // Save the applied coupon to localStorage
      localStorage.setItem("appliedCoupon", JSON.stringify(couponToApply));

      setShow(false); // Close the modal
    } else {
      alert("Invalid coupon code");
    }
  };

  // Update the coupon selection part in the modal
  <label
    key={coupons._id}
    className="x_radio-wrapper Z_coupon_item d-flex align-items-start p-3"
    onClick={() => {
      handleCouponSelect(coupons._id);
      setCouponInput(coupons.title); // Use title instead of code
    }}
  >
    <input
      type="radio"
      name="coupon"
      checked={selectedCoupon === coupons._id}
      onChange={() => {
        handleCouponSelect(coupons._id);
        setCouponInput(coupons.title); // Use title instead of code
      }}
      className="x_radio-input"
    />
    <span className="x_radio-custom"></span>
    <div className="Z_coupon_details ms-2">
      <strong className="Z_coupon_code">{coupons.title}</strong>
      <p className="Z_coupon_desc">{coupons.description}</p>
      <span className="Z_coupon_discount">Save {coupons.coupenDiscount}%</span>
    </div>
  </label>;

  // Add function to handle coupon selection
  const handleCouponSelect = (couponId) => {
    setSelectedCoupon(couponId);
    const selected = coupons.find((coupon) => coupon._id === couponId);
    localStorage.setItem("appliedCoupon", JSON.stringify(couponId));
    if (selected) {
      setCouponInput(selected.title);
      console.log("Selected coupon code:", selected.title);
    }
  };

  // Add function to apply the coupon

  // Address validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    address1: Yup.string().required("Address line 1 is required"),
    address2: Yup.string().required("Address line 2 is required"),
    postalCode: Yup.string()
      .matches(/^\d{6}$/, "Postal code must be exactly 6 digits")
      .required("Postal code is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    saveAddressAs: Yup.string()
      .oneOf(["Home", "Office", "Other"], "Invalid address type")
      .required("Address type is required"),
  });

  // Function to handle address submission
  const handleAddressSubmit = async (values, { resetForm }) => {
    try {
      const addressData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        address1: values.address1,
        address2: values.address2,
        postalCode: values.postalCode,
        city: values.city,
        state: values.state,
        country: values.country,
        saveAddressAs: values.saveAddressAs,
      };

      if (editingAddress) {
        const result = await dispatch(
          updateAddress({
            addressId: editingAddress._id,
            addressData: addressData
          })
        ).unwrap();

        if (result.success) {
          await dispatch(getUserAddresses());
          const updatedAddresses = await fetch("http://localhost:4000/api/allMyAddress", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }).then(res => res.json());
          setSavedAddresses(updatedAddresses.data || []);
          setEditingAddress(null);
          setShowFirstModal(false);
          resetForm();
        }
      } else {
        const result = await dispatch(createAddress(addressData)).unwrap();

        if (result.success) {
          await dispatch(getUserAddresses());
          const updatedAddresses = await fetch("http://localhost:4000/api/allMyAddress", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }).then(res => res.json());
          setSavedAddresses(updatedAddresses.data || []);
          setShowFirstModal(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  // Add this function to handle address selection
  const handleSelectAddress = (address) => {
    console.log("address", address);
    setSelectedAddress(address);
    setShowSelectAddressModal(false);
  };

  // Function to handle editing an address
  const handleEditAddress = (address) => {
    // Set the address to be edited
    setEditingAddress(address);
    // Close the select address modal first
    setShowSelectAddressModal(false);
    // Open the edit modal with a slight delay to ensure smooth transition
    setTimeout(() => {
      setShowFirstModal(true);
    }, 100);
  };

  // Get the address to display (either selected or first in the list)
  // Add this after the other const declarations and before the return statement
  const displayAddress =
    selectedAddress || (savedAddresses.length > 0 ? savedAddresses[0] : null);

  // Then in the JSX where displayAddress is used, add a conditional check
  {
    savedAddresses.length > 0 && displayAddress && (
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div
            className="mb-1"
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span style={{ color: "#6c757d", fontWeight: "400" }}>
              Deliver to:
            </span>
            <span style={{ color: "#212529", fontWeight: "500" }}>
              {displayAddress.firstName} {displayAddress.lastName}
            </span>
            <span
              style={{
                backgroundColor: "#f8f9fa",
                color: "#212529",
                padding: "0.125rem 0.5rem",
                fontSize: "0.75rem",
                borderRadius: "0.25rem",
                border: "1px solid #dee2e6",
                marginLeft: "0.5rem",
              }}
            >
              {displayAddress.saveAddressAs}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ color: "#6c757d", fontWeight: "400" }}>
              {displayAddress.address1}, {displayAddress.address2}-
              {displayAddress.postalCode}, {displayAddress.city},{" "}
              {displayAddress.state}, {displayAddress.country}
            </span>
          </div>
        </div>
        <Button
          variant="outline-dark"
          onClick={() => setShowSelectAddressModal(true)}
        >
          Change
        </Button>
      </div>
    );
  }
  const handleCheckout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login to checkout");
        navigate("/login");
        return;
      }

      if (!selectedAddress) {
        alert("Please select a delivery address");
        return;
      }

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty");
        return;
      }

      // Prepare order items with proper structure and validation
      const orderItems = cartItems.map(item => {
        const product = item.productData?.[0];
        const variant = item.productVarientData?.[0];

        if (!product || !variant) {
          console.error("Invalid product data:", item);
          return null;
        }

        return {
          productId: product._id,
          variantId: variant._id,
          quantity: Number(item.quantity) || 1,
          price: Number(variant.price) || 0,
          productName: product.productName, // Optional: for reference
          variantSize: variant.size // Optional: for reference
        };
      }).filter(item => item !== null); // Remove any invalid items

      if (orderItems.length === 0) {
        alert("No valid items in cart");
        return;
      }

      const totals = calculateTotals();

      const orderData = {
        userId: user._id,
        addressId: selectedAddress._id,
        items: orderItems.map(item => ({
          productId: item.productId,
          productVarientId: item.productVarientId,
          quantity: item.quantity
        })),
        platFormFee: Number(totals.platformFee) || 0,
        coupenId: appliedCoupon ? appliedCoupon._id : null,
        totalAmount: Number(totals.grandTotal) || 0,
        orderStatus: "Pending",
        paymentStatus: "not Received"
      };

      // Create order
      const result = await dispatch(createOrder(orderData)).unwrap();

      if (result.success) {
        // Clear cart and coupon
        setAppliedCoupon(null);
        localStorage.removeItem('appliedCoupon');

        // Navigate to success page
        localStorage.setItem("orderId", result.data._id);
        setIsCheckoutPage(true);
        setIsCartPage(false);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.message || "Failed to create order. Please try again.");
    }
  };
  return (
    <>
      <div className="Z_cart_container py-4">
        {/* Cart Section */}
        <Row className="mt-4">
          <Col lg={8} sm={12}>
            {/* Address Section - conditionally render based on saved addresses */}
            {savedAddresses.length === 0 ? (
              // No saved addresses - match Image 2
              <div className="Z_address_box p-3 mb-3 d-flex justify-content-between align-items-center">
                <span>No saved Addresses</span>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowFirstModal(true);
                  }}
                  className="z_button_trans"
                >
                  <FiPlus size={17} /> Add Address
                </Button>
              </div>
            ) : (
              // Address is saved - match Image 1
              <div
                className="Z_address_box p-3 mb-3"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "0.25rem",
                  backgroundColor: "#fff",
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div
                      className="mb-1"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span style={{ color: "#6c757d", fontWeight: "400" }}>
                        Deliver to:
                      </span>
                      <span style={{ color: "#212529", fontWeight: "500" }}>
                        {displayAddress.firstName} {displayAddress.lastName}
                      </span>

                      <span
                        style={{
                          backgroundColor: "#f8f9fa",
                          color: "#212529",
                          padding: "0.125rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.25rem",
                          border: "1px solid #dee2e6",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {displayAddress.saveAddressAs}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          color: "#6c757d",
                          fontWeight: "400",
                        }}
                      >
                        {displayAddress.address1}, {displayAddress.address2}-
                        {displayAddress.postalCode} ,{displayAddress.city} ,{" "}
                        {displayAddress.state}, {displayAddress.country}
                      </span>
                    </div>
                    <div
                      style={{
                        color: "#6c757d",
                        fontSize: "0.875rem",
                        maxWidth: "500px",
                      }}
                    >
                      {displayAddress.fullAddress}
                    </div>
                  </div>
                  <Button
                    variant="outline-dark"
                    onClick={() => setShowSelectAddressModal(true)}
                  >
                    Change
                  </Button>

                  {/* Select Address Modal */}
                  <Modal
                    show={showSelectAddressModal}
                    onHide={() => setShowSelectAddressModal(false)}
                    centered
                    className="z_select_address_modal"
                  >
                    <Modal.Header closeButton className="border-0 pb-2">
                      <Modal.Title className="fw-semibold text-dark">
                        Select Address
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                      {savedAddresses.length > 0 ? (
                        savedAddresses.map((address) => (
                          <div
                            key={address._id}
                            className={`border rounded mb-3 p-3 ${selectedAddress &&
                                selectedAddress._id === address._id
                                ? "border-primary"
                                : "border-light"
                              } shadow-sm`}
                            style={{
                              cursor: "pointer",
                              transition: "all 0.3s ease-in-out",
                            }}
                            onClick={() => handleSelectAddress(address)}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <span
                                className="me-2 px-3 py-1 rounded"
                                style={{
                                  background: "rgba(243, 249, 251, 1)",
                                  border: " 0.89px solid rgba(15, 15, 15, 0.1)",
                                  color: "black",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                }}
                              >
                                {address.saveAddressAs}
                              </span>
                              <span
                                className="fw-medium text-dark"
                                style={{
                                  fontWeight: "500",
                                  fontSize: "18px",
                                }}
                              >
                                {address.firstName} {address.lastName}
                              </span>
                              <div className="ms-auto">
                                <Button
                                  variant="link"
                                  className="p-0 text-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent the parent onClick from firing
                                    handleEditAddress(address);
                                  }}
                                >
                                  <FaEdit />
                                </Button>
                              </div>
                            </div>
                            <div className="mb-1 text-dark fw-medium">
                              +91 {address.phone}
                            </div>
                            <div
                              className="text-dark fw-normal"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {address.address1}, {address.address2},{" "}
                              {address.city}, {address.state}, {address.country}{" "}
                              - {address.postalCode}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted">
                          No saved addresses yet.
                        </div>
                      )}

                      <Button
                        className="w-100 z_button py-2 mt-3 d-flex align-items-center justify-content-center"
                        onClick={() => {
                          setEditingAddress(null);
                          setShowSelectAddressModal(false);
                          setTimeout(() => setShowFirstModal(true), 100);
                        }}
                      >
                        <FiPlus size={17} /> Add New Address
                      </Button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            )}

            {/* Add Address Modal */}
            <Modal
              show={showFirstModal}
              onHide={() => setShowFirstModal(false)}
              centered
              size="lg"
              className="Z_Add_address "
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </Modal.Title>
              </Modal.Header>

              <Formik
                initialValues={
                  editingAddress || {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    email: "",
                    address1: "",
                    address2: "",
                    postalCode: "",
                    city: "",
                    state: "",
                    country: "",
                    saveAddressAs: "Home",
                  }
                }
                validationSchema={validationSchema}
                enableReinitialize={true} // This is important to update form when editingAddress changes
                onSubmit={handleAddressSubmit}
              >
                {({ values, setFieldValue }) => (
                  <FormikForm>
                    <Modal.Body>
                      <div className="row">
                        {[
                          { label: "First name", name: "firstName" },
                          { label: "Last name", name: "lastName" },
                          { label: "Phone", name: "phone" },
                          { label: "Email", name: "email" },
                          { label: "Flat/ House No/ Building Name", name: "address1" },
                          { label: "Landmark", name: "address2" },
                          { label: "Pin Code", name: "postalCode" },
                          { label: "City", name: "city" },
                          { label: "State", name: "state" },
                          { label: "Country", name: "country" },
                        ].map(({ label, name }, index) => (
                          <div
                            className="col-md-6 col-12 mb-3 Z_Address_form"
                            key={index}
                          >
                            <label className="Z_form_label">{label}</label>
                            <Field
                              className="form-control Z_add_fields"
                              name={name}
                              placeholder={label}
                            />
                            <ErrorMessage
                              name={name}
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        ))}

                        {/* Save Address as Section */}
                        <div className="mb-3 gap-4 d-flex align-items-center">
                          <div className="me-3">
                            <label className="fw-bold">Save Address as</label>
                            {/* <div className="d-flex gap-2">
                                                        {["Home", "Office", "Other"].map((type, idx) => (
                                                            <label key={idx} className="z_radio-wrapper">
                                                                <input
                                                                    type="radio"
                                                                    name="saveAddressAs"
                                                                    value={type}
                                                                    checked={values.saveAddressAs === type}
                                                                    onChange={() => setFieldValue("saveAddressAs", type)}
                                                                    className="z_radio-input"
                                                                />
                                                                <span className="z_radio-custom"></span>
                                                                <span className="z_radio-label">{type}</span>
                                                            </label>
                                                        ))}
                                                    </div> */}
                            <div className="d-flex gap-2 z_options_resp">
                              {["Home", "Office", "Other"].map((type, idx) => (
                                <label
                                  key={idx}
                                  className={`z_radio-wrapper ${values.saveAddressAs === type
                                      ? "selected"
                                      : ""
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    name="saveAddressAs"
                                    value={type}
                                    checked={values.saveAddressAs === type}
                                    onChange={() =>
                                      setFieldValue("saveAddressAs", type)
                                    }
                                    className="z_radio-input"
                                  />
                                  <span className="z_radio-custom"></span>
                                  <span className="z_radio-label">{type}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>

                    <Modal.Footer className="border-0 gap-3 d-flex justify-content-center z_address_footer">
                      <Button
                        variant=" border"
                        onClick={() => setShowFirstModal(false)}
                        className="px-5 z_cancel_address"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="success"
                        className="z_button"
                      >
                        {editingAddress ? "Update" : "Save"}
                      </Button>
                    </Modal.Footer>
                  </FormikForm>
                )}
              </Formik>
            </Modal>

            {/* Table */}
            <div
              style={{ overflowX: "auto", maxWidth: "100%" }}
              className="z_tbl_radius"
            >
              <table className="Z_cart-table" style={{ minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td className="Z_cart-product">
                        <div className="Z_cart-product-image">
                          <img
                            src={
                              item.productData?.[0]?.images?.[0]
                                ? `http://localhost:4000/public/${item.productData[0].images[0].replace(
                                  "public\\",
                                  ""
                                )}`
                                : brocolli // fallback image
                            }
                            alt={
                              item.productData?.[0]?.productName || "Product"
                            }
                          />
                        </div>
                        <div className="Z_cart-product-info">
                          <p>
                            {item.productData?.[0]?.productName ||
                              "Unknown Product"}
                          </p>
                          <small>
                            {item.productVarientData?.[0]?.size || "N/A"}
                          </small>
                        </div>
                      </td>
                      <td>
                        {" "}
                        {formatPrice(
                          `${item.productVarientData?.[0]?.price || 0}`
                        )}
                      </td>
                      <td>
                        <div className="Z_cart-quantity">
                          <button
                            onClick={() => updateQuantity(item._id, "decrease")}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, "increase")}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        {formatPrice(
                          (item.productVarientData?.[0]?.price || 0) *
                          (item.quantity || 0)
                        )}
                      </td>
                      <td>
                        <Button
                          className="Z_delete-btn bg-transparent border-0"
                          onClick={() => deleteItem(item._id)}
                        >
                          <img src={Delete} alt="" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <span>
              <Link
                to="/"
                className="Z_continue_shopping text-dark"
                onClick={() => {
                  localStorage.setItem("activePage", "Vegetables");
                  window.location.reload(); // This will trigger the useEffect in HomeMain
                }}
                style={{
                  borderBottom: "1px solid gray",
                  display: "inline-block",
                }}
              >
                Continue Shopping
              </Link>
            </span>
          </Col>

          {/* Coupon & Price Details Section */}
          <Col lg={4} sm={12}>
            {/* Apply Coupon Section */}
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <div
                className="Z_coupon_box d-flex justify-content-between align-items-center p-3 mb-2"
                style={{
                  cursor: "pointer",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
                onClick={handleShow}
              >
                <span>Apply Coupon</span>
                <FaArrowRight />
              </div>
            ) : (
              <div
                className="Z_coupon_box"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <h5 className="m-0" style={{ fontSize: "16px" }}>
                    Applied Coupon
                  </h5>
                  <FaArrowRight />
                </div>
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong style={{ fontSize: "16px", fontWeight: "600" }}>
                      {appliedCoupon.title}
                    </strong>
                    <span
                      className="text-danger Z_remove_coupon"
                      onClick={() => setAppliedCoupon(null)}
                      style={{ cursor: "pointer" }}
                    >
                      Remove
                    </span>
                  </div>
                  <p className="text-secondary fw-normal mb-1">
                    {appliedCoupon.description}
                  </p>
                  <p className="z_font_bold mb-0">
                    Save ${appliedCoupon.discount}
                  </p>
                </div>
              </div>
            )}

            {/* Coupon Modal */}

            <Modal
              show={show}
              onHide={handleClose}
              centered
              className="Z_coupon_modal custom-modal-animation"
            >
              <Modal.Header closeButton>
                <Modal.Title className="Z_modal_title">
                  Select Coupon
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Coupon Input */}
                <div className="Z_coupon_input d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control Z_input_field"
                    placeholder="Enter Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <Button
                    variant="success"
                    className="z_button"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </div>

                {/* Applicable Coupons List */}
                <div className="Z_coupon_list mt-3">
                  <h6 className="Z_coupon_heading">Applicable Coupons</h6>
                  {coupons && coupons.length > 0 ? (
                    coupons.map((coupon) => (
                      <label
                        key={coupon._id}
                        className="x_radio-wrapper Z_coupon_item d-flex align-items-start p-3"
                        onClick={() => {
                          handleCouponSelect(coupon._id);
                          setCouponInput(coupon.title); // Changed from title to code
                        }}
                      >
                        <input
                          type="radio"
                          name="coupon"
                          checked={selectedCoupon === coupon._id}
                          onChange={() => {
                            handleCouponSelect(coupon._id);
                            setCouponInput(coupon.title); // Changed from title to code
                          }}
                          className="x_radio-input"
                        />
                        <span className="x_radio-custom"></span>
                        <div className="Z_coupon_details ms-2">
                          <strong className="Z_coupon_code">
                            {coupon.title}
                          </strong>
                          <p className="Z_coupon_desc">{coupon.description}</p>
                          <span className="Z_coupon_discount">
                            Save {coupon.coupenDiscount}%
                          </span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center text-muted">
                      No coupons available
                    </div>
                  )}
                </div>
              </Modal.Body>
            </Modal>

            {/* Price Details Section */}
            <Card className="Z_price_card mt-3">
              <Card.Body className="p-0">
                {/* Price Details Header */}
                <div className="Z_Price_Details_head">Price Details</div>
                <div className="Z_price_details">
                  <p>
                    Price ({cartItems.length} Items){" "}
                    <span>${calculateTotals().subtotal}</span>
                  </p>
                  <p>
                    Discount{" "}
                    <span className="text-success">
                      -${calculateTotals().discount}
                    </span>
                  </p>
                  <p>
                    Platform Fee <span>${calculateTotals().platformFee}</span>
                  </p>
                  <p>
                    Delivery Charges{" "}
                    <span className="text-success">
                      <s className="text-secondary">$20</s> FREE
                    </span>
                  </p>
                  <hr />
                  <p className="Z_total">
                    Total <span>${calculateTotals().grandTotal}</span>
                  </p>
                  <Button
                    variant="success"
                    className="w-100 z_button"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Addcart;
