import React, { useState, useEffect } from 'react';
import { GoChevronLeft, GoChevronRight, GoDotFill } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaKey, FaTrash, FaSignOutAlt, FaCamera, FaAngleDown, FaEyeSlash, FaEye } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import '../styles/MyProfile.css';
import '../styles/denisha.css';
import '../styles/x_app.css';
import '../styles/Home.css'
import { FiPlus } from 'react-icons/fi';
import { PiLineVertical, PiLineVerticalBold } from 'react-icons/pi';
import { BsCheckLg } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { createAddress, getUserAddresses, deleteAddress, updateAddress } from '../redux/slices/address.Slice';
import { deleteUser, getUserData, updateUser } from '../redux/slices/userSlice';
import { changePassword, logoutUser } from '../redux/slices/authSlice';
import { fetchUserOrders, deleteOrder } from '../redux/slices/order.Slice';

const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [activeFilter, setActiveFilter] = useState('All');
  const { addresses, loading, error } = useSelector((state) => state.address);
  console.log("Redux Address State:", { addresses, loading, error });
  const { userData, isLoading } = useSelector((state) => state.user);
  const { userOrders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.order);
  console.log("User Orders:", userOrders);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      console.log(userData, "userData");

      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        mobileNumber: userData.phone || '',
        email: userData.email || '',

      });
    }
  }, [userData]);

  useEffect(() => {
    dispatch(getUserAddresses())
      .unwrap()
      .then(result => console.log('Addresses fetched:', result))
      .catch(error => console.error('Error fetching addresses:', error));
  }, [dispatch]);

  // Fetch user orders when the orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      dispatch(fetchUserOrders())
        .unwrap()
        .then(result => {
          console.log('Orders fetched:', result);
          // Transform the API data to match the display format
          const formattedOrders = result.data.map(order => ({
            id: order._id,
            status: order.orderStatus || order.status,
            date: new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            orderNumber: order._id.substring(0, 8).toUpperCase(),
            items: order.productData ? order.productData.map((product, index) => {
              const orderItem = order.items && order.items[index];
              const variantData = order.productVarientData && order.productVarientData.find(
                variant => variant.productId === product._id
              );
              return {
                id: product._id,
                name: product.productName,
                price: variantData ? variantData.price : 0,
                quantity: orderItem ? orderItem.quantity : '1'
              };
            }) : []
          }));
          setOrders(formattedOrders);
        })
        .catch(error => console.error('Error fetching orders:', error));
    }
  }, [activeTab, dispatch]);

  // Remove the mock data and use the state that will be populated from the API
  const [orders, setOrders] = useState([]);

  // Use API orders if available, otherwise use mock data
  const displayOrders = orders;

  const filteredOrders = displayOrders.filter(order =>
    activeFilter === 'All' ? true : order.status === activeFilter
  );
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [showTrackOrder, setShowTrackOrder] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelComment, setCancelComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: '', label: 'Select a reason', disabled: true },
    { value: 'delivery_time', label: 'I was hoping for a shorter delivery time' },
    { value: 'price_decreased', label: 'Price of the product has now decreased' },
    { value: 'delivery_address', label: 'I want to change the delivery address' },
    { value: 'ratings_reviews', label: "I'm worried about the ratings/reviews" },
    { value: 'payment_option', label: 'I want to change the payment option' },
    { value: 'contact_details', label: 'I want to change the contact details' },
    { value: 'other', label: 'My reason is not listed here' }
  ];
  const [profileData, setProfileData] = useState({
    firstName: 'Jenny',
    lastName: 'Wilson',
    mobileNumber: '+1 56565 56565',
    email: 'jennywilson23@email.com',
    profileImage: require("../img/a_img/user.png"),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddresses] = useState([]);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);


  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    house: Yup.string().required("House details are required"),
    landmark: Yup.string().required("Landmark is required"),
    pin: Yup.string()
      .matches(/^\d{6}$/, "Pin code must be exactly 6 digits")
      .required("Pin code is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    addressType: Yup.string().oneOf(["Home", "Office", "Other"], "Invalid address type").required("Address type is required"),
  });

  
  const handleAddressSubmit = async (values, { resetForm }) => {
    try {
      const addressData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        address1: values.house,
        address2: values.landmark,
        postalCode: values.pin,
        city: values.city,
        state: values.state,
        country: values.country,
        saveAddressAs: values.addressType
      };

      if (editingAddress) {
        const result = await dispatch(updateAddress({
          addressId: editingAddress._id,
          addressData
        })).unwrap();

        if (result.success) {
          setEditingAddress(null);
          setShowFirstModal(false);
          resetForm();
        }
      } else {
        const result = await dispatch(createAddress(addressData)).unwrap();

        if (result.success) {
          setShowFirstModal(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      const result = await dispatch(deleteAddress(addressToDelete)).unwrap();
      if (result.success) {
        dispatch(getUserAddresses());
        setShowDeleteModal(false);
        setAddressToDelete(null);
      } else {
        console.error('Failed to delete address:', result.message);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const fileInputRef = React.createRef();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Update the handleLogout function with better error handling and user feedback
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then((response) => {
        // Show success message if needed
        console.log('Logout successful:', response);
        setShowLogoutModal(false);
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        // Show error message to user
        alert(error || 'Logout failed. Please try again.');
      });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add this validation function
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("One special character");
    return errors;
  };

  // Add password change handler
  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'newPassword') {
      const errors = validatePassword(value);
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: errors.length > 0 ? errors.join(", ") : '',
        confirmPassword: value !== passwords.confirmPassword ? "Passwords don't match" : ''
      }));
    } else if (field === 'confirmPassword') {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: value !== passwords.newPassword ? "Passwords don't match" : ''
      }));
    }
  };

  // Add form submit handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.oldPassword) {
      setPasswordErrors(prev => ({ ...prev, oldPassword: 'Required' }));
      return;
    }
    if (passwordErrors.newPassword || passwordErrors.confirmPassword) {
      return;
    }
    try {
      const result = await dispatch(changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword
      })).unwrap();

      // Clear form on success
      setPasswords({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordErrors(prev => ({
        ...prev,
        oldPassword: error.message || 'Password change failed'
      }));
    }
  };

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Add this function to handle password visibility toggle
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteUser()).unwrap();
      setShowDeleteAccountModal(false);
      setDeleteAccountPassword('');
      window.location.href = '/HomeMain';
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleTabClick = (tab, e) => {
    e.preventDefault();
    if (tab === "delete") {
      setShowDeleteAccountModal(true);
    } else if (tab === "logout") {
      setShowLogoutModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  useEffect(() => {
    if (userData) {
      console.log(userData, "userData");

      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        mobileNumber: userData.mobileNo || '',
        email: userData.email || '',
        profileImage: userData.image
          ? `http://localhost:4000/${userData.image}`
          : require("../img/a_img/user.png")

      });
    }
  }, [userData]);
  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(profileData)).unwrap();
      dispatch(getUserData()); // Refresh user data
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const buttonConfig = {
    profile: { text: isEditing ? 'Cancel' : 'Edit Profile', link: '#', icon: FaUser },
    orders: { text: 'View All Orders', link: '/all-orders', icon: FaShoppingBag },
    address: { text: 'Add Address', link: '/add-address', icon: FiPlus },
    password: { text: 'Reset Password', link: '#', icon: FaKey },
    delete: { text: 'Cancel', link: '/', icon: FaTrash },
    logout: { text: 'Back to Profile', link: '/my-account', icon: FaSignOutAlt }
  };
  // add address


  return (
    <div className="a_container py-4">
      <div className="a_row">
        <div className="a_col-3">
          <div className="a_sidebar a_card border-0 shadow-sm mb-md-4 mb-2">
            <div className="a_menu-list">
              <Link
                to="#"
                onClick={(e) => handleTabClick("profile", e)}
                className={`a_menu-item d-flex align-items-center gap-2 p-md-3 p-1 ${activeTab === "profile" ? "active" : ""}`}
              >
                <div className="a_menu-icon_main">
                  <img src={require("../img/a_img/editprofile.png")} alt="Profile" className="a_menu-icon" />
                </div>

                <span>My Profile</span>
              </Link>
              <Link
                to="#"
                onClick={(e) => handleTabClick("orders", e)}
                className={`a_menu-item d-flex align-items-center gap-2 p-md-3 p-1 ${activeTab === "orders" ? "active" : ""}`}
              >
                <div className="a_menu-icon_main">
                  <img src={require("../img/a_img/cart.png")} alt="Orders" className="a_menu-icon" />
                </div>

                <span>My Order</span>
              </Link>
              <Link
                to="#"
                onClick={(e) => handleTabClick("address", e)}
                className={`a_menu-item d-flex align-items-center gap-2 p-md-3 p-1 ${activeTab === "address" ? "active" : ""}`}
              >
                <div className="a_menu-icon_main">
                  <img src={require("../img/a_img/map.png")} alt="Address" className="a_menu-icon" />
                </div>

                <span>My Address</span>
              </Link>
              <Link
                to="#"
                onClick={(e) => handleTabClick("change password", e)}
                className={`a_menu-item d-flex align-items-center gap-2 p-md-3 p-1 ${activeTab === "change password" ? "active" : ""}`}
              >
                <div className="a_menu-icon_main">
                  <img src={require("../img/a_img/changepass.png")} alt="Password" className="a_menu-icon" />
                </div>

                <span>Change Password</span>
              </Link>
              <Link
                to="#"
                onClick={(e) => handleTabClick("delete", e)}
                className={`a_menu-item d-flex align-items-center gap-2 p-md-3 p-1 ${activeTab === "delete" ? "active" : ""}`}
              >
                <div className="a_menu-icon_main">
                  <img src={require("../img/a_img/deleteacc.png")} alt="Delete" className="a_menu-icon" />
                </div>

                <span>Delete Account</span>
              </Link>
              <Link
                to="#"
                onClick={(e) => handleTabClick("logout", e)}
                className={`a_menu-item d-flex align-items-center gap-2 p-md-3 p-1 ${activeTab === "logout" ? "active" : ""}`}
              >
                <div className="a_menu-icon_main">
                  <img src={require("../img/a_img/logout.png")} alt="Logout" className="a_menu-icon" />
                </div>

                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="a_col-9">
          <div className="a_header d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Link
                to="/"
                className={`text-decoration-none ${window.location.pathname === "/"
                  ? "text-dark fw-bold"
                  : "text-secondary"
                  }`}
              >
                Home
              </Link>
              <span>
                <GoChevronRight />
              </span>
              <Link
                to="/my-account"
                className={`text-decoration-none ${window.location.pathname === "/my-account"
                  ? "text-dark fw-bold"
                  : "text-secondary"
                  }`}
              >
                My Account
              </Link>
              <span>
                <GoChevronRight />
              </span>
              <span className="text-dark" style={{ fontWeight: "500" }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </div>

            {
              activeTab !== 'change password'  && (
                <Link
                  to={buttonConfig[activeTab].link}
                  className="a_btn a_btn-outline-success"
                  onClick={(e) => {
                    if (activeTab === 'profile') {
                      e.preventDefault();
                      setIsEditing(!isEditing);
                    } else if (activeTab === 'address') {
                      e.preventDefault();
                      setShowFirstModal(true);
                    }
                  }}
                >
                  {React.createElement(buttonConfig[activeTab].icon, {
                    className: "me-2",
                  })}
                  {buttonConfig[activeTab].text}
                </Link>
              )
            }
      
          </div>

          {activeTab === "profile" && (
            <div className="a_card border-0 shadow-sm">
              <div className="a_card-body p-md-4 p-3">
                <div className="a_profile-image mb-4">
                  <div className="a_image-wrapper position-relative d-inline-block">
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="a_avatar rounded-circle"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                      onClick={handleImageClick}
                    />
                    {isEditing && (
                      <div
                        className="position-absolute bg-white shadow d-flex justify-content-center align-items-center rounded-circle"
                        style={{
                          bottom: "4px",
                          right: "4px",
                          width: "36px",
                          height: "36px",
                          cursor: "pointer"
                        }}
                        onClick={handleImageClick}
                      >
                        <FaCamera className="text-secondary" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="d-none"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="a_row">
                    <div className="a_col-md-6 mb-md-3 mb-1">
                      <label className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="a_col-md-6 mb-md-3 mb-1">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="a_col-md-6 mb-md-3 mb-1">
                      <label className="form-label">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        className="form-control"
                        value={profileData.mobileNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="a_col-md-6 mb-md-3 mb-1">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    {isEditing && (
                      <div className="col-12 p-2">
                        <button type="submit" className="a_btn a_btn-success me-2">
                          Update
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeTab === "orders" && (
            <>
              <div className="d-flex gap-sm-3 gap-1 mb-4">
                <button
                  className={`a_btn a_btn-outline-success_m ${activeFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('All')}
                >All</button>
                {/* <button
                  className={`a_btn a_btn-outline-success_m ${activeFilter === 'In Progress' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('In Progress')}
                >In Progress</button> */}
                <button
                  className={`a_btn a_btn-outline-success_m ${activeFilter === 'Delivered' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Delivered')}
                >Delivered</button>
                <button
                  className={`a_btn a_btn-outline-success_m ${activeFilter === 'Cancelled' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Cancelled')}
                >Cancelled</button>
              </div>
              <div className="a_order border-0 shadow-sm">
                <div className="a_card-body p-0">
                  {ordersLoading ? (
                    <div className="text-center p-4">Loading orders...</div>
                  ) : ordersError ? (
                    <div className="text-center p-4 text-danger">Error loading orders: {ordersError}</div>
                  ) : filteredOrders.length > 0 ? (
                    <div className="a_order-list">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="a_order-item border shadow-sm rounded mb-md-3 mb-1" onClick={(e) => {
                          if (!e.target.closest('.a_btn_cancel')) {
                            if (order.status === 'Delivered') {
                              setSelectedOrder(order);
                              setShowTrackOrder(true);
                            } else {
                              setExpandedItems(prev => 
                                prev.includes(order.id) 
                                  ? prev.filter(id => id !== order.id)
                                  : [...prev, order.id]
                              );
                            }
                          }
                        }} style={{ cursor: 'pointer' }}>
                          <div className="d-flex justify-content-between align-items-center a_line_b mb-1">
                            <div className="d-flex align-items-center gap-md-3 gap-2">
                              <span className={`a_badge ${order.status === 'In Progress' ? 'a_badge-warning' : order.status === 'Delivered' ? 'a_badge-success' : ''}`} style={order.status === 'Cancelled' ? { backgroundColor: "#ffe5e5", color: "#ff4c3b" } : {}}>
                                {order.status}
                              </span>
                              <img src={require('../img/a_img/Line 375.png')} alt="" />
                              <p className="a_date mb-0">{order.date}</p>
                            </div>
                            {order.status !== 'Delivered' && (
                              <p className="a_tord mb-0" onClick={() => {
                                setSelectedOrder(order);
                                setShowTrackOrder(true);
                              }}>{order.status === 'Cancelled' ? 'View refund Status' : 'Track Order'}</p>
                            )}
                          </div>
                          {order.items.slice(0, expandedItems.includes(order.id) ? order.items.length : 1).map((item, index) => (
                            <div key={item.id} className="d-flex gap-md-4 gap-2 a_detail_cart">
                              <img src={require("../img/a_img/broccoli (1).jpg")} alt="Product" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                              <div className="flex-grow-1">
                                <p className="mb-1" style={{ color: '#0C6C44' }}>Order #{order.orderNumber}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="mb-1 fw-bold">{item.name}</h6>
                                  <h6 className="mb-0 fw-bold">${item.price}</h6>
                                </div>
                                <p className="text-muted mb-md-3 mb-1">{item.quantity}</p>
                              </div>
                            </div>
                          ))}
                          <div className='d-flex justify-content-end align-items-center px-4 mb-2'>
                            {order.items.length > 1 && (
                              <div className='w-100 d-flex justify-content-between align-items-center'>
                                <Link to="#" className="me-2" onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setExpandedItems(prev => 
                                    prev.includes(order.id) 
                                      ? prev.filter(id => id !== order.id)
                                      : [...prev, order.id]
                                  );
                                }}>
                                  {expandedItems.includes(order.id) ? 'Show less' : `+${order.items.length - 1} more`} <FaAngleDown style={{ transform: expandedItems.includes(order.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                                </Link>
                              </div>
                            )}
                            {order.status === 'In Progress' && (
                              <button
                                className="a_btn-outline-success a_btn_cancel d-flex"
                                onClick={() => {
                                  setSelectedOrder({
                                    ...order,
                                    _id: order.id // Ensure we have the order ID
                                  });
                                  setShowCancelOrder(true);
                                }}
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p>No orders found.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {
            activeTab === "address" && (
              <div className="border-0 shadow-sm">
                <div className="x_address-list">
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div>Error: {error.message || 'An error occurred'}</div>
                  ) : addresses && addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div className="x_address-card" key={addr._id}>
                        <div className="x_address-type">{addr.saveAddressAs}</div>
                        <div className="x_address-details">
                          <div className="x_person-name">{`${addr.firstName} ${addr.lastName}`}</div>
                          <div className="x_phone-number">{addr.phone}</div>
                          <div className="x_full-address">
                            {`${addr.address1}${addr.address2 ? `, ${addr.address2}` : ''}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.postalCode}`}
                          </div>
                        </div>
                        <button
                          className="x_address-menu"
                          onClick={() => setOpenDropdownId(openDropdownId === addr._id ? null : addr._id)}
                        >⋮</button>
                        <div className="x_dropdown">
                          {openDropdownId === addr._id && (
                            <div className="x_dropdown-content">
                              <button
                                className="x_dropdown-item"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  setEditingAddress(addr);
                                  setShowFirstModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="x_dropdown-item"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  setShowDeleteModal(true);
                                  setAddressToDelete(addr._id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="a_card text-center py-5">
                      <div className="a_card-body">
                        <img
                          src={require("../img/a_img/no-address.png")}
                          alt="No Address"
                          className="x_empty-img mb-3"
                        />
                        <h5 className="x_empty-text mb-2">No saved address</h5>
                        <p className="text-muted">You haven't saved any delivery address yet</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add/Edit Address Modal */}
                <Modal show={showFirstModal} onHide={() => {
                  setShowFirstModal(false);
                  setEditingAddress(null);
                }} centered size="lg" className='Z_Add_address'>
                  <Modal.Header closeButton>
                    <Modal.Title>{editingAddress ? 'Edit Address' : 'Add New Address'}</Modal.Title>
                  </Modal.Header>

                  <Formik
                    initialValues={editingAddress ? {
                      firstName: editingAddress.firstName || "",
                      lastName: editingAddress.lastName || "",
                      phone: editingAddress.phone || "",
                      email: editingAddress.email || "",
                      house: editingAddress.address1 || "",
                      landmark: editingAddress.address2 || "",
                      pin: editingAddress.postalCode || "",
                      city: editingAddress.city || "",
                      state: editingAddress.state || "",
                      country: editingAddress.country || "",
                      addressType: editingAddress.saveAddressAs || "Home",
                    } : {
                      firstName: "",
                      lastName: "",
                      phone: "",
                      email: "",
                      house: "",
                      landmark: "",
                      pin: "",
                      city: "",
                      state: "",
                      country: "",
                      addressType: "Home",
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleAddressSubmit}
                  >
                    {({ values, setFieldValue, resetForm }) => (
                      <FormikForm>
                        <Modal.Body>
                          <div className="row">
                            {[
                              { label: "First name", name: "firstName" },
                              { label: "Last name", name: "lastName" },
                              { label: "Phone", name: "phone" },
                              { label: "Email", name: "email" },
                              { label: "Flat/ House No/ Building Name", name: "house" },
                              { label: "Landmark", name: "landmark" },
                              { label: "Pin code", name: "pin" },
                              { label: "City", name: "city" },
                              { label: "State", name: "state" },
                              { label: "Country", name: "country" },
                            ].map(({ label, name }, index) => (
                              <div className="col-md-6 col-12 mb-3 Z_Address_form" key={index}>
                                <label className="Z_form_label">{label}</label>
                                <Field className="form-control Z_add_fields" name={name} placeholder={label} />
                                <ErrorMessage name={name} component="div" className="text-danger" />
                              </div>
                            ))}

                            <div className="mb-3 gap-4 d-flex align-items-center">
                              <div className="me-3">
                                <label className="fw-bold">Save Address as</label>
                                <div className="d-flex gap-2">
                                  {["Home", "Office", "Other"].map((type, idx) => (
                                    <label key={idx} className={`z_radio-wrapper ${values.addressType === type ? "selected" : ""}`}>
                                      <input
                                        type="radio"
                                        name="addressType"
                                        value={type}
                                        checked={values.addressType === type}
                                        onChange={() => setFieldValue("addressType", type)}
                                        className="z_radio-input"
                                      />
                                      <span className="z_radio-custom"></span>
                                      <span className="z_radio-label">{type}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Modal.Body>

                        <Modal.Footer className="border-0 gap-3 d-flex justify-content-center">
                          <Button variant="secondary" onClick={() => setShowFirstModal(false)} className="px-5">
                            Cancel
                          </Button>
                          <Button type="submit" variant="success" className="px-5 z_button">
                            {editingAddress ? 'Update' : 'Save'}
                          </Button>
                        </Modal.Footer>
                      </FormikForm>
                    )}
                  </Formik>
                </Modal>
              </div>
            )
          }
          {
            activeTab === "change password" && (
              <div className="a_card border-0 shadow-sm">
                <div className="a_card-body">
                  <form className="x_password-form" onSubmit={handlePasswordSubmit}>
                    <div className="x_form-group mb-4">
                      <label className="x_form-label">Old Password</label>
                      <div className="x_password-input">
                        <input
                          type={passwordVisibility.oldPassword ? "text" : "password"}
                          className={`x_form-control ${passwordErrors.oldPassword ? 'x_form-control-error' : ''}`}
                          placeholder="Old Password"
                          value={passwords.oldPassword}
                          onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                        />
                        <button
                          type="button"
                          className="x_password-toggle"
                          onClick={() => togglePasswordVisibility('oldPassword')}
                        >
                          {passwordVisibility.oldPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                      {passwordErrors.oldPassword && (
                        <div className="x_error-message">{passwordErrors.oldPassword}</div>
                      )}
                    </div>
                    <div className="x_form-group mb-4">
                      <label className="x_form-label">New Password</label>
                      <div className="x_password-input">
                        <input
                          type={passwordVisibility.newPassword ? "text" : "password"}
                          className={`x_form-control ${passwordErrors.newPassword ? 'x_form-control-error' : ''}`}
                          placeholder="New Password"
                          value={passwords.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        />
                        <button
                          type="button"
                          className="x_password-toggle"
                          onClick={() => togglePasswordVisibility('newPassword')}
                        >
                          {passwordVisibility.newPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <div className="x_error-message">{passwordErrors.newPassword}</div>
                      )}
                    </div>
                    <div className="x_form-group mb-4">
                      <label className="x_form-label">Confirm Password</label>
                      <div className="x_password-input">
                        <input
                          type={passwordVisibility.confirmPassword ? "text" : "password"}
                          className={`x_form-control ${passwordErrors.confirmPassword ? 'x_form-control-error' : ''}`}
                          placeholder="Confirm Password"
                          value={passwords.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        />
                        <button
                          type="button"
                          className="x_password-toggle"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                          {passwordVisibility.confirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <div className="x_error-message">{passwordErrors.confirmPassword}</div>
                      )}
                    </div>
                    <div className="x_form-actions">
                      <button type="button" className="x_btn x_btn-cancel">Cancel</button>
                      <button type="submit" className="x_btn x_btn-reset">Reset Password</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          {
            activeTab === "delete" && (
              <div className="a_card border-0 shadow-sm">
                <div className="a_card-body">
                  <h5 className="a_card-title mb-4">Delete Account</h5>
                  <div className="a_alert a_alert-danger mb-4">
                    <p className="mb-0">
                      Warning: This action cannot be undone. All your data will
                      be permanently deleted.
                    </p>
                  </div>
                  <form className="a_delete-form" onSubmit={(e) => {
                    e.preventDefault();
                    setShowDeleteAccountModal(true);
                  }}>
                    <div className="mb-3">
                      <label className="form-label">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={deleteAccountPassword}
                        onChange={(e) => setDeleteAccountPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="a_btn a_btn-danger">
                      Delete My Account
                    </button>
                  </form>
                </div>
              </div>
            )
          }

          {
            showDeleteAccountModal && (
              <div className="x_modal-overlay">
                <div className="x_modal">
                  <div className="x_modal-content">
                    <button
                      className="x_modal-close"
                      onClick={() => setShowDeleteAccountModal(false)}
                    >
                      <CgClose />
                    </button>
                    <h5 className="x_modal-title">Delete Account</h5>
                    <p className="x_modal-text">Deleting your account erases all data. Confirm Deletion?</p>
                    <div className="x_modal-actions">
                      <button
                        className="x_btn x_btn-secondary"
                        onClick={() => setShowDeleteAccountModal(false)}
                      >
                        No
                      </button>
                      <button
                        className="x_btn x_btn-danger"
                        onClick={handleDeleteAccount}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          {
            activeTab === "logout" && (
              <div className="a_card border-0 shadow-sm">
                <div className="a_card-body text-center">
                  <h5 className="a_card-title mb-4">Logout</h5>
                  <p className="mb-4">Are you sure you want to logout?</p>
                  <button
                    className="a_btn a_btn-danger"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    Yes, Logout
                  </button>
                </div >
              </div >
            )
          }

          {
            showLogoutModal && (
              <div className="x_modal-overlay">
                <div className="x_modal">
                  <div className="x_modal-content">
                    <button
                      className="x_modal-close"
                      onClick={() => setShowLogoutModal(false)}
                    >
                      <CgClose />
                    </button>
                    <h5 className="x_modal-title">Logout</h5>
                    <p className="x_modal-text">Are you sure want to Logout?</p>
                    <div className="x_modal-actions">
                      <button
                        className="x_btn x_btn-secondary"
                        onClick={() => setShowLogoutModal(false)}
                      >
                        No
                      </button>
                      <button
                        className="x_btn x_btn-danger"
                        onClick={handleLogout}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          {
            showDeleteModal && (
              <div className="x_modal-overlay">
                <div className="x_modal">
                  <div className="x_modal-content">
                    <button
                      className="x_modal-close"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setAddressToDelete(null);
                      }}
                    >
                      <CgClose />
                    </button>
                    <h5 className="x_modal-title">Delete Address</h5>
                    <p className="x_modal-text">Are you sure you want to delete Address?</p>
                    <div className="x_modal-actions">
                      <button
                        className="x_btn x_btn-secondary"
                        onClick={() => {
                          setShowDeleteModal(false);
                          setAddressToDelete(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="x_btn x_btn-danger"
                        onClick={handleDeleteAddress}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

        </div>
      </div>
      {/* Track Order Off-canvas */}

      {(showTrackOrder || showCancelOrder) && (
        <div className="a_backdrop" onClick={() => {
          setShowTrackOrder(false);
          setShowCancelOrder(false);
        }}></div>
      )}
      {showCancelOrder && (
        <div className={`a_offcanvas show`}>
          <div className="a_offcanvas-header">
            <h5 className='mb-0'>Cancel Order</h5>
            <button className="a_close-btn" onClick={() => setShowCancelOrder(false)}>&times;</button>
          </div>
          <div className="a_offcanvas-body ">
            <div>
              <div>
                <p className='text-muted'>Order ID: {selectedOrder?.orderNumber}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Select Reason</label>
                <div className="a_custom-select">
                  <button
                    type="button"
                    className="a_select-button form-control text-start d-flex justify-content-between align-items-center"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {cancelReason ? (
                      options.find(opt => opt.value === cancelReason)?.label
                    ) : (
                      "Select a reason"
                    )}

                    <FaAngleDown style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                  </button>
                  {isOpen && (
                    <div className="a_select-dropdown">
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className={`a_select-option ${cancelReason === option.value ? 'selected' : ''}`}
                          onClick={() => {
                            if (!option.disabled) {
                              setCancelReason(option.value);
                              setIsOpen(false);
                            }
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Additional Comments</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={cancelComment}
                  onChange={(e) => setCancelComment(e.target.value)}
                  placeholder="Please provide additional details..."
                ></textarea>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4 w-100">
              <button
                className="a_btn w-50 a_btn-outline-success"
                onClick={() => setShowCancelOrder(false)}
              >Back</button>
              <button
                className="a_btn w-50 a_btn-success"
                onClick={() => {
                  setShowCancelOrder(false);
                  // Delete the order when confirmed
                  if (selectedOrder && selectedOrder._id) {
                    dispatch(deleteOrder(selectedOrder._id))
                      .unwrap()
                      .then(() => {
                        // Refresh the orders list after successful cancellation
                        dispatch(fetchUserOrders())
                          .unwrap()
                          .then(result => {
                            // Transform the API data to match the display format
                            const formattedOrders = result.data.map(order => ({
                              id: order._id,
                              status: order.orderStatus || order.status,
                              date: new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric'
                              }),
                              orderNumber: order._id.substring(0, 8).toUpperCase(),
                              items: order.productData ? order.productData.map(product => ({
                                id: product._id,
                                name: product.productName,
                                price: order.totalAmount / (order.productData.length || 1), // Approximate price per item
                                quantity: order.items && order.items.length > 0 ? order.items[0].quantity : '1'
                              })) : []
                            }));
                            setOrders(formattedOrders);

                            // Show success confirmation
                            const successOffcanvas = document.createElement('div');
                            successOffcanvas.className = 'a_offcanvas show';
                            successOffcanvas.innerHTML = `
                              <div class="a_offcanvas-header">
                                <h5 class="mb-0">Cancel Order</h5>
                                <button class="a_close-btn" onclick="this.closest('.a_offcanvas').remove();document.querySelector('.a_backdrop').remove();">&times;</button>
                              </div>
                              <div class= "a_offcanvas-body d-flex flex-column justify-content-between">
                              <div></div>
                                <div class="text-center py-4">
                                  <img src="${require('../img/a_img/confrim_order.png')}" alt="Order Cancelled" style="width: 200px; margin-bottom: 24px;" />
                                  <h5 class="mb-2">Thank you</h5>
                                  <p class="text-muted">Your order has been cancelled successfully.</p>
                                </div>
                                <div class="d-flex gap-2 mt-4 w-100">
                                  <button class="a_btn w-50 a_btn-outline-success" onclick="this.closest('.a_offcanvas').remove();document.querySelector('.a_backdrop').remove();">Cancel</button>
                                  <button class="a_btn w-50 a_btn-success" onclick="this.closest('.a_offcanvas').remove();document.querySelector('.a_backdrop').remove();">Track Refund</button>
                                </div>
                              </div>
                            `;
                            // Create and add backdrop
                            const backdrop = document.createElement('div');
                            backdrop.className = 'a_backdrop';
                            document.body.appendChild(backdrop);

                            document.body.appendChild(successOffcanvas);
                            if (backdrop) {
                              backdrop.onclick = () => {
                                successOffcanvas.remove();
                                backdrop.remove();
                              };
                            }
                          })
                          .catch(error => {
                            console.error('Failed to refresh orders:', error);
                          });
                      })
                      .catch(error => {
                        console.error('Failed to cancel order:', error);
                        alert('Failed to cancel order. Please try again.');
                      });
                  } else {
                    console.error('No valid order ID found');
                    alert('Failed to cancel order. No valid order ID found.');
                  }
                }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}
      {selectedOrder && selectedOrder.status === 'Cancelled' ? (
        <div className={`a_offcanvas ${showTrackOrder ? 'show' : ''}`}>
          <div className="a_offcanvas-header">
            <h5 className='mb-0'>Refund Status</h5>
            <button className="a_close-btn" onClick={() => setShowTrackOrder(false)}>&times;</button>
          </div>
          <div className=" a_offcanvas-body d-flex flex-column justify-content-start">
            <div>
              <p className='text-muted'>Order ID: {selectedOrder.orderNumber}</p>
            </div>
            <div className="a_track-timeline">
              <div className="a_track-step completed">
                <div className="a_step-icon"><BsCheckLg /></div>
                <div className="a_step-content">
                  <h6>Refund Initiated</h6>
                  <p>Feb 05, 2025 02:35 PM</p>
                </div>
              </div>
              <div className="a_track-step">
                <div className="a_step-icon text-muted"><GoDotFill /></div>
                <div className="a_step-content">
                  <h6>Refund in process</h6>
                  <p>Pending...</p>
                </div>
              </div>
              <div className="a_track-step">
                <div className="a_step-icon text-muted"><GoDotFill /></div>
                <div className="a_step-content">
                  <h6>Refund Credited</h6>
                  <p>Pending...</p>
                </div>
              </div>
            </div>
            <div className="a_order-summary">
              <h6 className='a_order_h6'>Order Summary</h6>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="a_summary-item">
                  <div className="a_item-details">
                    <img src={require("../img/a_img/broccoli (1).jpg")} alt={item.name} />
                    <div>
                      <h6>{item.name}</h6>
                      <p>{item.quantity}</p>
                    </div>
                  </div>
                  <span className="a_item-price">${Math.round(item.price)}</span>
                </div>
              ))}

              <div className="a_price-breakdown p-2">
                <div className="a_price-row">
                  <span>Price ({selectedOrder.items.length} items)</span>
                  <span style={{ color: 'black' }}>${Math.round(selectedOrder.items.reduce((total, item) => total + item.price, 0))}</span>
                </div>
                <div className="a_price-row">
                  <span>Discount</span>
                  <span className="text-success">-$10</span>
                </div>
                <div className="a_price-row">
                  <span>Platform Fee</span>
                  <span style={{ color: 'black' }}>$1</span>
                </div>
                <div className="a_price-row">
                  <span>Delivery Charges</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="a_price-row total">
                  <span>Total</span>
                  <span>${Math.round(selectedOrder.items.reduce((total, item) => total + item.price, 0) - 10 + 1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`a_offcanvas ${showTrackOrder ? 'show' : ''}`}>



          <div className="a_offcanvas-header">
            <h5 className='mb-0'>{selectedOrder?.status === 'Delivered' ? 'Delivered' : 'Track Order'}</h5>
            <button className="a_close-btn" onClick={() => setShowTrackOrder(false)}>&times;</button>
          </div>
          {selectedOrder && selectedOrder.items && (
            <div className="a_offcanvas-body d-flex flex-column justify-content-start">
              <div>
                <p className='text-muted'>Order ID: ABC - 963258</p>
              </div>
              <div className="a_track-timeline">
                <div className={`a_track-step ${selectedOrder.status === 'Confirmed' || selectedOrder.status === '' || selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'completed' : ''}`}>
                  <div className="a_step-icon"><BsCheckLg /></div>
                  <div className="a_step-content">
                    <h6>Order Confirmed</h6>
                    <p>Feb 05, 2023 02:00 PM</p>
                  </div>
                </div>
                <div className={`a_track-step ${selectedOrder.status === 'In Progress' || selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'completed' : ''}`}>
                  <div className="a_step-icon"><BsCheckLg /></div>
                  <div className="a_step-content">
                    <h6>Under Progress</h6>
                    <p>Feb 05, 2023 02:15 PM</p>
                  </div>
                </div>
                <div className={`a_track-step ${selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'completed' : ''}`}>
                  <div className={`a_step-icon ${selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? '' : 'text-muted'}`}>
                    {selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? <BsCheckLg /> : <GoDotFill />}
                  </div>
                  <div className="a_step-content">
                    <h6>Shipped</h6>
                    <p>Feb 05, 2023 02:25 PM</p>
                  </div>
                </div>
                <div className={`a_track-step ${selectedOrder.status === 'Delivered' ? 'completed' : ''}`}>
                  <div className={`a_step-icon ${selectedOrder.status === 'Delivered' ? '' : 'text-muted'}`}>
                    {selectedOrder.status === 'Delivered' ? <BsCheckLg /> : <GoDotFill />}
                  </div>
                  <div className="a_step-content">
                    <h6>Delivered</h6>
                    <p>Feb 05, 2023 02:30 PM</p>
                  </div>
                </div>
              </div>
              <div className="a_order-summary">
                <h6 className='a_order_h6'>Order Summary</h6>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="a_summary-item">
                    <div className="a_item-details">
                      <img src={require("../img/a_img/broccoli (1).jpg")} alt={item.name} />
                      <div>
                        <h6>{item.name}</h6>
                        <p>{item.quantity}</p>
                      </div>
                    </div>
                    <span className="a_item-price">${Math.round(item.price)}</span>
                  </div>
                ))}

                <div className="a_price-breakdown p-2">
                  <div className="a_price-row">
                    <span>Price ({selectedOrder.items.length} items)</span>
                    <span style={{ color: 'black' }}>${Math.round(selectedOrder.items.reduce((total, item) => total + item.price, 0))}</span>
                  </div>
                  <div className="a_price-row">
                    <span>Discount</span>
                    <span className="text-success">-$10</span>
                  </div>
                  <div className="a_price-row">
                    <span>Platform Fee</span>
                    <span style={{ color: 'black' }}>$1</span>
                  </div>
                  <div className="a_price-row">
                    <span>Delivery Charges</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <div className="a_price-row total">
                    <span>Total</span>
                    <span>${Math.round(selectedOrder.items.reduce((total, item) => total + item.price, 0) - 10 + 1)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
