import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { selectCurrency, selectCurrencySymbol, convertPrice } from '../redux/slices/currency.Slice';

import '../styles/denisha.css';
import '../styles/x_app.css';
import { LiaAngleRightSolid } from 'react-icons/lia';
import { createCart, getallMyCarts, updateCart } from '../redux/slices/cart.Slice';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Card, Modal } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';

import { createWishlist, deleteFromWishlist, getWishlistItems } from '../redux/slices/wishlist.Slice';
import { toast } from 'react-toastify';

function SimilarPro({ setIsProductDetailPage, setIsVegetablePage }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
     const { categories } = useSelector(state => state.category);
     console.log(categories,"categories");
     
    const [productQuantities, setProductQuantities] = useState({});
    const { cartItems } = useSelector((state) => state.addcart);
    const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [modalShow, setModalShow] = useState(false);

console.log(selectedProduct,"selectedProduct");
    // Add isInWishlist function
    const isInWishlist = (productId) => {
        return wishlistItems?.some(item =>
            item.productId === productId ||
            (item.productData && item.productData[0]?._id === productId)
        );
    };

    // Add handleAddToWishlist function
    // Add renderStars function
    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={index < rating ? 'z_star-filled' : ''}><FaStar className='z_star-filled'></FaStar></span>
        ));
    };
    const selectedProductId = localStorage.getItem('selectedProductId');
    const selectedCurrency = useSelector(selectCurrency);
    const currencySymbol = useSelector(selectCurrencySymbol);
    const { conversionRates } = useSelector((state) => state.currency);
    const { products, loading: productLoading, error: productError } = useSelector((state) => state.product || {});
    const { variants, loading: variantLoading, error: variantError } = useSelector((state) => state.productveriant || {});

    // Function to convert prices based on selected currency
    const convertPriceValue = (amount) => {
        if (!amount || isNaN(amount)) return 0;
        const numAmount = parseFloat(amount);
        return (numAmount * conversionRates[selectedCurrency]).toFixed(2);
    };

    // Format price with appropriate currency symbol
    const formatPrice = (amount) => {
        if (!amount || isNaN(amount)) return `${currencySymbol}0`;
        const convertedAmount = convertPriceValue(amount);
        return `${currencySymbol}${Math.round(convertedAmount)}`;
    };

    // નવો ફંક્શન જે સિમિલર પ્રોડક્ટ્સ ફિલ્ટર કરશે
    const getSimilarProducts = (products, variants, selectedId) => {
        if (!products || !variants || !selectedId) return [];

        // સિલેક્ટેડ પ્રોડક્ટ શોધો
        const selectedProduct = products.find(p => p._id === selectedId);
        if (!selectedProduct) return [];

        // એજ કેટેગરીની પ્રોડક્ટ્સ ફિલ્ટર કરો
        const categoryProducts = products
            .filter(product =>
                product.categoryId === selectedProduct.categoryId &&
                product._id !== selectedId &&
                variants.some(v => v.productId === product._id)
            );

        // Get the last 6 products instead of random
        return categoryProducts
            .slice(-6)  // Take last 6 products
            .map(product => {
                const variant = variants.find(v => v.productId === product._id);
                if (!product) return null;

                return {
                    id: product._id,
                    name: product.productName || 'Product Name Not Available',
                    currentPrice: product.currentPrice ? `$${product.currentPrice}` : '$0',
                    originalPrice: product.originalPrice ? `$${product.originalPrice}` : '$0',
                    image: product.images || [],
                    size: variant?.size || 'Size not available',
                    price: formatPrice(`${variant.price}`),
                    discountPrice: formatPrice(`${variant.discountPrice}`),
                    discount: variant?.discount || '0',
                    stockStatus: variant?.stockStatus ?? true,
                    subtitle: variant?.categoryData?.[0]?.categoryName || product.categoryId?.categoryName || 'Uncategorized',
                    description: product.description || '',
                    category: variant?.categoryData?.[0]?.categoryName || product.categoryId?.categoryName || 'Uncategorized',
                    categoryId: product.categoryId || null,
                };
            })
            .filter(Boolean);
    };



  const handleQuantityChange = (value) => {
        const newQuantity = quantity + value;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };
    const handleViewAllProducts = () => {
        localStorage.setItem('activePage', 'Vegetable');
        setIsVegetablePage(true);
        setIsProductDetailPage(false);
    };

    const handleClose = () => {
        setModalShow(false);
        setTimeout(() => {
            setShowModal(false);
            setQuantity(1);
        }, 200);
    };
    useEffect(() => {
        const fetchData = async () => {
            // બધા API કૉલ્સ પેરેલલ મોડમાં કરો
            await Promise.all([
                dispatch(fetchProducts({})),
                dispatch(fetchProductVariants({ page: 1, pageSize: 10 })),
                dispatch(getallMyCarts({}))
            ]);
        };
        fetchData();
    }, [dispatch, selectedProductId]);

    if (productLoading || variantLoading) return <LoadingSpinner></LoadingSpinner>;
    if (productError || variantError) return <div>Error: {productError?.message || variantError?.message || 'An error occurred'}</div>;

    const formattedProducts = getSimilarProducts(
        products,
         variants, selectedProductId);

    if (!formattedProducts || formattedProducts.length === 0) {
        return (
            <div className="a_header_container">
                <div className="a_garden-fresh">
                    <div className="a_garden-fresh-header">
                        <h2 className="a_garden-fresh-title">Garden Fresh</h2>
                        <Link to="/Vegetable" className="a_view-all">
                            View All <LiaAngleRightSolid />
                        </Link>
                    </div>
                    <span className="line"></span>
                    <div className="a_garden-fresh-grid mt-3">
                        <div>No products available</div>
                    </div>
                </div>
            </div>
        );
    }


    const handleAddToCart = async (product) => {
        try {
            const variant = variants.find(v => v.productId === product.id);
            if (!variant) {
                toast.error("Product variant not found");
                return;
            }

            const result = await dispatch(createCart({
                productId: product.id,
                productVarientId: variant._id,
                quantity: 1
            })).unwrap();

            if (result.success) {
                toast.success("Item added to cart");
                // ફક્ત કાર્ટ આઇટમ્સ ફેચ કરો, આખો કમ્પોનન્ટ રિફ્રેશ નહીં
                dispatch(getallMyCarts({}));
            }
        } catch (error) {
            console.error("Cart operation failed:", error);
            if (error?.message === 'Cart Already Exist') {
                toast.info("Item quantity updated in cart");
            } else {
                toast.error("Failed to add to cart");
            }
        }
    };

    const handleAddToWishlist = async (productId) => {
        try {
            const isAlreadyInWishlist = isInWishlist(productId);
            if (isAlreadyInWishlist) {
                const wishlistItem = wishlistItems.find(item => item.productId === productId);
                const result = await dispatch(deleteFromWishlist(wishlistItem._id)).unwrap();
                if (result.success) {
                    toast.success('Item removed from wishlist');
                    // ફક્ત વિશલિસ્ટ આઇટમ્સ ફેચ કરો
                    dispatch(getWishlistItems());
                }
            } else {
                const result = await dispatch(createWishlist(productId)).unwrap();
                if (result.success) {
                    toast.success('Item added to wishlist');
                    // ફક્ત વિશલિસ્ટ આઇટમ્સ ફેચ કરો
                    dispatch(getWishlistItems());
                }
            }
        } catch (error) {
            toast.error(error.message || 'Wishlist operation failed');
        }
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

    return (
        <>
            <div className="a_header_container">
                <div className="a_garden-fresh">
                    <div className="a_garden-fresh-header">
                        <h2 className="a_garden-fresh-title">You May Also Like</h2>
                        <Link to="/Vegetable" className="a_view-all">
                            View All <LiaAngleRightSolid />
                        </Link>
                    </div>
                    <span className="line"></span>
                    <div className="a_garden-fresh-grid mt-3">
                        {formattedProducts.map((product, index) => (
                            <div key={index} className="z_product-card" style={{ cursor: 'pointer' }}>
                                <div className="z_product-image-container">
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:4000/${product.image[0]}`}
                                        alt={product.name}
                                        className="z_product-image"
                                    />
                                    <div className="z_hover-overlay">
                                        <div className="z_hover-icons">
                                            <button
                                                className="z_hover-icon-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(product);
                                                }}
                                            >
                                                <FaShoppingCart />
                                            </button>
                                            <button
                                                className={`z_hover-icon-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToWishlist(product.id);
                                                }}
                                            >
                                                <FaHeart style={{ color: isInWishlist(product.id) ? 'red' : 'inherit' }} />
                                            </button>
                                            <button className="z_hover-icon-btn" onClick={() => handleShow(product)}>
                                                <FaEye />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="Z_black-ribbon">
                                        {product.discount}
                                    </div>
                                </div>
                                <div className="z_card-body">
                                    <div className="z_rating-container">
                                        {renderStars(product.rating || 0)}
                                        <span className="z_rating-text">
                                            ({Number(product.rating || 0).toFixed(1)})
                                        </span>
                                    </div>
                                    <h3 className="z_product-title" style={{ cursor: "pointer" }} onClick={() => {
                                        localStorage.setItem('selectedProductId', product.id);
                                        navigate(`/product-details/${product.id}`);
                                    }}>{product.name}</h3>
                                    <p className="z_product-weight mb-1">{product.size}</p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="z_price-container mb-0 me-2">
                                            <span className="z_current-price">{product.price}</span>
                                            <span className="z_original-price">{product.discountPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                                            src={`http://localhost:4000/${selectedProduct.image && selectedProduct.image[0] ? selectedProduct.image[0] : ''}`}
                                            alt={selectedProduct.name}
                                            className="z_modal-product-img"
                                        />
                                        <span className="z_modal-discount-badge">
                                            {selectedProduct.discount}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="z_modal-content">
                                        <h4 className="mb-3">{selectedProduct.name}</h4>
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="h5 mb-0">
                                                    {selectedProduct.price }
                                                </span>
                                                <span className="text-decoration-line-through text-muted">
                                                    {selectedProduct.discountPrice }
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
                                                    {selectedProduct.id || "9852434"}
                                                </span>
                                            </div>
                                            <div className="z_modal-details-item">
                                                <span className="z_modal-details-label">
                                                    Category:
                                                </span>
                                                <span className="z_modal-details-value">
                                                    {/* If you have categories in scope */}
                                                    {categories && categories.find(cat => cat._id === selectedProduct.categoryId)?.categoryName || 'Uncategorized'}
                                                    {/* {selectedProduct.categoryName} */}
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

export default SimilarPro;

