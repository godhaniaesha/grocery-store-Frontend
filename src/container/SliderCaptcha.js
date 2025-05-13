import React, { useState, useRef, useEffect } from 'react';
import vegetables from '../image/z_accets/bg2.jpeg';
import peppers from '../image/z_accets/peppers.jpeg';
import greens from '../image/z_accets/bg3.jpeg';
import tomatoes from '../image/z_accets/tomatoes.jpeg';
import broccoli from '../image/z_accets/broccoli.jpeg';

const SliderCaptcha = () => {
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
    console.log("Current Shape Index:", shapeIndex); // For debugging
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(sliderPosition - targetPosition) < 10) {
      setIsVerified(true);
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
    <div className="slider-captcha" style={{ width: '300px', margin: '20px auto' }}>
      {/* Image Container */}
      <div style={{
        position: 'relative',
        height: '150px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '10px',
        backgroundColor: '#f0f0f0'
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

        {/* Cut-out Area (Empty Space) */}
        <div style={{
          position: 'absolute',
          left: `${targetPosition}px`,
          top: '50px',
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          zIndex: 1,
          clipPath: puzzleShapes[currentShape]
        }} />

        {/* Movable Puzzle Piece */}
        <div style={{
          position: 'absolute',
          left: `${sliderPosition}px`,
          top: '50px',
          width: '40px',
          height: '40px',
          backgroundImage: `url(${currentImage})`,
          backgroundSize: '300px 150px',
          backgroundPosition: `${-targetPosition}px -50px`,
          border: '2px solid #fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          zIndex: 2,
          transition: isDragging ? 'none' : 'left 0.3s',
          clipPath: puzzleShapes[currentShape]
        }} />
      </div>

      {/* Slider Bar */}
      <div
        ref={sliderRef}
        style={{
          position: 'relative',
          height: '40px',
          backgroundColor: '#f0f0f0',
          borderRadius: '20px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        {/* Slider Track (Blue Progress) */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${sliderPosition + 20}px`,
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          borderRadius: '20px',
          transition: isDragging ? 'none' : 'width 0.3s'
        }} />

        {/* Slider Handle */}
        <div
          style={{
            position: 'absolute',
            left: `${sliderPosition}px`,
            top: '0',
            width: '40px',
            height: '40px',
            backgroundColor: '#2196F3',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            userSelect: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: isDragging ? 'none' : 'left 0.3s'
          }}
        >
          ⇔
        </div>
      </div>

      {/* Checkbox and Verification Message */}
      <div style={{
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <input
          type="checkbox"
          checked={isVerified}
          readOnly
          style={{ width: '20px', height: '20px' }}
        />
        <span style={{ color: isVerified ? '#4CAF50' : '#666' }}>
          {isVerified ? 'Verified!' : 'I am human'}
        </span>
      </div>
    </div>
  );
};

export default SliderCaptcha;