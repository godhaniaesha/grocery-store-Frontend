import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  getWishlistItems,
  deleteFromWishlist,
} from "../redux/slices/wishlist.Slice";
import {
  createCart,
  updateCart,
  getallMyCarts,
} from "../redux/slices/cart.Slice";
import { fetchProductVariants } from "../redux/slices/productVeriant.Slice";
import { toast } from "react-toastify";
import "../styles/Wishlist.css";
import LoadingSpinner from "../components/LoadingSpinner";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    wishlistItems = [],
    loading,
    error,
  } = useSelector((state) => state.wishlist);
  console.log(wishlistItems, "wishlistItems");

  const { variants } = useSelector((state) => state.productveriant);

  useEffect(() => {
    dispatch(getWishlistItems());
    dispatch(fetchProductVariants({}));
  }, [dispatch]);

  const renderStars = (rating) => {
    const productRating = parseFloat(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`z_star ${index < productRating ? "z_star-filled" : ""}`}
      />
    ));
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await dispatch(deleteFromWishlist(wishlistId)).unwrap();
      toast.success("Item has been successfully removed from wishlist.");
      dispatch(getWishlistItems());
    } catch (error) {
      toast.error("Failed to remove item.");
      console.error("Wishlist deletion failed:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const variant = variants?.find((v) => v.productId === product._id);
      if (!variant) {
        toast.error("Product variant not found");
        return;
      }

      await dispatch(
        createCart({
          productId: product._id,
          productVarientId: variant._id,
          quantity: 1,
        })
      ).unwrap();
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Cart operation failed:", error);
      if (error?.message === "Cart Already Exist") {
        toast.info("Item quantity updated in cart");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="db_wishlist">
        <div className="db_empty_wishlist">
          <div className="db_empty_content">
            <div className="db_empty_icon" style={{ marginBottom: "1.5rem" }}>
              {/* SVG Illustration for Empty Wishlist */}
              {/* Alternate SVG Illustration for Empty Wishlist */}
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="35"
                  y="45"
                  width="50"
                  height="55"
                  rx="6"
                  fill="#F0F9F9"
                  stroke="#2c6145"
                  strokeWidth="2"
                />
                <path
                  d="M42 45V40C42 35 78 35 78 40V45"
                  stroke="#2c6145"
                  strokeWidth="1.5"
                />
                <path
                  d="M60 70C60 70 52 64 52 58C52 54 55.5 51 58.5 51C60.433 51 62 52.3 62 54C62 52.3 63.567 51 65.5 51C68.5 51 72 54 72 58C72 64 64 70 64 70H60Z"
                  fill="#2c6145"
                  fillOpacity="0.2"
                  stroke="#2c6145"
                  strokeWidth="1.2"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="56"
                  stroke="#2c6145"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3>Your Wishlist is Empty</h3>
            <p>
              Add items that you like to your wishlist and review them anytime
            </p>
            {/* <Link to="/vegetable" className="db_shop_btn">
                            <FaShoppingCart className="db_btn_icon" />
                            Start Shopping
                        </Link> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="a_header_container db_wishlist my-4">
      <div className="db_wishlist_header">
        <div className="db_header_content">
          <h2 className="db_title">My Wishlist</h2>
          <div className="db_count">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "Item" : "Items"}
          </div>
        </div>
      </div>

      <div className="db_wishlist_grid">
        {wishlistItems.map((item) => {
          const product = item.productData[0];
          const variant = variants?.find((v) => v.productId === product._id);

          return (
            <Card key={item._id} className="z_product-card">
              <div className="z_product-image-container">
                <Card.Img
                  variant="top"
                  src={`http://localhost:4000/${product.images[0]}`}
                  alt={product.productName}
                />
                <div className="z_hover-overlay">
                  <div className="z_hover-icons">
                    <button
                      className="z_hover-icon-btn"
                      onClick={() => addToCart(product)}
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      className="z_hover-icon-btn"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {variant && (
                  <div className="Z_black-ribbon">{variant.discount}</div>
                )}
              </div>
              <Card.Body className="z_card-body">
                <div className="z_rating-container">
                  {renderStars(product?.rating || 0)}
                  <span className="z_rating-text">
                    ({Number(product?.rating || 0).toFixed(1)})
                  </span>
                </div>
                <Card.Title
                  className="z_product-title"
                  onClick={() => {
                    localStorage.setItem("selectedProductId", product._id);
                    localStorage.setItem("activePage", "ProductDetails");
                    navigate(`/product-details/${product._id}`);
                  }}
                >
                  {product.productName}
                </Card.Title>
                <Card.Text className="z_product-subtitle">
                  {product.description}
                </Card.Text>

                {variant && (
                  <div className="z_price-container">
                    <span className="z_current-price">
                      ${variant.price || 0}
                    </span>
                    <span className="z_original-price">
                      ${((variant.price || 0) * 1.2).toFixed(2)}
                    </span>
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
