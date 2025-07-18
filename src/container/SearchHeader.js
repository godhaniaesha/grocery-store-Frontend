import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { createUser, login, generateOtp, verifyOtp, verifyGeneratedOtp, resetPassword, userLogout } from '../redux/slices/Auth.slice.js';
import { FaSearch, FaShoppingCart, FaHeart, FaBars, FaTimes, FaUser, FaTimesCircle, FaUserAlt, FaSignOutAlt, FaSignInAlt, FaLocationArrow } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";

import { BsShop } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { fetchCategories } from '../redux/slices/categorySlice';
import { getAllSubcategories } from '../redux/slices/Subcategory.slice';
import { fetchProducts } from '../redux/slices/product.Slice.js';
import '../styles/x_app.css'
import { GrFormClose, GrLocationPin } from 'react-icons/gr';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IoIosArrowDown, IoIosEye, IoIosEyeOff, IoIosLogIn, IoMdLogIn } from 'react-icons/io';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FiShoppingBag } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Search from "../components/Search.js";
import { getWishlistItems } from '../redux/slices/wishlist.Slice';
import { LocateIcon } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner.js";

export default function SearchHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, otpSent, otpVerified } = useSelector(state => state.auth);
  const { products, loading: productsLoading } = useSelector(state => state.product);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getWishlistItems());
    }
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      setCurrentView('login');
      if (window.location.pathname !== '/SliderCaptcha') {
        navigate('/SliderCaptcha');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (products?.length > 0) {
      // console.log('All products:', products);
    }
  }, [products]);

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories"); // For styling the clicked/sticky item
  const [visibleDropdownCategory, setVisibleDropdownCategory] = useState(null); // For showing the dropdown

  const { categories: storeCategories = [], loading: categoriesLoading } = useSelector((state) => state.category || {});
  const { subcategories = [], loading: subcategoriesLoading } = useSelector((state) => state.subcategory || {});
  const { wishlistItems } = useSelector(state => state.wishlist);
  const { cartItems } = useSelector(state => state.addcart);

  useEffect(() => {
    // console.log('=== REDUX STORE DATA ===');
    // console.log('Categories:', storeCategories);
    // console.log('Subcategories:', subcategories);
  }, [storeCategories, subcategories]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('User not logged in');
      return;
    }

    const fetchData = async () => {
      try {
        // console.log('=== FETCHING DATA ===');
        await Promise.all([
          dispatch(fetchCategories()).unwrap(),
          dispatch(getAllSubcategories()).unwrap(),
          dispatch(fetchProducts()).unwrap()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load categories. Please try again.');
      }
    };

    fetchData();
  }, [dispatch]);

  const categoriesWithSubcategories = React.useMemo(() => {
    if (!storeCategories?.length) {
      // console.log('No categories found');
      return [];
    }

    return storeCategories.map(category => {
      const categorySubcategories = subcategories.filter(sub => sub.categoryId === category._id);
      // console.log(`Category ${category.categoryName} subcategories:`);
      // categorySubcategories.forEach(sub => {
      //   console.log(`- ${sub.subCategoryName}`);
      // });

      return {
        ...category,
        subcategories: categorySubcategories
      };
    });
  }, [storeCategories, subcategories]);

  const isLoading = categoriesLoading || subcategoriesLoading;
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // If click is outside the main nav dropdown area, and no category is "active" (sticky)
        // then close the visible dropdown.
        // If a category is "active", its dropdown should remain visible unless another action closes it.
        if (activeCategory === "All Categories") {
             setVisibleDropdownCategory(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeCategory]); // Add activeCategory to dependencies

  const handleProductClick = (product) => {
    // console.log('Selected Product:', product);
    // console.log('Selected Product ID:', product._id);

    localStorage.setItem('selectedProductId', product._id);
    navigate(`/product-details/${product._id}`);
    handleSubItemSelected(); // Close dropdowns and offcanvas
  };

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const userDropdownRef = useRef(null);
  const modalRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem('token');


  useEffect(() => {
    const token = localStorage.getItem('token');
    const isVerified = localStorage.getItem('isVerified');

    if (!isVerified && window.location.pathname !== '/SliderCaptcha') {
      navigate('/SliderCaptcha');
    }
  }, [navigate]);

  const handleLoginClick = () => {
    setShowUserDropdown(false);
    setShowLoginModal(true);
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setCurrentView('forgot');
  };

  // Desktop Dropdown Handlers
  const handleDesktopCategoryMouseEnter = (categoryName) => {
    setVisibleDropdownCategory(categoryName);
  };

  const handleDesktopCategoryMouseLeave = () => {
    // If a category is actively clicked, keep its dropdown open, otherwise close
    if (activeCategory === "All Categories") {
        setVisibleDropdownCategory(null);
    } else {
        setVisibleDropdownCategory(activeCategory);
    }
  };

  const handleDesktopCategoryClick = (categoryName) => {
    if (categoryName === "All Categories") {
      setActiveCategory("All Categories");
      setVisibleDropdownCategory(null);
    } else if (activeCategory === categoryName) {
      // Clicking an already active category deactivates it
      setActiveCategory("All Categories");
      setVisibleDropdownCategory(null);
    } else {
      // Clicking a new category makes it active and shows its dropdown
      setActiveCategory(categoryName);
      setVisibleDropdownCategory(categoryName);
    }
  };

  // Mobile Offcanvas Handlers
  const handleMobileCategoryClick = (categoryName) => {
    if (categoryName === "All Categories") {
      setActiveCategory("All Categories");
      setVisibleDropdownCategory(null);
    } else if (visibleDropdownCategory === categoryName) {
      // If current is clicked to close
      setVisibleDropdownCategory(null);
      // setActiveCategory("All Categories"); // Optionally reset active style too
    } else {
      // If a new one is clicked to open
      setVisibleDropdownCategory(categoryName);
      setActiveCategory(categoryName); // Style new one as active
    }
  };

  // Handler for when a sub-item (subcategory or product) is selected from a dropdown
  const handleSubItemSelected = () => {
    setOpen(false); // Close mobile offcanvas
    setActiveCategory("All Categories"); // Reset active category style
    setVisibleDropdownCategory(null); // Close any visible desktop dropdown
  };


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const registerSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      )
      .required('Password is required'),
    terms: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  const forgotPasswordSchema = Yup.object().shape({
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required')
  });

  const otpSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, 'OTP must be exactly 6 digits')
      .required('OTP is required'),
  });

  const newPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
      setShowLoginModal(false);
      localStorage.setItem('isVerified', 'false');
      navigate('/SliderCaptcha');
      try {
        await Promise.all([
          dispatch(fetchCategories()).unwrap(),
          dispatch(getAllSubcategories()).unwrap(),
          dispatch(fetchProducts()).unwrap()
        ]);
      } catch (fetchError) {
        console.error('Error fetching data after login:', fetchError);
        toast.error('Failed to load initial data. Please try again.');
      }
      toast.success('Login successful!');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(err.message || 'Login failed');
    }
    setSubmitting(false);
  };

  const handleRegisterSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(createUser(values)).unwrap();
      if (result && !result.error) {
        localStorage.setItem('isVerified', 'false');
        navigate('/SliderCaptcha');
        setShowLoginModal(false);
        toast.success('Registration successful!');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(err.message || 'Registration failed');
    }
    setSubmitting(false);
  };

  const handleForgotSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(generateOtp(values.mobileNo)).unwrap();
      setEmail(values.mobileNo); // Save the mobile number for OTP verification step
      setCurrentView('otp');
      toast.success('OTP has been sent');
    } catch (err) {
      console.error('Forgot password failed:', err);
      toast.error(err.message || 'Failed to send OTP');
    }
    setSubmitting(false);
  };

  const handleOtpVerification = async (values, { setSubmitting }) => {
    try {
      // 'email' state holds the mobile number from the previous step
      const result = await dispatch(verifyOtp({ mobileNumber: email, otp: values.otp })).unwrap();
      if (result.success) {
        setCurrentView('new-password');
        toast.success('OTP verification successful');
      } else {
        toast.error(result.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      toast.error(err.message || 'OTP verification failed');
    }
    setSubmitting(false);
  };

  const handlePasswordUpdate = async (values, { setSubmitting }) => {
    try {
      // 'email' state holds the mobile number (used as userId for reset)
      const result = await dispatch(resetPassword({
        mobileNo: email,
        password: values.password,
        confirmPassword: values.confirmPassword
      })).unwrap();

      if (result.success) {
        setCurrentView('login');
        toast.success('Password updated successfully');
      }
    } catch (err) {
      console.error('Password update failed:', err);
      toast.error(err.message || 'Password update failed');
    }
    setSubmitting(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      localStorage.setItem('searchQuery', searchQuery);
      localStorage.removeItem('selectedCategoryId');
      localStorage.removeItem('selectedSubCategoryIdfromheader');
      navigate('/Vegetable');
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.removeItem('selectedCategoryId');
    localStorage.removeItem('selectedSubCategoryIdfromheader');
    navigate('/Vegetable');
    setShowSuggestions(false);
  };

  const filteredProductss = products?.filter(product =>
    product?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);

  return (
    <>
      <header className="sticky-top shadow-sm" style={{ "backgroundColor": "#2c6145" }}>
        <div className="container-sm text-white">
          <nav className="navbar navbar-expand-lg navbar-dark py-2 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                className="navbar-toggler p-1 me-md-1 me-0 border-0"
                type="button"
                onClick={() => setOpen(true)} // Directly control offcanvas
              >
                <HiMenuAlt2 size={24} />
              </button>

              <Link className="navbar-brand d-flex align-items-center" to="/Main">
                <BsShop className="me-1 me-md-2" size={28} />
                <span className="fw-bold fs-4">FreshMart</span>
              </Link>
            </div>

            <div className="d-flex align-items-center justify-content-end flex-grow-1">
              <Search />
              <div className="db_icon_wrapper d-flex align-items-center gap-md-3 gap-3 ms-sm-3 ms-1">
                <div className="text-center position-relative" ref={userDropdownRef}>
                  <button
                    className="btn bg-transparent p-0 border-0 d-flex justify-content-center w-100"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <FaUser size={22} className="text-white" />
                  </button>
                  {showUserDropdown && (
                    <div className="user-dropdown-menu text-center">
                      {!isLoggedIn ? (
                        <div className="dropdown-item gap-2 d-flex align-items-center"
                          onClick={() => {
                            setShowUserDropdown(false);
                            handleLoginClick();
                          }}
                        >
                          <span><FaSignInAlt size={20} /></span> Login
                        </div>
                      ) : (
                        <>
                          <Link
                            to="/MyAccount"
                            className="dropdown-item gap-2 d-flex align-items-center"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <FaUserAlt size={20} />My Account
                          </Link>
                          <Link
                            to="/MyAddresses"
                            className="dropdown-item gap-2 d-flex align-items-center"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <FaLocationDot size={20} />My Addresses
                          </Link>
                          <Link
                            to="/Myorder"
                            className="dropdown-item gap-2 d-flex align-items-center"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <FiShoppingBag size={20} />Orders
                          </Link>
                          <div // Changed Link to div for direct onClick handling
                            className="dropdown-item gap-2 d-flex align-items-center"
                            onClick={async () => {
                              try {
                                await dispatch(userLogout()).unwrap();
                                setShowUserDropdown(false);
                                localStorage.removeItem('isVerified');
                                toast.success('Logged out successfully');
                                // setShowLoginModal(true); // No need to show modal if navigating away
                                // setCurrentView('login');
                                navigate('/main'); // Navigate to main or login page
                              } catch (logoutError) {
                                toast.error(logoutError.message || 'Logout failed');
                              }
                            }}
                            style={{cursor: 'pointer'}}
                          >
                            <FaSignOutAlt size={20} />Logout
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-center position-relative">
                  <Link to="/wishlist" className="btn bg-transparent p-0 border-0 d-flex justify-content-center w-100 position-relative">
                    <FaHeart size={22} className="text-white" />
                    <span
                      className="badge bg-dark text-white position-absolute top-0 start-100 translate-middle rounded-circle"
                      style={{ "--bs-bg-opacity": "0.5" }}
                    >
                      {wishlistItems?.length || 0}
                    </span>
                  </Link>
                </div>
                <div className="text-center position-relative">
                  <Link to="/AddcartDesign" className="btn bg-transparent p-0 border-0 d-flex justify-content-center w-100 position-relative">
                    <FaShoppingCart size={22} className="text-white" />
                    <span
                      className="badge bg-dark text-white position-absolute top-0 start-100 translate-middle rounded-circle"
                      style={{ "--bs-bg-opacity": "0.5" }}
                    >
                      {cartItems?.length || 0}
                    </span>
                  </Link>
                </div>
                <div className="text-center d-md-none d-block position-relative">
                  <button
                    className="btn bg-transparent p-0 border-0 d-flex justify-content-center w-100 text-white"
                    onClick={toggleMobileSearch}
                  >
                    {showMobileSearch ? <FaTimes size={18} /> : <FaSearch size={18} />}
                  </button>
                </div>
              </div>
            </div>
            {showMobileSearch && (
              <div className="d-md-none my-2 mb-2 animate-slide-down w-100">
                <div className="input-group rounded-pill overflow-hidden">
                  <input
                    type="text"
                    className="form-control border-0 py-2 px-3"
                    placeholder="Search for groceries..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                  <button
                    className="btn btn-light d-flex align-items-center justify-content-center px-3"
                    type="button"
                    onClick={handleSearch}
                  >
                    <FaSearch />
                  </button>
                </div>
                {showSuggestions && filteredProductss.length > 0 && (
                  <div
                    className="suggestion-dropdown position-absolute start-0 w-100 bg-white border rounded mt-1 text-dark"
                    style={{
                      zIndex: 9999, maxHeight: '300px', overflowY: 'auto',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', top: 'calc(100% + 5px)'
                    }}
                  >
                    {filteredProductss.map((product) => (
                      <div
                        key={product._id}
                        className="suggestion-item p-2 border-bottom"
                        style={{ cursor: 'pointer', backgroundColor: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={() => {
                          setSearchQuery(product.productName);
                          setShowSuggestions(false);
                          handleSearch(); // Perform search action
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <FaSearch className="me-2 text-muted" size={14} />
                          <span>{product.productName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <nav className="x_navbar ">
          <div className="x_nav_container" ref={dropdownRef}>
            <div className="x_sticky_category">
              <div
                className={`text-nowrap x_nav_item ${activeCategory === "All Categories" ? "x_active" : ""}`}
                onClick={() => handleDesktopCategoryClick("All Categories")}
              >
                All Categories
              </div>
            </div>
            <ul className="x_nav_list">
              {isLoading ? (
                <li className="x_nav_item"><LoadingSpinner /></li>
              ) : (
                categoriesWithSubcategories.map((category) => (
                  <li
                    key={category._id}
                    className={`x_nav_item ${activeCategory === category.categoryName ? "x_active" : ""}`}
                    data-category={category.categoryName}
                    onMouseEnter={() => handleDesktopCategoryMouseEnter(category.categoryName)}
                    onMouseLeave={handleDesktopCategoryMouseLeave}
                    onClick={() => handleDesktopCategoryClick(category.categoryName)}
                  >
                    <div className="x_nav_item_content">
                      {category.categoryName}
                      <IoIosArrowDown
                        className={`x_arrow ${visibleDropdownCategory === category.categoryName ? "x_arrow_up" : ""}`}
                      />
                    </div>
                    {visibleDropdownCategory === category.categoryName && (
                      <div className="x_mega_dropdown">
                        <div className="x_dropdown_section">
                          <ul className="x_dropdown_list d-flex gap-5">
                            {subcategories
                              .filter(sub => sub.categoryId === category._id)
                              .map((subcat, index) => (
                                <li
                                  key={index}
                                  className="x_dropdown_item"
                                >
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      localStorage.setItem('selectedSubCategoryIdfromheader', subcat._id);
                                      localStorage.removeItem('selectedCategoryId');
                                      localStorage.removeItem('searchQuery');
                                      localStorage.setItem('activePage', 'Vegetables'); // Or derive from category/subcat
                                      navigate('/Vegetable');
                                      handleSubItemSelected();
                                    }}
                                  >
                                    {subcat.subCategoryName}
                                  </div>
                                  <hr />
                                  {products
                                    .filter(product => product.subCategoryId === subcat._id)
                                    .map((product, idx) => (
                                      <div
                                        key={idx}
                                        className="x_product_item db_product_name hover-underline my-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleProductClick(product); // This will navigate and call handleSubItemSelected
                                        }}
                                      >
                                        {product.productName}
                                      </div>
                                    ))}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </nav>

        <div className={`x_offcanvas ${open ? "x_open" : ""}`}>
          <button className="x_close_btn" onClick={() => setOpen(false)}>
            <GrFormClose className="x_active" size={24} />
          </button>
          <div className="x_offcanvas_content">
            <ul className="x_mobile_menu">
              <li
                className={`x_mobile_item ${activeCategory === "All Categories" ? "x_active" : ""}`}
                onClick={() => handleMobileCategoryClick("All Categories")}
              >
                All Categories
              </li>
              {categoriesWithSubcategories.map((category) => (
                <li
                  key={category._id}
                  className={`x_mobile_item ${activeCategory === category.categoryName ? "x_active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMobileCategoryClick(category.categoryName);
                  }}
                >
                  <div className="x_mobile_item_header">
                    {category.categoryName}
                    <IoIosArrowDown
                      className={`x_arrow ${visibleDropdownCategory === category.categoryName ? "x_arrow_up" : ""}`}
                    />
                  </div>
                  {visibleDropdownCategory === category.categoryName && (
                    <div className="x_mobile_submenu">
                      <div className="x_mobile_section">
                        <ul className="x_mobile_list">
                          {category.subcategories.map((subcat, index) => (
                            <li
                              key={index}
                              className="x_dropdown_item"
                            >
                              <div
                                role="button"
                                tabIndex={0}
                                className="fw-bold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem('selectedSubCategoryIdfromheader', subcat._id);
                                  localStorage.removeItem('selectedCategoryId');
                                  localStorage.removeItem('searchQuery');
                                  localStorage.setItem('activePage', 'Vegetables');
                                  navigate('/Vegetable');
                                  handleSubItemSelected();
                                }}
                              >
                                {subcat.subCategoryName}
                              </div>
                              <hr className="mt-0" />
                              {products
                                .filter(product => product.subCategoryId === subcat._id)
                                .map((product, idx) => (
                                  <div
                                    key={idx}
                                    className="x_product_item db_product_name hover-underline my-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleProductClick(product);
                                    }}
                                  >
                                    {product.productName}
                                  </div>
                                ))}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}>
          <div className="login-modal" ref={modalRef}>
            <button className="close-btn" onClick={() => setShowLoginModal(false)}>
              <FaTimesCircle />
            </button>
            <div className="container-fluid">
              <div className="row">
                <div className="view-content">
                  {currentView === 'login' && (
                    <>
                      <div className="col-md-6 login-section">
                        <h2>Login</h2>
                        <Formik
                          initialValues={{ email: '', password: '' }}
                          validationSchema={loginSchema}
                          onSubmit={handleLoginSubmit}
                        >
                          {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                            <Form>
                              {error && !loading && ( // Show error only if not loading
                                <div className="alert alert-danger" role="alert">
                                  {typeof error === 'string' ? error : JSON.stringify(error)}
                                </div>
                              )}
                              {loading && (
                                <div className="text-center mb-3">
                                  <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </div>
                              )}
                              <div className="form-group">
                                <input
                                  type="email" name="email" placeholder="Username or email address*"
                                  className={`form-input ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                  value={values.email} onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.email && touched.email && (<div className="error-message">{errors.email}</div>)}
                              </div>
                              <div className="form-group password-group">
                                <input
                                  type={showPassword ? "text" : "password"} name="password" placeholder="Password*"
                                  className={`form-input ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                  value={values.password} onChange={handleChange} onBlur={handleBlur}
                                />
                                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
                                </span>
                                {errors.password && touched.password && (<div className="error-message">{errors.password}</div>)}
                              </div>
                              <div className="form-options">
                                <label className="remember-me"><input type="checkbox" /><span>Remember me</span></label>
                                <a href="#" className="forgot-password" onClick={handleForgotPasswordClick}>Forgot Password?</a>
                              </div>
                              <button type="submit" className="login-btn" disabled={isSubmitting || loading}>
                                {isSubmitting || loading ? 'Logging in...' : 'Login'}
                              </button>
                            </Form>
                          )}
                        </Formik>
                      </div>
                      <div className="col-md-6 new-customer-section">
                        <h2>New Customer</h2>
                        <p>Be part of our growing family of new customers! Join us today and unlock a world of exclusive benefits, offers, and personalized experiences.</p>
                        <button className="register-btn" onClick={handleRegisterClick}>Register</button>
                      </div>
                    </>
                  )}
                  {currentView === 'forgot' && (
                    <>
                      <div className="col-md-6 login-section">
                        <h2>Reset your password</h2>
                        <p className="reset-text">We will send you an OTP to reset your password</p>
                        <Formik
                          initialValues={{ mobileNo: '' }}
                          validationSchema={forgotPasswordSchema}
                          onSubmit={handleForgotSubmit}
                        >
                          {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                            <Form>
                              {error && !loading && (<div className="alert alert-danger" role="alert">{typeof error === 'string' ? error : JSON.stringify(error)}</div>)}
                              {loading && (<div className="text-center mb-3"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>)}
                              <div className="form-group">
                                <input
                                  type="tel" name="mobileNo" placeholder="Mobile Number*"
                                  className={`form-input ${errors.mobileNo && touched.mobileNo ? 'is-invalid' : ''}`}
                                  value={values.mobileNo} onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.mobileNo && touched.mobileNo && (<div className="error-message">{errors.mobileNo}</div>)}
                              </div>
                              <button type="submit" className="submit-btn" disabled={isSubmitting || loading}>
                                {isSubmitting || loading ? 'Sending...' : 'Send OTP'}
                              </button>
                            </Form>
                          )}
                        </Formik>
                      </div>
                      <div className="col-md-6 new-customer-section">
                        <h2>New Customer</h2>
                        <p>Be part of our growing family of new customers! Join us today and unlock a world of exclusive benefits, offers, and personalized experiences.</p>
                        <button className="register-btn" onClick={handleRegisterClick}>Register</button>
                      </div>
                    </>
                  )}
                  {currentView === 'otp' && (
                    <>
                      <div className="col-md-6 login-section">
                        <h2>Verify OTP</h2>
                        <p className="reset-text">Please enter the OTP sent to your mobile</p>
                        <Formik
                          initialValues={{ otp: '' }}
                          validationSchema={otpSchema}
                          onSubmit={handleOtpVerification}
                        >
                          {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                            <Form>
                              {error && !loading && (<div className="alert alert-danger" role="alert">{typeof error === 'string' ? error : JSON.stringify(error)}</div>)}
                              {loading && (<div className="text-center mb-3"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>)}
                              <div className="form-group">
                                <input
                                  type="text" name="otp" placeholder="Enter OTP*"
                                  className={`form-input ${errors.otp && touched.otp ? 'is-invalid' : ''}`}
                                  value={values.otp} onChange={handleChange} onBlur={handleBlur} maxLength="6"
                                />
                                {errors.otp && touched.otp && (<div className="error-message">{errors.otp}</div>)}
                              </div>
                              <div className="form-options">
                                <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setCurrentView('forgot'); }}>Resend OTP</a>
                              </div>
                              <button type="submit" className="submit-btn" disabled={isSubmitting || loading}>
                                {isSubmitting || loading ? 'Verifying...' : 'Verify OTP'}
                              </button>
                            </Form>
                          )}
                        </Formik>
                      </div>
                      <div className="col-md-6 new-customer-section">
                        <h2>Having Trouble?</h2>
                        <p>If you haven't received the OTP, please check your spam folder or click on resend OTP.</p>
                        <button className="register-btn" onClick={() => setCurrentView('login')}>Back to Login</button>
                      </div>
                    </>
                  )}
                  {currentView === 'new-password' && (
                    <>
                      <div className="col-md-6 login-section">
                        <h2>Create New Password</h2>
                        <p className="reset-text">Please enter your new password</p>
                        <Formik
                          initialValues={{ password: '', confirmPassword: '' }}
                          validationSchema={newPasswordSchema}
                          onSubmit={handlePasswordUpdate}
                        >
                          {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                            <Form>
                              {error && !loading && (<div className="alert alert-danger" role="alert">{typeof error === 'string' ? error : JSON.stringify(error)}</div>)}
                              {loading && (<div className="text-center mb-3"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>)}
                              <div className="form-group password-group">
                                <input
                                  type={showPassword ? "text" : "password"} name="password" placeholder="New Password*"
                                  className={`form-input ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                  value={values.password} onChange={handleChange} onBlur={handleBlur}
                                />
                                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
                                </span>
                                {errors.password && touched.password && (<div className="error-message">{errors.password}</div>)}
                              </div>
                              <div className="form-group password-group">
                                <input
                                  type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm New Password*"
                                  className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                                  value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                                />
                                <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                  {showConfirmPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
                                </span>
                                {errors.confirmPassword && touched.confirmPassword && (<div className="error-message">{errors.confirmPassword}</div>)}
                              </div>
                              <button type="submit" className="submit-btn" disabled={isSubmitting || loading}>
                                {isSubmitting || loading ? 'Updating...' : 'Update Password'}
                              </button>
                            </Form>
                          )}
                        </Formik>
                      </div>
                      <div className="col-md-6 new-customer-section">
                        <h2>Password Guidelines</h2>
                        <ul className="password-guidelines">
                          <li>Is at least 8 characters long</li>
                          <li>Contains at least one uppercase letter</li>
                          <li>Contains at least one number</li>
                          <li>Contains at least one special character</li>
                        </ul>
                      </div>
                    </>
                  )}
                  {currentView === 'register' && (
                    <>
                      <div className="col-md-6 reg_sec login-section ">
                        <h2 className="mb-3">Register</h2>
                        <Formik
                          initialValues={{ username: '', email: '', mobileNo: '', password: '', terms: false }}
                          validationSchema={registerSchema}
                          onSubmit={handleRegisterSubmit}
                        >
                          {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                            <Form>
                              {error && !loading && (<div className="alert alert-danger" role="alert">{typeof error === 'string' ? error : JSON.stringify(error)}</div>)}
                              {loading && (<div className="text-center mb-3"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>)}
                              <div className="form-group">
                                <input
                                  type="text" name="username" placeholder="Username*"
                                  className={`form-input ${errors.username && touched.username ? 'is-invalid' : ''}`}
                                  value={values.username} onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.username && touched.username && (<div className="error-message">{errors.username}</div>)}
                              </div>
                              <div className="form-group">
                                <input
                                  type="email" name="email" placeholder="Email address*"
                                  className={`form-input ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                  value={values.email} onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.email && touched.email && (<div className="error-message">{errors.email}</div>)}
                              </div>
                              <div className="form-group">
                                <input
                                  type="tel" name="mobileNo" placeholder="Mobile Number*"
                                  className={`form-input ${errors.mobileNo && touched.mobileNo ? 'is-invalid' : ''}`}
                                  value={values.mobileNo} onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.mobileNo && touched.mobileNo && (<div className="error-message">{errors.mobileNo}</div>)}
                              </div>
                              <div className="form-group password-group">
                                <input
                                  type={showPassword ? "text" : "password"} name="password" placeholder="Password*"
                                  className={`form-input ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                  value={values.password} onChange={handleChange} onBlur={handleBlur}
                                />
                                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
                                </span>
                                {errors.password && touched.password && (<div className="error-message">{errors.password}</div>)}
                              </div>
                              <div className="form-options">
                                <label className="remember-me">
                                  <input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} />
                                  <span>I agree to the Terms of User</span>
                                </label>
                                {errors.terms && touched.terms && (<div className="error-message">{errors.terms}</div>)}
                              </div>
                              <button type="submit" className="login-btn" disabled={isSubmitting || loading}>
                                {isSubmitting || loading ? 'Registering...' : 'Register'}
                              </button>
                            </Form>
                          )}
                        </Formik>
                      </div>
                      <div className="col-md-6 new-customer-section">
                        <h2>Already have an account?</h2>
                        <p>Welcome back. Sign in to access your personalized experience, saved preferences, and more. We're thrilled to have you with us again!</p>
                        <button className="register-btn" onClick={() => setCurrentView('login')}>Login</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .user-dropdown-menu { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); min-width: 200px; z-index: 1000; margin-top: 14px; animation: dropdownAnimation 0.3s ease-out; }
        @keyframes dropdownAnimation { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .dropdown-item { padding: 12px 16px; cursor: pointer; color: #333; transition: all 0.2s; }
        .dropdown-item:hover { background-color: #2c6145; color: white; }
        .db_icon_wrapper .badge { font-size: 0.65rem; padding: 4px 6px; min-width: 20px; min-height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .db_icon_wrapper button:hover { transform: scale(1.1); }
        .db_icon_wrapper button { transition: transform 0.2s ease; }
        @media (max-width: 330px) { .db_icon_wrapper { gap: 0.7rem !important; } }
        @media (max-width: 425px) { .db_icon_wrapper svg { width: 16px !important; height: 16px !important; } .db_icon_wrapper .badge { font-size: 0.55rem; padding: 2px 4px; min-width: 16px; min-height: 16px; } }
        input:focus { box-shadow: none !important; outline: none; }
        .custom-input:focus { box-shadow: none !important; outline: none; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1100; padding: 15px; }
        .login-modal { background-color: white; border-radius: 12px; width: 900px; max-width: 95%; position: relative; }
        .close-btn { position: absolute; top: 15px; right: 15px; background: rgba(255, 255, 255, 0.2); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 1; color: #333; backdrop-filter: blur(5px); }
        .close-btn:hover { background: rgba(255, 255, 255, 0.4); transform: rotate(90deg); }
        .close-btn svg { width: 20px; height: 20px; transition: all 0.3s ease; }
        .close-btn:hover svg { color: #2c6145; }
        .view-content { display: flex; width: 100%; }
        .login-section { padding: 40px; border-right: 1px solid #eee; width: 50%; }
        .new-customer-section { padding: 40px; background-color: #f9f9f9; display: flex; flex-direction: column; justify-content: center; width: 50%; }
        .new-customer-section h2 { margin-bottom: 25px; }
        .new-customer-section p { color: #666; line-height: 1.6; margin-bottom: 30px; max-width: 80%; }
        .form-group { margin-bottom: 20px; position: relative; }
        .form-input { width: 100%; padding: 12px 15px; padding-right: 45px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background-color: white; height: 45px; }
        .form-input:focus { border-color: #2c6145; outline: none; }
        .password-group { position: relative; }
        .password-toggle { position: absolute; right: 15px; top: 8px; cursor: pointer; color: #666; display: flex; align-items: center; justify-content: center; padding: 5px; transition: color 0.3s ease; }
        .error-message { color: #dc3545; font-size: 12px; margin-top: 5px; margin-left: 2px; display: block; }
        .is-invalid { border-color: #dc3545; }
        .form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .remember-me { display: flex; align-items: center; gap: 8px; color: #666; cursor: pointer; }
        .forgot-password { color: #333; text-decoration: none; font-size: 15px; }
        .forgot-password:hover { text-decoration: underline; }
        .login-btn, .register-btn { width: 160px; padding: 12px 20px; border: none; border-radius: 25px; font-size: 14px; cursor: pointer; transition: background-color 0.3s; background-color: #2c6145; color: white; }
        @media (max-width: 768px) { .view-content { flex-direction: column; } .login-section, .new-customer-section { width: 100%; padding: 30px 20px; } .login-section { border-right: none; border-bottom: 1px solid #eee; } }
        .reset-text { color: #666; margin-bottom: 20px; font-size: 14px; }
        .submit-btn { width: 160px; padding: 12px 20px; border: none; border-radius: 25px; font-size: 14px; cursor: pointer; transition: background-color 0.3s; background-color: #2c6145; color: white; }
        .submit-btn:hover { background-color: #e9f6eb; color: #000; border: 1px solid #2c6145; }
        .password-guidelines { list-style: none; padding: 0; margin: 0; color: #666; }
        .password-guidelines li { margin-bottom: 8px; font-size: 14px; position: relative; padding-left: 20px; }
        .password-guidelines li:before { content: "•"; position: absolute; left: 0; color: #2c6145; }
        @media only screen and (max-width: 320px) { .form-options{ display: block; } }
      `}
      </style>
    </>
  );
}
