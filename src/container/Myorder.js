import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/order.Slice';
import { fetchProducts } from '../redux/slices/product.Slice';
import "../styles/x_app.css"

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
            <div className='a_header_container my-4'>
                <div className="x_breadcrumb">
                    <span className="x_breadcrumb_item">Home</span>
                    <span className="x_breadcrumb_separator"> | </span>
                    <span className="x_breadcrumb_item x_active">My Orders</span>
                </div>
                <h1 className="x_page_title">My Orders</h1>


                {orderLoading || productLoading ? (
                    <div>Loading...</div>
                ) : userOrders && userOrders.data ? (
                    userOrders.data.map((order) => (
                        <div key={order._id} className="x_order_card my-4 p-4 bg-white rounded shadow">
                            <div className="x_order_header d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="mb-1">Order ID: #{order._id}</h5>
                                    <span className="badge bg-success">{order.orderStatus || order.status}</span>
                                    {order.coupenId && <div className="text-muted mt-1">Coupon Applied: #{order.coupenId}</div>}
                                </div>
                                <div className="text-end">
                                    <div className="text-muted">Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                                    <div className="text-muted">Last Updated: {new Date(order.updatedAt).toLocaleDateString()}</div>
                                    <div className="h5 mb-0">SAR {order.totalAmount}</div>
                                    {order.platFormFee > 0 && <div className="text-muted small">Platform Fee: SAR {order.platFormFee}</div>}
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Products</th>
                                            <th>Price per Unit</th>
                                            <th>QTY</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item._id}>
                                                <td className="d-flex align-items-center gap-2">
                                                    <img 
                                                        src={getProductDetails(item.productId)?.images[0] || 'https://via.placeholder.com/50'} 
                                                        alt={getProductDetails(item.productId)?.productName || 'Product'} 
                                                        className="product-thumb" 
                                                        style={{width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px"}} 
                                                    />
                                                    <span>{getProductDetails(item.productId)?.productName || 'Product Unavailable'}</span>
                                                </td>
                                                <td>SAR {item.price || 0}</td>
                                                <td>{item.quantity || 0} items</td>
                                            </tr>
                                        ))}    
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No orders found</div>
                )}
                </div>
            </>
            );
}

            export default Myorder;