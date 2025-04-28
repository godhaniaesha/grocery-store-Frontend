import React from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import about1 from '../img/Ak_images/About1.png'
import icon1 from '../img/Ak_images/Icon1.png'
import icon2 from '../img/Ak_images/Icon2.png'
import icon3 from '../img/Ak_images/Icon3.png'
import icon4 from '../img/Ak_images/Icon4.png'
import icon5 from '../img/Ak_images/Icon5.png'
import icon6 from '../img/Ak_images/Icon6.png'
import '../styles/Akshay.css'
import HomeMethod from '../components/HomeMethod'

export default function Aboutus() {
    return (
        <div>
            <div className='a_header_container mt-5'>
                <Row className="align-items-center">
                    {/* Images Section */}
                    <Col lg={6} className="text-center">
                        <Image src={about1} alt="Delivery Person" className="about-img" />
                    </Col>


                    {/* Text Section */}
                    <Col lg={6}>
                        <h6 className='text-secondary'>About Us</h6>
                        <h2 className="g_text_gredient fw-bold" >Fresh, Healthy, and Delivered!</h2>
                        <p className='text-secondary'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className='text-secondary'>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className='text-secondary'>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </Col>
                </Row>

                
                <div className="g_pad_topbottom">
                    <div className='g_why_us g_text_gredient'>Why Choose us?</div>
                    <div>
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div>
                                    <div className='d-flex mb-5'>
                                        <div>
                                            <Image src={icon1} alt="Delivery Person" className="g_icone g_icon_hover" />
                                        </div>
                                        <div>
                                            <p className='g_icon_p'>Freshness & Quality Guaranteed</p>
                                            <p className='g_icon1_p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                                        </div>
                                    </div>
                                    <div className='d-flex mb-5'>
                                        <div>
                                            <Image src={icon2} alt="Delivery Person" className="g_icone g_icon_hover" />
                                        </div>
                                        <div>
                                            <p className='g_icon_p'>Sustainable & Locally Sourced</p>
                                            <p className='g_icon1_p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                                        </div>
                                    </div>
                                    <div className='d-flex mb-5'>
                                        <div>
                                            <Image src={icon3} alt="Delivery Person" className="g_icone g_icon_hover" />
                                        </div>
                                        <div>
                                            <p className='g_icon_p'>Easy & Convenient Shopping</p>
                                            <p className='g_icon1_p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div>
                                    <div className='d-flex mb-5'>
                                        <div>
                                            <Image src={icon4} alt="Delivery Person" className="g_icone g_icon_hover" />
                                        </div>
                                        <div>
                                            <p className='g_icon_p'>Affordable & Great Value</p>
                                            <p className='g_icon1_p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                                        </div>
                                    </div>
                                    <div className='d-flex mb-5'>
                                        <div>
                                            <Image src={icon5} alt="Delivery Person" className="g_icone g_icon_hover" />
                                        </div>
                                        <div>
                                            <p className='g_icon_p'>Safe, Hygienic, & Trusted</p>
                                            <p className='g_icon1_p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                                        </div>
                                    </div>
                                    <div className='d-flex mb-5'>
                                        <div>
                                            <Image src={icon6} alt="Delivery Person" className="g_icone g_icon_hover" />
                                        </div>
                                        <div>
                                            <p className='g_icon_p'>Smart Savings & Best Prices</p>
                                            <p className='g_icon1_p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    )
}
