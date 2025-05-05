import React, { useState, useEffect } from "react";
import { Card, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { fetchCategories } from '../redux/slices/categorySlice';
import {
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaStar,
  FaTimes,
  FaMinus,
  FaPlus,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
 
function Bestseller(props) {
  const dispatch = useDispatch();
  const { products, loading: productLoading } = useSelector((state) => state.product);
  const { variants, loading: variantLoading } = useSelector((state) => state.productveriant);
  const { categories, isLoading: categoryLoading } = useSelector((state) => state.category);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
 
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductVariants({}));
    dispatch(fetchCategories());
  }, [dispatch]);
 
  const handleClose = () => {
    setModalShow(false);
    setTimeout(() => {
      setShowModal(false);
      setQuantity(1);
    }, 200);
  };
 
  const handleShow = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setQuantity(1);
    setTimeout(() => setModalShow(true), 100);
  };
 
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
 
  // Function to navigate to the next slide
  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to the beginning
    }
  };
 
  // Function to navigate to the previous slide
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(products.length - 1); // Loop to the end
    }
  };
 
  // Auto slide functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);
 
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`z_star ${index < rating ? "z_star-filled" : ""}`}
      />
    ));
  };
 
  // Function to get the current visible products (6 at a time)
  const getVisibleProducts = () => {
    if (!products || products.length === 0) return [];
   
    // Create a circular array by duplicating products
    const extendedProducts = [...products, ...products];
   
    // Filter products that have variants and map them with variant data
    const productsWithVariants = extendedProducts
      .filter(product => variants?.some(v => v.productId === product._id))
      .map(product => {
        const variant = variants?.find(v => v.productId === product._id);
        return {
          ...product,
          variantPrice: variant?.price || 0,
          variantDiscount: variant?.discount || 0
        };
      });
 
    // Start from the current index and take 6 products
    return productsWithVariants.slice(currentIndex, currentIndex + 6);
  };
 
  if (productLoading || variantLoading) {
    return <div>Loading...</div>;
  }
 
  return (
    <>
      <section>
        <div className="a_header_container my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="z_section-title">
              <span className="z_title-dark">Bestsellers </span>
            </h2>
            <Link to="/Vegetable" className="z_view-all-link">
              View All <FaChevronRight className="z_view-all-icon" />
            </Link>


          </div>
 
          <div className="position-relative z_product-carousel-container">
            <button
              className="z_carousel-control z_carousel-prev"
              onClick={handlePrev}
            >
              <FaChevronLeft className="z_carousel-icon" />
            </button>
 
            <div className="z_product-slider-container">
              <div
                className="z_product-slider"
                style={{
                  transform: `translateX(0)`,
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <div className="row my-2">
                  {getVisibleProducts().map((product, index) => (
                    <div key={index} className="col-lg-2 col-md-4 col-sm-6">
                      <Card className="z_product-card">
                        <div className="z_product-image-container">
                          <Card.Img
                            variant="top"
                            src={`http://localhost:4000/${product.images?.[0]}`}
                            alt={product.productName}
                          />
                          <div className="z_hover-overlay">
                            <div className="z_hover-icons">
                              <button className="z_hover-icon-btn">
                                <FaShoppingCart />
                              </button>
                              <button className="z_hover-icon-btn">
                                <FaHeart />
                              </button>
                              <button
                                className="z_hover-icon-btn"
                                onClick={() => handleShow(product)}
                              >
                                <FaEye />
                              </button>
                            </div>
                          </div>
                          <div className="Z_black-ribbon">
                                                -{product.variantDiscount}
                                            </div>
                        </div>
                        <Card.Body className="z_card-body">
                          <div className="z_rating-container">
                            {renderStars(4.5)}
                            <span className="z_rating-text">
                              (4.5)
                            </span>
                          </div>
                          <Card.Title className="z_product-title">
                            {product.productName}
                          </Card.Title>
                          {/* <Card.Text className="z_product-subtitle">
                            {product.description}
                          </Card.Text> */}
                          <div className="z_price-container">
                            <span className="z_current-price">
                              ${product.variantPrice || 0}
                            </span>
                            <span className="z_original-price">
                              ${((product.variantPrice || 0) * 1.2).toFixed(2)}
                            </span>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            <button
              className="z_carousel-control z_carousel-next"
              onClick={handleNext}
            >
              <FaChevronRight className="z_carousel-icon" />
            </button>
          </div>
        </div>
 
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <Modal.Body className="p-0 position-relative">
            {selectedProduct && (
              <>
                <button onClick={handleClose} className="z_modal-close-btn">
                  <FaTimes className="z_modal-close-icon" />
                </button>
                <div className="row g-0">
                  <div className="col-md-6 position-relative">
                    <div className="modal-img-wrapper">
                      <img
                        src={`http://localhost:4000/${selectedProduct.images?.[0]}`}
                        alt={selectedProduct.productName}
                        className="z_modal-product-img"
                      />
                      <span className="z_modal-discount-badge">
                        -{selectedProduct.variantDiscount}%
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="z_modal-content">
                      <h3 className="mb-3">{selectedProduct.productName}</h3>
 
                      <div className="z_rating-container mb-4">
                        {renderStars(4.5)}
                        <span className="z_rating-text ms-2">
                          (4.5 customer review)
                        </span>
                      </div>
 
                      <div className="mb-4">
                        <div className="d-flex align-items-center gap-2">
                          <span className="h3 mb-0">
                            ${selectedProduct.variantPrice?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-decoration-line-through text-muted">
                            ${((selectedProduct.variantPrice || 0) * 1.2).toFixed(2)}
                          </span>
                        </div>
                      </div>
 
                      <p className="text-muted mb-4">
                        {selectedProduct.description}
                      </p>
 
                      <div className="z_modal-quantity-container">
                        <div className="z_modal-quantity-selector">
                          <button
                            className="z_modal-quantity-btn"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity === 1}
                          >
                            <FaMinus size={12} />
                          </button>
 
                          <span className="z_modal-quantity-number">
                            {quantity}
                          </span>
 
                          <button
                            className="z_modal-quantity-btn"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity === 10}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
 
                        <button className="z_modal-add-cart-btn">
                          Add to cart
                          <FaShoppingCart className="z_cart-icon" />
                        </button>
                      </div>
 
                      <div className="z_modal-details">
                        <div className="z_modal-details-item">
                          <span className="z_modal-details-label">SKU:</span>
                          <span className="z_modal-details-value">
                            {selectedProduct._id || "9852434"}
                          </span>
                        </div>
                        <div className="z_modal-details-item">
                          <span className="z_modal-details-label">
                            Category:
                          </span>
                          <span className="z_modal-details-value">
                            {categories.find(cat => cat._id === selectedProduct.categoryId)?.categoryName || 'Uncategorized'}
                          </span>
                        </div>
                        <div className="z_modal-details-item">
                          <span className="z_modal-details-label">Brand:</span>
                          <span className="z_modal-details-value">
                            {selectedProduct.brand || 'Premium Collection'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
}
 
export default Bestseller;