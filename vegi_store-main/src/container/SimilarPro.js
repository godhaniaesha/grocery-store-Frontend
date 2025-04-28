import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { selectCurrency, selectCurrencySymbol, convertPrice } from '../redux/slices/currency.Slice';

import '../styles/denisha.css';
import '../styles/x_app.css';
import { LiaAngleRightSolid } from 'react-icons/lia';
import { createCart, getallMyCarts, updateCart } from '../redux/slices/cart.Slice';
import { useNavigate } from 'react-router-dom';

function SimilarPro({setIsProductDetailPage,setIsVegetablePage}) {
    const navigate = useNavigate();
    const [productQuantities, setProductQuantities] = useState({});
    const { cartItems } = useSelector((state) => state.addcart);

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

    const dispatch = useDispatch();
    const selectedCurrency = useSelector(selectCurrency);
    const currencySymbol = useSelector(selectCurrencySymbol);
    const { conversionRates } = useSelector((state) => state.currency);

    const { products, loading: productLoading, error: productError } = useSelector((state) => state.product || {});
    const { variants, loading: variantLoading, error: variantError } = useSelector((state) => state.productveriant || {});

    // Function to convert prices based on selected currency
    const convertPriceValue = (amount) => {
        if (!amount || isNaN(amount)) return 0;
        
        // Parse the amount to ensure it's a number
        const numAmount = parseFloat(amount);
        
        // Convert from USD to selected currency
        return (numAmount * conversionRates[selectedCurrency]).toFixed(2);
    };

    // Format price with appropriate currency symbol
    const formatPrice = (amount) => {
        if (!amount || isNaN(amount)) return `${currencySymbol}0`;
        
        const convertedAmount = convertPriceValue(amount);
        return `${currencySymbol}${Math.round(convertedAmount)}`;
    };
    useEffect(() => {
        dispatch(fetchProducts({}));
        dispatch(fetchProductVariants({ page: 1, pageSize: 10 }));
        dispatch(getallMyCarts({}));
    }, [dispatch]);

    if (productLoading || variantLoading) return <div>Loading...</div>;
    if (productError || variantError) return <div>Error: {productError || variantError}</div>;

    const formattedProducts = products && variants ? products
        .filter(product => variants.some(v => v.productId === product._id))
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
            price: formatPrice( `${variant.price}`),
            discountPrice: formatPrice( `${variant.discountPrice}`),
            discount: variant?.discount || '0',  // Add this line
            stockStatus: variant?.stockStatus ?? true
        };
    }).filter(Boolean).slice(0, 6) : [];

    if (!formattedProducts || formattedProducts.length === 0) {
        return (
            <div className="a_header_container">
                <div className="a_garden-fresh">
                    <div className="a_garden-fresh-header">
                        <h2 className="a_garden-fresh-title">Garden Fresh</h2>
                        <a href="#" className="a_view-all" onClick={() => handleViewAllProducts()}>
                            View All <LiaAngleRightSolid />
                        </a>
                    </div>
                    <span className="line"></span>
                    <div className="a_garden-fresh-grid mt-3">
                        <div>No products available</div>
                    </div>
                </div>
            </div>
        );
    }
    const handleViewAllProducts = () => {
        localStorage.setItem('activePage', 'Vegetable');
        setIsVegetablePage(true);
        setIsProductDetailPage(false);
    };
    return (
        <>
            <div className="a_header_container">
                <div className="a_garden-fresh">
                    <div className="a_garden-fresh-header">
                        <h2 className="a_garden-fresh-title">Similar Products</h2>

                        <a href="#" className="a_view-all" onClick={() => handleViewAllProducts()}>
                            View All <LiaAngleRightSolid />
                        </a>
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

                            return (
                                <div key={index} className="a_product-card" onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
                                    <div className='a_image_container'>
                                        <div className="a_discount-badge">
                                            {product.discount}% <p className='mb-0'>OFF</p>
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
                                    <div className='a_card_content'>
                                        <h3 className="a_product-name">{product.name}</h3>
                                        <p className="a_product-weight mb-1">{product.size}</p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="a_price-container mb-0 me-2">
                                                <span className="a_current-price">{product.price}</span>
                                                <span className="a_original-price">{product.discountPrice}</span>
                                            </div>
                                            {isInCart ? (
                                                <div className="a_add-button added">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleQuantityChange(product, -1);
                                                        }}
                                                    >-</button>
                                                    <span>{cartItem?.quantity}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleQuantityChange(product, 1);
                                                        }}
                                                    >+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="a_add-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(product, 1);
                                                    }}
                                                >
                                                    ADD
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>

        </>
    );
}

export default SimilarPro;