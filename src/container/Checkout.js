import React from 'react'
import '../styles/Akshay.css'
import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Image, Row, Modal } from 'react-bootstrap';
import visa from '../img/Ak_images/visa.png'
import masterCard from '../img/Ak_images/mastercard.png'
import amex from '../img/Ak_images/amex.png'
import discover from '../img/Ak_images/discover.png'
import Upi from '../img/Ak_images/upi.png'
import paytm from '../img/Ak_images/paytm.png'
import gpay from '../img/Ak_images/gpay.png'
import phonepay from '../img/Ak_images/phonepay.png'
import citi from '../img/Kassets/citi.png'
import wells from '../img/Kassets/Wells Fargo .png'
import capital from '../img/Kassets/Capital One .png'
import td from '../img/Kassets/TD.png'
import order from '../img/Ak_images/orderconfirm.png'
import Bob from '../img/Kassets/bob.png'

import { useDispatch, useSelector } from 'react-redux';
import { getallMyCarts, clearCart } from '../redux/slices/cart.Slice';
import { createPayment } from '../redux/slices/checkout.Slice';
import { createOrder, updateOrderStatus } from '../redux/slices/order.Slice';
import { useNavigate } from 'react-router-dom';
import { getUserAddresses } from '../redux/slices/address.Slice';
import Thankspopup from './Thankspopup';

