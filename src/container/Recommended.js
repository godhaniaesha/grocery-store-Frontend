import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Z_style.css';
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
 
function Recommended(props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const dispatch = useDispatch();
 
    // Get data from Redux store
    const { categories, isLoading: categoryLoading } = useSelector(state => state.category);
    const { products, loading: productLoading } = useSelector(state => state.product);
    const { variants, loading: variantLoading } = useSelector(state => state.productveriant);
 
    const handleCategoryChange = (category) => {
        console.log('Category changed to:', category);
        const categoryId = category === 'All' ? 'All' : categories.find(cat => cat.categoryName === category)?._id;
        setSelectedCategory(category);
        localStorage.setItem('selectedCategoryR', categoryId);
    };
 
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
        dispatch(fetchProductVariants({}));
 
        // Load selected category from localStorage on component mount
        const savedCategory = localStorage.getItem('selectedCategoryR');
        if (savedCategory) {
            setSelectedCategory(savedCategory);
        }
    }, [dispatch]);
 
    // Format products with their variants
    const formattedProducts = React.useMemo(() => {
        if (!products || !variants) return [];
 
        console.log("products,variants", products, variants);
        return products
            .filter(product => variants.some(v => v.productId === product._id))
            .map(product => {
                const variant = variants.find(v => v.productId === product._id);
                // Add this line to see the full variant object
                console.log("Full variant object:", variant);
               
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
 
    // Filter products based on selected category ID from localStorage
    const filteredProducts = React.useMemo(() => {
        const selectedCategoryId = localStorage.getItem('selectedCategoryR');
 
        if (!selectedCategoryId || selectedCategoryId === 'All') {
            return formattedProducts;
        }
 
        return formattedProducts.filter(product => product.categoryId === selectedCategoryId);
    }, [formattedProducts]);
 
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
 
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);
 
    const categoryDisplayNames = {
        'All': 'All',
        ...Object.fromEntries(categories.map(cat => [
            cat.categoryName,
            cat.categoryName.split(' ')[0] // Take first word as display name
        ]))
    };
 
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`z_star ${index < rating ? 'z_star-filled' : ''}`}
            />
        ));
    };
 
    // Get categories from Redux state
    const availableCategories = ['All', ...categories.map(cat => cat.categoryName)];
 
 
 
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
                        {availableCategories.map((category, index) => (
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
                                                {product.variantDiscount}
                                            </div>
                                </div>
                                <Card.Body className="z_card-body">
                                    <div className="z_rating-container">
                                        {renderStars(product.rating)}
                                        <span className="z_rating-text">({product.rating})</span>
                                    </div>
                                    <Card.Title className="z_product-title">{product.title}</Card.Title>
                                    <Card.Text className="z_product-subtitle">
                                        {product.subtitle}
                                    </Card.Text>
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
                                        {/* <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.title}
                                            className="z_modal-product-img"
                                        /> */}
                                        <img
                                            src={`http://localhost:4000/${selectedProduct.image}`}
                                            alt={selectedProduct.title}
                                            className="z_modal-product-img"
                                        />
                                        <span className="Z_black-ribbon">{selectedProduct.variantDiscount}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="z_modal-content">
                                        <h3 className="mb-3">{selectedProduct.title}</h3>
 
                                        <div className="z_rating-container mb-4">
                                            {renderStars(selectedProduct.rating)}
                                            <p></p>
                                            <span className="z_rating-text ms-2">({selectedProduct.rating} customer review)</span>
                                        </div>
 
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="h3 mb-0">${selectedProduct.price.toFixed(2)}</span>
                                                <span className="text-decoration-line-through text-muted">
                                                    ${selectedProduct.originalPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
 
                                        <p className="text-muted mb-4">{selectedProduct.description}</p>
 
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
                                                <span className="z_modal-details-value">{selectedProduct.id || '9852434'}</span>
                                            </div>
                                            <div className="z_modal-details-item">
                                                <span className="z_modal-details-label">Category:</span>
                                                <span className="z_modal-details-value">{selectedProduct.subtitle}</span>
                                            </div>
                                            <div className="z_modal-details-item">
                                                <span className="z_modal-details-label">Brand:</span>
                                                <span className="z_modal-details-value">Premium Collection</span>
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
 