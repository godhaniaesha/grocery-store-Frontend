import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrency,
  selectCurrencySymbol,
  convertPrice,
} from "../redux/slices/currency.Slice";

import { fetchProductById, fetchProducts } from "../redux/slices/product.Slice";
import "../styles/ProductDetails.css";
import "../styles/denisha.css";
import "../styles/x_app.css";
import { LiaAngleRightSolid } from "react-icons/lia";
import { FaPlus } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { fetchProductVariants } from "../redux/slices/productVeriant.Slice";
import {
  createCart,
  updateCart,
  getallMyCarts,
} from "../redux/slices/cart.Slice";
import SimilarPro from "./SimilarPro";
const ProductDetails = ({setIsVegetablePage,setIsProductDetailPage,productId}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCurrency = useSelector(selectCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const { conversionRates } = useSelector((state) => state.currency);

  const { product, loading, error } = useSelector((state) => state.product);
  const id = localStorage.getItem("selectedProductId");
  const {
    products,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.product || {});
  const {
    variants,
    loading: variantLoading,
    error: variantError,
  } = useSelector((state) => state.productveriant || {});
  const { cartItems } = useSelector((state) => state.addcart);

  const [selectedSize, setSelectedSize] = useState("250g");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const [productQuantitiesPro, setProductQuantitiesPro] = useState({});
  const shareUrl = window.location.href;

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
    return `${currencySymbol}${convertedAmount}`;
  };

  useEffect(() => {
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchProductVariants({ page: 1, pageSize: 10 }));
    dispatch(getallMyCarts({}));
  }, [dispatch]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      // Set initial image path
      const imagePath = product.images[0].split("public\\")[1];
      setActiveImage(imagePath);

      // Set initial size from first variant if available
      if (product.productVarientData && product.productVarientData.length > 0) {
        setSelectedSize(product.productVarientData[0].size);

        // Set initial quantity based on cart item if exists
        const currentVariant = getCurrentVariant();
        if (currentVariant) {
          const cartItem = cartItems?.find(
            (item) =>
              item.productId === product._id &&
              item.productVarientId === currentVariant._id
          );
          if (cartItem) {
            setQuantity(cartItem.quantity);
          } else {
            setQuantity(1);
          }
        }
      }
    }
  }, [product, cartItems]);

  // Update quantity when variant changes
  useEffect(() => {
    if (product && selectedSize) {
      const currentVariant = getCurrentVariant();
      if (currentVariant) {
        const cartItem = cartItems?.find(
          (item) =>
            item.productId === product._id &&
            item.productVarientId === currentVariant._id
        );
        setQuantity(cartItem ? cartItem.quantity : 1);
      }
    }
  }, [selectedSize, product, cartItems]);

  const handleThumbnailClick = (image, index) => {
    const imagePath = image.split("public\\")[1];
    setActiveImage(imagePath);
    setActiveThumbnail(index);
  };

  const getCurrentVariant = () => {
    console.log("Product data:", product);
    console.log("Selected size:", selectedSize);

    if (!product) {
      console.log("Product is undefined");
      return null;
    }

    if (!product.productVarientData) {
      console.log("productVarientData is undefined");
      return null;
    }

    if (!Array.isArray(product.productVarientData)) {
      console.log(
        "productVarientData is not an array:",
        product.productVarientData
      );
      return null;
    }

    const variant = product.productVarientData.find(
      (v) => v.size === selectedSize
    );
    console.log("Found variant:", variant);
    console.log("All variants:", product.productVarientData);

    return variant || product.productVarientData[0];
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Move all data processing here, before any conditional returns
  const thumbnails =
    product && product.images
      ? product.images.map((img, index) => ({
          image: `http://localhost:4000/${img.split("public\\")[1]}`,
          alt: `${product.productName} view ${index + 1}`,
        }))
      : [];

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const isProductInCart = (productId, variantId) => {
    return cartItems?.some(
      (item) =>
        item.productId === productId && item.productVarientId === variantId
    );
  };
  // Add this function before the return statement
  const handleProCartAdd = async () => {
    try {
      const currentVariant = getCurrentVariant();
      if (!currentVariant) return;

      // Check if product is already in cart
      const existingCartItem = cartItems.find(
        (item) =>
          item.productId === product._id &&
          item.productVarientId === currentVariant._id
      );

      if (existingCartItem) {
        // Update existing cart item with new quantity instead of adding
        const cartData = {
          cartId: existingCartItem._id,
          productId: product._id,
          productVarientId: currentVariant._id,
          quantity: quantity, // Use the new quantity directly instead of adding
        };
        await dispatch(updateCart(cartData)).unwrap();
      } else {
        // Add new item to cart
        const cartData = {
          productId: product._id,
          productVarientId: currentVariant._id,
          quantity: quantity,
        };
        await dispatch(createCart(cartData)).unwrap();
      }

      // Refresh cart items
      dispatch(getallMyCarts({}));
      setQuantity(1); // Reset quantity after adding to cart
    } catch (error) {
      console.error("Failed to add/update cart:", error);
    }
  };

  return (
    <>
      <div className="a_product-details-container">
        <div className="row">
          <div className="col-sm-6">
            {/* // First fix the main image container */}
            <div className="a_product-image-container">
              <img
                src={`http://localhost:4000/public/${activeImage}`}
                alt={product?.productName}
                className="a_main-product-image"
              />
            </div>

            {/* Then fix the thumbnails */}
            <div className="a_thumbnail-container mt-3 d-flex gap-2">
              {product?.images?.map((img, index) => (
                <div
                  key={index}
                  className={`a_thumbnail ${
                    index === activeThumbnail ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(img, index)}
                >
                  <img
                    src={`http://localhost:4000/${img}`}
                    alt={`${product?.productName} ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="a_product-info">
              <div className="d-flex justify-content-between align-items-start">
                <h2 className="a_product-title">{product?.productName}</h2>
                <button
                  className="btn a_share-btn"
                  onClick={() => setShowShareModal(true)}
                >
                  <img src={require("../img/a_img/share.png")} alt="Share" />
                </button>
              </div>
              <div>
                <p className="fw-bold">{getCurrentVariant()?.size}</p>
              </div>
              <div className="a_price-section mt-3">
                <span>Price :</span>
                <span className="a_current-price">
                {formatPrice( `${getCurrentVariant()?.price}`)}
                </span>
                <span className="a_original-price">
                {formatPrice( `${getCurrentVariant()?.discountPrice}`)}
                </span>
              </div>
              <small className="a_small_txt">Save up to 15% OFF</small>
              <div className="size-selection mt-sm-4 mt-2">
                <p className="mb-2">Pack Size</p>
                <div className="d-flex gap-2">
                  {product?.productVarientData?.map((variant) => (
                    <button
                      key={variant.size}
                      className={`a_size-btn ${
                        selectedSize === variant.size ? "active" : ""
                      }`}
                      onClick={() => handleSizeChange(variant.size)}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="a_quantity-section mt-4 d-flex align-items-md-center align-items-sm-start flex-md-row flex-sm-column gap-3">
                <div className="a_quantity-controls d-flex align-items-center">
                  <button
                    className="btn a_quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="a_quantity-display">{quantity}</span>
                  <button
                    className="btn a_quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <FiPlus />
                  </button>
                </div>
                <Button
                  variant="success"
                  className="a_add-to-cart-btn"
                  onClick={() => handleProCartAdd()}
                >
                  <img src={require("../img/a_img/cartwhite.png")} alt="cart" />{" "}
                  Add to Cart
                </Button>
              </div>

              <div className="a_product-sections mt-4">
                <div className="a_section">
                  <h3>Product Description</h3>
                  <p>{product?.description}</p>
                </div>
                <div className="a_section">
                  <h3>Health Benefits</h3>
                  <p>{product?.healthBenefits}</p>
                </div>
                <div className="a_section">
                  <h3>Storage and Uses</h3>
                  <p>{product?.storageAndUses}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {/* <SimilarPro /> */}

      {showShareModal && (
        <>
          <div
            className="a_share_modal_backdrop"
            onClick={() => setShowShareModal(false)}
          ></div>
          <div className="a_share_modal">
            <div className="a_share_modal_header">
              <h3>Share</h3>
              <button
                className="a_share_modal_close"
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>
            <div className="a_share_modal_content">
              <div className="a_share_product_info">
                <img
                  src={activeImage}
                  alt="Broccoli"
                  className="a_share_product_image"
                />
                <h4>Broccoli - Organically Grown</h4>
              </div>
              <div className="a_share_url_container">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="a_share_url_input"
                  placeholder="Product URL"
                />
                <button
                  className="a_share_url_copy"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                >
                  Copy
                </button>
              </div>
              <div className="a_share_social_buttons">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a_share_social_btn facebook"
                >
                  <img
                    src={require("../img/a_img/facebook.png")}
                    alt="Facebook"
                  />
                  <span>Facebook</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Check out this product: ${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a_share_social_btn whatsapp"
                >
                  <img
                    src={require("../img/a_img/whatsapp.png")}
                    alt="Whatsapp"
                  />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a_share_social_btn x"
                >
                  <img src={require("../img/a_img/x.png")} alt="X" />
                  <span>X</span>
                </a>
                <a
                  href={`https://www.instagram.com/share?url=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a_share_social_btn instagram"
                >
                  <img
                    src={require("../img/a_img/insta.png")}
                    alt="Instagram"
                  />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <SimilarPro setIsVegetablePage={setIsVegetablePage} setIsProductDetailPage={setIsProductDetailPage} />
    </>
  );
};

export default ProductDetails;
