import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { selectCurrency, selectCurrencySymbol, convertPrice } from '../redux/slices/currency.Slice';

import '../styles/x_app.css';
import GardenFresh from './GardenFresh';
import Category from './Category';
import "../styles/x_app.css"
import "../styles/denisha.css"
import vegetables from "../img/x_img/vegetables.png";
import leafy from "../img/x_img/leafy.png";
import seasonal from "../img/x_img/seasonal.png";
import organic from "../img/x_img/organic.png";
import hydroponic from "../img/x_img/hydroponic.png";
import root from "../img/x_img/root.png";
import { LiaAngleRightSolid } from 'react-icons/lia';
import { fetchCategories } from '../redux/slices/categorySlice';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { createCart, updateCart, getallMyCarts } from '../redux/slices/cart.Slice';
import { clearSearch } from '../redux/slices/search.Slice';

function Vegetable({ setIsProductDetailPage, setSelectedProductId, setIsVegetablePage }) {
    const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem('selectedCategoryId') || '');

    useEffect(() => {
        const savedCategory = localStorage.getItem('selectedCategoryId');
        if (savedCategory) {
            setSelectedCategory(savedCategory);
        }
    }, []);

    // Add this useEffect to check for category ID in localStorage when component mounts
    useEffect(() => {
        const categoryId = localStorage.getItem('selectedCategoryId');
        if (categoryId) {
            console.log("Setting category from localStorage:", categoryId);
            setSelectedCategory(categoryId);
        }
    }, []);

    const dispatch = useDispatch();
    const selectedCurrency = useSelector(selectCurrency);
    const currencySymbol = useSelector(selectCurrencySymbol);
    const { conversionRates } = useSelector((state) => state.currency);
    const navigate = useNavigate();
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedDiscount, setSelectedDiscount] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [activeButton, setactiveButton] = useState(false);

    const [isSortOpen, setIsSortOpen] = useState(false);
    const [productQuantities, setProductQuantities] = useState({});
    // const [selectedCategory, setSelectedCategory] = useState(null);
    // console.log("Selected selectedDiscount ID:", selectedDiscount);
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
    // Add logging for category selection
    // Update handleCategorySelect function to work as a toggle
    const handleCategorySelect = (categoryId) => {
        // If clicking the same category, clear the selection (toggle off)
        if (compareCategoryIds(selectedCategory, categoryId)) {
            setSelectedCategory('');
            localStorage.removeItem('selectedCategoryId');
        } else {
            // If clicking a different category, select it (toggle on)
            setSelectedCategory(categoryId);
            localStorage.setItem('selectedCategoryId', categoryId);
        }
    };

    const handleProductClick = (productId) => {
        localStorage.setItem('selectedProductId', productId);
        localStorage.setItem('activePage', 'ProductDetails');
        setSelectedProductId(productId);
        setIsProductDetailPage(true);
        setIsVegetablePage(false);
    };

    // Add this near your other useSelector calls, before the formattedProducts definition
    const { products, loading: productLoading, error: productError } = useSelector((state) => state.product || {});
    const { variants, loading: variantLoading, error: variantError } = useSelector((state) => state.productveriant || {});
    const { categories, isLoading, error } = useSelector(state => state.category);

    const { cartItems } = useSelector(state => state.addcart); // Add this line

    // Add this selector to get search state
    const { searchQuery, searchResults } = useSelector(state => state.search);

    // Add useEffect to log filtered products when category changes
    useEffect(() => {
        if (selectedCategory && products) {
            const categoryProducts = products.filter(product =>
                product.categoryId && compareCategoryIds(product.categoryId, selectedCategory)
            ) || [];
            console.log("Selected Category ID:", selectedCategory);
            console.log("Category Products Count:", categoryProducts.length);
            console.log("All Products Count:", products.length);
            console.log("Category Products", categoryProducts);

            console.log("Product details:", categoryProducts.map(p => ({
                id: p._id,
                name: p.productName,
                categoryId: p.categoryId
            })));
        }
    }, [selectedCategory, products]);

    // Add this to your useEffect
    // Update the useEffect to initialize productQuantities from cartItems
    useEffect(() => {
        dispatch(fetchProducts({}));
        dispatch(fetchProductVariants({ page: 1, pageSize: 10 }));
        dispatch(fetchCategories({ page: 1, pageSize: 10 }));
        dispatch(getallMyCarts());  // Changed from getallMyCarts to getallMyCarts
    }, [dispatch]);

    // Add new useEffect to sync cartItems with productQuantities
    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            const quantities = {};
            cartItems.forEach(item => {
                const product = products?.find(p => p._id === item.productId);
                if (product) {
                    quantities[product.productName] = item.quantity;
                }
            });
            setProductQuantities(quantities);
        }
    }, [cartItems, products]);

    // Add this useEffect to fetch products when the selected category changes
    useEffect(() => {
        if (selectedCategory) {
            console.log("Fetching products for category:", selectedCategory);
            dispatch(fetchProducts({ categoryId: selectedCategory }));
        } else {
            console.log("Fetching all products");
            dispatch(fetchProducts({}));
        }
    }, [selectedCategory, dispatch]);

    const priceOptions = [
        { label: '--Default--' },
        { value: '0-10', label: 'Less than $10' },
        { value: '11-30', label: '$11 to $30' },
        { value: '31-50', label: '$31 to $50' },
        { value: '51-70', label: '$51 to $70' },
        { value: '71-90', label: '$71 to $90' }
    ];

    const discountOptions = [
        { label: '--Default--' },
        { value: '10-15', label: '10% - 15%' },
        { value: '15-25', label: '15% - 25%' },
        { value: '25+', label: 'More than 25%' }
    ];

    const sortOptions = [
        { label: '--Default--' },
        { value: 'popular', label: 'Popular' },
        { value: 'recent', label: 'Most Recent' },
        { value: 'high', label: 'Price - High' },
        { value: 'low', label: 'Price - Low' }
    ];

    // Add this helper function to ensure consistent category ID comparison
    const compareCategoryIds = (id1, id2) => {
        // Convert both to strings and trim for comparison
        return String(id1).trim() === String(id2).trim();
    };

    // Update the formattedProducts mapping to use searchResults when available
    const formattedProducts = (searchResults && searchResults.length > 0 ? searchResults : products) && variants ?
        (searchResults && searchResults.length > 0 ? searchResults : products)
            .filter(product => {
                // First check if product has any variants
                const hasVariant = variants.some(v => v.productId === product._id);
                if (!hasVariant) return false;

                // Then check category filter
                const selectedCategoryFromStorage = localStorage.getItem('selectedCategoryId');
                const matchesCategory = !selectedCategoryFromStorage ||
                    (product.categoryId && compareCategoryIds(product.categoryId, selectedCategoryFromStorage));

                if (selectedCategoryFromStorage && !matchesCategory) {
                    console.log("Product filtered out:", product.productName, "Category ID:", product.categoryId, "Selected Category:", selectedCategoryFromStorage);
                }

                return matchesCategory;
            })
            .map(product => {
                const variant = variants.find(v => v.productId === product._id);
                const cartItem = cartItems?.find(item => item.productId === product._id);

                // Calculate prices
                const currentPrice = variant?.price || product.currentPrice || 0;
                const originalPrice = variant?.discountPrice || product.originalPrice || 0;
                const discountPercentage = variant?.discount || 0;

                return {
                    _id: product._id,
                    variantId: variant?._id,
                    cartId: cartItem?._id,
                    name: product.productName,
                    image: product.images,
                    size: variant?.size || '',
                    price: formatPrice(currentPrice),
                    discountPrice: formatPrice(originalPrice),
                    discount: discountPercentage,
                    stockStatus: variant?.stockStatus ?? true,
                    numericPrice: parseFloat(currentPrice),
                    quantity: cartItem?.quantity || 0
                };
            }) : [];

    // Update filteredProducts with fixed discount filtering
    const filteredProducts = formattedProducts.filter(product => {
        // Price filter
        if (selectedPrice) {
            const [min, max] = selectedPrice.split('-').map(Number);
            if (!(product.numericPrice >= min && (max ? product.numericPrice <= max : true))) {
                return false;
            }
        }

        // Fixed discount filter
        if (selectedDiscount) {
            const discountValue = parseInt(product.discount);
            console.log("Discount Value:", discountValue);

            switch (selectedDiscount) {
                case '25+':
                    return discountValue >= 25;
                case '15-25':
                    return discountValue >= 15 && discountValue < 25;
                case '10-15':
                    return discountValue >= 10 && discountValue < 15;
                default:
                    return true;
            }
        }

        return true;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (selectedSort) {
            case 'high':
                return b.numericPrice - a.numericPrice;
            case 'low':
                return a.numericPrice - b.numericPrice;
            case 'recent':
                return -1; // Assuming newest products are at the start
            case 'popular':
                return 0; // Default order for popular items
            default:
                return 0;
        }
    });

    const handlePrevClick = () => {
        setactiveButton("prev");
        setTimeout(() => setactiveButton(null), 200);
    };

    const handleNextClick = () => {
        setactiveButton("next");
        setTimeout(() => setactiveButton(null), 200);
    };

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Add this before handleQuantityChange
    const selectedCategoryName = categories && selectedCategory
        ? categories.find(cat => cat._id === selectedCategory)?.categoryName
        : '';

    const handleQuantityChange = async (product, change) => {
        try {
            const currentQuantity = productQuantities[product.name] || 0;
            const newQuantity = Math.max(0, currentQuantity + change);

            if (newQuantity === 0) {
                if (product.cartId) {  // Only call API if item exists in cart
                    const cartData = {
                        cartId: product.cartId,
                        productId: product._id,
                        productVarientId: product.variantId,
                        quantity: 0
                    };
                    await dispatch(updateCart(cartData)).unwrap();
                }
                setProductQuantities(prev => {
                    const { [product.name]: _, ...rest } = prev;
                    return rest;
                });
                return;
            }

            if (currentQuantity === 0 && change > 0) {
                const cartData = {
                    productId: product._id,
                    productVarientId: product.variantId,
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
                const cartData = {
                    cartId: product.cartId,
                    productId: product._id,
                    productVarientId: product.variantId,
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

            // Refresh cart items after successful update
            await dispatch(getallMyCarts());
        } catch (error) {
            console.error('Failed to update cart:', error);
            // Optionally reset the quantity on error
            if (error.response?.status === 404) {
                setProductQuantities(prev => {
                    const { [product.name]: _, ...rest } = prev;
                    return rest;
                });
            }
        }
    };
    return (
        <>
            <div className='a_header_container'>
                <div className="x_category-container">
                    <div
                        className={`x_swiper-button-prev ${activeButton === "prev" ? "active" : ""}`}
                        onClick={handlePrevClick}
                    >
                        <MdKeyboardArrowLeft />
                    </div>
                    <div
                        className={`x_swiper-button-next ${activeButton === "next" ? "active" : ""}`}
                        onClick={handleNextClick}
                    >
                        <MdKeyboardArrowRight />
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={5}
                        navigation={{
                            prevEl: '.x_swiper-button-prev',
                            nextEl: '.x_swiper-button-next',
                        }}
                        breakpoints={{
                            320: { slidesPerView: 2, spaceBetween: 15 },
                            375: { slidesPerView: 2, spaceBetween: 15 },
                            425: { slidesPerView: 3, spaceBetween: 15 },
                            768: { slidesPerView: 4, spaceBetween: 15 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                            1200: { slidesPerView: 4, spaceBetween: 20 },
                            1400: { slidesPerView: 5, spaceBetween: 20 },
                            1600: { slidesPerView: 6, spaceBetween: 20 },
                        }}
                        className="x_category-swiper ps-0 ps-md-5"
                    >
                        {categories.map((category, index) => (
                            <SwiperSlide key={index} className='me-0 d-flex justify-content-center'>
                                <div
                                    className="x_category-item"
                                    onClick={() => handleCategorySelect(category._id)}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div className="x_category-image-wrapper" style={{
                                        border: selectedCategory === category._id ? '1px solid var(--greencolor)' : 'none'
                                    }}>
                                        <img
                                            src={`http://localhost:4000/${category.categoryImage}`}
                                            alt={category.categoryName}
                                            className="x_category-image"
                                        />
                                    </div>
                                    <p className="x_category-name">{category.categoryName}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* {selectedCategoryName && (
                    <div className="mt-4 mb-3">
                        <h2 className="x_category-title">{selectedCategoryName} Products</h2>
                        <span className="line"></span>
                    </div>
                )} */}

                <div className="x_filter-section">
                    {/* Price Dropdown */}
                    <div className="x_filter-group">
                        <label>Price</label>
                        <div className="x_custom-dropdown">
                            <div
                                className="x_dropdown-header"
                                onClick={() => setIsPriceOpen(!isPriceOpen)}
                            >
                                <span className='x_selected'>
                                    {selectedPrice === ''
                                        ? 'Price'
                                        : priceOptions.find(opt => opt.value === selectedPrice)?.label}
                                </span>
                                <span className={`x_arrow ${isPriceOpen ? 'x_open' : ''}`}>▼</span>
                            </div>
                            {isPriceOpen && (
                                <div className="x_dropdown-options">
                                    {priceOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className="x_checkbox-wrapper"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedPrice(option.value);
                                                setIsPriceOpen(false);
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPrice === option.value}
                                                onChange={() => { }}
                                                className="x_custom-checkbox"
                                            />
                                            <span className="x_checkbox-mark"></span>
                                            <span className="x_checkbox-label">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Discount Dropdown */}
                    <div className="x_filter-group">
                        <label>Discount</label>
                        <div className="x_custom-dropdown">
                            <div
                                className="x_dropdown-header"
                                onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                            >
                                <span className='x_selected'>
                                    {selectedDiscount === ''
                                        ? 'Discount'
                                        : discountOptions.find(opt => opt.value === selectedDiscount)?.label}
                                </span>
                                <span className={`x_arrow ${isDiscountOpen ? 'x_open' : ''}`}>▼</span>
                            </div>
                            {isDiscountOpen && (
                                <div className="x_dropdown-options">
                                    {discountOptions.map((option) => (
                                        <label key={option.value} className="x_radio-wrapper">
                                            <input
                                                type="radio"
                                                name="discount"
                                                value={option.value}
                                                checked={selectedDiscount === option.value}
                                                onChange={() => {
                                                    setSelectedDiscount(option.value);
                                                    setIsDiscountOpen(false);
                                                }}
                                                className="x_radio-input"
                                            />
                                            <span className="x_radio-custom"></span>
                                            <span className="x_radio-label">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="x_filter-group">
                        <label>Sort by</label>
                        <div className="x_custom-dropdown">
                            <div
                                className="x_dropdown-header"
                                onClick={() => setIsSortOpen(!isSortOpen)}
                            >
                                <span className='x_selected'>
                                    {selectedSort === ''
                                        ? 'Sort by'
                                        : sortOptions.find(opt => opt.value === selectedSort)?.label}
                                </span>
                                <span className={`x_arrow ${isSortOpen ? 'x_open' : ''}`}>▼</span>
                            </div>
                            {isSortOpen && (
                                <div className="x_dropdown-options">
                                    {sortOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className="x_sort-item"
                                            style={{ padding: '6px 15px' }}
                                            onClick={() => {
                                                setSelectedSort(option.value);
                                                setIsSortOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* product */}
                <div className="a_garden-fresh">
                    {searchQuery && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Search Results for "{searchQuery}"</h4>
                            <button
                                className="btn btn-outline-success"
                                onClick={() => dispatch(clearSearch())}
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                    <div className="a_garden-fresh-grid mt-3">
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map((product, index) => (
                                <div key={index} className="a_product-card" style={{ cursor: 'pointer' }}>
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
                                        <h3 className="a_product-name" onClick={() => handleProductClick(product._id)}  >{product.name}</h3>
                                        <p className="a_product-weight mb-1">{product.size}</p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="a_price-container mb-0 me-2">
                                                <span className="a_current-price">
                                                    {product.price}
                                                </span>
                                                <span className="a_original-price">
                                                    {product.discountPrice}
                                                </span>
                                            </div>
                                            {productQuantities[product.name] ? (
                                                <div className="a_add-button added">
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(product, -1);  // Pass product instead of product.name
                                                    }}>-</button>
                                                    <span>{productQuantities[product.name]}</span>
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(product, 1);  // Pass product instead of product.name
                                                    }}>+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="a_add-button"
                                                    onClick={(e) => { e.stopPropagation(); handleQuantityChange(product, 1); }}
                                                >
                                                    ADD
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center w-100 py-5">
                                <h4>No products found</h4>
                                <p>Try adjusting your filters or search criteria</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </>
    );
}

export default Vegetable;



