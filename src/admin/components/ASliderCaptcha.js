import React, { useState, useRef, useEffect } from 'react';
import vegetables from '../../image/z_accets/bg2.jpeg';
import peppers from '../../image/z_accets/peppers.jpeg';
import greens from '../../image/z_accets/bg3.jpeg';
import tomatoes from '../../image/z_accets/tomatoes.jpeg';
import broccoli from '../../image/z_accets/broccoli.jpeg';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ASliderCaptcha = () => {
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
      // Simple puzzle piece shape scaled for 40x40 container
      'path("M43.2955 22.1958C42.0244 22.1955 40.8418 22.5491 39.8343 23.1634C39.4553 23.3945 38.9806 23.403 38.5936 23.1854C38.2065 22.9679 37.968 22.5583 37.968 22.1142V14.1269C37.968 12.8978 36.9349 11.9093 35.7055 11.9093H25.9206C25.4861 11.9093 25.0839 11.6795 24.863 11.3054C24.6422 10.9312 24.6351 10.4678 24.8454 10.0876C25.3789 9.12397 25.6824 8.01342 25.6824 6.83563C25.6824 3.13281 22.6805 0.128906 18.9767 0.128906C15.274 0.128906 12.2726 3.13383 12.2726 6.83675C12.2726 8.01434 12.5762 9.12438 13.1093 10.0877C13.3199 10.4681 13.3136 10.9316 13.0927 11.3061C12.8716 11.6807 12.4691 11.9093 12.0343 11.9093H2.24971C1.02011 11.9093 0.000102195 12.8978 0.000102195 14.1269V21.9179C0.000102195 22.3503 0.227587 22.7508 0.59886 22.9723C0.970133 23.1939 1.43103 23.2043 1.8113 22.9986C2.75833 22.4864 3.84251 22.1956 4.99476 22.1959C8.69818 22.1954 11.6999 25.198 11.6999 28.9011C11.6999 32.6044 8.69818 35.6067 4.99476 35.6056C3.84241 35.6056 2.75823 35.3147 1.81119 34.8027C1.43052 34.5969 0.969724 34.6065 0.598042 34.8282C0.226463 35.0501 0 35.4509 0 35.8835V44.1367C0 45.3664 1.0199 46.3629 2.24961 46.3629H35.7055C36.9346 46.3629 37.968 45.3664 37.968 44.1367V35.6872C37.968 35.2435 38.2076 34.8343 38.5942 34.6167C38.9808 34.3993 39.4553 34.4069 39.8343 34.6379C40.8416 35.2521 42.0245 35.6056 43.2953 35.6056C46.9989 35.6067 50 32.6044 50 28.9011C50.0001 25.198 46.9989 22.1953 43.2955 22.1958Z")',
      'path("M 34.78 27.03 L 32.76 27.04 C 32.41 27.04 32.07 27.18 31.82 27.44 C 31.21 28.07 30.40 28.41 29.53 28.42 C 27.78 28.42 26.35 26.99 26.34 25.23 C 26.34 23.47 27.77 22.04 29.52 22.03 C 30.39 22.03 31.20 22.38 31.81 23.01 C 32.06 23.26 32.40 23.41 32.76 23.41 L 34.77 23.40 C 35.12 23.40 35.45 23.26 35.70 23.02 C 35.94 22.77 36.08 22.44 36.08 22.09 C 36.08 22.09 36.08 22.09 36.08 22.09 L 36.07 11.56 C 36.07 11.22 35.93 10.88 35.68 10.64 C 35.43 10.39 35.10 10.25 34.75 10.25 L 23.21 10.27 H 20.78 L 20.78 9.03 V 9.02 C 20.78 8.53 20.98 8.05 21.34 7.70 C 22.22 6.85 22.70 5.71 22.70 4.50 V 4.48 C 22.70 2.01 20.70 0.01 18.24 0 C 15.78 0.01 13.78 2.01 13.77 4.48 V 4.50 C 13.77 5.71 14.25 6.86 15.13 7.70 C 15.49 8.05 15.69 8.53 15.69 9.02 V 9.03 L 15.69 10.27 H 13.26 L 1.72 10.25 C 1.37 10.25 1.04 10.39 0.79 10.64 C 0.55 10.88 0.41 11.22 0.41 11.56 L 0.39 22.09 C 0.39 22.09 0.39 22.09 0.39 22.09 C 0.39 22.44 0.53 22.77 0.77 23.02 C 1.02 23.26 1.35 23.40 1.70 23.41 L 3.72 23.41 C 4.07 23.41 4.41 23.26 4.66 23.01 C 5.27 22.38 6.08 22.03 6.95 22.03 C 8.70 22.04 10.13 23.47 10.13 25.23 C 10.13 26.99 8.70 28.42 6.95 28.42 C 6.07 28.42 5.27 28.07 4.65 27.44 C 4.41 27.18 4.07 27.04 3.71 27.04 L 1.70 27.03 C 0.97 27.03 0.38 27.62 0.38 28.35 L 0.39 39.09 C 0.39 39.09 0.39 39.09 0.39 39.09 C 0.39 39.82 0.98 40.41 1.71 40.41 L 15.11 40.42 C 15.46 40.42 15.79 40.28 16.04 40.03 C 16.29 39.79 16.43 39.45 16.43 39.10 L 16.43 37.99 C 16.43 37.99 16.43 37.99 16.43 37.99 C 16.43 37.63 16.28 37.30 16.03 37.04 C 15.41 36.44 15.06 35.63 15.06 34.77 V 34.76 C 15.06 33.00 16.49 31.57 18.24 31.56 C 19.99 31.57 21.41 33.00 21.41 34.76 V 34.77 C 21.41 35.63 21.07 36.44 20.44 37.04 C 20.19 37.30 20.04 37.63 20.04 37.99 C 20.04 37.99 20.04 37.99 20.04 37.99 L 20.05 39.10 C 20.05 39.45 20.19 39.79 20.43 40.03 C 20.68 40.28 21.01 40.42 21.36 40.42 L 34.77 40.41 C 35.49 40.41 36.08 39.82 36.08 39.09 C 36.08 39.09 36.08 39.09 36.08 39.09 L 36.09 28.35 C 36.09 27.62 35.50 27.03 34.78 27.03 Z")',
      // Alternative puzzle piece shape
      'path("M 31 40 H 17.5 l 1.47-3.34 c 0.21-0.48 0.32-0.99 0.32-1.52 c 0-2.1-1.71-3.81-3.81-3.81 s-3.81 1.71-3.81 3.81 c 0 0.53 0.11 1.04 0.32 1.52 l 1.46 3.34 H 0 V 8.68 h 12.32 c 0.02-0.04 0.04-0.07 0.04-0.1 c 0-0.01 0-0.01 0-0.01 c-0.12-0.1-0.21-0.18-0.33-0.3 c-0.9-0.93-1.39-2.13-1.39-3.4 C 10.64 2.18 12.82 0 15.51 0 S 20.37 2.18 20.37 4.87 c 0 1.27-0.49 2.47-1.38 3.38 l-0.3 0.27 c-0.01 0.03-0.02 0.05-0.02 0.05 c 0 0.04 0.01 0.07 0.04 0.1 h 12.3 v 12.31 c 0.03 0.02 0.08 0.03 0.12 0.03 c 0.07-0.08 0.16-0.19 0.3-0.32 c 0.93-0.9 2.13-1.39 3.39-1.39 c 2.68 0 4.87 2.18 4.87 4.87 s-2.18 4.87-4.87 4.87 c-1.27 0-2.47-0.49-3.38-1.38 l-0.27-0.29 c-0.05-0.01-0.11 0-0.16 0.03 C 31 20.74 31 40 31 40 z")',
      // Complex puzzle piece shape
      'path("M 34.25 18.31 c-0.87 0-1.68 0.18-2.43 0.51 c-0.29 0.13-0.62 0.1-0.89-0.07 c-0.27-0.17-0.42-0.47-0.42-0.78 v-5.22 c 0-1.57-1.28-2.85-2.85-2.85 h-5.84 c-0.31 0-0.61-0.16-0.78-0.42 c-0.17-0.26-0.2-0.59-0.08-0.88 c 0.31-0.73 0.48-1.53 0.48-2.37 c 0-3.42-2.77-6.19-6.19-6.19 c-3.42 0-6.19 2.77-6.19 6.19 c 0 0.84 0.17 1.64 0.48 2.37 c 0.12 0.29 0.09 0.62-0.08 0.88 c-0.17 0.26-0.47 0.42-0.78 0.42 H 2.85 C 1.28 2.39 0 3.67 0 5.24 v 24.81 c 0 1.57 1.28 2.85 2.85 2.85 h 5.63 c 0.3 0 0.58-0.14 0.76-0.39 c 0.18-0.24 0.23-0.56 0.13-0.84 c-0.19-0.59-0.3-1.21-0.3-1.86 c 0-3.42 2.77-6.19 6.19-6.19 c 3.42 0 6.19 2.77 6.19 6.19 c 0 0.65-0.11 1.28-0.3 1.86 c-0.09 0.29-0.04 0.6 0.13 0.84 c 0.18 0.24 0.46 0.39 0.76 0.39 h 5.63 c 1.57 0 2.85-1.28 2.85-2.85 v-6.52 c 0-0.32 0.16-0.61 0.42-0.78 c 0.26-0.17 0.59-0.2 0.89-0.07 c 0.74 0.33 1.56 0.51 2.43 0.51 c 3.42 0 6.19-2.77 6.19-6.19 C 40.44 21.08 37.67 18.31 34.25 18.31 z")'
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
  
export default ASliderCaptcha;