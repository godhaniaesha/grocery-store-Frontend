import React, { useEffect, useState } from 'react';
import '../styles/x_app.css';
import '../styles/denisha.css';
import googlePlay from '../img/x_img/google-play.png';
import appStore from '../img/x_img/app-store.png';
import { Link } from 'react-router-dom'; // Add this import at the top
// import logo from '../img/x_img/logo.png';
import facebook from '../img/facebook.png';
import twiter from '../img/twiter.png';
import instagram from '../img/instagram.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slices/categorySlice';

function Footer({setIsVegetablePage,setIsCartPage,setIsCheckoutPage,setIsProductDetailPage,setIsFaqPage,setIsTermsPage,setIsContactUsPage,setIsAboutUsPage}) {

    const dispatch = useDispatch();
    const { categories, isLoading, error } = useSelector(state => state.category);
    const [activeButton, setActiveButton] = useState(null);
  
    useEffect(() => {
      dispatch(fetchCategories({ page: 1, pageSize: 10 }));
    }, [dispatch]);

    return (
        <footer className="footer">
            <div className='a_header_container'>
                <div className="footer-content">
                    {/* Logo and Description Section */}
                    <div className="footer-section">
                        <h2 className='x_category-title'>Logo</h2>
                        {/* <img src={logo} alt="Logo" className="footer-logo" /> */}
                        <p className="footer-description">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                        </p>
                        <div className="social-links">
                            <h4>Follow us for updates</h4>
                            <div className="social-icons">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                                    <img src={facebook} alt="Logo" className="footer-logo" />
                                </a>
                                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                                    <img src={twiter} alt="Logo" className="footer-logo" />
                                </a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                                    <img src={instagram} alt="Logo" className="footer-logo" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Category Links */}
                    <div className="footer-section">
                        <h3>Category</h3>
                        <ul className="footer-links">
                        {/* // This part is correct - storing categoryId in localStorage */}
                        {categories.map((category, index) => (
                            <li key={index}>
                                <Link
                                    to="#"
                                    onClick={() => {
                                        localStorage.setItem('activePage', 'Vegetables');
                                        localStorage.setItem('selectedCategoryId', category._id);
                                        setIsVegetablePage(true);
                                        setIsCartPage(false);
                                        setIsCheckoutPage(false);
                                        setIsProductDetailPage(false);
                                        setIsFaqPage(false);
                                        setIsTermsPage(false);
                                        setIsContactUsPage(false);
                                        setIsAboutUsPage(false);
                                       
                                    }}
                                >
                                   {category.categoryName}
                                </Link>
                            </li>
                        ))}
                            
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#">Sell on FastKart</a></li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={() => {
                                        localStorage.removeItem('activePage');
                                        window.location.reload();
                                    }}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={() => {
                                        localStorage.setItem('activePage', 'Vegetables');
                                        window.location.reload();
                                    }}
                                >
                                    Vegetables
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={() => {
                                        localStorage.setItem('activePage', 'Today deals');
                                        window.location.reload();
                                    }}
                                >
                                    Today Deals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={() => {
                                        localStorage.setItem('activePage', 'About us');
                                        window.location.reload();
                                    }}
                                >
                                    About Us
                                </Link>
                            </li>
                            <li> <Link
                                to="#"
                                onClick={() => {
                                    localStorage.setItem('activePage', 'Contact us');
                                    window.location.reload();
                                }}
                            >
                                Contact Us
                            </Link>
                            </li>
                            <li> <Link
                                to="#"
                                onClick={() => {
                                    localStorage.setItem('activePage', 'Terms');
                                    window.location.reload();
                                }}
                            >
                                Terms & Condition
                            </Link>
                            </li>
                            <li> <Link
                                to="#"
                                onClick={() => {
                                    localStorage.setItem('activePage', 'Faq');
                                    window.location.reload();
                                }}
                            >
                                FAQs
                            </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Experience App Section */}
                    <div className="footer-section">
                        <h3>Experience App On Mobile</h3>
                        {/* <div className="app-downloads">
                        <a href="#" className="app-link">
                            <img src={googlePlay} alt="Google Play" />
                        </a>
                        <a href="#" className="app-link">
                            <img src={appStore} alt="App Store" />
                        </a>
                    </div> */}
                        <div className="d-flex align-items-center flex-sm-row flex-lg-column flex-row gap-4 x_cres">
                            <div className="a_appUI_btns w-md-auto w-100 d-flex justify-content-center align-items-center gap-2">
                                <div>
                                    <img src={googlePlay} alt="Google Play" />
                                </div>
                                <div>
                                    <p className="mb-0">GET IN ON</p>
                                    <h5 >Google Play</h5>
                                </div>
                            </div>
                            <div className="a_appUI_btns w-md-auto w-100 d-flex justify-content-center align-items-center gap-2">
                                <div>
                                    <img src={appStore} alt="App Store" />
                                </div>
                                <div>
                                    <p className="mb-0">GET IN ON</p>
                                    <h5>Google Play</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* Copyright */}
            <div className="footer-bottom">
                <p>©2025 All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;