export default function Checkout()   {
    const [selected, setSelected] = useState("");
    const [show, setShow] = useState(false);
    const [showThanksModal, setShowThanksModal] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false); // Add this line
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addresses } = useSelector((state) => state.address);

    // Load selected address from localStorage when component mounts
    useEffect(() => {
        const savedAddress = localStorage.getItem('selectedAddress');
        if (savedAddress) {
            setSelectedAddress(JSON.parse(savedAddress));
        }
    }, []);

    useEffect(() => {
        dispatch(getUserAddresses());
    }, [dispatch]);

    // Get cart items from Redux store
    const cartItems = useSelector((state) => {
        const userId = JSON.parse(localStorage.getItem('user'))?._id;
        return state.addcart.cartItems.filter(item => item.userId === userId);
    });

    // Get applied coupon and address from localStorage
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Load user's default address from localStorage


    // Load applied coupon from localStorage
    useEffect(() => {
        const storedCoupon = localStorage.getItem('coupon');
        if (storedCoupon) {
            setAppliedCoupon(JSON.parse(storedCoupon));
        }
    }, []);

    // Calculate totals
    const calculateTotals = () => {
        // Safely calculate subtotal by checking if price and quantity exist
        const subtotal = cartItems.reduce((total, item) => {
            // Check if item has the expected price structure
            const price = item.productVarientData?.[0]?.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);

        // Calculate discount based on applied coupon
        const discount = appliedCoupon ? (subtotal * appliedCoupon.coupenDiscount / 100) : 0;
        const platformFee = 10;
        const grandTotal = subtotal - discount + platformFee;

        return {
            subtotal: isNaN(subtotal) ? 0 : subtotal,
            discount: isNaN(discount) ? 0 : discount,
            platformFee: isNaN(platformFee) ? 0 : platformFee,
            grandTotal: isNaN(grandTotal) ? 0 : grandTotal
        };
    };

    // Fetch cart data when component mounts


    // Debug cart items and applied coupon
    useEffect(() => {
        console.log("Cart Items:", cartItems);
        console.log("Applied Coupon:", appliedCoupon);
        if (cartItems.length > 0) {
            console.log("First cart item structure:", cartItems[0]);
        }

        // Calculate and log the discount
        const totals = calculateTotals();
        console.log("Calculated Totals:", totals);
    }, [cartItems, appliedCoupon]);

    const handleClose = () => setShow(false);

    // Add payment validation states
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    // const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // Add validation functions
    const validateCardPayment = () => {
        const errors = {};
        if (!cardDetails.cardNumber || !/^\d{16}$/.test(cardDetails.cardNumber)) {
            errors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        if (!cardDetails.cardHolder || cardDetails.cardHolder.trim().length < 3) {
            errors.cardHolder = 'Please enter card holder name';
        }
        if (!cardDetails.expiryDate || !/^(0[1-9]|1[0-2])\/\d{4}$/.test(cardDetails.expiryDate)) {
            errors.expiryDate = 'Please enter a valid expiry date (MM/YYYY)';
        }
        if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
            errors.cvv = 'Please enter a valid CVV';
        }
        return errors;
    };

    // const validateUpiPayment = () => {
    //     const errors = {};
    //     if (!upiId) {
    //         errors.upiId = 'Please enter UPI ID';
    //     } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
    //         errors.upiId = 'Please enter a valid UPI ID';
    //     }
    //     return errors;
    // };

    // const handleUpiValidation = () => {
    //     const errors = validateUpiPayment();
    //     setValidationErrors(errors);
    //     return Object.keys(errors).length === 0;
    // };

    const validateNetBanking = () => {
        const errors = {};
        if (!selectedBank) {
            errors.bank = 'Please select a bank';
        }
        return errors;
    };

    const handleShow = async () => {
        try {
            if (!selected || selected === "") {
                setValidationErrors({ ...validationErrors, paymentMethod: 'Please select a payment method' });
                return;
            }

            // Get the last order ID from localStorage
            const orderIdStr = localStorage.getItem('orderId');
            if (!orderIdStr) {
                throw new Error('No order ID found');
            }

            // Update order status
            const updateResponse = await dispatch(updateOrderStatus(orderIdStr));

            if (!updateResponse.payload) {
                throw new Error('Failed to update order status');
            }

            // Create payment record with basic payment data
            const paymentData = {
                orderId: orderIdStr,
                paymentMethod: selected,
                paymentStatus: 'Success'
            };

            try {
                const response = await fetch('http://localhost:4000/api/createPayment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(paymentData)
                });

                if (!response.ok) {
                    throw new Error('Failed to create payment record');
                }

                const paymentResult = await response.json();
                console.log('Payment record created:', paymentResult);
                localStorage.setItem('paymentId',paymentResult.data._id );


                // Show success modal and wait before navigation
                setShow(true);

                // Set a timeout to allow users to see the modal
                setTimeout(() => {
                    setShow(false);
                    navigate('/Invoice');
                    
                    localStorage.removeItem('orderId');
                    localStorage.removeItem('activePage');
                    localStorage.removeItem("appliedCoupon");
                    dispatch(clearCart());
                }, 2000);

            } catch (error) {
                console.error('Error creating payment record:', error);
                alert('Payment failed. Please try again.');
                return;
            }

        } catch (error) {
            console.error('Order status update failed:', error);
            alert(error.message || 'Failed to update order status. Please try again.');
        }
    };



    return (
        <div className="g_checkout_container">
            <div className="g_checkout_wrapper">
                <Row className="g_checkout_row">
                    <Col lg={7} xs={12}>
                        <div className="g_checkout_left">
                            <h2 className="g_checkout_title">Checkout</h2>

                            {/* Shipping Address Section */}
                            <div className="g_shipping_box">
                                <div className="g_shipping_header">
                                    <span className="g_shipping_icon">✓</span>
                                    SHIPPING ADDRESS
                                </div>
                                <div className="g_shipping_content">
                                    {selectedAddress ? (
                                        <div className="selected-address">
                                            <p className='mb-0 fw-semibold'>{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                            <p>{selectedAddress.address1},{selectedAddress.address2},{selectedAddress.postalCode}</p>
                                            {/* <p>{selectedAddress.address2}</p>
                                            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}</p>
                                            <p>{selectedAddress.phone}</p> */}
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p>Please first go to cart and select an address</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Remove the Address Selection Modal */}

                            {/* Address Selection Modal */}
                            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Select Address</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {addresses?.map((address) => (
                                        <div
                                            key={address._id}
                                            className="address-option p-3 border mb-2"
                                            onClick={() => {
                                                setSelectedAddress(address);
                                                setShowAddressModal(false);
                                            }}
                                        >
                                            <h6>{address.firstName} {address.lastName}</h6>
                                            <p className="mb-1">{address.address1}</p>
                                            <p className="mb-1">{address.address2}</p>
                                            <p className="mb-1">{address.city}, {address.state} {address.postalCode}</p>
                                            <p className="mb-0">{address.phone}</p>
                                        </div>
                                    ))}
                                </Modal.Body>
                            </Modal>

                            {/* Payment Method Section */}
                            <div className="g_payment_section">
                                <h3 className="g_section_subtitle">Select Payment Method</h3>
                                <div className="g_payment_options">
                                    {/* COD Option */}
                                    <label className={`g_payment_option ${selected === 'Cod' ? 'g_selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="Cod"
                                            checked={selected === 'Cod'}
                                            onChange={(e) => {
                                                setSelected(e.target.value);
                                                console.log('Selected Payment Method:', e.target.value);
                                            }}
                                            className="g_radio_input"
                                        />
                                        <span className="g_radio_custom"></span>
                                        <span className="g_payment_label">Cash on Delivery</span>
                                    </label>
                                
                                    {/* Credit/Debit Card Option */}
                                    <label className={`g_payment_option ${selected === 'Credit Card / Debit Card' ? 'g_selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="Credit Card / Debit Card"
                                            checked={selected === 'Credit Card / Debit Card'}
                                            onChange={(e) => {
                                                setSelected(e.target.value);
                                                console.log('Selected Payment Method:', e.target.value);
                                            }}
                                            className="g_radio_input"
                                        />
                                        <span className="g_radio_custom"></span>
                                        <div className="g_payment_label_container">
                                            <span className="g_payment_label">Credit Card / Debit Card</span>
                                            <div className="g_payment_icons">
                                                <img src={visa} alt="visa" className="g_card_icon" />
                                                <img src={masterCard} alt="mastercard" className="g_card_icon" />
                                                {/* <img src={amex} alt="amex" className="g_card_icon" />
                                                <img src={discover} alt="discover" className="g_card_icon" /> */}
                                            </div>
                                        </div>
                                    </label>
                                
                                    {/* UPI Option */}
                                    {/* <label className={`g_payment_option ${selected === 'UPI' ? 'g_selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="UPI"
                                            checked={selected === 'UPI'}
                                            onChange={(e) => {
                                                setSelected(e.target.value);
                                                console.log('Selected Payment Method:', e.target.value);
                                            }}
                                            className="g_radio_input"
                                        />
                                        <span className="g_radio_custom"></span>
                                        <div className="g_payment_label_container">
                                            <span className="g_payment_label">UPI</span>
                                            <div className="g_payment_icons">
                                                <img src={Upi} alt="upi" className="g_upi_icon" />
                                                <img src={paytm} alt="paytm" className="g_upi_icon" />
                                                <img src={gpay} alt="gpay" className="g_upi_icon" />
                                                <img src={phonepay} alt="phonepay" className="g_upi_icon" />
                                            </div>
                                        </div>
                                    </label> */}
                                
                                    {/* Net Banking Option */}
                                    <label className={`g_payment_option ${selected === 'Net Banking' ? 'g_selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="Net Banking"
                                            checked={selected === 'Net Banking'}
                                            onChange={(e) => {
                                                setSelected(e.target.value);
                                                console.log('Selected Payment Method:', e.target.value);
                                            }}
                                            className="g_radio_input"
                                        />
                                        <span className="g_radio_custom"></span>
                                        <div className="g_payment_label_container">
                                            <span className="g_payment_label">Net Banking</span>
                                            <div className="g_payment_icons">
                                                {/* <img src={citi} alt="citi" className="g_bank_icon" />
                                                <img src={wells} alt="wells fargo" className="g_bank_icon" />
                                                <img src={capital} alt="capital one" className="g_bank_icon" />*/}
                                                <img src={td} alt="td" className="g_bank_icon" /> 
                                                <img src={Bob} alt="td" className="g_bank_icon" /> 

                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {/* Payment Button */}
                                <div className="g_payment_button_container mt-4">
                                    
                                    <Button 
                                        className="g_payment_button" 
                                        onClick={async () => {
                                            await handleShow();
                                            setShowThanksModal(true);
                                            setTimeout(() => {
                                                setShowThanksModal(false);
                                                navigate('/Myorder');
                                            }, 300000); // 5 minutes
                                        }}
                                        disabled={!selected || !selectedAddress}
                                    >
                                        Proceed to Pay
                                    </Button>
                                    
                                  
                                    <Thankspopup show={showThanksModal} setShow={setShowThanksModal} />
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col lg={5} xs={12}>
                        <div className="g_cart_summary">
                            <h3 className="g_summary_title">Shopping cart</h3>
                            <div className="g_cart_items">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="g_cart_item">
                                        <div className="g_item_image_container">
                                            <img
                                                src={`http://localhost:4000/${item.productData?.[0]?.images?.[0]}`}
                                                alt={item.productData?.[0]?.productName || 'Product'}
                                                className="g_item_image"
                                            />
                                        </div>
                                        <div className="g_item_details">
                                            <h4 className="g_item_name">
                                                {item.productData?.[0]?.productName || 'Product Name Not Available'}
                                            </h4>
                                            <div className="g_item_controls">
                                                <div className="g_quantity_control">
                                                    <button
                                                        className="g_qty_btn g_qty_minus"
                                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                    >-</button>
                                                    <input
                                                        type="text"
                                                        value={item.quantity}
                                                        readOnly
                                                        className="g_qty_input"
                                                    />
                                                    <button
                                                        className="g_qty_btn g_qty_plus"
                                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                    >+</button>
                                                </div>
                                                <span className="g_item_price">
                                                    ${((item.productVarientData?.[0]?.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="g_cart_summary_footer">
                                <div className="g_coupon_section">
                                    <input
                                        type="text"
                                        value={appliedCoupon?.title || ''}
                                        placeholder="Enter coupon code"
                                        className="g_coupon_input"
                                    />
                                    <button className="g_apply_btn">
                                        {appliedCoupon ? 'Applied' : 'Apply'}
                                    </button>
                                </div>

                                <div className="g_price_details">
                                    <div className="g_price_row">
                                        <span>Subtotal</span>
                                        <span>${calculateTotals().subtotal}</span>
                                    </div>
                                    <div className="g_price_row">
                                        <span>Taxes and vat</span>
                                        <span>${calculateTotals().platformFee}</span>
                                    </div>
                                    <div className="g_price_row">
                                        <span>Delivery charge</span>
                                        <span>$0</span>
                                    </div>
                                    <div className="g_price_row">
                                        <span>Discount</span>
                                        <span>-${calculateTotals().discount}</span>
                                    </div>
                                    <div className="g_price_row g_total">
                                        <span>Total</span>
                                        <span>${calculateTotals().grandTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {/* <Thankspopup show={show} setShow={setShow} /> */}
        </div>
    );
}
