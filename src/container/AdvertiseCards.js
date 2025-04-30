import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Z_style.css';
import GrainsImage from '../image/z_accets/banner.png';
import VeggieImage from '../image/z_accets/banner-1.png';
import FruitImage from '../image/z_accets/banner-2.png';

function AdvertiseCards() {
    return (
        <div className="a_header_container py-5">
            <Row className="g-4">
                <Col xs={12} lg={8}>
                    <div className="z_advertise-card z_large-card z_first-card h-100">
                        <div className="z_card-image">
                            <img src={GrainsImage} alt="Fresh Grains" />
                            <div className="z_content-area">    
                                <div className="z_advertise-content">
                                    <h2 className="z_advertise-title">
                                        <span>Don't miss our daily</span><br />
                                        <span>amazing deals.</span>
                                    </h2>
                                    <p className="z_advertise-text text-dark">Save up to 60% off on your first order</p>
                                    <button className="z_advertise-btn">
                                        Order Now
                                        <span className="z_btn-arrow">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} lg={4}>
                    <Row className="g-4">
                        <Col xs={12} md={6} lg={12}>
                            <div className="z_advertise-card z_small-card z_second-card">
                                <div className="z_card-image">
                                    <img src={VeggieImage} alt="Fresh Vegetables" />
                                    <div className="z_content-area">
                                        <div className="z_advertise-content">
                                            <span className="z_advertise-subtitle">Only This Week</span>
                                            <h3 className="z_advertise-title">
                                                Unbeatable quality,<br />
                                                unbeatable prices.
                                            </h3>
                                            <p className="z_advertise-text small">Only this week. Don't miss...</p>
                                            <button className="z_advertise-btn z_outline-btn">
                                                Shop Now
                                                <span className="z_btn-arrow">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={6} lg={12}>
                            <div className="z_advertise-card z_small-card z_content-right">
                                <div className="z_card-image">
                                    <img src={FruitImage} alt="Fresh Fruits" />
                                    <div className="z_content-area">
                                        <div className="z_advertise-content">
                                            <span className="z_advertise-subtitle">Only This Week</span>
                                            <h3 className="z_advertise-title">
                                                Unbeatable quality,<br />
                                                unbeatable prices.
                                            </h3>
                                            <p className="z_advertise-text small">Only this week. Don't miss...</p>
                                            <button className="z_advertise-btn z_outline-btn">
                                                Shop Now
                                                <span className="z_btn-arrow">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default AdvertiseCards;