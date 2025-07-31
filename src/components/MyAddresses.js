import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAddresses, deleteAddress, updateAddress, createAddress } from '../redux/slices/address.Slice';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaTrash, FaEdit, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaExclamationTriangle, FaPlus, FaHome, FaBuilding, FaEllipsisV } from 'react-icons/fa';
import '../styles/Akshay.css'

const MyAddresses = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [localAddresses, setLocalAddresses] = useState([]);
  const [editErrors, setEditErrors] = useState({});
  const [addErrors, setAddErrors] = useState({});
  const [newAddress, setNewAddress] = useState({
    saveAddressAs: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses) {
      setLocalAddresses(addresses);
    }
  }, [addresses]);

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePostalCode = (postalCode) => {
    const postalRegex = /^[A-Za-z0-9\s-]{3,10}$/;
    return postalRegex.test(postalCode);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    return nameRegex.test(name.trim());
  };

  const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
  };

  // Generic validation function
  const validateAddressData = (addressData) => {
    const errors = {};

    // Save Address As validation
    if (!validateRequired(addressData.saveAddressAs)) {
      errors.saveAddressAs = 'Address type is required';
    }

    // First Name validation
    if (!validateRequired(addressData.firstName)) {
      errors.firstName = 'First name is required';
    } else if (!validateName(addressData.firstName)) {
      errors.firstName = 'First name should contain only letters and be 2-30 characters long';
    }

    // Last Name validation
    if (!validateRequired(addressData.lastName)) {
      errors.lastName = 'Last name is required';
    } else if (!validateName(addressData.lastName)) {
      errors.lastName = 'Last name should contain only letters and be 2-30 characters long';
    }

    // Phone validation
    if (!validateRequired(addressData.phone)) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(addressData.phone)) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    // Email validation
    if (!validateRequired(addressData.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(addressData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Address Line 1 validation
    if (!validateRequired(addressData.address1)) {
      errors.address1 = 'Address line 1 is required';
    } else if (addressData.address1.trim().length < 5) {
      errors.address1 = 'Address must be at least 5 characters long';
    }

    // City validation
    if (!validateRequired(addressData.city)) {
      errors.city = 'City is required';
    } else if (addressData.city.trim().length < 2) {
      errors.city = 'City name must be at least 2 characters long';
    }

    // State validation
    if (!validateRequired(addressData.state)) {
      errors.state = 'State is required';
    } else if (addressData.state.trim().length < 2) {
      errors.state = 'State name must be at least 2 characters long';
    }

    // Country validation
    if (!validateRequired(addressData.country)) {
      errors.country = 'Country is required';
    } else if (addressData.country.trim().length < 2) {
      errors.country = 'Country name must be at least 2 characters long';
    }

    // Postal Code validation
    if (!validateRequired(addressData.postalCode)) {
      errors.postalCode = 'Postal code is required';
    } else if (!validatePostalCode(addressData.postalCode)) {
      errors.postalCode = 'Please enter a valid postal code (3-10 characters, letters, numbers, spaces, and hyphens allowed)';
    }

    return errors;
  };

  // Reset form and errors
  const resetNewAddressForm = () => {
    setNewAddress({
      saveAddressAs: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    });
    setAddErrors({});
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateAddressData(newAddress);

    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    try {
      const result = await dispatch(createAddress(newAddress)).unwrap();
      setLocalAddresses(prev => [...prev, result]);
      setShowAddModal(false);
      dispatch(getUserAddresses());
      resetNewAddressForm();
    } catch (error) {
      console.error('Failed to add address:', error);
      // You could set a general error state here if needed
    }
  };

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteAddress(addressToDelete._id)).unwrap();
      setLocalAddresses(prev => prev.filter(addr => addr._id !== addressToDelete._id));
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error('Failed to delete address:', error);
      dispatch(getUserAddresses());
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setEditErrors({});
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateAddressData(selectedAddress);

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const result = await dispatch(updateAddress({
        addressId: selectedAddress._id,
        addressData: selectedAddress
      })).unwrap();

      setLocalAddresses(prev =>
        prev.map(addr =>
          addr._id === selectedAddress._id ? { ...addr, ...selectedAddress } : addr
        )
      );

      setShowEditModal(false);
      setEditErrors({});
    } catch (error) {
      console.error('Failed to update address:', error);
      dispatch(getUserAddresses());
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (addErrors[name]) {
      setAddErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getAddressIcon = (addressType) => {
    switch (addressType) {
      case 'Home': return <FaHome />;
      case 'Office': return <FaBuilding />;
      default: return <FaMapMarkerAlt />;
    }
  };

  return (
    <Container className="py-5">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">My Addresses</h1>
          <p className="page-subtitle">Manage your delivery addresses</p>
        </div>
        {localAddresses && localAddresses.length > 0 && (
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="add-address-btn"
          >
            <FaPlus className="me-2" />
            Add New Address
          </Button>
        )}
      </div>

      <Row className="g-4">
        {localAddresses && localAddresses.length > 0 ? (
          localAddresses.map((address) => (
            <Col key={address._id} xs={12} md={6} xl={4}>
              <div className="modern-address-card">
                <div className="card-header">
                  <div className="address-type">
                    <div className="type-icon">
                      {getAddressIcon(address.saveAddressAs)}
                    </div>
                    <span className="type-label">{address.saveAddressAs || 'Address'}</span>
                  </div>
                  <div className="card-actions">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(address)}>
                      <FaEdit />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteClick(address)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="contact-section">
                    <div className="name-display">
                      <FaUser className="contact-icon" />
                      <span className="full-name">{address.firstName} {address.lastName}</span>
                    </div>
                    <div className="contact-details">
                      <div className="contact-item">
                        <FaPhone className="contact-icon" />
                        <span>{address.phone}</span>
                      </div>
                      <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <span>{address.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="address-section">
                    <div className="location-header">
                      <FaMapMarkerAlt className="location-icon" />
                      <span className="location-title">Delivery Address</span>
                    </div>
                    <div className="address-details">
                      <p className="address-line primary">{address.address1}</p>
                      {address.address2 && <p className="address-line">{address.address2}</p>}
                      <p className="address-line city-state">{address.city}, {address.state}</p>
                      <p className="address-line country">{address.country}</p>
                      <p className="address-line postal">{address.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="empty-state">
              <div className="empty-icon">
                <FaMapMarkerAlt />
              </div>
              <h3 className="empty-title">No Addresses Found</h3>
              <p className="empty-description">Add your first delivery address to get started</p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="empty-action-btn"
                size="md"
              >
                <FaPlus className="me-2" />
                Add Your First Address
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="delete-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="delete-title">
            <FaExclamationTriangle className="me-2" />
            Delete Address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="delete-icon">
            <FaTrash />
          </div>
          <h5>Are you sure you want to delete this address?</h5>
          <p className="delete-address-preview">
            {addressToDelete?.address1}, {addressToDelete?.city}
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Address
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditErrors({});
        }}
        size="lg"
        className="address-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Save Address As *</Form.Label>
              <Form.Select
                name="saveAddressAs"
                value={selectedAddress?.saveAddressAs || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.saveAddressAs}
              >
                <option value="">Select Address Type</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {editErrors.saveAddressAs}
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={selectedAddress?.firstName || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.firstName}
                    placeholder="Enter first name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={selectedAddress?.lastName || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.lastName}
                    placeholder="Enter last name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={selectedAddress?.phone || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.phone}
                placeholder="Enter phone number"
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={selectedAddress?.email || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.email}
                placeholder="Enter email address"
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 1 *</Form.Label>
              <Form.Control
                type="text"
                name="address1"
                value={selectedAddress?.address1 || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.address1}
                placeholder="Enter street address"
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.address1}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                name="address2"
                value={selectedAddress?.address2 || ''}
                onChange={handleInputChange}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={selectedAddress?.city || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.city}
                    placeholder="Enter city"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={selectedAddress?.state || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.state}
                    placeholder="Enter state"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.state}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={selectedAddress?.country || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.country}
                    placeholder="Enter country"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.country}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={selectedAddress?.postalCode || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.postalCode}
                    placeholder="Enter postal code"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.postalCode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          resetNewAddressForm();
        }}
        size="lg"
        className="address-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAddress}>
            <Form.Group className="mb-3">
              <Form.Label>Save Address As *</Form.Label>
              <Form.Select
                name="saveAddressAs"
                value={newAddress.saveAddressAs}
                onChange={handleNewAddressChange}
                isInvalid={!!addErrors.saveAddressAs}
              >
                <option value="">Select Address Type</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {addErrors.saveAddressAs}
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={newAddress.firstName}
                    onChange={handleNewAddressChange}
                    isInvalid={!!addErrors.firstName}
                    placeholder="Enter first name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {addErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={newAddress.lastName}
                    onChange={handleNewAddressChange}
                    isInvalid={!!addErrors.lastName}
                    placeholder="Enter last name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {addErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newAddress.phone}
                onChange={handleNewAddressChange}
                isInvalid={!!addErrors.phone}
                placeholder="Enter phone number"
              />
              <Form.Control.Feedback type="invalid">
                {addErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newAddress.email}
                onChange={handleNewAddressChange}
                isInvalid={!!addErrors.email}
                placeholder="Enter email address"
              />
              <Form.Control.Feedback type="invalid">
                {addErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 1 *</Form.Label>
              <Form.Control
                type="text"
                name="address1"
                value={newAddress.address1}
                onChange={handleNewAddressChange}
                isInvalid={!!addErrors.address1}
                placeholder="Enter street address"
              />
              <Form.Control.Feedback type="invalid">
                {addErrors.address1}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                name="address2"
                value={newAddress.address2}
                onChange={handleNewAddressChange}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    isInvalid={!!addErrors.city}
                    placeholder="Enter city"
                  />
                  <Form.Control.Feedback type="invalid">
                    {addErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    isInvalid={!!addErrors.state}
                    placeholder="Enter state"
                  />
                  <Form.Control.Feedback type="invalid">
                    {addErrors.state}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={newAddress.country}
                    onChange={handleNewAddressChange}
                    isInvalid={!!addErrors.country}
                    placeholder="Enter country"
                  />
                  <Form.Control.Feedback type="invalid">
                    {addErrors.country}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleNewAddressChange}
                    isInvalid={!!addErrors.postalCode}
                    placeholder="Enter postal code"
                  />
                  <Form.Control.Feedback type="invalid">
                    {addErrors.postalCode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={() => {
                setShowAddModal(false);
                resetNewAddressForm();
              }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Address
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 2rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .header-content {
          flex: 1;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          background: linear-gradient(135deg, #2c6145 0%, #1e4431 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0.5rem 0 0 0;
        }

        .add-address-btn {
          background: linear-gradient(135deg, #2c6145 0%, #1e4431 100%);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(44, 97, 69, 0.25);
          transition: all 0.3s ease;
        }

        .add-address-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(44, 97, 69, 0.35);
        }

        .modern-address-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(44, 97, 69, 0.1);
          height: 100%;
        }

        .modern-address-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(44, 97, 69, 0.15);
          border-color: rgba(44, 97, 69, 0.2);
          border-radius: 0 !important;
        }

        .card-header {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(44, 97, 69, 0.1);
        }

        .address-type {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .type-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2c6145 0%, #1e4431 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.1rem;
        }

        .type-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-btn {
          background: rgba(44, 97, 69, 0.1);
          color: #2c6145;
        }

        .edit-btn:hover {
          background: #2c6145;
          color: white;
          transform: scale(1.05);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .delete-btn:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.05);
        }

        .card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-section {
          display: flex;
          flex-direction: column;
        }

        .name-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .contact-icon {
          color: #2c6145;
          font-size: 1.1rem;
        }

        .full-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          font-size: 0.95rem;
        }

        .address-section {
          background: rgba(44, 97, 69, 0.03);
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(44, 97, 69, 0.1);
        }

        .location-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .location-icon {
          color: #2c6145;
          font-size: 1.2rem;
        }

        .location-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 1rem;
        }

        .address-details {
          margin-left: 2rem;
        }

        .address-line {
          margin: 0 0 0.5rem 0;
          color: #475569;
          line-height: 1.5;
        }

        .address-line.primary {
          font-weight: 500;
          color: #1e293b;
        }

        .address-line.city-state {
          color: #2c6145;
          font-weight: 500;
        }

        .address-line:last-child {
          margin-bottom: 0;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, rgba(44, 97, 69, 0.1) 0%, rgba(44, 97, 69, 0.05) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #2c6145;
          font-size: 2.5rem;
        }

        .empty-title {
          color: #1e293b;
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .empty-description {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .empty-action-btn {
          background: linear-gradient(135deg, #2c6145 0%, #1e4431 100%);
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(44, 97, 69, 0.25);
          transition: all 0.3s ease;
        }

        .empty-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(44, 97, 69, 0.35);
        }

        /* Modal Styles */
        .delete-modal .modal-content {
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .delete-title {
          color: #ef4444;
          font-weight: 600;
        }

        .delete-icon {
          width: 80px;
          height: 80px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #ef4444;
          font-size: 2rem;
        }

        .delete-address-preview {
          background: #f8fafc;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: #64748b;
          font-style: italic;
          margin: 1rem 0;
        }

        .delete-warning {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0;
        }

        .address-modal .modal-content {
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .address-modal .modal-header {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid rgba(44, 97, 69, 0.1);
          border-radius: 20px 20px 0 0;
        }

        .address-modal .modal-title {
          color: #1e293b;
          font-weight: 600;
        }

        .address-modal .form-label {
          color: #374151;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .address-modal .form-control {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }

        .address-modal .form-control:focus {
          border-color: #2c6145;
          box-shadow: 0 0 0 3px rgba(44, 97, 69, 0.1);
        }

        .address-modal .form-control.is-invalid {
          border-color: #ef4444;
        }

        .address-modal .form-control.is-invalid:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .address-modal .form-select {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }

        .address-modal .form-select:focus {
          border-color: #2c6145;
          box-shadow: 0 0 0 3px rgba(44, 97, 69, 0.1);
        }

        .address-modal .form-select.is-invalid {
          border-color: #ef4444;
        }

        .address-modal .form-select.is-invalid:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .address-modal .invalid-feedback {
          display: block;
          font-size: 0.875rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }

        .address-modal .btn-primary {
          background: linear-gradient(135deg, #2c6145 0%, #1e4431 100%);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .address-modal .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(44, 97, 69, 0.25);
        }

        .address-modal .btn-outline-secondary {
          border: 1px solid #d1d5db;
          color: #6b7280;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .address-modal .btn-outline-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #374151;
        }

        /* Form Validation Styles */
        .form-control::placeholder {
          color: #9ca3af;
          font-style: italic;
        }

        .form-select option {
          color: #374151;
        }

        .form-group {
          position: relative;
        }

        /* Required field indicator */
        .form-label::after {
          content: '';
        }

        .form-label:has-text('*') {
          position: relative;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
            text-align: center;
          }

          .page-title {
            font-size: 2rem;
          }

          .modern-address-card {
            margin-bottom: 1rem;
          }

          .card-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .address-type {
            justify-content: center;
          }

          .card-actions {
            justify-content: center;
          }

          .contact-details {
            align-items: center;
            text-align: center;
          }

          .address-details {
            margin-left: 0;
            text-align: center;
          }

          .location-header {
            justify-content: center;
          }

          .address-modal .modal-body {
            max-height: 70vh;
            overflow-y: auto;
          }
        }

        /* Loading and Error States */
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #2c6145;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          margin: 1rem 0;
          border: 1px solid #fecaca;
        }

        /* Animation Classes */
        .fade-enter {
          opacity: 0;
          transform: translateY(20px);
        }

        .fade-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        .fade-exit {
          opacity: 1;
          transform: translateY(0);
        }

        .fade-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s ease;
        }

        /* Custom Scrollbar */
        .address-modal .modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .address-modal .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .address-modal .modal-body::-webkit-scrollbar-thumb {
          background: #2c6145;
          border-radius: 3px;
        }

        .address-modal .modal-body::-webkit-scrollbar-thumb:hover {
          background: #1e4431;
        }

        /* Form Focus States */
        .form-control:focus,
        .form-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(44, 97, 69, 0.1) !important;
          border-color: #2c6145 !important;
        }

        .form-control.is-invalid:focus,
        .form-select.is-invalid:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
          border-color: #ef4444 !important;
        }

        /* Success States */
        .form-control.is-valid {
          border-color: #10b981;
        }

        .form-control.is-valid:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-select.is-valid {
          border-color: #10b981;
        }

        .form-select.is-valid:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </Container>
  );
};

export default MyAddresses;