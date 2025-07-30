import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAddresses, deleteAddress, updateAddress, createAddress } from '../redux/slices/address.Slice';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaTrash, FaEdit, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/Akshay.css'

const MyAddresses = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [localAddresses, setLocalAddresses] = useState([]); // Local state for immediate UI updates
  const [editErrors, setEditErrors] = useState({}); // State for edit form validation errors
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

  // Update local addresses when Redux state changes
  useEffect(() => {
    if (addresses) {
      setLocalAddresses(addresses);
    }
  }, [addresses]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createAddress(newAddress)).unwrap();
      // Add new address to local state immediately
      setLocalAddresses(prev => [...prev, result]);
      setShowAddModal(false);
      // Also refresh from server to ensure consistency
      dispatch(getUserAddresses());
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
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteAddress(addressToDelete._id)).unwrap();
      
      // Immediately remove from local state for instant UI update
      setLocalAddresses(prev => prev.filter(addr => addr._id !== addressToDelete._id));
      
      setShowDeleteModal(false);
      setAddressToDelete(null);
      
      // Optional: Refresh from server to ensure consistency
      // dispatch(getUserAddresses());
    } catch (error) {
      console.error('Failed to delete address:', error);
      // If delete fails, refresh the addresses to restore the correct state
      dispatch(getUserAddresses());
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setEditErrors({}); // Clear any previous validation errors
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    
    if (!selectedAddress.saveAddressAs?.trim()) {
      errors.saveAddressAs = 'Address type is required';
    }
    
    if (!selectedAddress.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!selectedAddress.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!selectedAddress.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(selectedAddress.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!selectedAddress.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedAddress.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!selectedAddress.address1?.trim()) {
      errors.address1 = 'Address line 1 is required';
    }
    
    if (!selectedAddress.city?.trim()) {
      errors.city = 'City is required';
    }
    
    if (!selectedAddress.state?.trim()) {
      errors.state = 'State is required';
    }
    
    if (!selectedAddress.country?.trim()) {
      errors.country = 'Country is required';
    }
    
    if (!selectedAddress.postalCode?.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(selectedAddress.postalCode)) {
      errors.postalCode = 'Please enter a valid postal code';
    }
    
    // If there are validation errors, don't proceed
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    
    try {
      const result = await dispatch(updateAddress({
        addressId: selectedAddress._id,
        addressData: selectedAddress
      })).unwrap();
      
      // Update local state immediately
      setLocalAddresses(prev => 
        prev.map(addr => 
          addr._id === selectedAddress._id ? { ...addr, ...selectedAddress } : addr
        )
      );
      
      setShowEditModal(false);
      setEditErrors({});
      // Optional: Refresh from server to ensure consistency
      // dispatch(getUserAddresses());
    } catch (error) {
      console.error('Failed to update address:', error);
      // If update fails, refresh the addresses to restore the correct state
      dispatch(getUserAddresses());
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">My Addresses</h2>
      {localAddresses && localAddresses.length > 0 && (
        <div className="text-center my-4">
          <Button
            variant="success"
            onClick={() => setShowAddModal(true)}
            className="add-new-btn"
            style={{ backgroundColor: '#2c6145', borderColor: '#2c6145' }}
          >
            Add New Address
          </Button>
        </div>
      )}
      <Row className="g-4">
        {localAddresses && localAddresses.length > 0 ? (
          localAddresses.map((address) => (
            <Col key={address._id} xs={12} md={6} lg={4}>
              <div className="address-box">
                <div className="address-label">
                  {address.saveAddressAs || 'Address'}
                </div>
                <div className="address-content">
                  <div className="user-details">
                    <div className="user-name">
                      <FaUser className="icon-primary" />
                      <span>{address.firstName} {address.lastName}</span>
                    </div>
                    <div className="contact-info">
                      <div className="info-item">
                        <FaPhone className="icon-muted" />
                        <span>{address.phone}</span>
                      </div>
                      <div className="info-item">
                        <FaEnvelope className="icon-muted" />
                        <span>{address.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="address-info">
                    <div className="address-icon">
                      <FaMapMarkerAlt className="location-icon" />
                    </div>
                    <div className="address-text">
                      <div className="address-line">{address.address1}</div>
                      {address.address2 && <div className="address-line">{address.address2}</div>}
                      <div className="address-line city-state">{address.city}, {address.state}</div>
                      <div className="address-line country">{address.country}</div>
                      <div className="address-line postal">Postal Code: {address.postalCode}</div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button className="btn-delete" onClick={() => handleDeleteClick(address)}>
                      <FaTrash />
                    </button>
                    <button className="btn-edit" onClick={() => handleEdit(address)}>
                      <FaEdit />
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <Col xs={12}>
          <div className="db_empty_address">
            <div className="db_empty_content">
              <div className="db_empty_icon">
                <FaMapMarkerAlt />
              </div>
              <h3>No Addresses Found</h3>
              <p>Add your delivery address to start shopping with us</p>
              <Button
                variant="success"
                onClick={() => setShowAddModal(true)}
                className="db_shop_btn"
                style={{ backgroundColor: '#2c6145', borderColor: '#2c6145' }}
              >
                <FaMapMarkerAlt className="db_btn_icon" />
                Add New Address
              </Button>
            </div>
          </div>
        </Col>
        )}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="text-danger">
            <FaExclamationTriangle className="me-2" />
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this address?</p>
          <p className="text-muted small">
            {addressToDelete?.address1}, {addressToDelete?.city}
          </p>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="border" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Address
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal className='ps-0' show={showEditModal} onHide={() => {
        setShowEditModal(false);
        setEditErrors({}); // Clear validation errors when modal is closed
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Save Address As</Form.Label>
              <Form.Control
                type="text"
                name="saveAddressAs"
                value={selectedAddress?.saveAddressAs || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.saveAddressAs}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.saveAddressAs}
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={selectedAddress?.firstName || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={selectedAddress?.lastName || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={selectedAddress?.phone || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={selectedAddress?.email || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                type="text"
                name="address1"
                value={selectedAddress?.address1 || ''}
                onChange={handleInputChange}
                isInvalid={!!editErrors.address1}
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
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={selectedAddress?.city || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={selectedAddress?.state || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.state}
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
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={selectedAddress?.country || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.country}
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.country}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={selectedAddress?.postalCode || ''}
                    onChange={handleInputChange}
                    isInvalid={!!editErrors.postalCode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.postalCode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button className='border bg-transparent text-dark' onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button className='G_addressButton' type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Address Modal */}
      <Modal className='ps-0 G_address_modal' show={showAddModal} onHide={() => setShowAddModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAddress} className='G_AddAddressForm'>
            <Form.Group className="mb-3">
              <Form.Label>Save Address As</Form.Label>
              <Form.Select
                name="saveAddressAs"
                value={newAddress.saveAddressAs}
                onChange={handleNewAddressChange}
                required
              >
                <option value="">Select Address Type</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={newAddress.firstName}
                    onChange={handleNewAddressChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={newAddress.lastName}
                    onChange={handleNewAddressChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newAddress.phone}
                onChange={handleNewAddressChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newAddress.email}
                onChange={handleNewAddressChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                type="text"
                name="address1"
                value={newAddress.address1}
                onChange={handleNewAddressChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                name="address2"
                value={newAddress.address2}
                onChange={handleNewAddressChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={newAddress.country}
                    onChange={handleNewAddressChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleNewAddressChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button className='border bg-transparent text-dark' onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button className='G_addressButton' type="submit">
                Add Address
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      

      <style jsx>{`
        .address-box {
          background: white;
          border-radius: 16px;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .address-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .address-label {
          background: linear-gradient(135deg, #2c6145 0%, #1e4431 100%);
          color: white;
          padding: 8px 20px;
          font-weight: 500;
          letter-spacing: 0.5px;
          font-size: 0.95rem;
        }

        .address-content {
          padding: 20px;
        }

        .user-details {
          margin-bottom: 20px;
        }

        .user-name {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #64748b;
          font-size: 0.95rem;
        }

       .address-info {
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 12px;
          display: flex;
          gap: 1rem;
          margin-bottom: 1.25rem;
          border: 1px solid rgba(44, 97, 69, 0.1);
        }

        .address-icon {
          background: rgba(44, 97, 69, 0.1);
          padding: 0.75rem;
          border-radius: 50%;
          height: fit-content;
        }
        .location-icon {
          color: #2c6145;
          font-size: 1.5rem;
        }
.address-text {
          flex: 1;
        }
        .address-text p {
          margin: 0;
          color: #475569;
          line-height: 1.6;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
 .address-line {
          color: #475569;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .address-line:last-child {
          margin-bottom: 0;
        }

        .btn-delete, .btn-edit {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-delete {
          background: #fee2e2;
          color: #ef4444;
        }

        .btn-edit {
          background: #2c6145;
          color: white;
        }

        .btn-delete:hover {
          background: #fecaca;
        }

        .btn-edit:hover {
          background: #1e4431;
        }

        .icon-primary {
          color: #2c6145;
          font-size: 1.2rem;
        }

        .icon-muted {
          color: #94a3b8;
          font-size: 1rem;
        }
          .city-state {
          color: #2c6145;
          font-weight: 500;
        }

        .country {
          color: #64748b;
        }

        .postal {
          color: #64748b;
          font-size: 0.9rem;
        }
            .db_empty_address {
              padding: 40px 20px;
              text-align: center;
              background: white;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }

            .db_empty_content {
              max-width: 400px;
              margin: 0 auto;
            }

            .db_empty_icon {
              width: 80px;
              height: 80px;
              background: rgba(44, 97, 69, 0.1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 24px;
              color: #2c6145;
              font-size: 32px;
            }

            .db_empty_content h3 {
              color: #2c6145;
              margin-bottom: 12px;
              font-size: 24px;
            }

            .db_empty_content p {
              color: #666;
              margin-bottom: 24px;
              font-size: 16px;
            }

            .db_shop_btn {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 500;
              border-radius: 8px;
              transition: all 0.3s ease;
            }

            .db_shop_btn:hover {
              background-color: #1e4431 !important;
              border-color: #1e4431 !important;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(44, 97, 69, 0.2);
            }

            .db_btn_icon {
              font-size: 20px;
            }
      `}</style>
    </Container>
  );
};

export default MyAddresses;