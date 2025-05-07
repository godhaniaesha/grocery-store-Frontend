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
import { Card } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaEye, FaStar } from 'react-icons/fa';

import { createWishlist, deleteFromWishlist, getWishlistItems } from '../redux/slices/wishlist.Slice';
import { toast } from 'react-toastify';

function SimilarPro({ setIsProductDetailPage, setIsVegetablePage }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productQuantities, setProductQuantities] = useState({});
    const { cartItems } = useSelector((state) => state.addcart);
    const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });

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
                    stockStatus: variant?.stockStatus ?? true
                };
            })
            .filter(Boolean);
    };

    const handleProductClick = (productId) => {
        localStorage.setItem('selectedProductId', productId);
        localStorage.setItem('activePage', 'ProductDetails');
        navigate(`/HomeMain`);
    };


    const handleQuantityChange = async (product, change) => {
        try {
            // Get the current quantity from cart or local state
            const currentQuantity = cartItems?.find(item => item.productId === product.id)?.quantity || productQuantities[product.name] || 0;
            const newQuantity = Math.max(0, currentQuantity + change);
            const variant = variants.find(v => v.productId === product.id);

            // If new quantity is 0, remove from cart
            if (newQuantity === 0) {
                const existingCartItem = cartItems?.find(item =>
                    item.productId === product.id && item.productVarientId === variant?._id
                );

                if (existingCartItem) {
                    // Send delete request by setting quantity to 0
                    await dispatch(updateCart({
                        cartId: existingCartItem._id,
                        productId: product.id,
                        productVarientId: variant?._id,
                        quantity: 0
                    })).unwrap();

                    // Clear local state
                    setProductQuantities(prev => {
                        const { [product.name]: _, ...rest } = prev;
                        return rest;
                    });
                }
                return;
            }

            // Adding new item to cart
            if (currentQuantity === 0 && change > 0) {
                const cartData = {
                    productId: product.id,
                    productVarientId: variant?._id,
                    quantity: 1
                };
                const result = await dispatch(createCart(cartData)).unwrap();
                if (result.success) {
                    setProductQuantities(prev => ({
                        ...prev,
                        [product.name]: 1
                    }));
                }
            } else {
                // Updating existing cart item
                const existingCartItem = cartItems?.find(item =>
                    item.productId === product.id && item.productVarientId === variant?._id
                );

                const cartData = {
                    cartId: existingCartItem?._id,
                    productId: product.id,
                    productVarientId: variant?._id,
                    quantity: newQuantity
                };

                const result = await dispatch(updateCart(cartData)).unwrap();
                if (result.success) {
                    setProductQuantities(prev => ({
                        ...prev,
                        [product.name]: newQuantity
                    }));
                }
            }

            // Refresh cart items after any change
            await dispatch(getallMyCarts({}));
        } catch (error) {
            console.error('Failed to update cart:', error);
        }
    };

    const handleViewAllProducts = () => {
        localStorage.setItem('activePage', 'Vegetable');
        setIsVegetablePage(true);
        setIsProductDetailPage(false);
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
    if (productError || variantError) return <div>Error: {productError || variantError}</div>;

    const formattedProducts = getSimilarProducts(products, variants, selectedProductId);

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
        // Set product details in localStorage
        localStorage.setItem('selectedProductId', product.id);
        localStorage.setItem('activePage', 'ProductDetails');
        // Navigate to product details page
        navigate(`/HomeMain`);
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
                        {formattedProducts.map((product, index) => {
                            const isInCart = cartItems?.some(item =>
                                item.productId === product.id && item.quantity > 0
                            );
                            const cartItem = cartItems?.find(item =>
                                item.productId === product.id
                            );

                            return (<>
                                <div key={index} className="a_product-card" onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
                                    <div className='a_image_container'>
                                        {/* <div className="a_discount-badge">
                                            {product.discount}% <p className='mb-0'>OFF</p>
                                        </div> */}
                                        <div className="Z_black-ribbon">
                                            {product.discount}
                                        </div>
                                        <div className="a_image_slider">
                                            {Array.isArray(product.image) ?
                                                product.image.map((img, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={`http://localhost:4000/${img}`}
                                                        alt={`${product.name} ${imgIndex + 1}`}
                                                        className="a_product-image"
                                                    />
                                                ))
                                                :
                                                <img
                                                    src={`http://localhost:4000/${product.image}`}
                                                    alt={product.name}
                                                    className="a_product-image"
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="Z_black-ribbon">
                                        -{product.discount}
                                    </div>
                                </div>
                                <div className="z_card-body">
                                    <div className="z_rating-container">
                                        {renderStars(product.rating || 0)}
                                        <span className="z_rating-text">
                                            ({Number(product.rating || 0).toFixed(1)})
                                        </span>
                                    </div>
                                    <h3 className="z_product-title">{product.name}</h3>
                                    <p className="z_product-weight mb-1">{product.size}</p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="z_price-container mb-0 me-2">
                                            <span className="z_current-price">{product.price}</span>
                                            <span className="z_original-price">{product.discountPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                            )
                        })}
                    </div>
                </div>
            </div>


        </>
    );
}

export default SimilarPro;

