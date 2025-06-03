import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Z_style.css';
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { createCart, updateCart, getallMyCarts } from '../redux/slices/cart.Slice';
import { createWishlist, deleteFromWishlist, getWishlistItems } from "../redux/slices/wishlist.Slice";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function Recommended() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const dispatch = useDispatch();

    const { categories } = useSelector(state => state.category);
    const { products } = useSelector(state => state.product);

    const { variants } = useSelector(state => state.productveriant);
    const { cartItems = [] } = useSelector(state => state.addcart || {});
    const { wishlistItems } = useSelector(state => state.wishlist);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
        dispatch(fetchProductVariants({}));
        dispatch(getWishlistItems());
        dispatch(getallMyCarts());

        const savedCategoryName = localStorage.getItem('selectedCategoryNameR');
        if (savedCategoryName) {
            setSelectedCategory(savedCategoryName);
        }
    }, [dispatch]);

    const handleCategoryChange = (category) => {
        const categoryId = category === 'All' ? 'All' : categories.find(cat => cat.categoryName === category)?._id;
        setSelectedCategory(category);
        localStorage.setItem('selectedCategoryR', categoryId);
        localStorage.setItem('selectedCategoryNameR', category);
    };

    const formattedProducts = React.useMemo(() => {
        if (!products || !variants) return [];
        return products
            .filter(product => variants.some(v => v.productId === product._id))
            .map(product => {
                const variant = variants.find(v => v.productId === product._id);
                const price = variant?.price || 0;
                const discountPrice = variant?.discountPrice || price;
                const discountPercentage = price > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

                return {
                    id: product._id,
                    title: product.productName || 'Product Name Not Available',
                    subtitle: variant?.categoryData?.[0]?.categoryName || product.categoryId?.categoryName || 'Uncategorized',
                    image: product.images?.[0] || '',
                    category: variant?.categoryData?.[0]?.categoryName || product.categoryId?.categoryName || 'Uncategorized',
                    categoryId: product.categoryId || null,
                    price: price,
                    originalPrice: discountPrice,
                    variantDiscount: `${discountPercentage}%`,
                    rating: 4.5,
                    description: product.description || '',
                    stockStatus: variant?.stockStatus ?? true
                };
            });
    }, [products, variants]);

    const filteredProducts = React.useMemo(() => {
        if (selectedCategory === 'All') return formattedProducts;
        return formattedProducts.filter(product =>
            product.category === selectedCategory ||
            product.subtitle === selectedCategory
        );
    }, [formattedProducts, selectedCategory]);

    const handleClose = () => {
        setModalShow(false);
        setTimeout(() => {
            setShowModal(false);
            setQuantity(1);
        }, 200);
    };

    const handleShow = (product) => {
        const variant = variants?.find(v => v.productId === product.id);
        const existingCartItem = cartItems?.find(item =>
            item.productId === product.id
        );

        console.log(cartItems, "existingCartItem");

        setQuantity(existingCartItem?.quantity || 1);

        setSelectedProduct(product);
        setShowModal(true);
        setTimeout(() => setModalShow(true), 100);
    };

    const handleQuantityChange = (value) => {
        const newQuantity = quantity + value;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const categoryDisplayNames = {
        'All': 'All',
        ...Object.fromEntries(categories.map(cat => [
            cat.categoryName,
            cat.categoryName.split(' ')[0]
        ]))
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={`z_star ${index < rating ? 'z_star-filled' : ''}`} />
        ));
    };

    const isInWishlist = (productId) => {
        return wishlistItems?.some(item => item.productId === productId);
    };

    const handleAddToCart = async (product) => {
        try {
            const variant = variants?.find(v => v.productId === product.id);
            if (!variant) {
                toast.error("Product variant not found");
                return;
            }

            const existingCartItem = cartItems?.find(item =>
                item.productId === product.id &&
                item.productVarientId === variant._id
            );

            const newQuantity = quantity;

            if (existingCartItem) {
                await dispatch(updateCart({
                    cartId: existingCartItem._id,
                    productId: product.id,
                    productVarientId: variant._id,
                    quantity: newQuantity
                })).unwrap();
            } else {
                await dispatch(createCart({
                    productId: product.id,
                    productVarientId: variant._id,
                    quantity: newQuantity
                })).unwrap();
            }

            await dispatch(getallMyCarts());
            toast.success("Item added to cart");
            handleClose();
        } catch (error) {
            toast.error(error.message || "Failed to add to cart");
        }
    };

    const handleAddToWishlist = async (productId) => {
        try {
            const isAlreadyInWishlist = isInWishlist(productId);
            if (isAlreadyInWishlist) {
                const wishlistItem = wishlistItems.find(item => item.productId === productId);
                await dispatch(deleteFromWishlist(wishlistItem._id)).unwrap();
                toast.success('Item removed from wishlist');
            } else {
                await dispatch(createWishlist(productId)).unwrap();
                toast.success('Item added to wishlist');
            }
        } catch (error) {
            toast.error(error.message || 'Wishlist operation failed');
        }
    };

    return (
        <>
            <div className="a_header_container mt-5">
                <div className="d-flex flex-lg-row flex-column justify-content-between align-items-center x_filter_btn mb-4">
                    <h2 className="z_section-title mb-4">
                        <span className="z_title-highlight">Recommended</span>
                        {' '}
                        <span className="z_title-dark">For you</span>
                    </h2>
                    <div className="d-flex gap-3 mb-md-3 flex-wrap">
                        {['All', ...categories.map(cat => cat.categoryName)].map((category, index) => (
                            <button
                                key={index}
                                className={`z_category_btn ${selectedCategory === category ? 'z_category_btn_active' : 'z_category_btn_inactive'}`}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {categoryDisplayNames[category] || category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="row">
                    {filteredProducts.map((product, index) => (
                        <div key={index} className="col-xl-2 col-lg-4 col-md-3 col-sm-6 mb-4">
                            <Card className="z_product-card">
                                <div className="z_product-image-container">
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:4000/${product.image}`}
                                        alt={product.title}
                                    />
                                    <div className="z_hover-overlay">
                                        <div className="z_hover-icons">
                                            <button className="z_hover-icon-btn" onClick={() => handleAddToCart(product)}>
                                                <FaShoppingCart />
                                            </button>
                                            <button className={`z_hover-icon-btn ${isInWishlist(product.id) ? 'active' : ''}`} onClick={() => handleAddToWishlist(product.id)}>
                                                <FaHeart style={{ color: isInWishlist(product.id) ? 'red' : 'inherit' }} />
                                            </button>
                                            <button className="z_hover-icon-btn" onClick={() => handleShow(product)}>
                                                <FaEye />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="Z_black-ribbon">{product.variantDiscount}</div>
                                </div>
                                <Card.Body className="z_card-body">
                                    <div className="z_rating-container">
                                        {renderStars(product.rating)}
                                        <span className="z_rating-text">({product.rating})</span>
                                    </div>
                                    <Card.Title className="z_product-title" style={{ cursor: "pointer" }} onClick={() => {
                                        localStorage.setItem('selectedProductId', product.id);
                                        navigate(`/product-details/${product.id}`);
                                    }}>{product.title}</Card.Title>
                                    <Card.Text className="z_product-subtitle">{product.subtitle}</Card.Text>
                                    <div className="z_price-container">
                                        <span className="z_current-price">${product.price.toFixed(2)}</span>
                                        <span className="z_original-price">${product.originalPrice.toFixed(2)}</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} size="lg" centered className="p-0">
                <Modal.Body className="p-0 position-relative">
                    {selectedProduct && (
                        <>
                            <button onClick={handleClose} className="z_modal-close-btn">
                                <FaTimes className="z_modal-close-icon" />
                            </button>
                            <div className="row g-0 p-0">
                                <div className="col-md-6 position-relative p-0">
                                    <div className="modal-img-wrapper">
                                        <img
                                            src={`http://localhost:4000/${selectedProduct.images?.[0]}`}
                                            alt={selectedProduct.productName}
                                            className="z_modal-product-img"
                                        />
                                        <span className="z_modal-discount-badge">
                                            {selectedProduct.variantDiscount}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="z_modal-content">
                                        <h4 className="mb-3">{selectedProduct.productName}</h4>

                                        {/* <div className="z_rating-container mb-4">
                                    {renderStars(4.5)}
                                    <span className="z_rating-text ms-2">
                                      (4.5 customer review)
                                    </span>
                                  </div> */}

                                        <div className="mb-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="h5 mb-0">
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

                                        {/* // In the Modal section, update the quantity display: */}
                                        <div className="z_modal-quantity-container">
                                            <div className="z_modal-quantity-selector">
                                                <button
                                                    className="z_modal-quantity-btn"
                                                    onClick={() => handleQuantityChange(-1)}
                                                    disabled={quantity === 1}
                                                >
                                                    <FaMinus size={12} />
                                                </button>

                                                <div className="d-flex flex-column align-items-center">
                                                    <span className="z_modal-quantity-number">
                                                        {quantity}
                                                    </span>
                                                    {/* {selectedProduct.cartQuantity > 0 && (
                                          // <small className="text-muted" style={{fontSize: '0.75rem'}}>
                                          //    {selectedProduct.cartQuantity}
                                          // </small>
                                        )} */}
                                                </div>

                                                <button
                                                    className="z_modal-quantity-btn"
                                                    onClick={() => handleQuantityChange(1)}
                                                    disabled={quantity === 10}
                                                >
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>

                                            <button
                                                className="z_modal-add-cart-btn"
                                                onClick={() => handleAddToCart(selectedProduct)}
                                            >
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
        </>
    );
}

export default Recommended;
