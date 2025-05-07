import React, { useState, useEffect } from "react";
import { Card, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { createCart, updateCart, getallMyCarts } from '../redux/slices/cart.Slice';
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
import { toast } from "react-toastify";
import { createWishlist, deleteFromWishlist, getWishlistItems } from "../redux/slices/wishlist.Slice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
 
function Bestseller(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading: productLoading } = useSelector((state) => state.product);
  const { variants, loading: variantLoading } = useSelector((state) => state.productveriant);
  const { categories, isLoading: categoryLoading } = useSelector((state) => state.category);
  const { cartItems } = useSelector(state => state.addcart);
  const { wishlistItems } = useSelector(state => state.wishlist);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
 
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductVariants({}));
    dispatch(fetchCategories());
    dispatch(getWishlistItems());
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
  // આ ફંક્શન્સ હટાવી શકાય છે કારણ કે હવે Swiper તેને મેનેજ કરશે
  // handleNext, handlePrev, currentIndex અને auto slide functionality ને હટાવી દો
  const getVisibleProducts = () => {
    if (!products || products.length === 0) return [];
    
    return products
      .filter(product => variants?.some(v => v.productId === product._id))
      .map(product => {
        const variant = variants?.find(v => v.productId === product._id);
        return {
          ...product,
          variantPrice: variant?.price || 0,
          variantDiscount: variant?.discount || 0
        };
      });
  };
 
  const isInWishlist = (productId) => {
    return wishlistItems?.some(item => item.productId === productId);
  };

  if (productLoading || variantLoading) {
    return <div>Loading...</div>;
  }
 
  // Add cart handling functions
  const handleAddToCart = async (product) => {
    try {
      const variant = variants?.find(v => v.productId === product._id);
      if (!variant) {
        toast.error("Product variant not found");
        return;
      }
      console.log(variant._id, "variant._id");
      

      await dispatch(createCart({
        productId: product._id,
        productVarientId: variant._id,
        quantity: 1
      })).unwrap();
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Cart operation failed:", error);
      // Check if error is for existing cart item
      if (error?.message === 'Cart Already Exist') {
        toast.info("Item quantity updated in cart"); // Changed message here
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };



  const handleAddToWishlist = async (productId) => {
    try {
      const isAlreadyInWishlist = isInWishlist(productId);
      if (isAlreadyInWishlist) {
        // If product is already in wishlist, remove it
        const wishlistItem = wishlistItems.find(item => item.productId === productId);
        await dispatch(deleteFromWishlist(wishlistItem._id)).unwrap();
        toast.success('Item removed from wishlist');
      } else {
        // If product is not in wishlist, add it
        await dispatch(createWishlist(productId)).unwrap();
        toast.success('Item added to wishlist');
      }
    } catch (error) {
      toast.error(error.message || 'Wishlist operation failed');
    }
  };
  return (
    <>
      <section className="">
        <div className="a_header_container my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="z_section-title">
              <span className="z_title-dark">Bestsellers </span>
            </h2>
            <Link to="/Vegetable" className="z_view-all-link">
              View All <FaChevronRight className="z_view-all-icon" />
            </Link>


          </div>
 
          <div className="position-relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={6}
              navigation={{
                nextEl: '.x_swiper-button-next',
                prevEl: '.x_swiper-button-prev'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                576: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 6,
                },
              }}
            >
              <div className="x_swiper-button-prev"> <MdKeyboardArrowLeft /></div>
              <div className="x_swiper-button-next"> <MdKeyboardArrowRight /></div>
              {getVisibleProducts().map((product, index) => (
                <SwiperSlide key={index}>
                  <Card className="z_product-card">
                    <div className="z_product-image-container">
                      <Card.Img
                        variant="top"
                        src={`http://localhost:4000/${product.images?.[0]}`}
                        alt={product.productName}
                      />
                      <div className="z_hover-overlay">
                        <div className="z_hover-icons">
                          <button 
                            className="z_hover-icon-btn"
                            onClick={() => handleAddToCart(product)}
                          >
                            <FaShoppingCart />
                          </button>
                          <button 
                            className={`z_hover-icon-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                            onClick={() => handleAddToWishlist(product._id)}
                          >
                            <FaHeart style={{color: isInWishlist(product._id) ? 'red' : 'inherit'}} />
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
                      <Card.Title 
                        className="z_product-title"
                        onClick={() => {
                          localStorage.setItem('selectedProductId', product._id);
                          localStorage.setItem('activePage', 'ProductDetails');
                          navigate(`/product-details/${product._id}`);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {product.productName}
                      </Card.Title>
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
                </SwiperSlide>
              ))}
            </Swiper>
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
