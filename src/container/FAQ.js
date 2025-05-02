import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp, FaSearch, FaQuestionCircle, FaShoppingCart, FaCreditCard, FaTruck } from 'react-icons/fa';
import '../styles/FAQ.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const faqData = [
        {
            category: 'orders',
            question: 'How do I track my order?',
            answer: 'You can track your order by logging into your account and visiting the "Order History" section. There you\'ll find real-time updates on your order status.'
        },
        {
            category: 'delivery',
            question: 'What are your delivery hours?',
            answer: 'We deliver from 9 AM to 9 PM every day. You can choose your preferred delivery slot during checkout.'
        },
        {
            category: 'payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept credit/debit cards, UPI, net banking, and cash on delivery for all orders.'
        },
        {
            category: 'orders',
            question: 'How can I cancel my order?',
            answer: 'You can cancel your order within 1 hour of placing it through your account dashboard or by contacting our customer support.'
        },
        {
            category: 'delivery',
            question: 'Do you deliver to my area?',
            answer: 'We currently deliver to most areas within the city. You can check delivery availability by entering your pincode on our homepage.'
        },
        {
            category: 'payment',
            question: 'Is it safe to save my card details?',
            answer: 'Yes, we use industry-standard encryption to protect your payment information. Your card details are never stored on our servers.'
        }
    ];

    const categories = ['all', 'orders', 'delivery', 'payment'];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const filteredFAQs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryIcons = {
        'all': <FaQuestionCircle />,
        'orders': <FaShoppingCart />,
        'payment': <FaCreditCard />,
        'delivery': <FaTruck />
    };

    return (
        <div className="db_faq a_header_container">
           
                <div className="db_faq_header">
                    <div className="db_faq_header_content">
                        <h1>Frequently Asked Questions</h1>
                        <p>Find answers to common questions about our services</p>
                        <div className="db_faq_header_decoration"></div>
                    </div>
                </div>

                <div className="db_search_filter_section">
                    <div className="db_search_box">
                        <FaSearch className="db_search_icon" />
                        <input
                            type="text"
                            placeholder="Search your question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="db_category_filters">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`db_category_btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                <span className="db_category_icon">{categoryIcons[category]}</span>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="db_faq_list">
                    {filteredFAQs.map((faq, index) => (
                        <div
                            key={index}
                            className={`db_faq_item ${activeIndex === index ? 'active' : ''}`}
                        >
                            <div
                                className="db_faq_question"
                                onClick={() => toggleAccordion(index)}
                            >
                                <div className="db_question_content">
                                    <span className="db_category_tag">{faq.category}</span>
                                    <span className="db_question_text">{faq.question}</span>
                                </div>
                                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            <div className="db_faq_answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                    {filteredFAQs.length === 0 && (
                        <div className="db_no_results">
                            <FaQuestionCircle className="db_no_results_icon" />
                            <p>No matching questions found. Try a different search term.</p>
                        </div>
                    )}
                </div>
      
        </div>
    );
};

export default FAQ;