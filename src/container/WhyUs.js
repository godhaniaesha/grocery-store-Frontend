import React from 'react';
import { FaTruck, FaLeaf, FaRegClock, FaShieldAlt, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';

function WhyUs() {
    const features = [
        {
            icon: <FaLeaf />,
            title: "Fresh Products",
            description: "100% organic and fresh products"
        },
        {
            icon: <FaRegClock />,
            title: "24/7 Support",
            description: "Shop anytime with round-the-clock service"
        },
        {
            icon: <FaShieldAlt />,
            title: "Secure Payment",
            description: "100% secure and trusted payment"
        },
        {
            icon: <FaMoneyBillWave />,
            title: "Best Prices",
            description: "Guaranteed best prices and quality"
        },
        {
            icon: <FaHeadset />,
            title: "Customer Support",
            description: "Dedicated customer support team"
        }
    ];

    return (
        <div className="x_why_section">
            <div className="a_header_container">
                <div className="x_why_header text-center">
                    <h5 className="x_testimonial_subtitle">Why Choose Us</h5>
                    
                    <h2 className="x_testimonial_title">
                       Find Reasons to Choose Us
                    </h2>
                </div>
                
                <div className="x_why_features">
                    {features.map((feature, index) => (
                        <div key={index} className="x_feature_card">
                            <div className="x_feature_icon">
                                {feature.icon}
                            </div>
                            <h3 className="x_feature_title">{feature.title}</h3>
                            <p className="x_feature_description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WhyUs;