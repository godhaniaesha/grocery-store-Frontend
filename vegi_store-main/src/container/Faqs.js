import React from 'react'
import '../styles/Akshay.css'
import { Col, Image, Row } from 'react-bootstrap'
import faqs1 from '../img/Ak_images/faqs.png'
import Accordion from 'react-bootstrap/Accordion';

export default function Faqs() {
    return (
        <div>
            <div className='a_header_container'>
                <div className='g_pad_topbottom'>
                    <div className='g_why_us g_text_gredient'>Frequently Asked Questions</div>
                    <div>
                        <Row>
                            <Col lg={6}>
                                <div>
                                    <Image src={faqs1} className='about-img'></Image>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div id="G_faqs_acco">
                                    <div className="g_faqs_right">
                                        <Accordion defaultActiveKey="0">
                                            <Accordion.Item eventKey="0" className="rounded">
                                                <Accordion.Header>How do I register?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ad voluptate doloribus eos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto. Libero, vero natus.
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ad voluptate doloribus eos sunt labore ea enim voluptatem, sequi voluptas rem doloremque architecto. Libero, vero natus.
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey="1" className="mt-3 border-top rounded rounded-1">
                                                <Accordion.Header>How do I reset my password?</Accordion.Header>
                                                <Accordion.Body>
                                                    Instructions on how to reset your password will go here.
                                                    Instructions on how to reset your password will go here.
                                                    Instructions on how to reset your password will go here.
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey="2" className="mt-3 border-top rounded rounded-1">
                                                <Accordion.Header>What are the modes of payment?</Accordion.Header>
                                                <Accordion.Body>
                                                    We accept credit cards, debit cards, PayPal, and more.
                                                    We accept credit cards, debit cards, PayPal, and more.
                                                    We accept credit cards, debit cards, PayPal, and more.
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey="3" className="mt-3 border-top rounded rounded-1">
                                                <Accordion.Header>When will I receive my order?</Accordion.Header>
                                                <Accordion.Body>
                                                    Estimated delivery time varies based on location and shipping method.
                                                    Estimated delivery time varies based on location and shipping method.
                                                    Estimated delivery time varies based on location and shipping method.
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey="4" className="mt-3 border-top rounded rounded-1">
                                                <Accordion.Header>How can I cancel my order?</Accordion.Header>
                                                <Accordion.Body>
                                                    You can cancel your order within 24 hours of placing it.
                                                    You can cancel your order within 24 hours of placing it.
                                                    You can cancel your order within 24 hours of placing it.
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey="5" className="mt-3 border-top rounded rounded-1">
                                                <Accordion.Header>What if I want to return something?</Accordion.Header>
                                                <Accordion.Body>
                                                    Our return policy allows returns within 30 days of purchase.
                                                    Our return policy allows returns within 30 days of purchase.
                                                    Our return policy allows returns within 30 days of purchase.
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            <Accordion.Item eventKey="6" className="mt-3 border-top rounded rounded-1">
                                                <Accordion.Header>What if I don’t receive my order by the scheduled time?</Accordion.Header>
                                                <Accordion.Body>
                                                    If your order is delayed, please contact customer support.
                                                    If your order is delayed, please contact customer support.
                                                    If your order is delayed, please contact customer support.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
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
