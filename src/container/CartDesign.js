import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function CartDesign() {
    const [selectedShipping, setSelectedShipping] = useState('free');

    return (
        <>
            <section className="Z_cart_container py-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="Z_address_box p-3 mb-4">
                                <span>Deliver to: </span>
                                <button className="Z_button ms-2">Change Address</button>
                            </div>
                            <div className="z_tbl_radius">
                                <table className="Z_cart-table">
                                    <thead>
                                        <tr>
                                            <th>Products</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="Z_cart-product">
                                                    <div className="Z_cart-product-image">
                                                        <img src="product-image.jpg" alt="V-neck cotton T-shirt" />
                                                    </div>
                                                    <div className="Z_cart-product-info">
                                                        <p>V-neck cotton T-shirt</p>
                                                        <small>Blue, XL</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>$60.00</td>
                                            <td>
                                                <div className="Z_cart-quantity">
                                                    <button>-</button>
                                                    <span>1</span>
                                                    <button>+</button>
                                                </div>
                                            </td>
                                            <td>$60.00</td>
                                            <td>
                                                <button className="Z_delete_btn">
                                                    <FaTimes className="text-danger" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="Z_coupon_box mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <input type="text" className="Z_input_field" placeholder="Add voucher discount" />
                                    <button className="Z_apply_code_btn">Apply Code</button>
                                </div>
                                <div className="Z_coupon_list">
                                    <div className="Z_coupon_item">
                                        <div className="Z_coupon_info">
                                            <div className="Z_discount_text">Discount</div>
                                            <div className="Z_discount_amount">10% OFF</div>
                                            <div className="Z_discount_condition">For all orders from 200$</div>
                                            <div className="Z_coupon_code">MO234231</div>
                                        </div>
                                        <button className="Z_apply_code_btn">Apply Code</button>
                                    </div>
                                    
                                    <div className="Z_coupon_item active">
                                        <div className="Z_coupon_info">
                                            <div className="Z_discount_text">Discount</div>
                                            <div className="Z_discount_amount">10% OFF</div>
                                            <div className="Z_discount_condition">For all orders from 200$</div>
                                            <div className="Z_coupon_code">MO234231</div>
                                        </div>
                                        <button className="Z_apply_code_btn">Apply Code</button>
                                    </div>
                                    
                                    <div className="Z_coupon_item">
                                        <div className="">
                                            <div className="Z_coupon_left">
                                                <div className="Z_discount_text">Discount</div>
                                                <div className="Z_discount_amount">10% OFF</div>
                                                <div className="Z_discount_condition">For all orders from 200$</div>
                                                <div className="Z_coupon_code">MO234231</div>
                                            </div>
                                            <button className="Z_apply_code_btn">Apply Code</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="Z_price_card">
                                <div className="Z_Price_Details_head">
                                    Order Summary
                                </div>
                                <div className="Z_price_details">
                                    <p>
                                        <span>Subtotal</span>
                                        <span>-$80.00</span>
                                    </p>
                                    <p>
                                        <span>Discounts</span>
                                        <span>-$80.00</span>
                                    </p>
                                    <p>
                                        <span>Shipping</span>
                                        <div>
                                            <div className="form-check">
                                                <input 
                                                    type="radio" 
                                                    className="form-check-input" 
                                                    name="shipping" 
                                                    id="free" 
                                                    checked={selectedShipping === 'free'}
                                                    onChange={() => setSelectedShipping('free')}
                                                />
                                                <label className="form-check-label" htmlFor="free">Free Shipping $0.00</label>
                                            </div>
                                            <div className="form-check">
                                                <input 
                                                    type="radio" 
                                                    className="form-check-input" 
                                                    name="shipping" 
                                                    id="local"
                                                    checked={selectedShipping === 'local'}
                                                    onChange={() => setSelectedShipping('local')}
                                                />
                                                <label className="form-check-label" htmlFor="local">Local: $35.00</label>
                                            </div>
                                            <div className="form-check">
                                                <input 
                                                    type="radio" 
                                                    className="form-check-input" 
                                                    name="shipping" 
                                                    id="flat"
                                                    checked={selectedShipping === 'flat'}
                                                    onChange={() => setSelectedShipping('flat')}
                                                />
                                                <label className="form-check-label" htmlFor="flat">Flat Rate: $35.00</label>
                                            </div>
                                        </div>
                                    </p>
                                    <hr />
                                    <p className="Z_total">
                                        <span>Total</span>
                                        <span>$186.99</span>
                                    </p>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="terms" />
                                        <label className="form-check-label" htmlFor="terms">
                                            I agree with the Terms And Conditions
                                        </label>
                                    </div>
                                    <button className="Z_button w-100 mt-3">Process To Checkout</button>
                                    <div className="text-center mt-3">
                                        <a href="#" className="Z_continue_shopping">Or continue shopping</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CartDesign;