import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// Images
import slide1 from '../image/z_accets/Slide1.png';
import slide2 from '../image/z_accets/Tabpanel.png';
import slide3 from '../image/z_accets/Slide3.png';
import '../styles/Z_style.css';

function FirstSlider() {
    return (
        <section className="z_first-slider">
            <Carousel controls={false} indicators={true} className="responsive-carousel">
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={slide1}
                        alt="First slide"
                    />
                    <Carousel.Caption className="responsive-caption">
                        <span className="z_discount-badge">Weekend Discount</span>
                        <h3>Don't miss our daily amazing deals</h3>
                        <p>Save up to 60% off on your first order</p>
                        <a href="#shop" className="z_order-btn">Order Now →</a>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={slide2}
                        alt="Second slide"
                    />
                    <Carousel.Caption className="responsive-caption">
                        <span className="z_discount-badge">Weekend Discount</span>
                        <h3>Shopping with us for better quality and the best price</h3>
                        <p>We have prepared special discounts for you on grocery products.</p>
                        <a href="#shop" className="z_order-btn">Shop Now →</a>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={slide3}
                        alt="Third slide"
                    />
                    <Carousel.Caption className="responsive-caption">
                        <span className="z_discount-badge">Weekend Discount</span>
                        <h3>Get the best quality products at the lowest prices</h3>
                        <p>We have prepared special discounts for you on organic breakfast products.</p>
                        <a href="#shop" className="z_order-btn">Shop Now →</a>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </section>
    );
}

export default FirstSlider;