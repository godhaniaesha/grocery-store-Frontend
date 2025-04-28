import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaSearch, FaShoppingCart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Menuheader from './Menuheader';
import "../styles/x_app.css"
import { GrFormClose } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import { useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getallMyCarts } from '../redux/slices/cart.Slice'; // Import the action
import noImg from '../img/Search (1).png'
import axios from 'axios';
import { setSearchQuery, setSearchResults, clearSearch } from '../redux/slices/search.Slice';
import { logoutUser } from '../redux/slices/authSlice';

// Add NoResultsFound component at the top of the file
const NoResultsFound = ({ searchQuery }) => {
  return (
    <div className="position-absolute w-100 bg-white mt-1 shadow-sm rounded-2 p-4 text-center" style={{ top: '100%', zIndex: 1000, border: '1px solid #ddd' }}>
      <img src={noImg} alt="No results found" style={{ width: '120px', marginBottom: '15px' }} />
      <p className="text-muted mb-2">No results found for "{searchQuery}"</p>
      <p className="text-muted small">Sorry! We couldn't find that try looking for something else</p>
    </div>
  );
};

// Update the component props
export default function LogoHeader({
  setIsVegetablePage,
  setIsAboutUsPage,
  setIsContactUsPage,
  setIsTodayDealsPage,
  setIsCartPage,
  setIsCheckoutPage,
  setIsFaqPage,
  setIsTermsPage,
  setIsProfilePage,
  setIsProductDetailPage,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(localStorage.getItem('activePage') || "Home");
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Vapi 395006');
  const searchRef = useRef(null);
  const locationRef = useRef(null);

  // Handle clicking outside location popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationClick = () => {
    setShowLocationPopup(!showLocationPopup);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationPopup(false);
  };


  // const detectCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         const formattedLocation = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  //         setSelectedLocation(formattedLocation);
  //         setShowLocationPopup(false);
  //       },
  //       (error) => {
  //         console.error('Error getting location:', error);
  //         let errorMessage = 'Failed to get location. ';
  //         switch(error.code) {
  //           case error.PERMISSION_DENIED:
  //             errorMessage += 'Please enable location services in your browser.';
  //             break;
  //           case error.POSITION_UNAVAILABLE:
  //             errorMessage += 'Location information is unavailable.';
  //             break;
  //           case error.TIMEOUT:
  //             errorMessage += 'Location request timed out.';
  //             break;
  //           default:
  //             errorMessage += 'Please try again.';
  //         }
  //         alert(errorMessage);
  //       }
  //     );
  //   } else {
  //     alert('Geolocation is not supported by your browser');
  //   }
  // };

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiKey = '3c947abc49a649869276aa9aee77aade'; // Replace with your API key
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);

            const results = response.data.results[0];
            const city = results.components.state_district ;
            console.log(results,'results');
            
            const postcode = results.components.postcode;

            const formattedLocation = `${city}, ${postcode}`;
            setSelectedLocation(formattedLocation);
            setShowLocationPopup(false);
          } catch (error) {
            console.error('Error fetching address:', error);
            alert('Failed to fetch address. Please try again.');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Failed to get location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please enable location services in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please try again.';
          }
          alert(errorMessage);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };
  const handleItemClick = (item) => {

    setActive(item);
    setOpen(false);

    localStorage.setItem('activePage', item);
    if (item === "Profile") {
      setIsProfilePage(true);
      setIsCartPage(false);
      setIsTodayDealsPage(false);
      setIsCheckoutPage(false);
      setIsFaqPage(false);
      setIsProductDetailPage(false);
      setIsTermsPage(false);
      setIsProfilePage(false);
      setIsAboutUsPage(false);
      setIsContactUsPage(false);

    } else if (item === "Cart") {

      setIsCartPage(true);
      setIsCheckoutPage(false);
      setIsFaqPage(false);
      setIsTermsPage(false);
      setIsProfilePage(false);
      setIsAboutUsPage(false);
      setIsContactUsPage(false);
      setIsProductDetailPage(false);
      setIsTodayDealsPage(false);
      setIsProductDetailPage(false);
    } else if (item === "Vegetables") {
      setIsVegetablePage(true);
      setIsAboutUsPage(false);
      setIsContactUsPage(false);
      setIsProductDetailPage(false);
      setIsCheckoutPage(false);

      setIsFaqPage(false);
      setIsProfilePage(false);
      setIsTermsPage(false);
      setIsTodayDealsPage(false);
      setIsCartPage(false); // Add this
    } else if (item === "About us") {
      setIsAboutUsPage(true);
      setIsVegetablePage(false);
      setIsFaqPage(false);
      setIsProductDetailPage(false);
      setIsContactUsPage(false);
      setIsTodayDealsPage(false);
      setIsCartPage(false); // Add this
    } else if (item === "Contact us") {
      setIsContactUsPage(true);
      setIsTermsPage(false);
      setIsVegetablePage(false);
      setIsAboutUsPage(false);
      setIsProductDetailPage(false);
      setIsTodayDealsPage(false);
      setIsCartPage(false); // Add this
    } else if (item === "Today deals") {
      setIsTodayDealsPage(true);
      setIsProfilePage(false);
      setIsProductDetailPage(false);
      setIsVegetablePage(false);
      setIsAboutUsPage(false);
      setIsContactUsPage(false);
      setIsCartPage(false); // Add this
    } else {
      setIsVegetablePage(false);
      setIsAboutUsPage(false);
      setIsContactUsPage(false);
      setIsCheckoutPage(false);
      setIsFaqPage(false);
      setIsTermsPage(false);
      setIsProductDetailPage(false);
      setIsProfilePage(false);
      setIsTodayDealsPage(false);
      setIsCartPage(false); // Add this
    }
  };
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const accountDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const userCartItems = state.addcart.cartItems.filter(item => item.userId === userId);
    const cartCount = userCartItems.length || 0;
    console.log("Cart count:", cartCount);
    return cartCount;
  });
  const handleClickOutside = useCallback((event) => {
    if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
      setShowAccountDropdown(false);
    }
  }, []);
  useEffect(() => {
    dispatch(getallMyCarts()); // Fetch cart items when component mounts
  }, [dispatch]);
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);


  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then((response) => {
        // Show success message if needed
        console.log('Logout successful:', response);
        navigate('/HomeMain');
        localStorage.setItem('activePage', "Home"); // Add this line

        // Reset other page states
        setIsProfilePage(false);
        setIsCartPage(false);
        setIsTodayDealsPage(false);
        setIsCheckoutPage(false);
        setIsAboutUsPage(false);
        setIsProductDetailPage(false);
        setIsContactUsPage(false);
        setIsTermsPage(false);
        setIsVegetablePage(false);
        setIsAboutUsPage(false);
        setShowAccountDropdown(false);
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        // Show error message to user
        alert(error || 'Logout failed. Please try again.');
      });
  };

  const handleLogin = () => {
    navigate('/login');
    setShowAccountDropdown(false);
  };

  const handleProfileClick = () => {
    setActive("Profile");
    localStorage.setItem('activePage', "Profile"); // Add this line

    // Reset other page states
    setIsProfilePage(true);
    setIsCartPage(false);
    setIsTodayDealsPage(false);
    setIsCheckoutPage(false);
    setIsAboutUsPage(false);
    setIsProductDetailPage(false);
    setIsContactUsPage(false);
    setIsTermsPage(false);
    setIsVegetablePage(false);
    setIsAboutUsPage(false);
    setShowAccountDropdown(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 568) {
        setShowSearch(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleCartClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    setActive("Cart");
    localStorage.setItem('activePage', "Cart");

    // Reset other page states
    setIsCartPage(true);
    setIsVegetablePage(false);
    setIsAboutUsPage(false);
    setIsProfilePage(false);
    setIsCheckoutPage(false);
    setIsFaqPage(false);
    setIsTermsPage(false);
    setIsProductDetailPage(false);
    setIsContactUsPage(false);
    setIsTodayDealsPage(false);
  };

  // Function to fetch suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      dispatch(clearSearch());
      return;
    }
    try {
      const response = await axios.get('http://localhost:4000/api/allProducts');

      // Check if response.data has the expected structure
      const products = response.data.data || response.data || [];

      // Ensure products is an array before filtering
      if (Array.isArray(products)) {
        const filtered = products.filter(product => {
          // Check if product has either productName or name property
          const productName = product.productName || product.name || '';
          return productName.toString().toLowerCase().includes(query.toLowerCase());
        });
        console.log('Filtered products:', filtered); // Debug filtered results
        setSuggestions(filtered);

        // If this is a search submission (not just typing), dispatch the results
        if (!showSuggestions) {
          dispatch(setSearchResults(filtered));
        }
      } else {
        console.error('API response is not in expected format:', response.data);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      dispatch(setSearchQuery(searchQuery));
      fetchSuggestions(searchQuery);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (item) => {
    // Auto-fill the search input with the selected product name
    setSearchQuery(item.productName || item.name || '');

    // Hide suggestions
    setShowSuggestions(false);

    // Dispatch the selected product to Redux store
    dispatch(setSearchResults([item]));

    // Show the product on the main page instead of redirecting
    setIsProductDetailPage(false);
    setIsVegetablePage(true);
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    dispatch(clearSearch());
  };

  // New functions for responsive search bar
  const handleResponsiveSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  const handleResponsiveSearchSubmit = () => {
    if (searchQuery.trim()) {
      dispatch(setSearchQuery(searchQuery));
      fetchSuggestions(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleResponsiveClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    dispatch(clearSearch());
  };

  // Handle clicking outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`a_logomainheader a_header_container sticky-top ${scrolled ? 'shadow-sm' : ''}`} >
      <nav className={`navbar navbar-expand-lg py-${scrolled ? '1' : '2'}`}>
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <a className="navbar-brand text-success fw-bold fs-2 me-3" href="#">
            LOGO
          </a>

          <div className="d-none d-md-flex align-items-center me-3 position-relative" ref={locationRef}>
            <div
              className="d-flex align-items-center cursor-pointer location-trigger"
              onClick={handleLocationClick}
              style={{ cursor: 'pointer' }}
            >
              <img src={require('../img/location.png')} className="me-1" alt="location" />
              <div className="d-flex flex-column">
                <span className="text-muted small">Deliver to</span>
                <strong className="text-muted small">{selectedLocation}</strong>
              </div>
            </div>

            {showLocationPopup && (
              <div className="position-absolute bg-white shadow-sm rounded-3 location-popup"
                style={{
                  width: '480px',
                  zIndex: '1000',
                  top: '7vh',
                  left: '-130%'
                }}
              >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom ">
                  <h5 className="m-0" style={{ fontSize: '20px', fontWeight: '400' }}>Change Location</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowLocationPopup(false)}
                    style={{ fontSize: '20px' }}
                  ></button>
                </div>

                <div className="p-3 pt-4 d-flex justify-content-between align-items-center gap-3">
                  <button
                    className="btn text-white px-4 py-2"
                    style={{
                      background: '#2B8D42',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      width: '293px',
                      fontWeight: '400'
                    }}
                    onClick={detectCurrentLocation}
                  >
                    Detect my location
                  </button>

                  <div className="text-center" style={{ fontSize: '16px', color: '#666' }}>
                    OR
                  </div>

                  <div className="input-group flex-grow-1">
                    <span className="input-group-text border-end-0" style={{ background: '#EFEFEF', borderColor: '#EFEFEF' }}>
                      <FaSearch style={{ color: '#666' }} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search Delivery location.."
                      style={{
                        background: '#EFEFEF',
                        borderColor: '#EFEFEF',
                        boxShadow: 'none',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="d-none d-sm-flex flex-grow-1 mx-2 position-relative" ref={searchRef}>
            <div className="input-group a_input">
              <span className="input-group-text a_input_icon border-0 bg-light">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Search for Vegetables..."
                style={{ borderRadius: '0', boxShadow: 'none', outline: 'none' }}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
              />
              {searchQuery && (
                <button
                  className="btn border-0 bg-light"
                  onClick={handleClearSearch}
                  style={{ cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Desktop Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="position-absolute w-100 bg-white mt-1 shadow-sm rounded-2" style={{ top: '100%', zIndex: 1000, border: '1px solid #ddd' }}>
                <div className="p-3 pt-0">
                  <div className="text-muted small mb-2 border-bottom py-2">SUGGESTIONS</div>
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center p-2 hover-bg-light cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSuggestionSelect(item)}
                    >
                      {item.productName || item.name || 'Unnamed Product'}
                    </div>
                  ))}
                  <div
                    className="d-flex justify-content-between align-items-center p-2 hover-bg-light cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowSuggestions(false);
                      dispatch(setSearchResults(suggestions));
                      dispatch(setSearchQuery(searchQuery));
                    }}
                  >
                    <span className="text-dark">Search for "{searchQuery}"</span>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex align-items-center">
            <FaSearch
              className="text-muted fs-5 d-sm-none me-3"
              onClick={() => setShowSearch(!showSearch)}
              style={{ cursor: 'pointer' }}
            />
            <div className="d-none d-md-flex align-items-center me-3 position-relative" ref={accountDropdownRef}>
              <div
                className="d-flex align-items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAccountDropdown(!showAccountDropdown);
                }}
                style={{ cursor: 'pointer' }}
              >
                <img src={require('../img/Link.png')} className="me-1" alt="location" />
                <div className="d-flex flex-column">
                  <span className="text-muted small">Sign In</span>
                  <strong className="text-muted small">Account</strong>
                </div>
              </div>
              {showAccountDropdown && (
                <div className="position-absolute top-100 start-0 mt-2 bg-white shadow rounded py-2" style={{ top: '100%', right: 0, width: '200px', zIndex: 1000, border: "#00800033 1px solid", boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' }}>
                  {!localStorage.getItem('token') ? (
                    <div
                      className="px-3 py-2 hover-bg-light cursor-pointer text-decoration-none text-dark"
                      onClick={handleLogin}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaSignOutAlt className="me-2" />
                      <span>Login</span>
                    </div>
                  ) : (
                    <>
                      <div
                        className="px-3 py-2 hover-bg-light cursor-pointer text-decoration-none text-dark"
                        onClick={handleProfileClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <FaUser className="me-2" />
                        <span>Profile</span>
                      </div>
                      <div
                        className="px-3 py-2 hover-bg-light cursor-pointer text-decoration-none text-dark"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                      >
                        <FaSignOutAlt className="me-2" />
                        <span>Logout</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="position-relative" onClick={handleCartClick} style={{ cursor: 'pointer' }}>
              <img src={require('../img/cart.png')} className="me-1" alt="cart" />
              <span className="position-absolute top-0 start-100 translate-middle badge bg-success rounded-circle">
                {cartItems} {/* Display dynamic cart count */}
              </span>
            </div>

            <button className="x_menu_btn ms-3" onClick={() => setOpen(true)}>☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="container-fluid py-2 border-top border-bottom bg-light position-relative" ref={searchRef}>
          <div className="input-group a_input">
            <span className="input-group-text a_input_icon border-0 bg-white">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 bg-white"
              placeholder="Search for Vegetables..."
              style={{ borderRadius: '0', boxShadow: 'none', outline: 'none' }}
              value={searchQuery}
              onChange={handleResponsiveSearchChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleResponsiveSearchSubmit();
                }
              }}
            />
            {searchQuery && (
              <button
                className="btn border-0 bg-white"
                onClick={handleResponsiveClearSearch}
                style={{ cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="position-absolute w-100 bg-white mt-1 shadow-sm rounded-2" style={{ top: '100%', zIndex: 1000, border: '1px solid #ddd' }}>
              <div className="p-3 pt-0">
                <div className="text-muted small mb-2 border-bottom py-2">SUGGESTIONS</div>
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center p-2 hover-bg-light cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSuggestionSelect(item)}
                  >
                    {item.productName || item.name || 'Unnamed Product'}
                  </div>
                ))}
                <div
                  className="d-flex justify-content-between align-items-center p-2 hover-bg-light cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowSuggestions(false);
                    dispatch(setSearchResults(suggestions));
                    dispatch(setSearchQuery(searchQuery));
                  }}
                >
                  <span className="text-dark">Search for "{searchQuery}"</span>
                  <FaArrowRight />
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* <Menuheader></Menuheader> */}


      <nav className="x_navbar">
        <ul className="x_nav_list">
          {["Home", "Vegetables", "Today deals", "About us", "Contact us"].map(
            (item) => (
              <li
                key={item}
                className={`x_nav_item ${active === item ? "x_active" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            )
          )}
        </ul>

        {/* 📱 Mobile Menu Button */}

      </nav>

      {/* 📜 Offcanvas Sidebar */}
      <div className={`x_offcanvas ${open ? "x_open" : ""}`}>
        <button className="x_close_btn" onClick={() => setOpen(false)}><GrFormClose className='x_active' /></button>
        <ul className="x_offcanvas_list">
          {["Home", "Vegetables", "Today deals", "About us", "Contact us"].map(
            (item) => (
              <li
                key={item}
                className={`x_nav_item ${active === item ? "x_active" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}


