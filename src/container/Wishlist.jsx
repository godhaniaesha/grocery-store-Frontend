import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Wishlist.css';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: 'Organic Bananas',
            price: 4.99,
            image: require("../image/z_accets/Almonds3.png"),
            quantity: 1,
            discount: 10,
            category: 'Fruits',
            rating: 4.5,
            subtitle: 'Fresh organic produce'
        },
        {
            id: 2,
            name: 'Organic Bananas',
            price: 4.99,
            image: require("../image/z_accets/Almonds3.png"),
            quantity: 1,
            discount: 10,
            category: 'Fruits',
            rating: 4.5,
            subtitle: 'Fresh organic produce'
        },
        {
            id: 3,
            name: 'Organic Bananas',
            price: 4.99,
            image: require("../image/z_accets/Almonds3.png"),
            quantity: 1,
            discount: 10,
            category: 'Fruits',
            rating: 4.5,
            subtitle: 'Fresh organic produce'
        },
        {
            id: 4,
            name: 'Organic Bananas',
            price: 4.99,
            image: require("../image/z_accets/Almonds3.png"),
            quantity: 1,
            discount: 10,
            category: 'Fruits',
            rating: 4.5,
            subtitle: 'Fresh organic produce'
        },
        {
            id: 5,
            name: 'Organic Bananas',
            price: 4.99,
            image: require("../image/z_accets/Almonds3.png"),
            quantity: 1,
            discount: 10,
            category: 'Fruits',
            rating: 4.5,
            subtitle: 'Fresh organic produce'
        },
        {
            id: 6,
            name: 'Organic Bananas',
            price: 4.99,
            image: require("../image/z_accets/Almonds3.png"),
            quantity: 1,
            discount: 10,
            category: 'Fruits',
            rating: 4.5,
            subtitle: 'Fresh organic produce'
        },
        // Add more items as needed
    ]);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`z_star ${index < rating ? 'z_star-filled' : ''}`}
            />
        ));
    };

    const removeFromWishlist = (itemId) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    };

    const addToCart = (item) => {
        console.log('Added to cart:', item);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="db_wishlist">
                <div className="db_empty_wishlist">
                    <div className="db_empty_content">
                        <div className="db_empty_icon">
                            <FaHeart />
                        </div>
                        <h3>Your Wishlist is Empty</h3>
                        <p>Add items that you like to your wishlist and review them anytime</p>
                        <Link to="/shop" className="db_shop_btn">
                            <FaShoppingCart className="db_btn_icon" />
                            Start Shopping
                        </Link>
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
          {wishlistItems.map((item) => (
            <Card key={item.id} className="z_product-card">
              <div className="z_product-image-container">
                <Card.Img variant="top" src={item.image} alt={item.name} />
                <div className="z_hover-overlay">
                  <div className="z_hover-icons">
                    <button
                      className="z_hover-icon-btn"
                      onClick={() => addToCart(item)}
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      className="z_hover-icon-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
              <Card.Body className="z_card-body">
                <div className="z_rating-container">
                  {renderStars(item.rating)}
                  <span className="z_rating-text">({item.rating})</span>
                </div>
                <Card.Title className="z_product-title">{item.name}</Card.Title>
                <Card.Text className="z_product-subtitle">
                  {item.subtitle}
                </Card.Text>
                <div className="z_price-container">
                  <span className="z_current-price">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.discount > 0 && (
                    <span className="z_original-price">
                      ${(item.price * (1 + item.discount / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    );
};

export default Wishlist;