import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/product.Slice';
import { fetchProductVariants } from '../redux/slices/productVeriant.Slice';
import { selectCurrency, selectCurrencySymbol, convertPrice } from '../redux/slices/currency.Slice';
import { getAllSubcategories } from '../redux/slices/Subcategory.slice';

import '../styles/Home.css'
import "../styles/x_app.css"
import "../styles/denisha.css"
import { LiaAngleRightSolid } from 'react-icons/lia';
import { fetchCategories } from '../redux/slices/categorySlice';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import {
    GiSaltShaker,
    GiCoffeeCup,
    GiOilDrum,
    GiBroccoli,
    GiWheat,
    GiMilkCarton,
    GiMeat,
    GiFruitBowl,
} from "react-icons/gi";
import { FaWineBottle } from "react-icons/fa";
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { createCart, updateCart, getallMyCarts } from '../redux/slices/cart.Slice';
import { clearSearch } from '../redux/slices/search.Slice';
import { Col, Container, Row } from 'react-bootstrap';
import { FaChevronRight, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import Accordion from 'react-bootstrap/Accordion';
import { toast } from 'react-toastify';
import { createWishlist, deleteFromWishlist, getWishlistItems } from '../redux/slices/wishlist.Slice';
import LoadingSpinner from '../components/LoadingSpinner';

function Vegetable({ setIsProductDetailPage, setSelectedProductId, setIsVegetablePage }) {
    const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem('selectedCategoryId') || '');

    const iconMapping = {
        "Salt": <GiSaltShaker size={35} />,
        "Coffee & Tea": <GiCoffeeCup size={35} />,
        "Oil": <GiOilDrum size={35} />,
        "Vinegar": <FaWineBottle size={35} />,
        "Vegetables": <GiBroccoli size={35} />,
        "Grains": <GiWheat size={30} />,
        "Dairy": <GiMilkCarton size={30} />,
        "Meat": <GiMeat size={30} />,
        "Fruits": <GiFruitBowl size={30} />
    };

    const getCategoryIcon = (categoryName) => {
        for (const [key, icon] of Object.entries(iconMapping)) {
            if (categoryName.toLowerCase().includes(key.toLowerCase())) {
                return icon;
            }
        }
        return <GiBroccoli size={35} />;
    };
    const [selectedSubcategory, setSelectedSubcategory] = useState(localStorage.getItem('selectedSubCategoryIdfromheader') || '');
    const [showModal, setShowModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const { wishlistItems } = useSelector(state => state.wishlist);

    const isInWishlist = (productId) => {
        return wishlistItems?.some(item => item.productId === productId);
    };

    // Helper function for subcategory ID comparison
    const compareSubcategoryIds = (id1, id2) => {
        return String(id1).trim() === String(id2).trim();
    };

    // Handler for subcategory selection
    const handleSubcategorySelect = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
        localStorage.setItem('selectedSubCategoryIdfromheader', subcategoryId);
        dispatch(fetchProducts({ subcategoryId }));
        handleFilterClose();
    };

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
    // Update handleCategorySelect function to work with both slider and offcanvas
    // handleCategorySelect ફંક્શન અપડેટ કરો
    const handleCategorySelect = (categoryId) => {
        // કેટેગરી સિલેક્ટ કરો
        setSelectedCategory(categoryId);
        // localStorage માં કેટેગરી ID સેવ કરો
        localStorage.setItem('selectedCategoryId', categoryId);
        localStorage.removeItem('searchQuery');
        localStorage.removeItem('selectedSubCategoryIdfromheader');
        // સિલેક્ટેડ કેટેગરી ના પ્રોડક્ટ્સ ફેચ કરો
        dispatch(fetchProducts({ categoryId }));
        // offcanvas બંધ કરો
        handleFilterClose();
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
    const { subcategories } = useSelector(state => state.subcategory);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [modalShow, setModalShow] = useState(false);

    // Inside your function component, add these state variables
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    console.log(selectedProduct, "aaaaaa");


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
                categoryId: p.categoryId,
                description: p.description
            })));
        }
    }, [selectedCategory, products]);

    // Add this to your useEffect
    // Update the useEffect to initialize productQuantities from cartItems
    useEffect(() => {
        dispatch(fetchProducts({}));
        dispatch(fetchProductVariants({ page: 1, pageSize: 10 }));
        dispatch(fetchCategories({ page: 1, pageSize: 10 }));
        dispatch(getAllSubcategories());
        dispatch(getallMyCarts());
        dispatch(getWishlistItems());
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

    const handleClose = () => {
        setModalShow(false);
        setTimeout(() => {
            setShowModal(false);
            setQuantity(1);
        }, 200);
    };

    // const handleShow = (product) => {
    //     const variant = variants?.find(v => v.productId === product._id);
    //     const existingCartItem = cartItems?.find(item =>
    //         item.productId === product._id &&
    //         item.productVarientId === variant?._id
    //     );

    //     setSelectedProduct(product);
    //     setQuantity(existingCartItem?.quantity || 1);
    //     setShowModal(true);
    //     setTimeout(() => setModalShow(true), 100);
    // };
    const handleShow = (product) => {
        const variant = variants?.find(v => v.productId === product._id);
        const existingCartItem = cartItems?.find(item =>
            item.productId === product._id &&
            item.productVarientId === variant?._id
        );

        // Attach variant data directly to selectedProduct for modal use
        setSelectedProduct({
            ...product,
            variantPrice: variant?.price,
            variantDiscount: variant?.discount,
            variantId: variant?._id,
            images: product.images,
            // Add more variant fields if needed
        });
        setQuantity(existingCartItem?.quantity || 1);
        setShowModal(true);
        setTimeout(() => setModalShow(true), 100);
    };
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

                // Get search query from localStorage
                const searchQuery = localStorage.getItem('searchQuery');

                // If search query exists, filter by product name
                if (searchQuery) {
                    return product.productName.toLowerCase().includes(searchQuery.toLowerCase());
                }

                // Get selected category and subcategory from localStorage
                const selectedCategoryFromStorage = localStorage.getItem('selectedCategoryId');
                const selectedSubcategoryFromStorage = localStorage.getItem('selectedSubCategoryIdfromheader');

                // Match category if selected
                const matchesCategory = !selectedCategoryFromStorage ||
                    (product.categoryId && compareCategoryIds(product.categoryId, selectedCategoryFromStorage));

                // Match subcategory if selected
                const matchesSubcategory = !selectedSubcategoryFromStorage ||
                    (product.subCategoryId && compareSubcategoryIds(product.subCategoryId, selectedSubcategoryFromStorage));

                return matchesCategory && matchesSubcategory;
            })
            .map(product => {
                const variant = variants.find(v => v.productId === product._id);
                const cartItem = cartItems?.find(item => item.productId === product._id);
                const category = categories?.find(cat => cat._id === product.categoryId);

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
                    quantity: cartItem?.quantity || 0,
                    description: product.description,
                    categoryName: category?.categoryName || 'Uncategorized'  // Add this line
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
    console.log("filteredProducts", filteredProducts)

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

    const handleFilterOpen = () => setShowFilter(true);
    const handleFilterClose = () => setShowFilter(false);

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "200px" }}
            >
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden"> <LoadingSpinner></LoadingSpinner></span>
                </div>
            </div>
        );
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

    const handleModalQuantityChange = (change) => {
        setQuantity((prev) => {
            const newQty = prev + change;
            if (newQty < 1) return 1;
            if (newQty > 10) return 10;
            return newQty;
        });
    };

    // Add this function to your component
    const handleApplyPriceFilter = () => {
        // Convert inputs to numbers
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : 0;

        // Validate that max is greater than min if both are provided
        if (maxPrice && min > max) {
            alert("Maximum price should be greater than minimum price");
            return;
        }

        // Create a price range string for filtering
        let priceRange = '';
        if (minPrice && maxPrice) {
            priceRange = `${min}-${max}`;
        } else if (minPrice) {
            priceRange = `${min}-999999`; // Some large number as upper limit
        } else if (maxPrice) {
            priceRange = `0-${max}`;
        }

        // Update the selected price state
        setSelectedPrice(priceRange);

        // Close the offcanvas after applying filter
        handleFilterClose();
    };

    const handleAddToCart = async (product) => {
        try {
            const variant = variants?.find(v => v.productId === product._id);
            if (!variant) {
                toast.error("Product variant not found");
                return;
            }

            const existingCartItem = cartItems?.find(item =>
                item.productId === product._id &&
                item.productVarientId === variant._id
            );

            if (existingCartItem) {
                await dispatch(updateCart({
                    cartId: existingCartItem._id,
                    productId: product._id,
                    productVarientId: variant._id,
                    quantity: quantity
                })).unwrap();
                toast.success("Cart updated successfully");
            } else {
                await dispatch(createCart({
                    productId: product._id,
                    productVarientId: variant._id,
                    quantity: quantity
                })).unwrap();
                toast.success("Added to cart successfully");
            }

            await dispatch(getallMyCarts());
            handleClose(); // Close modal after cart operation
        } catch (error) {
            console.error('Failed to update cart:', error);
            toast.error(error.message || "Failed to update cart");
        }
    };


    const handleAddToWishlist = async (productId) => {
        try {
            const isAlreadyInWishlist = isInWishlist(productId);

            if (isAlreadyInWishlist) {
                // Remove from wishlist
                const wishlistItem = wishlistItems.find(item => item.productId === productId);
                if (wishlistItem) {
                    await dispatch(deleteFromWishlist(wishlistItem._id)).unwrap();
                    toast.success('Item removed from wishlist');
                } else {
                    toast.error('Wishlist item not found');
                }
            } else {
                // Add to wishlist
                await dispatch(createWishlist(productId)).unwrap();
                toast.success('Item added to wishlist');
            }
        } catch (error) {
            toast.error(error.message || 'Wishlist operation failed');
        }
    };


    return (
        <div className='z_main_off'>
            <section className="Z_banner z_sm_db">
                <Container>
                    <Row className="justify-content-end">
                        <Col md={6} className="d-flex align-items-center">
                            <div className="Z_banner_content text-end">
                                <h2>Premium Grocery Store</h2>
                                <p>Discover our selection of high-quality nuts, dried fruits, seeds, spices, and grains</p>
                                <Link to="/Vegetable" className="order-now-btn">
                                    Order Now
                                    <span>
                                        <FaChevronRight />
                                    </span>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <div className='a_header_container'>
                {/* Banner Section */}
                <section className="Z_banner z_lg_db">
                    <Container>
                        <Row className="justify-content-end">
                            <Col md={6} className="d-flex align-items-center">
                                <div className="Z_banner_content text-end">
                                    <h2>Premium Grocery Store</h2>
                                    <p>Discover our selection of high-quality nuts, dried fruits, seeds, spices, and grains</p>
                                    <Link to="/Vegetable" className="order-now-btn">
                                        Order Now
                                        <span>
                                            <FaChevronRight />
                                        </span>
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Modify category slider */}
                <section className="z_category-slider-section">
                    <div>
                        <div className="z_section-header mb-4">
                            <h3 className="z_section-title">Category</h3>
                        </div>
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={20}
                            slidesPerView={6}
                            loop={true}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                480: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 4, spaceBetween: 15 },
                                1024: { slidesPerView: 5, spaceBetween: 20 },
                                1200: { slidesPerView: 6, spaceBetween: 20 },
                            }}
                            className="z_category-swiper"
                        >
                            {categories.map((category, index) => (
                                <SwiperSlide key={index}>
                                    <div className="db_card text-center h-100"
                                        style={{
                                            border: selectedCategory === category._id ? '1px solid #2c6145' : '1px solid transparent',
                                        }}>
                                        <div
                                            className={`z_category-card d-flex flex-column justify-content-center align-items-center ${selectedCategory === category._id ? 'active-category' : ''}`}
                                            onClick={() => {
                                                localStorage.removeItem('selectedSubCategoryIdfromheader');

                                                if (selectedCategory === category._id) {
                                                    localStorage.removeItem('selectedCategoryId');
                                                    setSelectedCategory('');
                                                    dispatch(fetchProducts({}));
                                                } else {
                                                    setSelectedCategory(category._id);
                                                    localStorage.setItem('selectedCategoryId', category._id);
                                                    localStorage.removeItem('searchQuery');
                                                    localStorage.removeItem('selectedSubCategoryIdfromheader');
                                                    dispatch(fetchProducts({ categoryId: category._id }));
                                                }
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: '50%',
                                                padding: '10px',
                                                transition: 'all 0.3s ease',
                                                height: '150px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                backgroundColor: 'transparent',

                                            }}
                                        >
                                            <div className="db_icon">{getCategoryIcon(category.categoryName)}</div>
                                            <h6 className="db_card_title mb-0">
                                                {category.categoryName?.length > 17 ? `${category.categoryName.substring(0, 17)}...` : category.categoryName}
                                            </h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </div>
                </section>

                {/* Filter and Sort Bar */}
                <div className="z_filter-sort-bar">
                    <button className="z_filter-btn" onClick={handleFilterOpen}>
                        <span className="z_filter-icon"><HiOutlineAdjustmentsHorizontal /></span> Filter
                    </button>
                    <div className="z_sort-dropdown" style={{ position: 'relative',display:'inline-block' }}>
                        <select
                            className="z_sort-select"
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                        >
                            <option value="">Sort by</option>
                            <option value="popular">Popular</option>
                            <option value="recent">Most Recent</option>
                            <option value="high">Price - High</option>
                            <option value="low">Price - Low</option>
                        </select>
                    </div>
                </div>

                {/* Offcanvas for Filter */}
                <Offcanvas show={showFilter} onHide={handleFilterClose} placement="start" className="z_filter-offcanvas">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="z_filter-title">Filter Products</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="z_filter-body">
                            <Accordion defaultActiveKey={['0']} alwaysOpen className="z_filter-accordion">
                                {/* Price Filter */}
                                {/* // Update the price filter Accordion.Item */}
                                <Accordion.Item eventKey="0" className="z_filter-group">
                                    <Accordion.Header className="z_filter-group-header">
                                        <h4 className="mb-0">Price Range</h4>
                                    </Accordion.Header>
                                    <Accordion.Body className="z_filter-group-content">
                                        <div className="z_price-inputs">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                className="z_price-input"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                            <span className="z_price-separator">-</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                className="z_price-input"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="z_filter-buttons d-flex justify-content-between">
                                            <button
                                                className="z_apply-filter-btn"
                                                onClick={handleApplyPriceFilter}
                                            >
                                                Apply
                                            </button>
                                            <button
                                                className="z_apply-filter-btn"
                                                onClick={() => {
                                                    setMinPrice('');
                                                    setMaxPrice('');
                                                    setSelectedPrice('');
                                                }}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* Category Filter */}
                                <Accordion.Item eventKey="1" className="z_filter-group">
                                    <Accordion.Header className="z_filter-group-header">
                                        <h4 className="mb-0">Categories</h4>
                                    </Accordion.Header>
                                    <Accordion.Body className="z_filter-group-content">
                                        <div className="z_checkbox-group">
                                            <label
                                                className="z_checkbox-label"
                                                onClick={() => {
                                                    // localStorage માંથી selectedCategoryId દૂર કરો
                                                    localStorage.removeItem('selectedCategoryId');
                                                    // selectedCategory ને ખાલી કરો
                                                    setSelectedCategory('');
                                                    // બધા પ્રોડક્ટ્સ ફેચ કરો
                                                    dispatch(fetchProducts({}));
                                                    // ફિલ્ટર મેનુ બંધ કરો
                                                    handleFilterClose();
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="z_checkbox-input"
                                                    checked={!selectedCategory}
                                                    readOnly
                                                />
                                                <span className="z_checkbox-custom"></span>
                                                All Categories
                                            </label>

                                            {categories.map((category, index) => (
                                                <label
                                                    className="z_checkbox-label"
                                                    key={category._id || index}
                                                    onClick={() => handleCategorySelect(category._id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="z_checkbox-input"
                                                        checked={compareCategoryIds(selectedCategory, category._id)}
                                                        readOnly
                                                    />
                                                    <span className="z_checkbox-custom"></span>
                                                    {category.categoryName}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* Subcategory Filter */}
                                <Accordion.Item eventKey="subcategory" className="z_filter-group">
                                    <Accordion.Header className="z_filter-group-header">
                                        <h4 className="mb-0">Subcategories</h4>
                                    </Accordion.Header>
                                    <Accordion.Body className="z_filter-group-content">
                                        <div className="z_checkbox-group">
                                            <label
                                                className="z_checkbox-label"
                                                onClick={() => {
                                                    // localStorage માંથી selectedSubcategoryId દૂર કરો
                                                    localStorage.removeItem('selectedSubCategoryIdfromheader');
                                                    // selectedSubcategory ને ખાલી કરો
                                                    setSelectedSubcategory('');
                                                    // બધા પ્રોડક્ટ્સ ફેચ કરો
                                                    dispatch(fetchProducts({}));
                                                    // ફિલ્ટર મેનુ બંધ કરો
                                                    handleFilterClose();
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="z_checkbox-input"
                                                    checked={!selectedSubcategory}
                                                    readOnly
                                                />
                                                <span className="z_checkbox-custom"></span>
                                                All Subcategories
                                            </label>

                                            {subcategories
                                                .filter(subcategory => !selectedCategory || subcategory.categoryId === selectedCategory)
                                                .map((subcategory, index) => (
                                                    <label
                                                        className="z_checkbox-label"
                                                        key={subcategory._id || index}
                                                        onClick={() => handleSubcategorySelect(subcategory._id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="z_checkbox-input"
                                                            checked={compareSubcategoryIds(selectedSubcategory, subcategory._id)}
                                                            readOnly
                                                        />
                                                        <span className="z_checkbox-custom"></span>
                                                        {subcategory.subCategoryName}
                                                    </label>
                                                ))}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* Discount Filter */}
                                <Accordion.Item eventKey="discount" className="z_filter-group">
                                    <Accordion.Header className="z_filter-group-header">
                                        <h4 className="mb-0">Discount</h4>
                                    </Accordion.Header>
                                    <Accordion.Body className="z_filter-group-content">
                                        <div className="z_radio-group">
                                            <label className="z_radio-label">
                                                <input type="radio" name="discount" className="z_radio-input" />
                                                <span className="z_radio-custom"></span>
                                                10% and above
                                            </label>
                                            <label className="z_radio-label">
                                                <input type="radio" name="discount" className="z_radio-input" />
                                                <span className="z_radio-custom"></span>
                                                20% and above
                                            </label>
                                            <label className="z_radio-label">
                                                <input type="radio" name="discount" className="z_radio-input" />
                                                <span className="z_radio-custom"></span>
                                                30% and above
                                            </label>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Modify cards  */}
                {/* <h2>modify cards</h2> */}
                <div className="">
                    <div className="row">
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map((product, index) => (
                                // console.log("product", product, product.discount)

                                <div key={index} className="col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-4">
                                    <Card className="z_product-card">
                                        <div className="z_product-image-container">
                                            <Card.Img
                                                variant="top"
                                                src={Array.isArray(product.image) ? `http://localhost:4000/${product.image[0]}` : `http://localhost:4000/${product.image}`}
                                                alt={product.name}
                                                className="z_product-image"
                                            />
                                            <div className="z_hover-overlay">
                                                <div className="z_hover-icons">
                                                    <button className="z_hover-icon-btn" onClick={() => handleAddToCart(product)}
                                                        disabled={!product.stockStatus}>
                                                        <FaShoppingCart />
                                                    </button>
                                                    <button
                                                        className={`z_hover-icon-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                                                        onClick={() => handleAddToWishlist(product._id)}
                                                    >
                                                        <FaHeart style={{ color: isInWishlist(product._id) ? 'red' : 'inherit' }} />
                                                    </button>
                                                    <button
                                                        className="z_hover-icon-btn"
                                                        onClick={() => handleShow(product)}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Add HOT badge */}
                                            <div className="Z_black-ribbon">
                                                {product.discount}
                                            </div>

                                            {/* {product.discount > 0 && (
                                               
                                            )} */}
                                        </div>
                                        <Card.Body className="z_card-body">
                                            {/* If you have a rating, render it here */}
                                            {/* <div className="z_rating-container">
                                                {renderStars(product.rating)}
                                                <span className="z_rating-text">({product.rating})</span>
                                            </div> */}
                                            <Card.Title className="z_product-title text-nowrap" onClick={() => {
                                                localStorage.setItem('selectedProductId', product._id);
                                                localStorage.setItem('activePage', 'ProductDetails');
                                                navigate(`/product-details/${product._id}`);
                                            }}>{product.name}</Card.Title>
                                            <Card.Text className="z_product-subtitle">
                                                {product.size}
                                            </Card.Text>
                                            <div className="z_price-container">
                                                <span className="z_current-price">{product.price}</span>
                                                <span className="z_original-price">{product.discountPrice}</span>
                                            </div>
                                            {/* <div className="z_add-to-cart-container">
                                                {productQuantities[product.name] ? (
                                                    <div className="z_add-button added">
                                                        <button onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleQuantityChange(product, -1);
                                                        }}>-</button>
                                                        <span>{productQuantities[product.name]}</span>
                                                        <button onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleQuantityChange(product, 1);
                                                        }}>+</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="z_add-button"
                                                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(product, 1); }}
                                                    >
                                                        ADD
                                                    </button>
                                                )}
                                            </div> */}
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <div className="text-center w-100 py-5">
                                <h4>No products found</h4>
                                <p>Try adjusting your filters or search criteria</p>
                            </div>
                        )}
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
                                                    src={`http://localhost:4000/${selectedProduct.image?.[0]}`}
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
                                                <h4 className="mb-3">{selectedProduct.name}</h4>

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
                                                      {/* // ...inside your Modal... */}
                                                        <button
                                                            className="z_modal-quantity-btn"
                                                            onClick={() => handleModalQuantityChange(-1)}
                                                            disabled={quantity === 1}
                                                        >
                                                            <FaMinus size={12} />
                                                        </button>

                                                        <div className="d-flex flex-column align-items-center">
                                                            <span className="z_modal-quantity-number">
                                                                {quantity}
                                                            </span>
                                                        </div>

                                                        <button
                                                            className="z_modal-quantity-btn"
                                                            onClick={() => handleModalQuantityChange(1)}
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
                                                            {selectedProduct.categoryName || 'Uncategorized'}
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
                </div>
            </div >
        </div>
    );
}

export default Vegetable;
