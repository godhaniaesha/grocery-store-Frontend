import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Offcanvas } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteInventory,
  getInventory,
  SingleInventory,
  updateInventory,
} from "../../redux/slices/sellerInventorySlice";

function Inventory() {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [inventorydelete, setinventorydelete] = useState();
  const [inventorySingleView, setinventorySingleView] = useState();

  const allinventory = useSelector((state) => state.sellerInventory.inventory);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getInventory());
  }, []);

  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Filter data based on search term
    const filtered = allinventory?.filter((item) =>
      item?.productData?.[0]?.productName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase())
    );

    setFilteredData(filtered || []);

    // Calculate total pages
    const totalPagesCount = Math.ceil((filtered?.length || 0) / itemsPerPage);
    setTotalPages(totalPagesCount);

    // Adjust current page if it exceeds the new total pages
    if (currentPage > totalPagesCount && totalPagesCount > 0) {
      setCurrentPage(1);
    }

    // Now slice the data for current page display
    const currentDataSlice = filtered?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setCurrentData(currentDataSlice || []);
  }, [searchTerm, allinventory, currentPage]);

  const handleDelete = (id) => {
    // console.log(id);
    setModalShow(true);
    setinventorydelete(id);
  };

  const confirmDelete = () => {
    dispatch(deleteInventory(inventorydelete)); // Dispatch delete action
    setModalShow(false); // Close modal
  };

  const handleSingleView = (id) => {
    // console.log(id);
    setinventorySingleView(id);
    navigate("/seller/viewinventory/" + id);
    dispatch(SingleInventory(id));
  };

  const handleEdit = (data) => {
    // console.log(data);
    navigate("/seller/editinventory/" + data._id, {
      state: { inventoryData: data },
    });
  };

  return (
    <div className="sp_container">
      <div className="d-lg-flex justify-content-between align-item-center">
        <div>
          <h4>Inventory</h4>
          <Link to={"/seller/home"} className="sp_text_grey">
            Dashboard
          </Link>{" "}
          / <Link>Inventory</Link>
        </div>
        <div className="d-sm-flex align-items-center justify-sm-content-start justify-content-end">
          <div className="sp_search flex-fill">
            <BiSearch className="sp_sear_icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-md-center align-items-center justify-content-between ">
            <Link to="/seller/addinventory" className="sp_add_btn sp_add_btn1">
              + Add
            </Link>
          </div>
        </div>
      </div>
      <div className="sp_table d-flex justify-content-between flex-column">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Unit</th>
              <th>Quality</th>
              <th>Low Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <div className="sp_404">
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src={require("../../img/s_img/404.png")}
                        alt="404 Not Found"
                      />
                    </div>
                    <h6 className="sp_text_grey">No data Available.</h6>
                  </div>
                </td>
              </tr>
            ) : (
              currentData?.map((item, index) => (
                <tr key={(currentPage - 1) * itemsPerPage + index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="d-flex align-items-center">
                    <div className="sp_table_img">
                      <img
                        src={`http://localhost:4000/${item.productData?.[0]?.images?.[0]}`}
                        alt="Product"
                      />
                    </div>
                    {item.productData?.[0]?.productName}
                  </td>
                  <td>{item.productVarientData?.[0]?.size}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <div
                      className={`stock-status text-center ${
                        item.quantity <= 10
                          ? "critical"
                          : item.quantity <= 30
                          ? "low-stock"
                          : "sufficient"
                      }`}
                    >
                      {item.quantity <= 10
                        ? "Critical"
                        : item.quantity <= 30
                        ? "low-stock"
                        : "Sufficient"}
                    </div>
                  </td>
                  <td className="sp_td_action">
                    <div className="d-flex align-items-center">
                      <a
                        href="#"
                        className="sp_table_action d-flex justify-content-center align-items-center"
                        aria-label="View Inventory"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSingleView(item._id);
                        }}
                      >
                        <img
                          src={require("../../img/s_img/view.png")}
                          alt="View Icon"
                        />
                      </a>

                      <div
                        className="sp_table_action d-flex justify-content-center align-items-center"
                        aria-label="Edit Inventory"
                        onClick={() => handleEdit(item)}
                      >
                        <img
                          src={require("../../img/s_img/edit.png")}
                          alt="Edit Icon"
                        />
                      </div>

                      <a
                        href="#"
                        className="sp_table_action d-flex justify-content-center align-items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(item._id);
                        }}
                      >
                        <img
                          src={require("../../img/s_img/delete.png")}
                          alt="Delete Icon"
                        />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredData?.length > itemsPerPage && (
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
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <FaAngleRight />
            </button>
          </div>
        )}
      </div>

      {/* Delete modal */}
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Body className="px-5 py-5">
          <h5 className="text-center">Delete Product?</h5>
          <p className="sp_text_grey px-5 text-center fs-5">
            Are you sure you want to delete Product?
          </p>
          <div className="d-flex align-items-center justify-content-between pt-4">
            <div className="sp_filter_btn" onClick={() => setModalShow(false)}>
              Cancel
            </div>
            <Link onClick={confirmDelete} className="sp_add_btn">
              Delete
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Inventory;
