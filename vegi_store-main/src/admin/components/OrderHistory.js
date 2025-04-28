import React, { useState, useEffect } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import { Modal, Offcanvas } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { PiGreaterThanBold, PiLessThanBold } from "react-icons/pi";
import { RiFilter2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getOrders, SingleOrder } from "../../redux/slices/sellerOrderSlice";

function OrderHistory() {
  const [filterOff, setfilterOff] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [payments1, setPayments1] = useState([]);

  const handleClose = () => setfilterOff(false);
  const handleShow = () => setfilterOff(true);
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(10000);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  const dispatch = useDispatch();
  const order = useSelector((state) => state.sellerOrder.orders || []);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(order || []);
  }, [order]);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery]);

  const handleGetId = (id) => {
    navigate("/seller/view-order-history-panding/" + id);
    dispatch(SingleOrder(id));
  };
  
  const applyFilters = () => {
    const filteredOrders = (order || []).filter((orders) => {
      // Safely check for properties before accessing them
      const dateMatch = filterDate
        ? new Date(orders.createdAt).toDateString() ===
          new Date(filterDate).toDateString()
        : true;

      // Updated to match the new structure
      const methodMatch = filterMethod
        ? orders.paymentMethod === filterMethod
        : true;

      const statusMatch = filterStatus
        ? orders.paymentStatus === filterStatus
        : true;

      const orderStatusMatch = orderStatus
        ? orders.orderStatus === orderStatus
        : true;

      // Updated search to match new structure
      const searchMatch = searchQuery
        ? (orders?.user
            ? (
                orders.user?.firstName +
                " " +
                orders.user?.lastName
              )
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
            : false) ||
          (orders?.paymentMethod
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          orders?.totalPrice?.toString().includes(searchQuery) ||
          orders?.paymentStatus
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      return (
        dateMatch &&
        methodMatch &&
        statusMatch &&
        orderStatusMatch &&
        searchMatch
      );
    });

    if (JSON.stringify(filteredOrders) !== JSON.stringify(orders)) {
      setOrders(filteredOrders);
    }
  };

  const resetFilters = () => {
    setFilterDate("");
    setFilterMethod("");
    setFilterStatus("");
    setOrderStatus("");
    handleClose();
  };
  
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    applyFilters();
  };

  // pagination code
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  
  useEffect(() => {
    const total = Math.ceil((orders?.length ?? 0) / itemsPerPage);
    setTotalPages(total);

    const currentDataSlice = orders?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setCurrentData(currentDataSlice || []);
  }, [orders, currentPage]);
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  return (
    <div className="sp_container">
      <div className="d-lg-flex justify-content-between align-item-center">
        <div>
          <h4>Order History</h4>
          <Link to={"/seller/home"} className="sp_text_grey">
            Dashboard
          </Link>{" "}
          / <Link>Order History </Link>
        </div>
        <div className="d-sm-flex align-items-center justify-sm-content-start justify-content-end">
          <div className="sp_search flex-fill">
            <BiSearch className="sp_sear_icon" />
            <input
              type="text"
              placeholder="Search..."
              className=""
              onChange={handleInputChange}
            />
          </div>
          <div className="d-flex justify-content-md-center align-items-center justify-content-between ">
            <button
              className="btn sp_filter_btn sp_filter_btn1 sp_linear1 border-no"
              onClick={handleShow}
            >
              <RiFilter2Fill className="mx-2" /> Filter
            </button>
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
              <th>Payment method</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!currentData || currentData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <div className="sp_404">
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src={require("../../img/s_img/404.png")}
                        alt="No Data"
                      />
                    </div>
                    <h6 className="sp_text_grey">No data Available.</h6>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((order, index) => {
                const formattedDate = order?.createdAt
                  ? new Date(order?.createdAt)
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

                let dt;
                if (order.paymentStatus === "Success" || order.paymentStatus === "Received") {
                  dt = "sp_btn_green";
                }
                if (order.paymentStatus === "not Received" || order.paymentStatus === "Failed") {
                  dt = "sp_btn_red";
                }

                let orderColor;
                if (order.orderStatus === "Pending") {
                  orderColor = "sp_btn_yellow";
                }
                if (order.orderStatus === "Confirmed") {
                  orderColor = "sp_btn_green";
                }
                if (order.orderStatus === "Shipped") {
                  orderColor = "sp_btn_green";
                }
                if (order.orderStatus === "outForDelivery") {
                  orderColor = "sp_btn_red";
                }
                if (order.orderStatus === "Delivered") {
                  orderColor = "sp_btn_green";
                }
                if (order.orderStatus === "Cancelled") {
                  orderColor = "sp_btn_red";
                }

                return (
                  <tr key={order._id?.order || order._id}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {order?.user?.firstName && order?.user?.lastName
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : "-"}
                    </td>
                    <td>{formattedDate}</td>
                    <td className="text-center">
                      {order?.paymentMethod || "-"}
                    </td>
                    <td className="text-center">
                      <div>${order?.totalPrice || order?.totalAmount || "-"}</div>
                    </td>
                    <td>
                      {order?.paymentStatus ? (
                        <div className={`${dt}`} style={{ width: "100px" }}>
                          {order?.paymentStatus || "-"}
                        </div>
                      ) : (
                        <p className="text-center">-</p>
                      )}
                    </td>
                    <td>
                      <div className={`${orderColor}`}>
                        {order?.orderStatus || "-"}
                      </div>
                    </td>
                    <td className="sp_td_action">
                      <div
                        className="d-flex align-items-center justify-content-end"
                        onClick={() => handleGetId(order._id?.order || order._id, order)}
                      >
                        <div
                          className="sp_table_action d-flex justify-content-center align-items-center"
                          aria-label="View Order Details"
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
              })
            )}
          </tbody>
        </table>
        {totalPages > 0 && (
          <div className="sp_pagination justify-content-center justify-content-md-end">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaAngleLeft />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaAngleRight />
            </button>
          </div>
        )}
      </div>
      {/* filter offcanvas */}
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
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              ></input>
            </div>
            <div className="sp_filter_select">
              <p>Payment Method</p>
              <select
                onChange={(e) => setFilterMethod(e.target.value)}
                value={filterMethod}
              >
                <option value="">All</option>
                <option value="Cod">Cash on Delivery</option>
                <option value="Card">Credit Card / Debit Card</option>
                <option value="Net Banking">Net banking</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div className="sp_filter_select">
              <p>Payment Status</p>
              <select
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
              >
                <option value="">All</option>
                <option value="Success">Success</option>
                <option value="Received">Received</option>
                <option value="not Received">Not Received</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div className="sp_filter_select">
              <p>Order Status</p>
              <select
                onChange={(e) => setOrderStatus(e.target.value)}
                value={orderStatus}
              >
                <option value="">All</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancel</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="outForDelivery">Out For Delivery</option>
              </select>
            </div>
          </div>

          <div className="d-flex  align-items-center gap-4 justify-content-between ">
            <div
              className="sp_filter_btn w-50"
              onClick={() => {
                handleClose();
                resetFilters();
              }}
            >
              Cancel
            </div>
            <Link
              onClick={() => {
                handleClose();
                applyFilters();
              }}
              className="z_button w-50 d-flex justify-content-center"
            >
              Apply
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default OrderHistory;