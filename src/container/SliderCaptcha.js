import React, { useState, useRef, useEffect } from 'react';
import vegetables from '../image/z_accets/bg2.jpeg';
import peppers from '../image/z_accets/peppers.jpeg';
import greens from '../image/z_accets/bg3.jpeg';
import tomatoes from '../image/z_accets/tomatoes.jpeg';
import broccoli from '../image/z_accets/broccoli.jpeg';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SliderCaptcha = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const [targetPosition, setTargetPosition] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentShape, setCurrentShape] = useState(0);

  // Array of all puzzle background images
  const puzzleImages = [
    vegetables,
    peppers,
    greens,
    tomatoes,
    broccoli
  ];

  // Array of different puzzle piece shapes
  const puzzleShapes = [
    'path("M 15 5 C 25 5 25 15 15 15 L 15 30 C 10 30 5 20 15 20 C 25 20 20 10 15 10 L 15 40 C 10 40 5 50 15 50 C 25 50 20 60 15 60 L 15 85 L 85 85 L 85 15 L 15 15 L 15 55 C 5 55 5 45 15 45 Z")',       // Inward top, inward right
    // Simple square (again for more variety)
  ];

  useEffect(() => {
    // Set random target position and random image on component mount
    setTargetPosition(Math.floor(Math.random() * 200) + 50);
    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    setCurrentImage(puzzleImages[randomIndex]);
    const shapeIndex = Math.floor(Math.random() * puzzleShapes.length); // Select a random shape index
    setCurrentShape(shapeIndex);
    console.log("Current Shape Index:", shapeIndex);  // For debugging
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(sliderPosition - targetPosition) < 10) {
      setIsVerified(true);

      // Set verification status in localStorage and dispatch storage event
      localStorage.setItem('isVerified', 'true');
      window.dispatchEvent(new Event('storage'));

      // Add toast notification before navigation
      toast.success('Verification successful! Welcome to FreshMart');

      // Add a small delay before navigating to main
      setTimeout(() => {
        navigate('/Main');
      }, 1000);
    } else {
      setSliderPosition(0);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width - 40));
    setSliderPosition(newPosition);
  };

  return (
    <div className="slider-captcha" style={{
      width: '90%',
      maxWidth: '400px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Title and Subtitle */}
      <h2 style={{
        textAlign: 'center',
        fontSize: 'clamp(20px, 4vw, 24px)',
        marginBottom: '8px',
        color: '#333'
      }}>Slider CAPTCHA</h2>
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(12px, 3vw, 14px)',
        color: '#666',
        marginBottom: '20px'
      }}>Click the button below to verify</p>

      {/* Image Container */}
      <div style={{
        position: 'relative',
        height: 'clamp(120px, 30vw, 150px)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '20px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #e0e0e0'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${currentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        {/* Cut-out Area */}
        <div style={{
          position: 'absolute',
          left: `${targetPosition}px`,
          top: 'calc(50% - 20px)',
          width: 'clamp(30px, 8vw, 40px)',
          height: 'clamp(30px, 8vw, 40px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          zIndex: 1,
          clipPath: puzzleShapes[currentShape]
        }} />

        {/* Movable Puzzle Piece */}
        <div style={{
          position: 'absolute',
          left: `${sliderPosition}px`,
          top: 'calc(50% - 20px)',
          width: 'clamp(30px, 8vw, 40px)',
          height: 'clamp(30px, 8vw, 40px)',
          backgroundImage: `url(${currentImage})`,
          backgroundSize: '100% auto',
          backgroundPosition: `${-targetPosition}px 50%`,
          border: '2px solid #fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          zIndex: 2,
          transition: isDragging ? 'none' : 'left 0.3s',
          clipPath: puzzleShapes[currentShape]
        }} />
      </div>

      {/* Slider Text */}
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(12px, 3vw, 14px)',
        color: '#666',
        marginBottom: '10px'
      }}>Slide to complete the puzzle</p>

      {/* Slider Bar */}
      <div
        ref={sliderRef}
        style={{
          position: 'relative',
          height: 'clamp(35px, 9vw, 40px)',
          backgroundColor: '#f5f5f5',
          borderRadius: '20px',
          cursor: 'pointer',
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          touchAction: 'none' // Improve touch handling
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = sliderRef.current.getBoundingClientRect();
          const newPosition = Math.max(0, Math.min(touch.clientX - rect.left, rect.width - 40));
          setSliderPosition(newPosition);
        }}
      >
        {/* Slider Track */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${sliderPosition + 20}px`,
          backgroundColor: 'rgba(66, 133, 244, 0.2)',
          borderRadius: '20px',
          transition: isDragging ? 'none' : 'width 0.3s'
        }} />

        {/* Slider Handle */}
        <div
          style={{
            position: 'absolute',
            left: `${sliderPosition}px`,
            top: '0',
            width: 'clamp(35px, 9vw, 40px)',
            height: '100%',
            backgroundColor: '#4285f4',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            userSelect: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: isDragging ? 'none' : 'left 0.3s',
            fontSize: 'clamp(16px, 4vw, 20px)'
          }}
        >
          ⇔
        </div>
      </div>

      {/* Verification Status */}
      <div style={{
        marginTop: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <input
          type="checkbox"
          checked={isVerified}
          readOnly
          style={{
            width: 'clamp(16px, 4vw, 18px)',
            height: 'clamp(16px, 4vw, 18px)',
            accentColor: '#4285f4'
          }}
        />
        <span style={{
          color: isVerified ? '#4CAF50' : '#666',
          fontSize: 'clamp(12px, 3vw, 14px)'
        }}>
          {isVerified ? 'Verified!' : 'I am human'}
        </span>
      </div>
    </div>
  );
};

export default SliderCaptcha;