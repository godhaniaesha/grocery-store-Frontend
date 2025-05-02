import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/PrivacyPolicy.css';
import { 
    FaShieldAlt, FaUserLock, FaCookie, FaEnvelope, 
    FaUserShield, FaShareAlt, FaLock, FaGlobe,
    FaExclamationTriangle, FaChild, FaHistory
} from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div className="db_privacy">
            <Container>
                <div className="db_privacy_header">
                    <FaShieldAlt className="db_privacy_icon" />
                    <h1>Privacy Policy</h1>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <div className="db_header_description">
                        <p>We value your privacy and are committed to protecting your personal information. 
                           This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.</p>
                    </div>
                </div>

                <div className="db_privacy_content">
                    <div className="db_privacy_section">
                        <div className="db_section_header">
                            <FaUserLock className="db_section_icon" />
                            <h2>Information We Collect</h2>
                        </div>
                        <p>We collect information that you provide directly to us, including:</p>
                        <Row className="db_info_grid">
                            <Col md={6}>
                                <div className="db_info_card">
                                    <h3>Personal Information</h3>
                                    <ul>
                                        <li>Full name and title</li>
                                        <li>Email address</li>
                                        <li>Phone number</li>
                                        <li>Date of birth</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="db_info_card">
                                    <h3>Delivery Information</h3>
                                    <ul>
                                        <li>Delivery address</li>
                                        <li>Preferred delivery times</li>
                                        <li>Special delivery instructions</li>
                                        <li>Address type (home/work)</li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="db_privacy_section">
                        <div className="db_section_header">
                            <FaUserShield className="db_section_icon" />
                            <h2>Data Protection</h2>
                        </div>
                        <div className="db_protection_content">
                            <div className="db_protection_item">
                                <FaLock className="db_item_icon" />
                                <h3>Secure Storage</h3>
                                <p>Your data is encrypted and stored on secure servers with regular security updates.</p>
                            </div>
                            <div className="db_protection_item">
                                <FaGlobe className="db_item_icon" />
                                <h3>Data Transfer</h3>
                                <p>We use SSL encryption for all data transfers between your device and our servers.</p>
                            </div>
                        </div>
                    </div>

                    <div className="db_privacy_section">
                        <div className="db_section_header">
                            <FaCookie className="db_section_icon" />
                            <h2>Cookies & Tracking</h2>
                        </div>
                        <div className="db_cookie_info">
                            <p>We use cookies and similar tracking technologies to:</p>
                            <ul>
                                <li>Remember your login status</li>
                                <li>Maintain your shopping cart</li>
                                <li>Analyze site usage patterns</li>
                                <li>Personalize your shopping experience</li>
                            </ul>
                            <div className="db_cookie_notice">
                                <FaExclamationTriangle className="db_notice_icon" />
                                <p>You can control cookie settings through your browser preferences.</p>
                            </div>
                        </div>
                    </div>

                    <div className="db_privacy_section">
                        <div className="db_section_header">
                            <FaChild className="db_section_icon" />
                            <h2>Children's Privacy</h2>
                        </div>
                        <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
                    </div>

                    <div className="db_privacy_section">
                        <div className="db_section_header">
                            <FaHistory className="db_section_icon" />
                            <h2>Data Retention</h2>
                        </div>
                        <p>We retain your personal information for as long as necessary to:</p>
                        <ul>
                            <li>Provide our services to you</li>
                            <li>Comply with legal obligations</li>
                            <li>Resolve disputes</li>
                            <li>Enforce our agreements</li>
                        </ul>
                    </div>

                    <div className="db_privacy_section">
                        <div className="db_section_header">
                            <FaEnvelope className="db_section_icon" />
                            <h2>Contact Us</h2>
                        </div>
                        <p>If you have any questions about our Privacy Policy, please contact us:</p>
                        <div className="db_contact_grid">
                            <div className="db_contact_card">
                                <h3>Customer Support</h3>
                                <p>Email: support@grocerystore.com</p>
                                <p>Phone: 1-800-GROCERY</p>
                            </div>
                            <div className="db_contact_card">
                                <h3>Privacy Office</h3>
                                <p>Email: privacy@grocerystore.com</p>
                                <p>Phone: 1-888-PRIVACY</p>
                            </div>
                            <div className="db_contact_card">
                                <h3>Postal Address</h3>
                                <p>123 Grocery Street</p>
                                <p>Food City, FC 12345</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default PrivacyPolicy;