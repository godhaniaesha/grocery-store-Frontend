import { useEffect, useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCart, updateCart, getallMyCarts } from '../redux/slices/cart.Slice';
import { getAllCoupons } from '../redux/slices/coupon.Slice';
import {
  selectCurrency,
  selectCurrencySymbol,
} from "../redux/slices/currency.Slice";
import { createAddress, deleteAddress, getUserAddresses, updateAddress } from "../redux/slices/address.Slice";
import { createOrder } from '../redux/slices/order.Slice';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaMapMarkerAlt, FaList, FaPlus } from 'react-icons/fa';
import { FaEdit, FaTrash } from 'react-icons/fa';
import "../styles/x_app.css"
import { RadioGroup } from '@mui/material';

export default function AddcartDesign() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this line to initialize the navigate function
  const { cartItems = [] } = useSelector((state) => state.addcart);
  const { coupons = [], loading: couponLoading } = useSelector((state) => state.coupons);
  const { addresses = [] } = useSelector((state) => state.address);
  const selectedCurrency = useSelector(selectCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const { conversionRates } = useSelector((state) => state.currency);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const savedAddress = localStorage.getItem('selectedAddress');
    return savedAddress ? JSON.parse(savedAddress) : null;
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);  // Add this line
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Add cart data log to view in useEffect
  useEffect(() => {
    dispatch(getallMyCarts());
    dispatch(getAllCoupons());
    dispatch(getUserAddresses()); // Add this line
  }, [dispatch]);
  const [shippingMethod, setShippingMethod] = useState("free");
  // const [discountCode, setDiscountCode] = useState("");
  // const [agreedToTerms, setAgreedToTerms] = useState(false);


  // Replace the applyDiscountCode function with this updated version
  const applyDiscountCode = () => {
    if (!discountCode.trim()) {
      alert('Please enter coupon code');
      return;
    }
    const coupon = coupons.find(c => c.code === discountCode || c.title === discountCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      console.log('Coupon applied:', coupon);
    } else {
      setAppliedCoupon(null);
      alert('Invalid coupon code');
    }
  };

  const updateQuantity = async (cartId, type) => {
    try {
      const cartItem = cartItems.find((item) => item._id === cartId);
      if (!cartItem) return;

      const newQuantity = type === "increase"
        ? cartItem.quantity + 1
        : Math.max(1, cartItem.quantity - 1);

      if (newQuantity !== cartItem.quantity) {
        const result = await dispatch(
          updateCart({
            cartId: cartId,
            quantity: newQuantity,
          })
        ).unwrap();

        if (result.success) {
          dispatch(getallMyCarts());
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (cartId) => {
    try {
      const result = await dispatch(deleteCart(cartId)).unwrap();
      if (result && result.success) {
        dispatch(getallMyCarts());
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const convertPriceValue = (amount) => {
    if (!amount || isNaN(amount)) return 0;
    const numAmount = parseFloat(amount);
    return (numAmount * conversionRates[selectedCurrency]).toFixed(2);
  };

  const formatPrice = (amount) => {
    if (!amount || isNaN(amount)) return `${currencySymbol}0`;
    const convertedAmount = convertPriceValue(amount);
    return `${currencySymbol}${convertedAmount}`;
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item?.productVarientData?.[0]?.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.coupenType === "Fixed") {
        discount = appliedCoupon.coupenDiscount;
      } else if (appliedCoupon.coupenType === "Percentage") {
        discount = subtotal * (appliedCoupon.coupenDiscount / 100);
      }
    }

    const shippingCost = shippingMethod === "free" ? 0 : 35;
    return subtotal - discount + shippingCost;
  };


  const [address, setAddress] = useState({
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
    saveAddressAs: ""
  });

  const handleEditAddress = async (address) => {
    setEditingAddress(address);
    setAddress({
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      email: address.email,
      address1: address.address1,
      address2: address.address2,
      postalCode: address.postalCode,
      city: address.city,
      state: address.state,
      country: address.country,
      saveAddressAs: address.saveAddressAs
    });
    setShowAddressForm(true);
  };

  const handleAddAddress = async () => {
    if (!address.firstName || !address.lastName || !address.phone || !address.email ||
      !address.address1 || !address.address2 || !address.postalCode ||
      !address.city || !address.state || !address.country || !address.saveAddressAs) {
      return;
    }

    try {
      if (editingAddress) {
        // Update existing address
        await dispatch(updateAddress({
          addressId: editingAddress._id,
          addressData: address
        })).unwrap();
      } else {
        // Create new address
        await dispatch(createAddress(address)).unwrap();
      }

      dispatch(getUserAddresses()); // Refresh addresses list

      // Update selected address if we're editing it
      if (editingAddress && selectedAddress && editingAddress._id === selectedAddress._id) {
        setSelectedAddress({ ...address, _id: editingAddress._id });
        localStorage.setItem('selectedAddress', JSON.stringify({ ...address, _id: editingAddress._id }));
      }

      // Reset form
      setAddress({
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
        saveAddressAs: ""
      });
      setEditingAddress(null);
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };
  // ... existing code ...
  const handleDeleteAddress = async (addressId) => {
    try {
      if (!addressId) {
        console.error('No address ID provided for deletion');
        return;
      }

      if (window.confirm('Are you sure you want to delete this address?')) {
        await dispatch(deleteAddress(addressId)).unwrap();

        // If the deleted address was the selected address, clear it
        if (selectedAddress && selectedAddress._id === addressId) {
          setSelectedAddress(null);
          localStorage.removeItem('selectedAddress');
        }

        // Refresh the addresses list
        dispatch(getUserAddresses());

        // Close the modal if it's open
        setShowAddressModal(false);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };


  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyCouponCode = (code) => {
    setDiscountCode(code);
    const coupon = coupons.find(c => c.code === code || c.title === code);
    if (coupon) {
      setAppliedCoupon(coupon);
      console.log('Coupon applied:', coupon);
    } else {
      setAppliedCoupon(null);
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      productVarientId: item.productVarientId,
      quantity: Number(item.quantity) || 1
    }));

    const subtotal = getSubtotal();
    let discountAmount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.coupenType === "Fixed") {
        discountAmount = appliedCoupon.coupenDiscount;
      } else if (appliedCoupon.coupenType === "Percentage") {
        discountAmount = subtotal * (appliedCoupon.coupenDiscount / 100);
      }
    }

    const shippingCost = shippingMethod === "free" ? 0 : 35;
    const grandTotal = subtotal - discountAmount + shippingCost;
    if (appliedCoupon) {
      localStorage.setItem('coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('coupon');
    }
    const orderData = {
      userId: localStorage.getItem('userId'),
      addressId: selectedAddress._id,
      items: orderItems,
      platFormFee: 0,
      coupenId: appliedCoupon?._id || null,
      discountAmount: discountAmount,
      shippingCost: shippingCost,
      totalAmount: grandTotal,
      orderStatus: "Pending",
      paymentStatus: "not Received"
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      // console.log(result,"result");

      if (result) {
        // ઓર્ડર ID લોકલસ્ટોરેજમાં સેવ કરો
        localStorage.setItem('orderId', result.data._id);
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Order creation failed. Please try again.');
    }
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem('selectedAddress', JSON.stringify(addr));
    setShowAddressModal(false);
  };

  // Add this function to clear selected address
  const handleClearAddress = () => {
    setSelectedAddress(null);
    localStorage.removeItem('selectedAddress');
  };

  // Update the selected address display section
  {
    selectedAddress && (
      <div className="border rounded p-3 mb-3">
        <div className="d-flex justify-content-between">
          <h6 className="mb-2">Selected Address</h6>
          <button
            className="btn btn-link text-danger p-0"
            onClick={handleClearAddress}
          >
            Change
          </button>
        </div>
        <p className="mb-1">{selectedAddress.firstName} {selectedAddress.lastName}</p>
        <p className="mb-1">{selectedAddress.phone}</p>
        <p className="mb-1">
          {selectedAddress.address1}, {selectedAddress.address2}-{selectedAddress.postalCode}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country}
        </p>
        <span className="badge bg-light text-dark">{selectedAddress.saveAddressAs}</span>
      </div>
    )
  }
  // const handleEditAddress = async (address) => {
  //   try {
  //     await dispatch(updateAddress({
  //       addressId: address._id,
  //       addressData: address
  //     })).unwrap();
  //     dispatch(getUserAddresses()); // Refresh addresses list
  //     setEditingAddress(null);
  //     setShowAddressForm(false);
  //   } catch (error) {
  //     alert('એડ્રેસ અપડેટ કરવામાં ભૂલ થઈ છે');
  //   }
  // };


  const [selectedOption, setSelectedOption] = useState("3rd-party-off");

  const handleChange = e => {
    setSelectedOption(e.target.id);
  };
  return (
    <div className="a_header_container">
      <div className="row py-5">
        <div className="col-lg-8 mb-md-4 mb-2">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-md-4 p-2">
              <div className="d-md-flex justify-content-between d-block align-items-center mb-3">
                <h5 className="fw-bold mb-md-0 mb-2 text-nowrap x_ship_tex">Shipping Address</h5>
                <div>
                  <button
                    className="btn x_btn_gradient  me-2 x_btn_gradient_m"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <FaPlus className="me-1" /> Add New Address
                  </button>
                  {addresses.length > 0 && (
                    <button
                      className="btn x_btn_gradient"
                      onClick={() => setShowAddressModal(true)}
                    >
                      <FaList className="me-1" /> View All Addresses
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Address Display - Only show when explicitly selected */}
              {selectedAddress && (
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className='d-flex gap-3'>
                      <div className="">
                        {selectedAddress.saveAddressAs === 'Home' && <FaHome size={20} />}
                        {selectedAddress.saveAddressAs === 'Office' && <FaBuilding size={20} />}
                        {selectedAddress.saveAddressAs === 'Other' && <FaMapMarkerAlt size={20} />}
                      </div>
                      <div>
                        <p className="mb-0 fw-bold">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                        <p className="mb-0">{selectedAddress.address1}, {selectedAddress.address2}</p>
                        <p className="mb-0">{selectedAddress.city}, {selectedAddress.state}, {selectedAddress.postalCode}</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className='text-center'>
                        {/* Edit icon */}
                        <button
                          className="btn gap-1 p-0 fw-bold text-decoration-none border-0 x_btn_edit d-flex align-items-center"
                          onClick={() => handleEditAddress(selectedAddress)}
                          style={{ fontSize: '14px', color: '#2c6145' }}
                        >
                          <FaEdit size={19} style={{ color: '#2c6145' }} className='mb-1' />
                          Edit
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}


              {/* Address Form Modal */}
              <div className={`modal fade ${showAddressForm ? 'show' : ''}`}
                style={{
                  display: showAddressForm ? 'block' : 'none',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowAddressForm(false);
                  }
                }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    {/* <div className="modal-header">
                      <h5 className="modal-title">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h5> */}
                    <div className="modal-header" style={{ backgroundColor: "#2c6145" }}>
                      <h5 className="modal-title" style={{ color: "#fff" }}> {editingAddress ? 'Edit Address' : 'Add New Address'}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        style={{ filter: "invert(1)" }}
                        onClick={() => setShowAddressForm(false)}
                      ></button>
                    </div>
                    {/* // Add fields in modal form (Changed from: હીં મોડલ ફોર્સમાં ફીલ્ડ્સ ઉમેરો) */}
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            name="firstName"
                            value={address.firstName}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            name="lastName"
                            value={address.lastName}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="Phone Number"
                            name="phone"
                            value={address.phone}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={address.email}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Address Line 1"
                            name="address1"
                            value={address.address1}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Address Line 2"
                            name="address2"
                            value={address.address2}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Postal Code"
                            name="postalCode"
                            value={address.postalCode}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="City"
                            name="city"
                            value={address.city}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="State"
                            name="state"
                            value={address.state}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Country"
                            name="country"
                            value={address.country}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="col-12">
                          <select
                            className="form-select"
                            name="saveAddressAs"
                            value={address.saveAddressAs}
                            onChange={handleAddressChange}
                          >
                            <option value="">Save Address As</option>
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#fff", color: "#2c6145", border: "1px solid #2c6145" }}
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </button>
                        <button
                          type="button"
                          className="btn"
                          style={{ backgroundColor: "#2c6145", color: "#fff" }}
                          onClick={handleAddAddress}
                        >
                          {editingAddress ? 'Update Address' : 'Add Address'}
                        </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address List Modal */}
              <div className={`modal fade ${showAddressModal ? 'show' : ''}`}
                style={{
                  display: showAddressModal ? 'block' : 'none',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowAddressModal(false);
                  }
                }}>
                <div className="modal-dialog modal-md">
                  <div className="modal-content">
                    <div className="modal-header" style={{ backgroundColor: "#2c6145" }}>
                      <h5 className="modal-title" style={{ color: "#fff" }}>Your Addresses</h5>
                      <button
                        type="button"
                        className="btn-close"
                        style={{ filter: "invert(1)" }}
                        onClick={() => setShowAddressModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      {addresses.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted">No saved addresses</p>
                          <button
                            className="btn"
                            style={{ backgroundColor: "#2c6145", color: "#fff" }}
                            onClick={() => {
                              setShowAddressModal(false);
                              setShowAddressForm(true);
                            }}
                          >
                            <FaPlus className="me-1" /> Add New Address
                          </button>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {addresses.map((addr) => (
                            <div key={addr._id} className="">
                              <div
                                className={`border rounded p-3 address-card ${selectedAddress?._id === addr._id ? 'selected-address' : ''}`}
                                onClick={() => handleSelectAddress(addr)}
                                style={{
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  borderColor: selectedAddress?._id === addr._id ? "#2c6145" : undefined,
                                  boxShadow: selectedAddress?._id === addr._id ? "0 0 0 2px #2c614533" : undefined
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                      {addr.saveAddressAs === 'Home' && <FaHome style={{ color: "#2c6145" }} />}
                                      {addr.saveAddressAs === 'Office' && <FaBuilding style={{ color: "#2c6145" }} />}
                                      {addr.saveAddressAs === 'Other' && <FaMapMarkerAlt style={{ color: "#2c6145" }} />}
                                      <h6 className="mb-0 fw-bold">{addr.firstName} {addr.lastName}</h6>
                                      <span className="badge" style={{ backgroundColor: "#2c6145", color: "#fff", marginLeft: 8 }}>{addr.saveAddressAs}</span>
                                    </div>
                                    <p className="mb-1">
                                      <span className="text-muted">Phone:</span> {addr.phone}
                                    </p>
                                    <p className="mb-1">
                                      {addr.address1}, {addr.address2}
                                    </p>
                                    <p className="mb-0">
                                      {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                                    </p>
                                  </div>
                                  <div className="d-flex flex-column gap-2">
                                    <button
                                      className="btn btn-sm"
                                      style={{ borderColor: "#dc3545", color: "#dc3545" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAddress(addr._id);
                                      }}
                                    >
                                      <FaTrash size={14} className='me-1 mb-1' />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#fff", color: "#2c6145", border: "1px solid #2c6145" }}
                        onClick={() => setShowAddressModal(false)}
                      >
                        Close
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          className="btn"
                          style={{ backgroundColor: "#2c6145", color: "#fff" }}
                          onClick={() => {
                            setShowAddressModal(false);
                            setShowAddressForm(true);
                          }}
                        >
                          <FaPlus className="me-1" /> Add New Address
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-body p-md-4 p-2">
              <div
                className="table-responsive"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#2c6145 #e8f5e9",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0"
                }}
              >
                <table className="table align-middle table-hover">
                  <thead>
                    <tr className="bg-light">
                      <th scope="col" className="fw-bold py-3 ps-4" style={{ width: "40%", minWidth: "300px", borderBottom: "2px solid #2c6145" }}>Products</th>
                      <th scope="col" className="text-center fw-bold py-3" style={{ width: "15%", minWidth: "80px", borderBottom: "2px solid #2c6145" }}>Price</th>
                      <th scope="col" className="text-center fw-bold py-3" style={{ width: "30%", minWidth: "120px", borderBottom: "2px solid #2c6145" }}>Quantity</th>
                      <th scope="col" className="text-end fw-bold py-3 pe-4 text-nowrap" style={{ width: "15%", minWidth: "100px", borderBottom: "2px solid #2c6145" }}>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      const product = item.productData?.[0];
                      const variant = item.productVarientData?.[0];

                      return (
                        <tr
                          key={item._id}
                          className="border-bottom"
                          style={{ transition: "all 0.2s" }}
                        >
                          <td
                            className="py-3 ps-4"
                            style={{ minWidth: "200px" }}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <div className="position-relative" style={{
                                width: "60px", // Small size (Changed from: નાની સાઈઝ)
                                height: "60px", // Square shape with equal height and width (Changed from: ચોરસ આકાર માટે સરખી height અને width)
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #e0e0e0"
                              }}>
                                <img
                                  src={`http://localhost:4000/${product?.images[0]}`}
                                  alt={product?.productName}
                                  className="img-fluid"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div>
                                <h6
                                  className="mb-1 fw-semibold"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    localStorage.setItem(
                                      "selectedProductId",
                                      product.id
                                    );
                                    navigate(`/product-details/${product.id}`);
                                  }}
                                >
                                  {product?.productName}
                                </h6>
                                <span className="badge bg-light text-dark border">
                                  {variant?.size || "Size"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td
                            className="text-center align-middle"
                            style={{ minWidth: "80px" }}
                          >
                            <span className="fw-semibold">
                              {formatPrice(variant?.price)}
                            </span>
                          </td>
                          <td
                            className="text-center align-middle"
                            style={{ minWidth: "120px" }}
                          >
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle p-1"
                                onClick={() =>
                                  updateQuantity(item._id, "decrease")
                                }
                                style={{ width: "32px", height: "32px" }}
                              >
                                <Minus size={16} />
                              </button>
                              <input
                                type="text"
                                className="form-control text-center px-2"
                                style={{ maxWidth: "50px" }}
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle p-1"
                                onClick={() =>
                                  updateQuantity(item._id, "increase")
                                }
                                style={{ width: "32px", height: "32px" }}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </td>
                          <td
                            className="text-end align-middle pe-4"
                            style={{ minWidth: "100px" }}
                          >
                            <div className="d-flex justify-content-end align-items-center gap-3">
                              <span className="fw-semibold">
                                {formatPrice(variant?.price * item.quantity)}
                              </span>
                              <button
                                className="btn btn-sm btn-outline-danger rounded-circle p-1"
                                onClick={() => removeItem(item._id)}
                                style={{ width: "32px", height: "32px" }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Discount Code Input */}
              <div className="mt-4">
                <div className="input-group mb-md-4 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add voucher discount"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    style={{
                      borderColor: "#dee2e6",
                      transition:
                        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    }}
                  />
                  <button
                    className="btn px-4"
                    onClick={applyDiscountCode}
                    style={{ backgroundColor: "#2c6145", color: "white" }}
                  >
                    Apply Code
                  </button>
                </div>

                {/* Discount Coupons */}
                <div
                  className="d-flex gap-3"
                  style={{
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                    scrollSnapType: "x mandatory",
                    padding: "10px 0"
                  }}
                >
                  {coupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="position-relative flex-shrink-0"
                      style={{
                        width: "250px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: discountCode === coupon.title ? "#e8f5e9" : "#fff",
                        scrollSnapAlign: "start"
                      }}
                    >
                      <div className="p-3" style={{ borderBottom: "1px dashed #2c6145" }}>
                        <div className="text-muted small mb-1">Coupon Code: {coupon.title}</div>
                        <div className="fw-bold mb-1" style={{ fontSize: "1.25rem", color: "#2c6145" }}>
                          {coupon.coupenType === "Fixed" ? `₹${coupon.coupenDiscount} OFF` : `${coupon.coupenDiscount}% OFF`}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                          {coupon.description}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Valid: {coupon.startDate} to {coupon.endDate}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center p-3">
                        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                          {coupon.title}
                        </div>
                        <button
                          className="btn btn-sm"
                          onClick={() => applyCouponCode(coupon.code || coupon.title)}
                          style={{
                            fontSize: "0.85rem",
                            padding: "0.3rem 1rem",
                            backgroundColor: "#2c6145",
                            color: "white"
                          }}
                        >
                          Apply Code
                        </button>
                      </div>

                      {/* Left Circle */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-6px",
                          top: "70%",
                          transform: "translateY(-50%)",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "0% 50% 50% 0%",
                          border: "1px dashed #2c6145",
                          zIndex: 1,
                        }}
                      />

                      {/* Right Circle */}
                      <div
                        style={{
                          position: "absolute",
                          right: "-6px",
                          top: "70%",
                          transform: "translateY(-50%)",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "50% 0% 0% 50%",
                          border: "1px dashed #2c6145",
                          zIndex: 1,
                        }}
                      />

                      {/* Border */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: "1px dashed #2c6145",
                          borderRadius: "8px",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/* Address Section */}

              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-md-4 p-2">
              <h4 className="fw-bold mb-md-4 mb-2 x_fs">Order Summary</h4>

              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>

              {appliedCoupon && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Discount ({appliedCoupon.title})</span>
                  <span className="text-success">
                    -{formatPrice(
                      appliedCoupon.coupenType === "Fixed"
                        ? appliedCoupon.coupenDiscount
                        : getSubtotal() * (appliedCoupon.coupenDiscount / 100)
                    )}
                  </span>
                </div>
              )}

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span>{shippingMethod === "free" ? formatPrice(0) : formatPrice(35)}</span>
                </div>
                {/* <div
                  className={`form-check x_radio d-flex mb-0 px-0 ${shippingMethod === "free" ? "selected-shipping" : ""}`}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shipping"
                    id="freeShipping"
                    checked={shippingMethod === "free"}
                    onChange={() => setShippingMethod("free")}
                  />
                  <label
                    className="form-check-label d-flex justify-content-between w-100"
                    htmlFor="freeShipping"
                  >
                    <span>Free Shipping</span>
                    <span>$0.00</span>
                  </label>
                </div>

                <div
                  className={`form-check x_radio d-flex mb-0 px-0 ${shippingMethod === "local" ? "selected-shipping" : ""}`}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shipping"
                    id="localShipping"
                    checked={shippingMethod === "local"}
                    onChange={() => setShippingMethod("local")}
                  />
                  <label
                    className="form-check-label d-flex justify-content-between w-100"
                    htmlFor="localShipping"
                  >
                    <span>Local:</span>
                    <span>$35.00</span>
                  </label>
                </div>

                <div
                  className={`form-check x_radio d-flex mb-0 px-0 ${shippingMethod === "flat" ? "selected-shipping" : ""}`}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shipping"
                    id="flatRate"
                    checked={shippingMethod === "flat"}
                    onChange={() => setShippingMethod("flat")}
                  />
                  <label
                    className="form-check-label d-flex justify-content-between w-100"
                    htmlFor="flatRate"
                  >
                    <span>Flat Rate:</span>
                    <span>$35.00</span>
                  </label>
                </div> */}
                <div className="x_option-item px-0">
                  <label className="x_radio-wrapper p-0 w-100 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="free"
                        checked={shippingMethod === "free"}
                        onChange={() => setShippingMethod("free")}
                        className="x_radio-input"
                      />
                      <span className="x_radio-custom"></span>
                      <span className="x_radio-label ms-2">Free Shipping</span>
                    </div>
                    <span className="x_radio-label">$0.00</span>
                  </label>
                </div>
                <div className="x_option-item px-0">
                  <label className="x_radio-wrapper p-0 w-100 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="local"
                        checked={shippingMethod === "local"}
                        onChange={() => setShippingMethod("local")}
                        className="x_radio-input"
                      />
                      <span className="x_radio-custom"></span>
                      <span className="x_radio-label ms-2">Local:</span>
                    </div>
                    <span className="x_radio-label">$35.00</span>
                  </label>
                </div>
                <div className="x_option-item px-0">
                  <label className="x_radio-wrapper p-0 w-100 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="flat"
                        checked={shippingMethod === "flat"}
                        onChange={() => setShippingMethod("flat")}
                        className="x_radio-input"
                      />
                      <span className="x_radio-custom"></span>
                      <span className="x_radio-label ms-2">Flat Rate:</span>
                    </div>
                    <span className="x_radio-label">$35.00</span>
                  </label>
                </div>
              </div>

              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between mb-md-3 mb-2">
                  <h5 className="fw-bold x_fs">Total</h5>
                  <h5 className="fw-bold">{formatPrice(getTotal())}</h5>
                </div>

                {/* <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree with the{" "}
                    <a href="#" className="text-decoration-none">
                      Terms And Conditions
                    </a>
                  </label>
                </div> */}
                <label
                  className="x_checkbox-wrapper px-0"

                >
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    id="terms"
                    className="x_custom-checkbox"
                  />
                  <span className="x_checkbox-mark"></span>
                  <span className="x_checkbox-label" htmlFor="terms"> I agree with the{" "}
                    <a href="#" className="text-decoration-none">
                      Terms And Conditions
                    </a></span>
                </label>

                <button
                  className="btn w-100 mb-3"
                  disabled={!agreedToTerms}
                  style={{ backgroundColor: "#2c6145", color: "white" }}
                  onClick={handleCheckout}  // Add this line to connect the button with handleCheckout function
                >
                  Process To Checkout
                </button>

                <div className="text-center">
                  <Link to={"/Vegetable"} className="text-decoration-none">
                    Or continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style>
  {`
  /* Custom Scrollbar Styles */
  .table-responsive::-webkit-scrollbar {
    width: 8px;
  }

  .table-responsive::-webkit-scrollbar-track {
    background: #e8f5e9;
    border-radius: 4px;
  }

  .table-responsive::-webkit-scrollbar-thumb {
    background-color: #2c6145;
    border-radius: 4px;
    border: 2px solid #e8f5e9;
  }

  .table-responsive::-webkit-scrollbar-thumb:hover {
    background-color: #234e37;
  }

  /* Table Styles */
  .table {
    margin-bottom: 0;
  }

  .table > :not(caption) > * > * {
    padding: 1rem;
  }

  .table tbody tr:hover {
    background-color: #f8f9fa;
  }

  /* Button Hover Effects */
  .btn-outline-secondary:hover,
  .btn-outline-danger:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
  }

  /* Quantity Input Styles */
  .form-control:focus {
    border-color: #2c6145;
    box-shadow: 0 0 0 0.2rem rgba(44, 97, 69, 0.25);
  }
  `}
</style>
