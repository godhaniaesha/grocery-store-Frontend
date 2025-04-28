import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  AcceptOrder,
  getOrders,
  ReasonsForCancellation,
  RejectOrder,
  SingleOrder,
} from "../../redux/slices/sellerOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import OrderStatusStepper from "../container/OrderStatusStepper";

function ViewOrderHistoryPanding() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [rejectId, setRejectId] = useState("");
  const handleShowModal = (id) => {
    setShowModal(true);
    setRejectId(id);
  };
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    // Fetch order data when the component mounts
    const fetchData = async () => {
      // First fetch all orders
      await dispatch(getOrders());
      // Then fetch reasons and single order
      await dispatch(ReasonsForCancellation());
      await dispatch(SingleOrder(id));
    };

    fetchData(); // Call the async function
  }, [id, dispatch]);

  const orderData = useSelector((state) => state.sellerOrder.sOrder);
  const reasons = useSelector((state) => state.sellerOrder.reason);

  // Check if order data is available before accessing its properties
  if (!orderData || Object.keys(orderData).length === 0) {
    return (
      <Container fluid className="k-container">
        <div className="k-header">
          <h1 className="k-title">Orders</h1>
          <div className="k-breadcrumb">
            <span>Dashboard / Order / </span>
            <span className="k-active">View Order</span>
          </div>
        </div>
        <div className="text-center p-5">Loading order details...</div>
      </Container>
    );
  }

  // Format date for consistency
  const formattedDate = orderData.createdAt
    ? new Date(orderData.createdAt)
        .toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "")
    : "N/A";

  // Calculate total quantity and price
  const totalItems = 1; // We have 1 item in the single order
  const platformFee = 0; // Default platform fee
  const deliveryFee = 20; // Default delivery fee

  // Get item price and calculate total
  const itemPrice = orderData.varient ? orderData.varient.price : 0;
  const itemQuantity = orderData.quantity || 1;
  const itemTotal = itemPrice * itemQuantity;

  // Calculate discount if applicable
  const discount = orderData.coupon ? parseFloat(orderData.coupon.discount) : 0;

  const rejectOrder = (id, reasonId, comments) => {
    dispatch(RejectOrder({ id, reasonId, comments })).then((response) => {
      dispatch(SingleOrder(id));
      if (response.payload.success) {
        handleCloseModal();
      }
    });
  };

  const acceptOrder = (id, status) => {
    dispatch(AcceptOrder({ id, status })).then(() => {
      dispatch(SingleOrder(id));
    });
  };

  const handleRejectOrder = (values) => {
    rejectOrder(rejectId, values.reasonId, values.comments);
  };

  return (
    <>
      <Container fluid className="k-container">
        <div className="k-header">
          <h1 className="k-title">Orders</h1>
          <div className="k-breadcrumb">
            <Link to={"/seller/home"} className="sp_text_grey">
              Dashboard
            </Link>{" "}
            /{" "}
            <Link to={"/seller/order"} className="sp_text_grey">
              Orders
            </Link>{" "}
            /<Link>View Order</Link>
          </div>
        </div>

        <Row className="k-content-row">
          <Col lg={12} xl={9} className="k-order-bg">
            <Card className="k-order-card shadow-none">
              <Card.Body className="k-order-header shadow-none">
                <div className="k-order-info">
                  <h5 className="k-order-number">{orderData.orderId}</h5>
                  <span className="k-order-date">• {formattedDate}</span>
                </div>
                <div className="k-order-actions">
                  {orderData.orderStatus === "Pending" && (
                    <>
                      <div
                        className="sp_btn_green"
                        onClick={() =>
                          acceptOrder(orderData._id.order, "Confirmed")
                        }
                      >
                        Accept
                      </div>
                      <div
                        className="sp_btn_red ms-2"
                        onClick={() => {
                          handleShowModal(orderData.orderId);
                        }}
                      >
                        Reject
                      </div>
                    </>
                  )}
                  {orderData.orderStatus === "Confirmed" && (
                    <div className="sp_btn_green">Accepted</div>
                  )}
                  {orderData.orderStatus === "Cancelled" && (
                    <div className="sp_btn_red">Rejected</div>
                  )}
                  {orderData.orderStatus === "Shipped" && (
                    <div className="sp_btn_green">Shipped</div>
                  )}
                  {orderData.orderStatus === "outForDelivery" ||
                  orderData.orderStatus === "In Progress" ? (
                    <div className="sp_btn_green">Out For Delivery</div>
                  ) : null}
                  {orderData.orderStatus === "Delivered" && (
                    <div className="sp_btn_green">Delivered</div>
                  )}
                </div>
              </Card.Body>
            </Card>

            <Row className="k-address-row">
              <Col md={12} lg={4}>
                <Card className="k-address-card">
                  <Card.Body className="p-0">
                    <h6 className="k-address-title m-0 p-2 ps-3">
                      Shipping Address
                    </h6>
                    <div className="k-address-content p-3">
                      {orderData.user ? (
                        <>
                          <p className="k-name">
                            {orderData.user.firstName} {orderData.user.lastName}
                          </p>
                          {orderData.useraddress ? (
                            <>
                              <p className="k-address">
                                {orderData.useraddress.address1 ||
                                  "No address available"}
                              </p>
                              <p className="k-address">
                                {orderData.useraddress.address2 ||
                                  "No address available"}
                              </p>
                            </>
                          ) : (
                            "No Address data available"
                          )}
                          <p className="k-email">{orderData.user.email}</p>
                          <p className="k-phone">
                            {orderData.user.mobileNo || "+1 56565 56565"}
                          </p>
                        </>
                      ) : (
                        <p className="k-name">No user data available</p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12} lg={4}>
                <Card className="k-address-card">
                  <Card.Body className="p-0">
                    <h6 className="k-address-title m-0 p-2 ps-3">
                      Billing Address
                    </h6>
                    <div className="k-address-content p-3">
                      {orderData.user ? (
                        <>
                          <p className="k-name">
                            {orderData.user.firstName} {orderData.user.lastName}
                          </p>
                          {orderData.useraddress ? (
                            <p className="k-address">
                              {orderData.useraddress.address1 ||
                                "No address available"}
                            </p>
                          ) : (
                            "No address data available"
                          )}
                          <p className="k-email">{orderData.user.email}</p>
                          <p className="k-phone">
                            {orderData.user.mobileNo || "+1 56565 56565"}
                          </p>
                        </>
                      ) : (
                        <p className="k-name">No user data available</p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12} lg={4}>
                {[
                  "Confirmed",
                  "Shipped",
                  "OutForDelivery",
                  "Delivered",
                  "Pending",
                ].includes(orderData.orderStatus) ? (
                  <Card className="k-payment-card">
                    <Card.Body className="p-0">
                      <h6 className="k-payment-title m-0 p-2 ps-3">
                        Payment Details
                      </h6>
                      <div className="k-payment-content p-3">
                        <div className="k-payment-row">
                          <span className="k-payment-label">
                            Payment Status
                          </span>
                          <span
                            className="k-payment-value text-truncate"
                            style={{ color: "green" }}
                          >
                            {orderData.paymentStatus}
                          </span>
                        </div>
                        <div className="k-payment-row">
                          <span className="k-payment-label">
                            Payment Method
                          </span>
                          <span className="k-payment-value text-truncate">
                            {orderData.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ) : orderData.orderStatus === "Cancelled" ? (
                  <Card className="k-payment-card">
                    <Card.Header>
                      <h6 className="k-price-details-title">Reason</h6>
                    </Card.Header>
                    <Card.Body className="k-price-details-body">
                      <div className="k-price-row">
                        <p className="m-0 k-text-gray">
                          {orderData.cancellationInfo.reason ||
                            "No reason provided"}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                ) : null}
              </Col>
            </Row>

            <Card className="k-products-card">
              <Card.Body className="k-products-body">
                <Table responsive className="k-products-table rounded-0">
                  <thead>
                    <tr>
                      <th className="k-product-header">Product</th>
                      <th className="k-price-header">Price</th>
                      <th className="k-quantity-header">Quantity</th>
                      <th className="k-total-header">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="k-product-cell">
                        <div className="k-product-info">
                          <div className="k-product-img-container">
                            {orderData.product &&
                            orderData.product[0] &&
                            orderData.product[0].images ? (
                              <img
                                src={`http://localhost:4000/${orderData.product[0].images[0]}`}
                                alt={
                                  orderData.product[0].productName || "Product"
                                }
                                className="k-product-img"
                              />
                            ) : (
                              <div className="k-product-img-placeholder">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="k-product-details">
                            <p className="k-product-name m-0">
                              {orderData.product && orderData.product[0]
                                ? orderData.product[0].productName
                                : "Unknown Product"}
                            </p>
                            <p className="k-product-weight m-0">
                              {orderData.varient
                                ? orderData.varient.size
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="k-price-cell">
                        ${orderData.varient ? orderData.varient.price : 0}
                      </td>
                      <td className="k-quantity-cell">
                        {orderData.quantity || 1}
                      </td>
                      <td className="k-total-cell">
                        ${orderData.totalPrice || itemTotal}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={12} xl={3}>
            {/* stepper component for order status */}
            <OrderStatusStepper
              orderStatus={orderData.orderStatus}
              orderCreatedAt={orderData.createdAt}
              statusUpdatedAt={orderData.updatedAt}
            />

            <Card className="k-price-details-card rounded-0 mt-5 mt-xl-0">
              <Card.Header className="k-price-details-header">
                <h6 className="k-price-details-title">Price Details</h6>
              </Card.Header>
              <Card.Body className="k-price-details-body">
                <div className="k-price-row">
                  <span className="k-price-label">
                    Price ({totalItems} items)
                  </span>
                  <span className="k-price-value">${itemTotal}</span>
                </div>
                <div className="k-price-row">
                  <span className="k-price-label">Discount</span>
                  <span className="k-price-discount">-${discount}</span>
                </div>
                <div className="k-price-row">
                  <span className="k-price-label">Platform Fee</span>
                  <span className="k-price-value">${platformFee}</span>
                </div>
                <div className="k-price-row">
                  <span className="k-price-label">Delivery Charges</span>
                  <span className="k-delivery-free">
                    <span className="k-delivery-original">${deliveryFee}</span>{" "}
                    FREE
                  </span>
                </div>
                <div className="k-price-row k-price-total-row">
                  <span className="k-price-total-label">Total</span>
                  <span className="k-price-total-value">
                    ${orderData.totalPrice}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* order reject modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="k-reject-order-modal"
      >
        <div className="k-modal-content">
          <div className="k-modal-header">
            <h5 className="k-modal-title">Reject Order</h5>
            <button
              type="button"
              className="k-close-button"
              onClick={handleCloseModal}
            >
              ×
            </button>
          </div>

          <Formik
            initialValues={{ reasonId: "", comments: "" }}
            validationSchema={Yup.object({
              reasonId: Yup.string().required("Reason is required"),
              comments: Yup.string().required("Comments are required"),
            })}
            onSubmit={handleRejectOrder}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="k-modal-body">
                  <Form.Group className="mb-3">
                    <Field
                      as="select"
                      name="reasonId"
                      className="k-select-reason"
                    >
                      <option value="" disabled>
                        Select Reason
                      </option>
                      {reasons.map((res, index) => (
                        <option key={index} value={res._id}>
                          {res.reasonName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="reasonId"
                      component="div"
                      className="error"
                      style={{ color: "red" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Field
                      as="textarea"
                      rows={4}
                      placeholder="Add comments..."
                      className="k-comments-area"
                      name="comments"
                    />
                    <ErrorMessage
                      name="comments"
                      component="div"
                      className="error"
                      style={{ color: "red" }}
                    />
                  </Form.Group>
                </div>

                <div className="k-modal-footer">
                  <Button
                    variant="outline-secondary"
                    onClick={handleCloseModal}
                    className="k-cancel-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    type="submit"
                    className="k-save-button"
                  >
                    Cancel Order
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
}

export default ViewOrderHistoryPanding;
