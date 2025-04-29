import React, { useState } from 'react';
import '../styles/x_app.css';
import '../styles/denisha.css';
import deliveryMan from '../img/x_img/topsubscribe.png';

function Subscribe() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmail('');
    };
    return (
        <div className="a_header_container">
        <div className="x_subscribe_section">
                <div className="x_subscribe_container">
                    <div className="x_subscribe_content">
                        <h2 className="x_subscribe_title">
                            Stay home & get your daily<br />
                            needs from our shop
                        </h2>
                        <p className="x_subscribe_subtitle">
                            Start Your Daily Shopping with Nest Mart
                        </p>
                        <div className="x_subscribe_form_wrapper">
                            <form onSubmit={handleSubmit} className="x_subscribe_form">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    required
                                    className="x_subscribe_input"
                                />
                                <button type="submit" className="x_subscribe_button">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="x_subscribe_images">
                        <img src={deliveryMan} alt="Delivery Man" className="x_delivery_man" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subscribe;