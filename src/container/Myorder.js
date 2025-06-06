import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/order.Slice';
import { fetchProducts } from '../redux/slices/product.Slice';
import "../styles/x_app.css"
import LoadingSpinner from '../components/LoadingSpinner';

function Myorder(props) {
    const dispatch = useDispatch();
    const { userOrders, loading: orderLoading } = useSelector((state) => state.order);
    const { products, loading: productLoading } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchUserOrders());
        dispatch(fetchProducts());
    }, [dispatch]);

    const getProductDetails = (productId) => {
        return products?.find(product => product._id === productId) || null;
    };

    return (
        <>
            <div className='a_header_container my-4 container'>
                <div className="x_breadcrumb">
                    <span className="x_breadcrumb_item">Home</span>
                    <span className="x_breadcrumb_separator"> | </span>
                    <span className="x_breadcrumb_item x_active">My Orders</span>
                </div>
                <h1 className="x_page_title">My Orders</h1>

                {orderLoading || productLoading ? (
                    <div><LoadingSpinner></LoadingSpinner></div>
                ) : userOrders && userOrders.data ? (
                    userOrders.data.slice().reverse().map((order) => (
                        <div key={order._id} className="x_order_card my-4 p-3 p-md-4 bg-white rounded shadow">
                            <div className="x_order_header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
                                <div>
                                    <h5 className="mb-2 sm_text_x">Order ID: #{order._id}</h5>
                                    <span className="badge bg-success">{order.orderStatus}</span>
                                    {order.coupenData && order.coupenData.length > 0 && (
                                        <div className="text-muted mt-2">
                                            Coupon Applied: {order.coupenData[0].title} 
                                            <small className="d-block d-md-inline ms-md-2">({order.coupenData[0].description})</small>
                                        </div>
                                    )}
                                    {order.addressData && order.addressData.length > 0 && (
                                        <div className="delivery-address mt-2">
                                            <strong>Delivery Address:</strong>
                                            <div className="text-muted">
                                                {order.addressData[0].firstName} {order.addressData[0].lastName}<br />
                                                Phone: {order.addressData[0].phone}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-start text-md-end">
                                    <div className="text-muted">Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                                    <div className="text-muted">Last Updated: {new Date(order.updatedAt).toLocaleDateString()}</div>
                                    <div className="h5 mb-0 mt-2">Total Amount: ₹{order.totalAmount}</div>
                                    {order.platFormFee > 0 && (
                                        <div className="text-muted small">Platform Fee: ₹{order.platFormFee}</div>
                                    )}
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead >
                                        <tr className="table-light text-nowrap" >
                                            <th className="fw-semibold">Products</th>
                                            <th className="fw-semibold">Variant</th>
                                            <th className="fw-semibold">QTY</th>
                                            <th className="fw-semibold">Price per Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => {
                                            const productInfo = order.productData?.find(p => p._id === item.productId);
                                            const variantInfo = order.productVarientData?.find(v => v._id === item.productVarientId);
                                            
                                            return (
                                                <tr key={item._id} className='text-nowrap'>
                                                    <td className="d-flex align-items-center gap-2">
                                                        <img 
                                                            src={`http://localhost:4000/${productInfo?.images[0]}`}
                                                            alt={productInfo?.productName || 'Product'} 
                                                            className="product-thumb " 
                                                            style={{width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px"}} 
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/50';
                                                            }}
                                                        />
                                                        <span className="text-break">{productInfo?.productName || 'Product Unavailable'}</span>
                                                    </td>
                                                    <td className="align-middle">{variantInfo?.size || variantInfo?.weight || 'N/A'} {variantInfo?.unit || ''}</td>
                                                    <td className="align-middle text-nowrap">{item.quantity} items</td>
                                                    <td className="align-middle">₹{variantInfo?.price || item.price || 0}</td>
                                                </tr>
                                            );
                                        })}    
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-info">No orders found</div>
                )}
            </div>
        </>
    );
}

export default Myorder;