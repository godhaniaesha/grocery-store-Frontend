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
        <div>
            <div className='a_header_container'>
                <div className='g_pad_topbottom'>
                    <div className="p-4 bg-white shadow rounded">
                        <Form>
                            <Row>
                                {/* Left Section - Payment Methods */}
                                <Col md={8}>
                                    <p className="mb-4 g_check_p">Select Payment Method</p>
                                    {validationErrors.paymentMethod && (
                                        <div className="text-danger mb-2">{validationErrors.paymentMethod}</div>
                                    )}
                                    <label className={`g_method_border p-3 d-flex g_radio-wrapper align-items-center w-96 ${selected === "Cod" ? "selected-border" : ""}`}>
                                        <input
                                            type="radio"
                                            id="Cod"
                                            name="payment"
                                            checked={selected === "Cod"}
                                            onChange={() => setSelected('Cod')}
                                            className="mr-2 accent-green-600 g_radio-input"
                                        />
                                        <span className="g_radio-custom"></span>
                                        <span htmlFor="Cod" className="g_payment_method mb-0 ms-2 g_radio-label">
                                            Cash on Delivery
                                        </span>
                                    </label>
                                    <label className={`g_method_border g_radio-wrapper mt-4 p-3  align-items-center  w-100 ${selected === "Card" ? "selected-border" : ""}`}>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={selected === "Card"}
                                                    onChange={() => setSelected('Card')}
                                                    className="g_radio-input"
                                                />
                                                <span className="g_radio-custom"></span>
                                                <span className="g_radio-label g_payment_method ms-3">Credit/Debit Card</span>

                                            </div>
                                            <div className='d-flex flex-wrap'>
                                                <Image src={visa} className='ms-2'></Image>
                                                <Image src={masterCard} className='ms-2'></Image>
                                                <Image src={amex} className='ms-2'></Image>
                                                <Image src={discover} className='ms-2 me-4'></Image>
                                            </div>
                                        </div>
                                        {selected === "Card" && (
                                            <>
                                                <hr />
                                                <Row className="mt-3">
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className='my-3 g_payment_method'>Card Number</Form.Label>
                                                            <Form.Control
                                                                placeholder="Card Number"
                                                                className='g_form_background bg-light mb-3'
                                                                value={cardDetails.cardNumber}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                                                isInvalid={!!validationErrors.cardNumber}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {validationErrors.cardNumber}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className='my-3 g_payment_method'>Card Holder Name</Form.Label>
                                                            <Form.Control
                                                                placeholder="Card Holder Name"
                                                                className='g_form_background bg-light mb-3'
                                                                value={cardDetails.cardHolder}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                                                                isInvalid={!!validationErrors.cardHolder}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {validationErrors.cardHolder}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className='my-3 g_payment_method'>Expiry Date</Form.Label>
                                                            <Form.Control
                                                                placeholder="MM / YYYY"
                                                                className='g_form_background bg-light'
                                                                value={cardDetails.expiryDate}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                                                isInvalid={!!validationErrors.expiryDate}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {validationErrors.expiryDate}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className='my-3 g_payment_method'>CVV</Form.Label>
                                                            <Form.Control
                                                                placeholder="CVV"
                                                                className='g_form_background bg-light'
                                                                value={cardDetails.cvv}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                                isInvalid={!!validationErrors.cvv}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {validationErrors.cvv}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                    </label>
                                    <label className={`g_method_border g_radio-wrapper mt-4 p-3  align-items-center w-100 ${selected === "Upi" ? "selected-border" : ""}`}>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={selected === "Upi"}
                                                    onChange={() => setSelected('Upi')}
                                                    className="g_radio-input"
                                                />
                                                <span className="g_radio-custom"></span>
                                                <span className="g_radio-label g_payment_method ms-3">UPI</span>

                                            </div>
                                            <div className='d-flex flex-wrap'>
                                                <Image src={Upi} className='ms-2'></Image>
                                                <Image src={paytm} className='ms-2'></Image>
                                                <Image src={gpay} className='ms-2'></Image>
                                                <Image src={phonepay} className='ms-2 me-4'></Image>
                                            </div>
                                        </div>
                                        {selected === "Upi" && (
                                            <>
                                                <hr />
                                                <Row className="mt-3">
                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label className='my-3 g_payment_method'>UPI ID</Form.Label>
                                                            <div className="input-group">
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Enter UPI ID"
                                                                    className='g_form_background bg-light'
                                                                    value={upiId}
                                                                    onChange={(e) => {
                                                                        setUpiId(e.target.value);
                                                                        // Clear validation error when user starts typing
                                                                        if (validationErrors.upiId) {
                                                                            setValidationErrors({ ...validationErrors, upiId: '' });
                                                                        }
                                                                    }}
                                                                    isInvalid={!!validationErrors.upiId}
                                                                />

                                                                <div className='g_border_left p'></div>
                                                                <div className="input-group-append input-group-text g_Upi_background" >
                                                                    <Form.Select
                                                                        className='g_form_background'
                                                                        style={{ backgroundColor: "#EFEFEF", border: "none" }}
                                                                    >
                                                                        <option value="">@okicici</option>
                                                                        <option value="@oksbi">@oksbi</option>
                                                                        <option value="@okhdfc">@okhdfc</option>
                                                                        <option value="@okaxis">@okaxis</option>
                                                                    </Form.Select>
                                                                </div>
                                                            </div>
                                                            <Form.Control.Feedback type="invalid">
                                                                {validationErrors.upiId}
                                                            </Form.Control.Feedback>
                                                            {validationErrors.upiId && (
                                                                <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                                                    {validationErrors.upiId}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                    </label>
                                    <label className={`g_method_border g_radio-wrapper mt-4 p-3  align-items-center w-100 ${selected === "Net Banking" ? "selected-border" : ""}`}>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={selected === "Net Banking"}
                                                    onChange={() => setSelected('Net Banking')}
                                                    className="g_radio-input"
                                                />
                                                <span className="g_radio-custom"></span>
                                                <span className="g_radio-label g_payment_method ms-3">Net banking</span>

                                            </div>
                                            <div className='d-flex flex-wrap'>
                                                <Image src={citi} className='ms-2'></Image>
                                                <Image src={wells} className='ms-2'></Image>
                                                <Image src={capital} className='ms-2'></Image>
                                                <Image src={td} className='ms-2 me-4'></Image>
                                            </div>
                                        </div>
                                        {selected === "Net Banking" && (
                                            <>
                                                <hr />
                                                <Row className="mt-3">
                                                    <Col>
                                                        <Form.Group>
                                                            <div className="position-relative">
                                                                <div className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#999" className="bi bi-search" viewBox="0 0 16 16">
                                                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                                    </svg>
                                                                </div>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Search your bank"
                                                                    className='form-control'
                                                                    style={{
                                                                        backgroundColor: '#F5F5F5',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        padding: '12px 12px 12px 35px',
                                                                        fontSize: '14px'
                                                                    }}
                                                                />
                                                            </div>
                                                            {validationErrors.bank && (
                                                                <div className="text-danger mt-2">
                                                                    {validationErrors.bank}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="mt-4">
                                                                    <Row className="g-3">
                                                                        <Col xs={6} md={2}>
                                                                            <Card
                                                                                className={`h-100 cursor-pointer border-0 border p-2 ${selectedBank === 'citi' ? 'border-success' : ''}`}
                                                                                role="button"
                                                                                onClick={() => setSelectedBank('citi')}
                                                                            >
                                                                                <div className="d-flex flex-column align-items-center">
                                                                                    <Image src={citi} alt="Citi Bank" className="mb-2" />
                                                                                    <span className="text-center small">Citi Bank</span>
                                                                                </div>
                                                                            </Card>
                                                                        </Col>
                                                                        <Col xs={6} md={2}>
                                                                            <Card className="h-100 cursor-pointer border-0 border  p-2" role="button">
                                                                                <div className="d-flex flex-column align-items-center">
                                                                                    <Image src={wells} alt="Wells Fargo Bank" className="mb-2" />
                                                                                    <span className="text-center small">Wells Fargo Bank</span>
                                                                                </div>
                                                                            </Card>
                                                                        </Col>
                                                                        <Col xs={6} md={2}>
                                                                            <Card className="h-100 cursor-pointer border-0 border  p-2" role="button">
                                                                                <div className="d-flex flex-column align-items-center">
                                                                                    <Image src={capital} alt="Capital One Bank" className="mb-2" />
                                                                                    <span className="text-center small">Capital One Bank</span>
                                                                                </div>
                                                                            </Card>
                                                                        </Col>
                                                                        <Col xs={6} md={2}>
                                                                            <Card className="h-100 cursor-pointer border-0 border p-2" role="button">
                                                                                <div className="d-flex flex-column align-items-center">
                                                                                    <Image src={wells} alt="Wells Fargo Bank" className="mb-2" />
                                                                                    <span className="text-center small">Wells Fargo Bank</span>
                                                                                </div>
                                                                            </Card>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                    </label>

                                </Col>

                                {/* Right Section - Price Details */}
                                <Col md={4} >
                                    <div className='g_checkout_border'>
                                        <div className='bg-light '>
                                            <div className='g_check_pad'>
                                                <p className='g_check_p'>Price Details</p>
                                            </div>
                                        </div>
                                        <div className='g_check_pad'>
                                            <div className='d-flex justify-content-between g_check_interpad'>
                                                <div className='g_check_name'>Price ({cartItems.length} Items)</div>
                                                <div className='g_check_prize'>${calculateTotals().subtotal.toFixed(2)}</div>
                                            </div>
                                            <div className='d-flex justify-content-between g_check_interpad'>
                                                <div className='g_check_name'>Discount</div>
                                                <div className='g_check_prize1'>-${calculateTotals().discount.toFixed(2)}</div>
                                            </div>
                                            <div className='d-flex justify-content-between g_check_interpad'>
                                                <div className='g_check_name'>Platform Fee</div>
                                                <div className='g_check_prize'>${calculateTotals().platformFee.toFixed(2)}</div>
                                            </div>
                                            <div className='d-flex justify-content-between g_check_interpad'>
                                                <div className='g_check_name'>Delivery Charges</div>
                                                <div className='g_check_prize1'><span className='g_check_strike'>$20</span>FREE</div>
                                            </div>
                                            <hr />
                                            <div className='d-flex justify-content-between g_check_interpad'>
                                                <div className='g_check_prize'>Total</div>
                                                <div className='g_check_prize'>${calculateTotals().grandTotal.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                        <Button className="mt-4 g_payment_button" variant="success" onClick={handleShow}>Pay ${calculateTotals().grandTotal.toFixed(2)}</Button>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <div className="text-center">
                        <Image src={order}></Image>
                        <h4 className='my-2'>Thank you </h4>  
                        <p className="text-muted my-2+">Your order has been placed successfully. </p>
                    </div>
                </Modal.Body>
            </Modal>


        </div>
    )
}
