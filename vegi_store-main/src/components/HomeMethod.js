import React from 'react';
import '../styles/denisha.css'
import '../styles/Home.css'
import { Col, Row } from 'react-bootstrap';
import Online_Payment from '../img/Kassets/Online_Payment .png'
import Fresh_stocks from '../img/Kassets/Fresh_stocks .png'
import Quality_assurance from '../img/Kassets/Quality_assurance.png'
import Delivery from '../img/Kassets/Delivery.png'

function HomeMethod() {
    return (
        <section className="Z_homeMethod_section">
            <div className="a_header_container">
                <div className="row Z_homeMethod_row">
                    {/* Online Payment */}
                    <Row>
                        <Col md={6} xl={3} lg={6} sm={6} >
                            <div className=" Z_homeMethod_col">
                                <div className="Z_homeMethod_card">
                                    <img src={Online_Payment} alt="Online Payment" className="Z_homeMethod_icon" />
                                    <div className="Z_homeMethod_text">
                                        <h4 className="Z_homeMethod_title">Online Payment</h4>
                                        <p className="Z_homeMethod_desc">
                                            Tasigförsamhet beteendedesign.
                                            checkout. Ylig kärrtorpa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        {/* Fresh Stocks and Sales */}
                        <Col md={6} xl={3} lg={6} sm={6} >
                            <div className=" Z_homeMethod_col">
                                <div className="Z_homeMethod_card">
                                    <img src={Fresh_stocks} alt="Fresh Stocks" className="Z_homeMethod_icon" />
                                    <div className="Z_homeMethod_text">
                                        <h4 className="Z_homeMethod_title">Fresh stocks and sales</h4>
                                        <p className="Z_homeMethod_desc">
                                            Tasigförsamhet beteendedesign.
                                            checkout. Ylig kärrtorpa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        {/* Quality Assurance */}
                        <Col md={6} xl={3} lg={6} sm={6} >
                            <div className="Z_homeMethod_col">
                                <div className="Z_homeMethod_card">
                                    <img src={Quality_assurance} alt="Quality Assurance" className="Z_homeMethod_icon" />
                                    <div className="Z_homeMethod_text">
                                        <h4 className="Z_homeMethod_title">Quality assurance</h4>
                                        <p className="Z_homeMethod_desc">
                                            Tasigförsamhet beteendedesign.
                                            checkout. Ylig kärrtorpa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        {/* Delivery within 1 hour */}
                        <Col md={6} xl={3} lg={6} sm={6} >
                            <div className="Z_homeMethod_col">
                                <div className="Z_homeMethod_card">
                                    <img src={Delivery} alt="Delivery" className="Z_homeMethod_icon" />
                                    <div className="Z_homeMethod_text">
                                        <h4 className="Z_homeMethod_title">Delivery within 1 hour</h4>
                                        <p className="Z_homeMethod_desc">
                                            Tasigförsamhet beteendedesign.
                                            checkout. Ylig kärrtorpa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
}

export default HomeMethod;
