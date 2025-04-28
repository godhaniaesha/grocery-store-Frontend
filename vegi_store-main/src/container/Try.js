import React, { useState } from 'react';
import { Container, Row, Col, Table, Button, Card, Form, Modal, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/denisha.css'
import '../styles/Home.css'
import brocolli from '../img/Kassets/Broccoli.png'
import Delete from '../img/Kassets/Delete.png'
import { GoPlus } from 'react-icons/go';
import { FiPlus } from 'react-icons/fi';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as Yup from "yup";

function Addcart() {
    const [show, setShow] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(1);
    // Add state for the applied coupon
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showFirstModal, setShowFirstModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [cart, setCart] = useState([
        { id: 1, name: "Broccoli - Organically Grown", weight: "250 g", price: 35, qty: 1, img: brocolli },
        { id: 2, name: "Carrots - Fresh Farm", weight: "500 g", price: 25, qty: 2, img: brocolli },
        { id: 3, name: "Tomatoes - Organic", weight: "1 kg", price: 40, qty: 1, img: brocolli }
    ]);

    const updateQuantity = (id, type) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, qty: type === "increase" ? item.qty + 1 : Math.max(1, item.qty - 1) } : item
        ));
    };

    const deleteItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // Coupons
    const coupons = [
        { id: 1, code: "WELCOME10", description: "Get Flat $100 Off on cart value of 500 & Above", discount: "$100" },
        { id: 2, code: "FREESHIP50 ", description: "Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet.", discount: "$100" },
        { id: 3, code: "B1G1", description: "Get Flat $100 Off on cart value of 1500 & Above", discount: "$100" }
    ];

    const [couponInput, setCouponInput] = useState(coupons[0].code);


    // Add this function to handle coupon selection
    const handleCouponSelect = (couponId) => {
        setSelectedCoupon(couponId);
        // Find the selected coupon and set its code to the input field
        const selected = coupons.find(coupon => coupon.id === couponId);
        setCouponInput(selected.code);

        // Log the selected coupon code
        console.log("Selected coupon code:", selected.code);
    }

    // Add function to apply the coupon
    const handleApplyCoupon = () => {
        const couponToApply = coupons.find(coupon => coupon.code === couponInput);
        if (couponToApply) {
            setAppliedCoupon(couponToApply);
            handleClose(); // Close the modal
            console.log("Applied coupon:", couponToApply);
        } else {
            console.log("Invalid coupon code");
            // Optional: Show an error message
        }
    }

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
        addressType: Yup.string().oneOf(["Home", "Office", "Other"], "Invalid address type")
    });

    return (
        <div className="Z_cart_container py-4">
            {/* Cart Section */}
            <Row className="mt-4">
                <Col lg={8} sm={12} >
                    {/* Address Section */}
                    <div className="Z_address_box p-3 mb-3 d-flex justify-content-between align-items-center">
                        <span>No saved Addresses</span>
                        <Button type='button' onClick={() => setShowFirstModal(true)} className='d-flex justify-content-center align-items-center gap-1'><FiPlus size={17} /> Add Address</Button>
                    </div>

                    {/* Add Address Modal */}
                    <Modal show={showFirstModal} onHide={() => setShowFirstModal(false)} centered size="lg" className='Z_Add_address'>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Address</Modal.Title>
                        </Modal.Header>

                        <Formik
                            initialValues={{
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
                            onSubmit={(values) => {
                                console.log("Form Submitted", values);
                            }}
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
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
                                                    <Form.Label className="Z_form_label">{label}</Form.Label>
                                                    <Field className="form-control Z_add_fields" name={name} placeholder={label} />
                                                    <ErrorMessage name={name} component="div" className="text-danger" />
                                                </div>
                                            ))}

                                            {/* Save Address as Section */}
                                            <div className="mb-3 gap-4 d-flex align-items-center">
                                                <div className="me-3">
                                                    <Form.Label className="fw-bold">Save Address as</Form.Label>
                                                    <div className="d-flex gap-2">
                                                        {["Home", "Office", "Other"].map((type, idx) => (
                                                            <ToggleButton
                                                                key={idx}
                                                                id={`radio-${type}`}
                                                                type="radio"
                                                                variant="outline-light"
                                                                name="addressType"
                                                                value={type}
                                                                checked={values.addressType === type}
                                                                onChange={() => setFieldValue("addressType", type)}
                                                                className={`px-3 py-2 rounded border ${values.addressType === type ? "border-success text-dark fw-bold" : "border-secondary text-muted"}`}
                                                                style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "100px" }}
                                                            >
                                                                <span
                                                                    className={`d-inline-block rounded-circle border ${values.addressType === type ? "border-success bg-success" : "border-secondary"}`}
                                                                    style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                                >
                                                                    {values.addressType === type && (
                                                                        <span className="bg-white rounded-circle" style={{ width: "8px", height: "8px" }}></span>
                                                                    )}
                                                                </span>
                                                                {type}
                                                            </ToggleButton>
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
                                            Save
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    </Modal>

                    {/* Second Modal */}
                    <Modal show={showSecondModal} onHide={() => setShowSecondModal(false)} centered size="md">
                        <Modal.Header closeButton>
                            <Modal.Title>Second Modal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>This is the second modal that opens differently.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowSecondModal(false)}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* Table */}
                    <div style={{ overflowX: 'auto', maxWidth: '100%' }} className='z_tbl_radius'>
                        <table className="Z_cart-table" style={{ minWidth: '600px' }}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td className="Z_cart-product">
                                            <div className="Z_cart-product-image">
                                                <img src={item.img} alt={item.name} />
                                            </div>
                                            <div className="Z_cart-product-info">
                                                <p>{item.name}</p>
                                                <small>{item.weight}</small>
                                            </div>
                                        </td>
                                        <td>${item.price}</td>
                                        <td>
                                            <div className="Z_cart-quantity">
                                                <button onClick={() => updateQuantity(item.id, "decrease")}>-</button>
                                                <span>{item.qty}</span>
                                                <button onClick={() => updateQuantity(item.id, "increase")}>+</button>
                                            </div>
                                        </td>
                                        <td>${item.price * item.qty}</td>
                                        <td>
                                            <Button className="Z_delete-btn bg-transparent border-0" onClick={() => deleteItem(item.id)}>
                                                <img src={Delete} alt="" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <span>
                        <a href="#" className="Z_continue_shopping text-dark" style={{ borderBottom: '1px solid gray', display: 'inline-block', }}>Continue Shopping</a>
                    </span>
                </Col>

                {/* Coupon & Price Details Section */}
                <Col lg={4} sm={12} >
                    {/* Apply Coupon Section */}
                    {/* Coupon Section */}
                    {!appliedCoupon ? (
                        <div className="Z_coupon_box d-flex justify-content-between align-items-center p-3 mb-2" style={{ cursor: 'pointer', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }} onClick={handleShow}>
                            <span>Apply Coupon</span>
                            <FaArrowRight />
                        </div>
                    ) : (
                        <div className="Z_coupon_box" style={{ border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', marginTop: '10px', marginBottom: '10px' }}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h5 className="m-0" style={{ fontSize: '16px' }}>Applied Coupon</h5>
                                <FaArrowRight />
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <strong style={{ fontSize: '16px', fontWeight: '600' }}>{appliedCoupon.code}</strong>
                                    <span className="text-danger Z_remove_coupon" onClick={() => setAppliedCoupon(null)} style={{ cursor: 'pointer' }}>
                                        Remove
                                    </span>
                                </div>
                                <p className="text-secondary fw-normal mb-1">{appliedCoupon.description}</p>
                                <p className="z_font_bold mb-0">Save {appliedCoupon.discount}</p>
                            </div>
                        </div>
                    )}

                    {/* Coupon Modal */}
                    <Modal show={show} onHide={handleClose} centered className="Z_coupon_modal">
                        <Modal.Header closeButton>
                            <Modal.Title className="Z_modal_title">Select Coupon</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Coupon Input */}
                            <div className="Z_coupon_input d-flex align-items-center">
                                <input
                                    type="text"
                                    className="form-control Z_input_field"
                                    placeholder="Enter Coupon Code"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                />
                                <Button variant="success" className="z_button" onClick={handleApplyCoupon}>Apply</Button>
                            </div>

                            {/* Applicable Coupons List */}
                            <div className="Z_coupon_list mt-3">
                                <h6 className="Z_coupon_heading">Applicable Coupons</h6>

                                {coupons.map((coupon) => (
                                    <label key={coupon.id} className="Z_coupon_item d-flex align-items-start p-3">
                                        <input
                                            type="radio"
                                            name="coupon"
                                            checked={selectedCoupon === coupon.id}
                                            onChange={() => handleCouponSelect(coupon.id)}
                                            className="Z_coupon_radio"
                                        />
                                        <div className="Z_coupon_details ms-2">
                                            <strong className="Z_coupon_code">{coupon.code}</strong>
                                            <p className="Z_coupon_desc">{coupon.description}</p>
                                            <span className="Z_coupon_discount">Save {coupon.discount}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* Price Details Section */}
                    <Card className="Z_price_card mt-3">
                        <Card.Body className='p-0'>
                            {/* Price Details Header */}
                            <div className='Z_Price_Details_head' >
                                Price Details
                            </div>
                            <div className="Z_price_details">
                                <p>Price (3 Items) <span>$105</span></p>
                                <p>Discount <span className="text-success">-$10</span></p>
                                <p>Platform Fee <span>$1</span></p>
                                <p>Delivery Charges <span className="text-success"><s className='text-secondary'>$20</s> FREE</span></p>
                                <hr />
                                <p className="Z_total">Total <span>$96</span></p>
                                <Button variant="success" className="w-100 z_button" >Checkout</Button>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Addcart;
