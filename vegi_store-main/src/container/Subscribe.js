import React from 'react';
import '../styles/x_app.css';
import '../styles/denisha.css';

function Subscribe() {
    return (
        <div className='a_header_container'>
        <div className="subscribe-section">
            <div className="subscribe-content">
                <h2>In store or online your health & safety <br className='x_br_n'></br> is our top priority</h2>
                <p>The only supermarket that makes your life easier, <br className='x_br_n'></br> makes you enjoy life and makes it better</p>
                
                <div className="subscribe-form">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="email-input"
                        />
                        <button className="subscribe-btn">Subscribe</button>
                    </div>
            </div>
            
            <div className="subscribe-illustration">
                {/* Illustration will be added via CSS */}
            </div>
        </div>
        </div>
    );
}

export default Subscribe;