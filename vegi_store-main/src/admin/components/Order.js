import React, { useEffect, useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import { Button, Form, Modal, Offcanvas } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { PiGreaterThanBold, PiLessThanBold } from "react-icons/pi";
import { RiFilter2Fill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AcceptOrder,
  getOrders,
  ReasonsForCancellation,
  RejectOrder,
  SingleOrder,
} from "../../redux/slices/sellerOrderSlice";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Order() {
  const [rejectId, setRejectId] = useState("");

  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(10000);
  //   model states and functions
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [tempDate, setTempDate] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const getallOrders = useSelector((state) => state.sellerOrder.orders);
  const reasons = useSelector((state) => state.sellerOrder.reason);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => setfilterOff(false);
  const handleShow = () => setfilterOff(true);

  useEffect(() => {
    dispatch(getOrders());
    dispatch(ReasonsForCancellation());
  }, []);

  const acceptOrder = (id, status) => {
    // console.log(id, status);
    dispatch(AcceptOrder({ id, status })).then(() => {
      dispatch(getOrders());
    });
  };

  const rejectOrder = (id, status, reasonId, comments) => {
    // console.log(id, status, reasonId, comments);
    dispatch(RejectOrder({ id, status, reasonId, comments })).then(
      (response) => {
        dispatch(getOrders());
        // console.log("dispach log", response.payload);

        if (response.payload.success) {
          handleCloseModal();
        }
      }
    );
  };

  const handleSingleView = (id, order) => {
    // console.log("iddddd", id);
    navigate("/seller/view-order/" + id);
    dispatch(SingleOrder(id));
  };

  // console.log("getallOrders", getallOrders);
  // console.log("reasons", reasons);

  const [filterOff, setfilterOff] = useState(false);

  const handleShowModal = (id) => {
    setShowModal(true);
    // console.log("modelId", id);
    setRejectId(id);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  const handleRejectOrder = (values) => {
    // console.log(values);
    rejectOrder(rejectId, "Reject", values.reasonId, values.comments);
  };

  const applyFilters = () => {
    setDate(tempDate);
    setStatus(tempStatus);
    handleClose(); // close the Offcanvas
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = (getallOrders || []).filter((order) => {
    const isDateMatch = date ? order.createdAt.slice(0, 10) === date : true;

    const allowedStatuses = ["Confirmed", "Cancelled", "Pending"];
    const isStatusMatch = status
      ? allowedStatuses.includes(status) && order.orderStatus === status
      : true;

    const fullName = order.user ? `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase()
      : "";

    const isNameMatch = searchTerm
      ? fullName.includes(searchTerm.toLowerCase())
      : true;

    return isDateMatch && isStatusMatch && isNameMatch;
  });
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleCancel = () => {
    setTempDate("");
    setTempStatus("");
    setSearchTerm("");
    setDate("");
    setStatus("");
    handleClose();
  };

  return (
    <>
      <div className="sp_container">
        <div className="d-lg-flex justify-content-between align-item-center">
          <div>
            <h4>Orders</h4>
            <Link to={"/seller/home"} className="sp_text_grey">
              Dashboard
            </Link>{" "}
            / <Link>Orders</Link>
          </div>
          <div className="d-sm-flex align-items-center justify-sm-content-start justify-content-end">
            <div className="sp_search">
              <BiSearch className="sp_sear_icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="d-flex justify-content-md-center align-items-center justify-content-between ">
              <div className="sp_filter_btn sp_linear1" onClick={handleShow}>
                <RiFilter2Fill className="mx-2" /> Filter
              </div>
            </div>
          </div>
        </div>
        <div className="sp_table d-flex justify-content-between flex-column">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer name</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th className="sp_status_col">Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {currentOrders?.length === 0 ? (
              <div className="sp_404">
                <div className="d-flex justify-content-center align-items-center">
                  <img src={require("../../img/s_img/404.png")} alt="404" />
                </div>
                <h6 className="sp_text_grey">No data Available.</h6>
              </div>
            ) : (
              <tbody>
                {currentOrders.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        {item.user?.firstName && item.user?.lastName
                          ? `${item.user.firstName} ${item.user.lastName}`
                          : "-"}
                      </td>
                      <td>
                        {`${new Date(item.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })} (${new Date(item.createdAt).toLocaleString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )})`}
                      </td>
                      <td>{`$${item.totalPrice}`}</td>
                      <td className="d-flex justify-content-between">
                        {item.orderStatus === "Pending" && (
                          <>
                            <div
                              className="sp_btn_green"
                              onClick={() =>
                                acceptOrder(item._id?.order, "Confirmed")
                              }
                            >
                              Accept
                            </div>
                            <div
                              className="sp_btn_red ms-2"
                              onClick={() => handleShowModal(item._id?.order)}
                            >
                              Reject
                            </div>
                          </>
                        )}
                        {[
                          "Confirmed",
                          "Delivered",
                          "outForDelivery",
                          "In Progress",
                          "Shipped",
                        ].includes(item.orderStatus) && (
                          <div className="sp_btn_green">Accepted</div>
                        )}
                        {item.orderStatus === "Cancelled" && (
                          <div className="sp_btn_red">Rejected</div>
                        )}
                      </td>
                      <td className="sp_td_action">
                        <div className="d-flex align-items-center justify-content-end">
                          <div
                            className="sp_table_action d-flex justify-content-center align-items-center"
                            aria-label="View Subcategory"
                            onClick={() =>
                              handleSingleView(item._id?.order)
                            }
                          >
                            <img
                              src={require("../../img/s_img/view.png")}
                              alt="View Icon"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
          {filteredOrders.length > ordersPerPage && (
            <div className="sp_pagination justify-content-center justify-content-md-end">
              {/* Previous button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaAngleLeft />
              </button>

              {/* First page */}
              {totalPages > 4 && currentPage > 3 && (
                <>
                  <button onClick={() => setCurrentPage(1)}>1</button>
                  {currentPage > 4 && <span>...</span>}
                </>
              )}

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  // Show current page and one page before and after
                  if (
                    pageNum === currentPage ||
                    pageNum === currentPage - 1 ||
                    pageNum === currentPage + 1
                  ) {
                    return true;
                  }
                  // Special case for small number of pages
                  if (totalPages <= 5) {
                    return true;
                  }
                  return false;
                })
                .map((pageNum) => (
                  <button
                    key={pageNum}
                    className={currentPage === pageNum ? "active" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

              {/* Last page */}
              {totalPages > 4 && currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span>...</span>}
                  <button onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <FaAngleRight />
              </button>
            </div>
          )}
        </div>
        {/* filter offanavs */}
        <Offcanvas
          className="sp_filter_off"
          show={filterOff}
          onHide={handleClose}
          placement={"end"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filter</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column justify-content-between">
            <div>
              <div className="sp_filter_select">
                <p>Date</p>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                />
              </div>
              <div className="sp_filter_select">
                <p>Status</p>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Accepted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4 justify-content-between ">
              <div className="sp_filter_btn w-50" onClick={handleCancel}>
                Cancel
              </div>
              <Link
                onClick={applyFilters}
                className="z_button w-50 d-flex justify-content-center"
              >
                Apply
              </Link>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      {/* order reject model */}

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
                      {reasons.map((res, index) => {
                        return (
                          <option key={index} value={res._id}>
                            {res.reasonName}
                          </option>
                        );
                      })}
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
export default Order;
