import React, { useEffect, useState } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import { Modal, Offcanvas } from 'react-bootstrap';
import { BiSearch } from "react-icons/bi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { PiGreaterThanBold, PiLessThanBold } from "react-icons/pi";
import { RiFilter2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import '../../styles/sp_style.css'
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getCategory, getProducts, getSingleProduct, updateProductStats } from '../../redux/slices/sellerProductSlice';
import { getAllSubcategories } from '../../redux/slices/Subcategory.slice';

function Product() {
    const [filterOff, setfilterOff] = useState(false);
    const handleClose = () => setfilterOff(false);
    const handleShow = () => setfilterOff(true);
    const [minValue, set_minValue] = useState(0);
    const [maxValue, set_maxValue] = useState(10000);
    const handleInput = (e) => {
        set_minValue(e.minValue);
        set_maxValue(e.maxValue);
        setFilterOption((prev) => ({
            ...prev,
            minPrice: e.minValue,
            maxPrice: e.maxValue,
        }));
    };


    const [deleteId, setDeleteId] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const [updateId, setUpdateId] = useState('');
    const dispatch = useDispatch();
    const productData1 = useSelector((state) => state.sellerProduct.productData);
    const categoryData = useSelector((state) => state.sellerProduct.categoryData);
    const subcategoryData = useSelector((state) => state.subcategory.subcategories);
    // console.log(productData1,"categoryData");

    const [productData, setProductData] = useState([]);
    useEffect(() => {
        // Check if productData1 is an array before processing
        if (!Array.isArray(productData1)) {
            setProductData([]);
            return;
        }

        const product = productData1.flatMap((product, index) => {
            // Check if productVarientData exists and is an array
            if (!product.productVarientData || !Array.isArray(product.productVarientData)) {
                return [];
            }

            return product.productVarientData
                .filter(data => data && data.sellerId === localStorage.getItem('userId'))
                .map((data, id) => ({
                    id: id,
                    image: product.images?.[0] ?? 'default.jpg',
                    productName: product.productName,
                    categoryName: product?.categoryData?.[0]?.categoryName ?? 'Unknown',
                    subcategoryName: product?.subcategoryData?.[0]?.subCategoryName ?? 'Unknown',
                    unit: data.size,
                    status: data?.status || false,
                    price: data.price,
                    variantId: data._id,
                    createdAt: data.createdAt // <-- make sure this exists
                }));
        });
        // Sort by createdAt descending (newest first)
        product.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProductData(product)
    }, [productData1, subcategoryData])
    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategory());
        dispatch(getAllSubcategories());
    }, [dispatch])


    // const [searchQuery, setSearchQuery] = useState('');


    // Handle pagination

    // handling filters 
    const [filterOption, setFilterOption] = useState({
        minPrice: minValue ?? 0,
        maxPrice: maxValue ?? 1000,
        category: '',
        unit: '',
        status: '',
    });

    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    console.log(currentData, "currentData");

    const itemsPerPage = 10;
    useEffect(() => {
        setFilteredData(productData);
    }, [productData, productData1]);
    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOption((prev) => ({ ...prev, [name]: value }));
    };

    // Handle filtering
    const handleFilter = (searchQuery) => {
        // console.log('Applying filter:', productData);
        let filteredData1 = []
        if (searchQuery && searchQuery.length > 0) {
            filteredData1 = productData.filter(product =>
                product?.productName?.toLowerCase().includes(searchQuery?.toLowerCase())
            );
        }
        else {
            filteredData1 = productData;
        }
        if (filterOption.minPrice > 0) {
            filteredData1 = filteredData1.filter(product => product.price >= filterOption.minPrice);
        }
        if (filterOption.maxPrice < 10000) {
            filteredData1 = filteredData1.filter(product => product.price <= filterOption.maxPrice);
        }
        if (filterOption.category) {
            filteredData1 = filteredData1.filter(product => product.categoryName === filterOption.category);
        }
        if (filterOption.unit) {
            filteredData1 = filteredData1.filter(product =>
                product.unit?.toLowerCase().includes(filterOption.unit?.toLowerCase())
            );
        }
        // console.log('filterData', typeof filterOption.status);
        if (filterOption.status) {
            filteredData1 = filteredData1.filter(product => `${product.status}` === filterOption.status);
        }

        // console.log('Filtered Data:', filteredData1);
        setFilteredData(filteredData1);
        setCurrentPage(1); // Reset to first page after filtering
        setfilterOff(false)
    };
    const removefilter = () => {
        setFilterOption({
            minPrice: 0,
            maxPrice: 10000,
            category: '',
            unit: '',
            status: '',
        });
        setFilteredData(productData);
        setCurrentPage(1);
        setfilterOff(false)
    }
    // Update pagination when `filteredData` or `currentPage` changes
    useEffect(() => {
        const total = Math.ceil((filteredData.length ?? 0) / itemsPerPage);
        setTotalPages(total);

        const currentDataSlice = filteredData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        setCurrentData(currentDataSlice);
    }, [filteredData, currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const updateStatus = (id, value) => {
        // console.log('id', id);
        dispatch(updateProductStats({ id, value })).then(() => { dispatch(getProducts()); })

    }

    const handleDeteleProduct = () => {
        setModalShow(false); dispatch(deleteProduct(deleteId)).then(() => { dispatch(getProducts()) })
    }




    return (
        <div className="sp_container">
            <div className="d-xl-flex justify-content-between align-item-center">
                <div ><h4>Product</h4>
                    <Link className='sp_text_grey' to={'/seller/home'}>Dashboard</Link> / <Link>Product</Link>
                </div>
                <div className="sp_filter_both d-flex flex-sm-row flex-column  d-sm-flex align-items-sm-center justify-lg-content-end justify-content-start">
                    <div className="sp_search">
                        <BiSearch className="sp_sear_icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className=""
                            // value={searchQuery}
                            onChange={(e) => { handleFilter(e.target.value) }}
                        />
                    </div>
                    <div className="d-flex justify-content-md-center align-items-sm-center justify-content-between ">
                        <div className="sp_filter_btn sp_linear1 w-sm-auto w-100" onClick={() => { handleShow() }}><RiFilter2Fill className="mx-2" /> Filter</div>
                        {/* <Link to="/admin/add-product" className="sp_add_btn"> */}
                        <Link to="/seller/Add-product" className="sp_add_btn mx-md-2 gap-1 px-2 d-flex justify-content-center  w-sm-auto w-100 align-items-center fw-medium">
                            <span> <FiPlus /> </span>Add
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
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {currentData.length > 0 ?
                        <tbody>
                            {currentData.map((ele, index) => (
                                <tr key={(currentPage - 1) * itemsPerPage + index}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="d-flex align-items-center">
                                        <div className="sp_table_img">
                                            <img src={'http://localhost:4000/' + ele?.image} alt="Product" />
                                        </div>
                                        {ele?.productName}
                                    </td>
                                    <td>{ele?.categoryName}</td>
                                    <td>{ele?.subcategoryName}</td>
                                    <td>{ele?.unit}</td>
                                    <td>${ele?.price}</td>
                                    <td className="sp_status1">
                                        <label className="sp_switch">
                                            <input type="checkbox" checked={ele?.status === true} onChange={(e) => { updateStatus(ele.variantId, e.target.checked) }} />
                                            <span className="slider round"></span>
                                        </label>
                                        <p>{ele.status}</p>
                                    </td>
                                    <td className="sp_td_action">
                                        <div className="d-flex align-items-center">
                                            <Link to={'/seller/viewproducts/' + ele.variantId} className="sp_table_action d-flex justify-content-center align-items-center">
                                                <img src={require('../../img/s_img/view.png')} alt="View" />
                                            </Link>
                                            {/* <Link to={`/seller/Edit-product/` + ele.variantId} className="sp_table_action d-flex justify-content-center align-items-center" >
                                            <img
                                                src={require("../../img/s_img/edit.png")}
                                                alt="Edit Icon"
                                            />
                                        </Link> */}
                                            {/* // ... existing code ... */}
                                            <Link
                                                to={`/seller/Edit-product/` + ele.variantId}
                                                className="sp_table_action d-flex justify-content-center align-items-center"
                                                onClick={() => {
                                                    console.log('Edit row data:', ele); // Log the row data
                                                }}
                                            >
                                                <img src={require("../../img/s_img/edit.png")} alt="Edit Icon" />
                                            </Link>
                                            {/* // ... existing code ... */}
                                            <Link className="sp_table_action d-flex justify-content-center align-items-center" onClick={() => { setModalShow(true), setDeleteId(ele.variantId) }}>
                                                <img src={require('../../img/s_img/delete.png')} alt="Delete" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody> :
                        <div className="sp_404">
                            <div className="d-flex justify-content-center align-items-center">
                                <img src={require('../../img/s_img/404.png')}></img>

                            </div>
                            <h6 className="sp_text_grey">No data Available.</h6>
                        </div>
                    }


                </table>

                {/* Pagination Controls */}
                {filteredData.length > itemsPerPage && (
                    <div className="sp_pagination justify-content-sm-center justify-content-start justify-content-md-end overflow-auto">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FaAngleLeft />
                        </button>

                        {totalPages > 4 && currentPage > 3 && (
                            <>
                                <button onClick={() => setCurrentPage(1)}>1</button>
                                {currentPage > 4 && <button>...</button>}
                            </>
                        )}

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
                                if (totalPages <= 3) {
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

                        {totalPages > 4 && currentPage < totalPages - 2 && (
                            <>
                                {currentPage < totalPages - 3 && <button>...</button>}
                                <button onClick={() => setCurrentPage(totalPages)}>
                                    {totalPages}
                                </button>
                            </>
                        )}

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
            <Offcanvas className="sp_filter_off" show={filterOff} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column justify-content-between">
                    <div>
                        {/* Category Filter */}
                        <div className="sp_filter_select">
                            <p>Category</p>
                            <select name="category" value={filterOption.category} onChange={handleFilterChange}>
                                <option value="">All</option>
                                {categoryData.map((category) => {
                                    return (<option value={category.categoryName}>{category.categoryName}</option>)
                                })}
                            </select>
                        </div>

                        {/* Unit Filter */}
                        <div className="sp_filter_select">
                            <p>Unit</p>
                            <select name="unit" value={filterOption.unit} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="piece">Piece</option>
                                <option value="gram">Gram</option>
                                <option value="kg">KG</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="sp_filter_select">
                            <p>Status</p>
                            <select name="status" value={filterOption.status} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="true">Available</option>
                                <option value="false">Out of Stock</option>
                            </select>
                        </div>

                        {/* Price Range Slider */}
                        <div className="s_price_slider">
                            <MultiRangeSlider
                                min={0}
                                max={1000}
                                step={50}
                                minValue={filterOption.minPrice}
                                maxValue={filterOption.maxPrice}
                                onInput={handleInput}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex align-items-center gap-md-4 justify-content-between">
                        <div className="sp_filter_btn w-sm-50 w-100 mt-0" onClick={removefilter}>Cancel</div>
                        <Link onClick={handleFilter} className="z_button d-flex justify-content-center align-items-center w-50">
                            Apply
                        </Link>
                    </div>
                </Offcanvas.Body>m
            </Offcanvas>


            {/* delete modal  */}
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {/* <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Modal heading
                    </Modal.Title>
                </Modal.Header> */}
                <Modal.Body className='px-5 py-5'>
                    <h5 className='text-center'>Delete Product?</h5>
                    <p className='sp_text_grey  text-center fs-5'>
                        Are you sure you want to delete
                        Product?
                    </p>
                    <div className="d-flex  align-items-center justify-content-evenly pt-4">
                        <div className="sp_filter_btn" onClick={() => setModalShow(false)}>Cancle</div>
                        <Link onClick={() => {
                            handleDeteleProduct()
                        }} className="sp_add_btn">
                            Delete
                        </Link>
                    </div>
                </Modal.Body>

                {/* <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer> */}
            </Modal>

        </div>
    )
}
export default Product;