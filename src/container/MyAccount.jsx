import React, { useState, useEffect } from 'react';
import { FaEdit, FaCamera } from 'react-icons/fa';
import '../styles/MyAccount.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateUser } from '../redux/slices/userSlice';

const MyAccount = () => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const { userData, isLoading } = useSelector((state) => state.user);
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        city: '',
        state: '',
        pincode: '',
        locality: '',
        image: ''
    });

    useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);

    useEffect(() => {
        if (userData) {
            setUserInfo({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                mobileNo: userData.mobileNo || '',
                city: userData.city || '',
                state: userData.state || '',
                pincode: userData.pincode || '',
                locality: userData.locality || '',
                image: userData.image || ''
            });
        }
    }, [userData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo({ ...userInfo, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedData = { ...userInfo };

            if (selectedImageFile) {
                updatedData.image = userInfo.image; // Changed from 'image' to 'userInfo.image'
            }

            await dispatch(updateUser(updatedData)).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <div className="account-container">
            <div className="account-header">
                <h1>My Account</h1>
            </div>

            <div className="account-content">
                <div className="account-sidebar">
                    <div className="avatar-wrapper" style={{ position: 'relative' }}>
                        <img
                            src={userInfo.image ? userInfo.image : require("../image/user.jpg")}
                            alt="Profile"
                            className="avatar-img"
                        />
                        {isEditing && (
                            <div className="camera-icon" 
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '45px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    borderRadius: '50%',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => document.querySelector('input[type="file"]').click()}
                            >
                                <FaCamera color="white" size={16} />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="quote-section mt-2">
                        <p className="quote-text small">
                            "Your one-stop destination for fresh groceries, quality products, and exceptional service. Shop smart, live better! 🛒✨"
                        </p>
                    </div>
                </div>

                <div className="account-main">
                    <div className="info-header">
                        <h2>Personal Information</h2>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="edit-btn">
                                <FaEdit />
                            </button>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="info-display">
                            <div className="info-row">
                                <div className="info-field">
                                    <label>First Name</label>
                                    <p>{userInfo.firstName}</p>
                                </div>
                                <div className="info-field">
                                    <label>Last Name</label>
                                    <p>{userInfo.lastName}</p>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-field">
                                    <label>Email</label>
                                    <p>{userInfo.email}</p>
                                </div>
                                <div className="info-field">
                                    <label>Phone</label>
                                    <p>{userInfo.mobileNo}</p>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-field">
                                    <label>City</label>
                                    <p>{userInfo.city}</p>
                                </div>
                                <div className="info-field">
                                    <label>State</label>
                                    <p>{userInfo.state}</p>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-field">
                                    <label>Postal Code</label>
                                    <p>{userInfo.pincode}</p>
                                </div>
                                <div className="info-field">
                                    <label>Country</label>
                                    <p>{userInfo.locality}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="edit-form">
                            <div className="form-row">
                                <div className="form-field">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={userInfo.firstName}
                                        onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={userInfo.lastName}
                                        onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={userInfo.mobileNo}
                                        onChange={(e) => setUserInfo({ ...userInfo, mobileNo: e.target.value })}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={userInfo.email}
                                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        value={userInfo.city}
                                        onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        value={userInfo.state}
                                        onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Postal Code</label>
                                    <input
                                        type="text"
                                        value={userInfo.pincode}
                                        onChange={(e) => setUserInfo({ ...userInfo, pincode: e.target.value })}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        value={userInfo.locality}
                                        onChange={(e) => setUserInfo({ ...userInfo, locality: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button type="submit" className="save-btn">Save</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
