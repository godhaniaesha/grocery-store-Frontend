import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { selectCurrency, selectCurrencySymbol } from '../redux/slices/currency.Slice';
import '../styles/denisha.css';
import '../styles/x_app.css';
import { LiaAngleRightSolid } from 'react-icons/lia';
import { createCart, getallMyCarts, updateCart } from '../redux/slices/cart.Slice';
import { useNavigate } from 'react-router-dom';


export default function SpecialOffer({setSelectedProductId, setIsProductDetailPage,setIsVegetablePage}) {
    const navigate = useNavigate();
    const [productQuantities, setProductQuantities] = useState({});
    const { cartItems } = useSelector((state) => state.addcart);

    const handleProductClick = (productId) => {
        localStorage.setItem('selectedProductId', productId);
        localStorage.setItem('activePage', 'ProductDetails');
        setSelectedProductId(productId);
        setIsProductDetailPage(true);
        setIsVegetablePage(false);
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
    const { products, loading: productLoading, error: productError } = useSelector((state) => state.product || {});
    const { variants, loading: variantLoading, error: variantError } = useSelector((state) => state.productveriant || {});

    useEffect(() => {
        dispatch(fetchProducts({}));
        dispatch(fetchProductVariants({ page: 1, pageSize: 10 }));
        dispatch(getallMyCarts({}));
    }, [dispatch]);

    if (productLoading || variantLoading) return <div>Loading...</div>;
    if (productError || variantError) {
        const errorMessage = typeof (productError || variantError) === 'string' 
            ? (productError || variantError)
            : (productError?.message || variantError?.message || 'An error occurred');
        return <div>Error: {errorMessage}</div>;
    }

    // const formattedProducts = products && variants ? products.map(product => {
    //     const variant = variants.find(v => v.productId === product._id);
    //     if (!product) return null;

    //     return {
    //         id: product._id,
    //         name: product.productName || 'Product Name Not Available',
    //         currentPrice: product.currentPrice ? `$${product.currentPrice}` : '$0',
    //         originalPrice: product.originalPrice ? `$${product.originalPrice}` : '$0',
    //         image: product.images || [],
    //         size: variant?.size || 'Size not available',
    //         price: variant?.price ? `$${variant.price}` : product.currentPrice ? `$${product.currentPrice}` : '$0',
    //         discount: variant?.discountPrice ? `$${variant.discountPrice}` : product.originalPrice ? `$${product.originalPrice}` : '$0',
    //         discountPrice: variant?.discount || '0',  // Add this line
    //         stockStatus: variant?.stockStatus ?? true
    //     };
    // }).filter(Boolean).slice(0, 8) : [];

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
            price: variant?.price ? `${currencySymbol}${variant.price}` : product.currentPrice ? `${currencySymbol}${product.currentPrice}` : `${currencySymbol}0`,
            discountPrice: variant?.discountPrice ? `${currencySymbol}${variant.discountPrice}` : product.originalPrice ? `${currencySymbol}${product.originalPrice}` : `${currencySymbol}0`,
            discount: variant?.discount || '0',  // Add this line
            stockStatus: variant?.stockStatus ?? true
        };
    }).filter(Boolean).slice(-8).reverse() : [];  
    const handleViewAllProducts = () => {
        localStorage.setItem('activePage', 'Vegetable');
        setIsVegetablePage(true);
        setIsProductDetailPage(false);
    };
    if (!formattedProducts || formattedProducts.length === 0) {
        return (
            <div className="a_header_container">
                <div className="a_garden-fresh">
                    <div className="a_garden-fresh-header">
                        <h2 className="a_garden-fresh-title">Garden Fresh</h2>
                        <p  className="a_view-all"  onClick={() => handleViewAllProducts()}>
                            View All <LiaAngleRightSolid />
                        </p>
                    </div>
                    <span className="line"></span>
                    <div className="a_garden-fresh-grid mt-3">
                        <div>No products available</div>
                    </div>
                </div>
            </div>
        );
    }
   
    return (
      <>
        <div className="a_speacial_offer_bg">
          <div className="a_header_container">
            <div className="a_garden-fresh">
              <div className="a_garden-fresh-header">
                <h2 className="a_garden-fresh-title">Special offer</h2>
              
              </div>
              <span className="line"></span>
              <div className="row gap-lg-0 gap-3 mt-3">
                <div className="col-xxl-3 col-xl-4 col-lg-5 col-12 ">
                  <div className="a_special_offer_banner">
                    <div className="a_special_offer_transparentbg">
                      <div className="a_discount">
                        <span className="a_disc_35">35%</span> OFF
                      </div>
                      <h2>Hurry! Limited Stock</h2>
                      <p>Lorem ipsum dolor sit amet,consecteur</p>
                      <div className="a_countdown_container">
                        <div className="a_countdown_item">
                          <div className="a_countdown_number">326</div>
                          <div className="a_countdown_label">Days</div>
                        </div>
                        <div className="a_countdown_separator">:</div>
                        <div className="a_countdown_item">
                          <div className="a_countdown_number">03</div>
                          <div className="a_countdown_label">Hrs</div>
                        </div>
                        <div className="a_countdown_separator">:</div>
                        <div className="a_countdown_item">
                          <div className="a_countdown_number">06</div>
                          <div className="a_countdown_label">Min</div>
                        </div>
                        <div className="a_countdown_separator">:</div>
                        <div className="a_countdown_item">
                          <div className="a_countdown_number">52</div>
                          <div className="a_countdown_label">Sec</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-7 col-12 ">
                <div className="a_garden-fresh-grid mt-3">
                        {formattedProducts.map((product, index) => {
                            const isInCart = cartItems?.some(item =>
                                item.productId === product.id && item.quantity > 0
                            );
                            const cartItem = cartItems?.find(item =>
                                item.productId === product.id
                            );

                            return (
                                <div key={index} className="a_product-card" style={{ cursor: 'pointer' }}>
                                    <div className='a_image_container'>
                                        <div className='a_image_container'>
                                            <div className="a_discount-badge">
                                                {product.discount}% <p className='mb-0'>OFF</p>
                                            </div>
                                            {/* ... rest of the image container code ... */}

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
                                    </div>
                                    <div className='a_card_content'>
                                        <h3 className="a_product-name"  onClick={() => handleProductClick(product.id)}>{product.name}</h3>
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
            </div>
          </div>
        </div>
      </>
    );
}
