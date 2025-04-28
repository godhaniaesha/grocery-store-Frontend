import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import '../styles/denisha.css';
import '../styles/Home.css';
import { FaCheck } from 'react-icons/fa';
import check from '../img/Kassets/Receipt Details.png'
import brocolli from '../img/Kassets/Broccoli.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../redux/slices/order.Slice';
import axios from 'axios';

function Orderdetails(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                
                // Get the token from localStorage
                const token = localStorage.getItem('token');
                
                // Set the authorization header
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                
                // If we have orderId from navigation state, fetch that specific order
                if (location.state && location.state.orderId) {
                    const response = await axios.get(`http://localhost:4000/api/order/${location.state.orderId}`, config);
                    setOrder(response.data);
                } else {
                    // Otherwise fetch all orders and get the latest one
                    const response = await axios.get('http://localhost:4000/api/allOrders', config);
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user) {
                        const userOrders = response.data.filter(order => order.userId === user._id);
                        if (userOrders.length > 0) {
                            // Sort by createdAt in descending order and get the latest
                            const latestOrder = userOrders.sort((a, b) => 
                                new Date(b.createdAt) - new Date(a.createdAt)
                            )[0];
                            setOrder(latestOrder);
                        }
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Failed to load order details");
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location.state]);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <h3>Loading order details...</h3>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container className="text-center my-5">
                <h3>{error || "Order not found"}</h3>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/HomeMain')}
                >
                    Return to Home
                </button>
            </Container>
        );
    }

    // Format date
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Container fluid className="Z_order_details_container my-4">
            <Row>
                <Col md={12} lg={8}>
                    {/* Order Confirmation Section */}
                    <div className="Z_order_confirmation_section">
                        <div className="Z_order_confirmation_container d-flex align-items-center">
                            <div className="Z_success_icon_container">
                                <div>
                                    <img src={check} alt="Check mark" style={{ height: '70px' }} />
                                </div>
                            </div>
                            <div className="Z_order_text_container ms-3">
                                <h4 className="Z_order_number">Order #{order._id.substring(0, 8)}</h4>
                                <h3 className="Z_thank_you">Thank you, {order.shippingAddress.fullName.split(' ')[0]}!</h3>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <Card className="Z_map_card mb-4">
                        <Card.Body className="p-0">
                            <div className="Z_map_container">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.6539624305547!2d72.8792098760017!3d21.205901081669435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x26cb5e4230fc8877%3A0xd36ccfe485cd6a01!2sKalathiya%20Infotech!5e0!3m2!1sen!2snl!4v1742555876783!5m2!1sen!2snl"
                                    width="100%"
                                    height="90%" allowfullscreen="" loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                                <div className="Z_order_status p-3">
                                    <h5 className="Z_status_title">Your order is confirmed.</h5>
                                    <p className="Z_status_text mb-1">You'll receive an email when your order is ready.</p>
                                    <p className="Z_status_text">Your order will be delivered in 5 hours.</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Contact Details Section */}
                    <Card className="Z_contact_card mb-4">
                        <Card.Header className="Z_card_header">Contact Details</Card.Header>
                        <Card.Body>
                            <Row>
                                {/* Contact Information */}
                                <Col md={6} className="mb-3 mb-md-0">
                                    <div className="Z_contact_section">
                                        <h6 className="Z_contact_heading">Contact Information</h6>
                                        <p className="Z_contact_text">{order.shippingAddress.phone}</p>
                                    </div>

                                    <div className="Z_contact_section mt-4">
                                        <h6 className="Z_contact_heading">Shipping Address</h6>
                                        <p className="Z_contact_text mb-1">{order.shippingAddress.fullName}</p>
                                        <p className="Z_contact_text mb-1">{order.shippingAddress.phone}</p>
                                        <p className="Z_contact_text">{order.shippingAddress.address}</p>
                                    </div>

                                    <div className="Z_contact_section mt-4">
                                        <h6 className="Z_contact_heading">Shipping method</h6>
                                        <p className="Z_contact_text">{order.paymentMethod}</p>
                                    </div>
                                </Col>

                                {/* Payment Method and Billing */}
                                <Col md={6}>
                                    <div className="Z_contact_section">
                                        <h6 className="Z_contact_heading">Payment Method</h6>
                                        <p className="Z_contact_text">{order.paymentMethod} - ${order.total}</p>
                                    </div>

                                    <div className="Z_contact_section mt-4">
                                        <h6 className="Z_contact_heading">Billing Address</h6>
                                        <p className="Z_contact_text mb-1">{order.shippingAddress.fullName}</p>
                                        <p className="Z_contact_text">{order.shippingAddress.address}</p>
                                        <p className="Z_contact_text">{order.shippingAddress.phone}</p>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Order Summary Section */}
                <Col md={12} lg={4}>
                    <Card className="Z_summary_card">
                        <Card.Header className="Z_card_header">Order Summary</Card.Header>
                        <Card.Body className='mx-2'>
                            {/* Order Items */}
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className="Z_order_item d-flex justify-content-between align-items-center mb-3">
                                    <div className="Z_item_details gap-3 d-flex align-items-center">
                                        <div className="Z_item_icon me-2 text-success">
                                            <img src={brocolli} alt="" />
                                        </div>
                                        <div>
                                            <p className="Z_item_name mb-0">{item.productName || "Product"}</p>
                                            <small className="Z_item_weight">{item.size || "N/A"}</small>
                                        </div>
                                    </div>
                                    <div className="Z_item_price text-end">
                                        <p className="mb-0">${item.price}</p>
                                        <small className="text-muted">×{item.quantity}</small>
                                    </div>
                                </div>
                            ))}

                            <hr className="Z_divider" />

                            {/* Price Breakdown */}
                            <div className="Z_price_summary">
                                <div className="Z_price_row d-flex justify-content-between mb-2">
                                    <p className="Z_price_label mb-0">Price ({order.items.length} Items)</p>
                                    <p className="Z_price_value mb-0">${order.subtotal}</p>
                                </div>

                                <div className="Z_price_row d-flex justify-content-between mb-2">
                                    <p className="Z_price_label mb-0">Discount</p>
                                    <p className="Z_price_value mb-0 text-success">-${order.discount}</p>
                                </div>

                                <div className="Z_price_row d-flex justify-content-between mb-2">
                                    <p className="Z_price_label mb-0">Platform Fee</p>
                                    <p className="Z_price_value mb-0">${order.platformFee}</p>
                                </div>

                                <div className="Z_price_row d-flex justify-content-between mb-3">
                                    <p className="Z_price_label mb-0">Delivery Charges</p>
                                    <div className="Z_delivery_fee text-end">
                                        <p className="Z_price_value mb-0 text-decoration-line-through">$20</p>
                                        <p className="Z_price_value mb-0 text-success">FREE</p>
                                    </div>
                                </div>

                                <hr className="Z_divider" />

                                <div className="Z_price_row d-flex justify-content-between mt-2">
                                    <h6 className="Z_total_label fw-bold mb-0">Total</h6>
                                    <h6 className="Z_total_value fw-bold mb-0">${order.total}</h6>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Orderdetails;