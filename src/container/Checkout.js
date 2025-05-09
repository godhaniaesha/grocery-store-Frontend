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
import { useDispatch, useSelector } from 'react-redux';
import { getallMyCarts, clearCart } from '../redux/slices/cart.Slice';
import { createPayment } from '../redux/slices/checkout.Slice';
import { createOrder, updateOrderStatus } from '../redux/slices/order.Slice';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ setIsCheckoutPage }) {
    const [selected, setSelected] = useState("");
    const [show, setShow] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        const storedCoupon = localStorage.getItem('appliedCoupon');
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
    const [upiId, setUpiId] = useState('');
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

    const validateUpiPayment = () => {
        const errors = {};
        if (!upiId) {
            errors.upiId = 'Please enter UPI ID';
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
            errors.upiId = 'Please enter a valid UPI ID';
        }
        return errors;
    };

    const handleUpiValidation = () => {
        const errors = validateUpiPayment();
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateNetBanking = () => {
        const errors = {};
        if (!selectedBank) {
            errors.bank = 'Please select a bank';
        }
        return errors;
    };

    // Update handleShow function to include payment validation
    const handleShow = async () => {
        try {
            if (!selected || selected === "") {
                setValidationErrors({ ...validationErrors, paymentMethod: 'Please select a payment method' });
                return;
            }

            let hasErrors = false;
            if (selected === 'Card') {
                const cardErrors = validateCardPayment();
                if (Object.keys(cardErrors).length > 0) {
                    setValidationErrors({ ...validationErrors, ...cardErrors });
                    hasErrors = true;
                }
            } else if (selected === 'Upi') {
                const upiErrors = validateUpiPayment();
                if (Object.keys(upiErrors).length > 0) {
                    setValidationErrors({ ...validationErrors, ...upiErrors });
                    hasErrors = true;
                }
            } else if (selected === 'Net Banking') {
                const bankErrors = validateNetBanking();
                if (Object.keys(bankErrors).length > 0) {
                    setValidationErrors({ ...validationErrors, ...bankErrors });
                    hasErrors = true;
                }
            }

            if (hasErrors) {
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

            // Create payment record
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
            } catch (error) {
                console.error('Error creating payment record:', error);
                // Continue with order success flow even if payment record fails
            }

            // Show success modal and wait before navigation
            setShow(true);

            // Set a timeout to allow users to see the modal
            setTimeout(() => {
                setShow(false);
                navigate('/HomeMain');
                localStorage.removeItem('orderId');
                localStorage.removeItem('activePage');
                setIsCheckoutPage(false);
                localStorage.removeItem("appliedCoupon");
                dispatch(clearCart());
            }, 2000); // Wait for 2 seconds

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
                                    <Form.Control
                                        type="text"
                                        defaultValue="Daniel Hecker"
                                        className="g_input"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="g_payment_section">
                                <h3 className="g_section_subtitle">Payment method</h3>
                                <div className="g_payment_options">
                                    <label className={`g_payment_option ${selected === 'Card' ? 'g_selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="Card"
                                            checked={selected === 'Card'}
                                            onChange={() => setSelected('Card')}
                                            className="g_radio_input"
                                        />
                                        <span className="g_radio_custom"></span>
                                        <span className="g_payment_label">Credit card</span>
                                    </label>

                                    <label className={`g_payment_option ${selected === 'PayPal' ? 'g_selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="PayPal"
                                            checked={selected === 'PayPal'}
                                            onChange={() => setSelected('PayPal')}
                                            className="g_radio_input"
                                        />
                                        <span className="g_radio_custom"></span>
                                        <span className="g_payment_label">PayPal</span>
                                    </label>
                                </div>

                                {/* Card Details Section */}
                                {selected === 'Card' && (
                                    <div className="g_card_details">
                                        <div className="g_card_input_group">
                                            <label>Name On Card</label>
                                            <input
                                                type="text"
                                                placeholder="Mehedi Hasan Parves"
                                                className="g_card_input"
                                                value={cardDetails.cardHolder}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                                            />
                                        </div>
                                        <div className="g_card_input_group">
                                            <label>Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="3787-3849-3126-0777"
                                                className="g_card_input"
                                                value={cardDetails.cardNumber}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="g_card_row">
                                            <div className="g_card_input_group">
                                                <label>Expiration Date</label>
                                                <input
                                                    type="text"
                                                    placeholder="27/4"
                                                    className="g_card_input"
                                                    value={cardDetails.expiryDate}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="g_card_input_group">
                                                <label>CVV/CVC</label>
                                                <input
                                                    type="text"
                                                    placeholder="072"
                                                    className="g_card_input"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="g_save_card">
                                            <input
                                                type="checkbox"
                                                id="saveCard"
                                                className="g_checkbox"
                                            />
                                            <label htmlFor="saveCard">Securely save this card for faster checkout next time</label>
                                        </div>

                                    </div>
                                )}
                                <button className="g_payment_button" onClick={handleShow}>
                                    Pay $155
                                </button>
                            </div>
                        </div>
                    </Col>

                    <Col lg={5} xs={12}>
                        <div className="g_cart_summary">
                            <h3 className="g_summary_title">Shopping cart</h3>
                            <div className="g_cart_items">
                                <div className="g_cart_item">
                                    <div className="g_item_image_container">
                                        <img src="/path/to/image1.jpg" alt="Prairie Blossoms" className="g_item_image" />
                                    </div>
                                    <div className="g_item_details">
                                        <h4 className="g_item_name">Prairie Blossoms Smocked Floral Peasant Top</h4>
                                        <div className="g_item_controls">
                                            <div className="g_quantity_control">
                                                <button className="g_qty_btn g_qty_minus">-</button>
                                                <input type="text" value="1" readOnly className="g_qty_input" />
                                                <button className="g_qty_btn g_qty_plus">+</button>
                                            </div>
                                            <span className="g_item_price">$57</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="g_cart_item">
                                    <div className="g_item_image_container">
                                        <img src="/path/to/image2.jpg" alt="Fit to Be Tied" className="g_item_image" />
                                    </div>
                                    <div className="g_item_details">
                                        <h4 className="g_item_name">Fit to Be Tied Crinkle Cotton Tie-Front Shirt</h4>
                                        <div className="g_item_controls">
                                            <div className="g_quantity_control">
                                                <button className="g_qty_btn">-</button>
                                                <span>1</span>
                                                <button className="g_qty_btn">+</button>
                                            </div>
                                            <span className="g_item_price">$57</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="g_cart_item">
                                    <div className="g_item_image_container">
                                        <img src="/path/to/image3.jpg" alt="On the Move" className="g_item_image" />
                                    </div>
                                    <div className="g_item_details">
                                        <h4 className="g_item_name">On the Move Pleated Corduroy Cargo Pants</h4>
                                        <div className="g_item_controls">
                                            <div className="g_quantity_control">
                                                <button className="g_qty_btn">-</button>
                                                <span>1</span>
                                                <button className="g_qty_btn">+</button>
                                            </div>
                                            <span className="g_item_price">$51</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="g_cart_summary_footer">
                                <div className="g_coupon_section">
                                    <input type="text" placeholder="VJ895TURT" className="g_coupon_input" />
                                    <button className="g_apply_btn">Applied</button>
                                </div>

                                <div className="g_price_details">
                                    <div className="g_price_row">
                                        <span>Subtotal</span>
                                        <span>$165</span>
                                    </div>
                                    <div className="g_price_row">
                                        <span>Taxes and vat</span>
                                        <span>$10</span>
                                    </div>
                                    <div className="g_price_row">
                                        <span>Delivery charge</span>
                                        <span>$00</span>
                                    </div>
                                    <div className="g_price_row">
                                        <span>Discount</span>
                                        <span>-$20</span>
                                    </div>
                                    <div className="g_price_row g_total">
                                        <span>Total</span>
                                        <span>$155</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
