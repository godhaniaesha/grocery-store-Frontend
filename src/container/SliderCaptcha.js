import React, { useState, useRef, useEffect } from 'react';
// Assuming these image imports are correct based on your project structure
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
  // State to store the ID of the currently selected SVG clip path
  const [currentShapeId, setCurrentShapeId] = useState('');

  // Define the size of the puzzle piece
  const pieceSize = 40; // px
  const containerWidth = 300; // px
  const containerHeight = 150; // px
  const pieceVerticalPosition = (containerHeight - pieceSize) / 2; // Center vertically

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
  // Array of SVG clip path IDs for jigsaw shapes.
  // These shapes are defined using userSpaceOnUse for a 40x40 viewBox.
  const puzzleShapeIds = [
    '#jigsawShapeRightTabLeftIndent',
    '#jigsawShapeRightIndentLeftTab',
    '#jigsawShapeTopTabBottomIndent',
    '#jigsawShapeTopIndentBottomTab',
    '#jigsawShapeAllFeatures1', // Right Tab, Left Indent, Top Indent, Bottom Tab
    '#jigsawShapeAllFeatures2', // Right Indent, Left Tab, Top Tab, Bottom Indent
    // Add some simpler shapes focusing on right/left for variety if needed,
    // but the combined shapes are more realistic.
    // '#jigsawShapeRightTab', // Example simple shape (defined below)
  ];

  useEffect(() => {
    // Set random target position and random image on component mount
    // Target position should be within a range that keeps the puzzle piece within the image container.
    // Considering a piece size of 40px and potential tabs/indents extending ~10px.
    // A piece with a right tab extends to position + 40 + 10 = position + 50. Max position = 300 - 50 = 250.
    // A piece with a left tab starts at position - 10. Min position = 0 - (-10) = 10.
    // Let's set a target range that is safe for all defined shapes (assuming ~10px features).
    const minTargetPosition = pieceSize + 10; // Min position needs to allow space for a left tab/indent
    const maxTargetPosition = containerWidth - pieceSize - 10; // Max position needs to allow space for a right tab/indent

    // Ensure the range is valid
    const effectiveMin = Math.max(pieceSize / 2, minTargetPosition); // Ensure piece isn't too close to left edge relative to its center
    const effectiveMax = Math.min(containerWidth - pieceSize * 1.5, maxTargetPosition); // Ensure piece isn't too close to right edge

    // Fallback range if the calculated range is invalid or too small
    const safeMin = 50;
    const safeMax = containerWidth - pieceSize - 50; // 300 - 40 - 50 = 210

    const finalMinTarget = effectiveMin < effectiveMax ? effectiveMin : safeMin;
    const finalMaxTarget = effectiveMin < effectiveMax ? effectiveMax : safeMax;


    setTargetPosition(Math.floor(Math.random() * (finalMaxTarget - finalMinTarget + 1)) + finalMinTarget);

    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    setCurrentImage(puzzleImages[randomIndex]);

    // Select a random shape ID
    const shapeIndex = Math.floor(Math.random() * puzzleShapeIds.length);
    setCurrentShapeId(puzzleShapeIds[shapeIndex]);

  }, []); // Empty dependency array ensures this runs only once on mount


  // Add touch event handlers for mobile compatibility
  const handleTouchStart = (e) => {
    if (isVerified || !sliderRef.current) return;
    setIsDragging(true);
    // Prevent default touch behavior (like scrolling)
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (isVerified) return;
    setIsDragging(false);
    checkVerification();
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !sliderRef.current || isVerified) return;
    const rect = sliderRef.current.getBoundingClientRect();
    // Use clientX from the first touch point
    // Adjust for the horizontal center of the handle (which is 40px wide)
    const newPosition = Math.max(0, Math.min(e.touches[0].clientX - rect.left - pieceSize / 2, rect.width - pieceSize));
    setSliderPosition(newPosition);
    // Prevent default touch behavior (like scrolling)
    e.preventDefault();
  };

  const handleMouseDown = () => {
    if (isVerified || !sliderRef.current) return;
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
    if (isVerified) return;
    setIsDragging(false);
    checkVerification();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current || isVerified) return;
    const rect = sliderRef.current.getBoundingClientRect();
    // Adjust for the horizontal center of the handle (which is 40px wide)
    const newPosition = Math.max(0, Math.min(e.clientX - rect.left - pieceSize / 2, rect.width - pieceSize));
    setSliderPosition(newPosition);
  };

  // Handle mouse leaving the slider area while dragging
  const handleMouseLeave = () => {
    if (isDragging && !isVerified) {
      // Treat mouse leaving as mouse up if dragging
      handleMouseUp();
    }
  };

  const checkVerification = () => {
    // Allow a small tolerance for verification
    const tolerance = 5; // px
    if (Math.abs(sliderPosition - targetPosition) < tolerance) {
      setIsVerified(true);
    } else {
      // Reset slider position if not verified
      setSliderPosition(0);
    }
  }


  // Reset captcha state
  const resetCaptcha = () => {
    setIsVerified(false);
    setSliderPosition(0);
    // Set a new random target position and image
    const minTargetPosition = pieceSize + 10;
    const maxTargetPosition = containerWidth - pieceSize - 10;

    // Ensure the range is valid
    const effectiveMin = Math.max(pieceSize / 2, minTargetPosition);
    const effectiveMax = Math.min(containerWidth - pieceSize * 1.5, maxTargetPosition);

    // Fallback range if the calculated range is invalid or too small
    const safeMin = 50;
    const safeMax = containerWidth - pieceSize - 50; // 300 - 40 - 50 = 210

    const finalMinTarget = effectiveMin < effectiveMax ? effectiveMin : safeMin;
    const finalMaxTarget = effectiveMin < effectiveMax ? effectiveMax : safeMax;

    setTargetPosition(Math.floor(Math.random() * (finalMaxTarget - finalMinTarget + 1)) + finalMinTarget);

    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    setCurrentImage(puzzleImages[randomIndex]);
    // Select a new random shape ID
    const shapeIndex = Math.floor(Math.random() * puzzleShapeIds.length);
    setCurrentShapeId(puzzleShapeIds[shapeIndex]);
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
      <div className="slider-captcha" style={{ width: `${containerWidth}px`, margin: '20px auto', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>

        {/* SVG definitions for clip paths */}
        {/* This SVG is hidden and only used to define the clip paths */}
        {/* Using userSpaceOnUse and a viewBox of 40x40 */}
        <svg width="0" height="0" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <defs>
            {/* Define clip paths here using userSpaceOnUse and 40x40 coordinates */}

            {/* Base 40x40 Square: M 0 0 L 40 0 L 40 40 L 0 40 Z */}
            {/* Features are replacing segments of this square */}
            {/* Coordinates: 0,0 is top-left of the 40x40 box */}
            {/* Tab/Indent curves extend +/- 10px from the edge */}
            {/* Control points (C x1 y1, x2 y2, x y) are relative to the segment */}

            {/* Common shapes with features on opposing sides */}
            {/* Right Tab, Left Indent, Straight Top/Bottom */}
            <clipPath id="jigsawShapeRightTabLeftIndent" clipPathUnits="userSpaceOnUse">
              <path d={`M 0 0 L ${pieceSize} 0 L ${pieceSize} ${pieceSize * 0.375} C ${pieceSize + 10} ${pieceSize * 0.45}, ${pieceSize + 10} ${pieceSize * 0.55}, ${pieceSize} ${pieceSize * 0.625} L ${pieceSize} ${pieceSize} L 0 ${pieceSize} L 0 ${pieceSize * 0.625} C -10 ${pieceSize * 0.55}, -10 ${pieceSize * 0.45}, 0 ${pieceSize * 0.375} Z`} />
            </clipPath>
            {/* Right Indent, Left Tab, Straight Top/Bottom */}
            <clipPath id="jigsawShapeRightIndentLeftTab" clipPathUnits="userSpaceOnUse">
              <path d={`M 0 0 L ${pieceSize} 0 L ${pieceSize} ${pieceSize * 0.375} C ${pieceSize - 10} ${pieceSize * 0.45}, ${pieceSize - 10} ${pieceSize * 0.55}, ${pieceSize} ${pieceSize * 0.625} L ${pieceSize} ${pieceSize} L 0 ${pieceSize} L 0 ${pieceSize * 0.625} C 10 ${pieceSize * 0.55}, 10 ${pieceSize * 0.45}, 0 ${pieceSize * 0.375} Z`} />
            </clipPath>
            {/* Top Tab, Bottom Indent, Straight Left/Right */}
            <clipPath id="jigsawShapeTopTabBottomIndent" clipPathUnits="userSpaceOnUse">
              <path d={`M 0 0 L ${pieceSize * 0.375} 0 C ${pieceSize * 0.45} -10, ${pieceSize * 0.55} -10, ${pieceSize * 0.625} 0 L ${pieceSize} 0 L ${pieceSize} ${pieceSize} L ${pieceSize * 0.625} ${pieceSize} C ${pieceSize * 0.55} ${pieceSize + 10}, ${pieceSize * 0.45} ${pieceSize + 10}, ${pieceSize * 0.375} ${pieceSize} L 0 ${pieceSize} Z`} />
            </clipPath>
            {/* Top Indent, Bottom Tab, Straight Left/Right */}
            <clipPath id="jigsawShapeTopIndentBottomTab" clipPathUnits="userSpaceOnUse">
              <path d={`M 0 0 L ${pieceSize * 0.375} 0 C ${pieceSize * 0.45} 10, ${pieceSize * 0.55} 10, ${pieceSize * 0.625} 0 L ${pieceSize} 0 L ${pieceSize} ${pieceSize} L ${pieceSize * 0.625} ${pieceSize} C ${pieceSize * 0.55} ${pieceSize - 10}, ${pieceSize * 0.45} ${pieceSize - 10}, ${pieceSize * 0.375} ${pieceSize} L 0 ${pieceSize} Z`} />
            </clipPath>

            {/* More complex shapes with features on all four sides */}
            {/* Right Tab, Left Indent, Top Indent, Bottom Tab */}
            <clipPath id="jigsawShapeAllFeatures1" clipPathUnits="userSpaceOnUse">
              <path d={`M 0 0 L ${pieceSize * 0.375} 0 C ${pieceSize * 0.45} 10, ${pieceSize * 0.55} 10, ${pieceSize * 0.625} 0 L ${pieceSize} 0 L ${pieceSize} ${pieceSize * 0.375} C ${pieceSize + 10} ${pieceSize * 0.45}, ${pieceSize + 10} ${pieceSize * 0.55}, ${pieceSize} ${pieceSize * 0.625} L ${pieceSize} ${pieceSize} L ${pieceSize * 0.625} ${pieceSize} C ${pieceSize * 0.55} ${pieceSize + 10}, ${pieceSize * 0.45} ${pieceSize + 10}, ${pieceSize * 0.375} ${pieceSize} L 0 ${pieceSize} L 0 ${pieceSize * 0.625} C 10 ${pieceSize * 0.55}, 10 ${pieceSize * 0.45}, 0 ${pieceSize * 0.375} Z`} />
            </clipPath>
            {/* Right Indent, Left Tab, Top Tab, Bottom Indent */}
            <clipPath id="jigsawShapeAllFeatures2" clipPathUnits="userSpaceOnUse">
              <path d={`M 0 0 L ${pieceSize * 0.375} 0 C ${pieceSize * 0.45} -10, ${pieceSize * 0.55} -10, ${pieceSize * 0.625} 0 L ${pieceSize} 0 L ${pieceSize} ${pieceSize * 0.375} C ${pieceSize - 10} ${pieceSize * 0.45}, ${pieceSize - 10} ${pieceSize * 0.55}, ${pieceSize} ${pieceSize * 0.625} L ${pieceSize} ${pieceSize} L ${pieceSize * 0.625} ${pieceSize} C ${pieceSize * 0.55} ${pieceSize - 10}, ${pieceSize * 0.45} ${pieceSize - 10}, ${pieceSize * 0.375} ${pieceSize} L 0 ${pieceSize} L 0 ${pieceSize * 0.625} C -10 ${pieceSize * 0.55}, -10 ${pieceSize * 0.45}, 0 ${pieceSize * 0.375} Z`} />
            </clipPath>

            {/* Example of a simple shape (Right Tab) using userSpaceOnUse */}
            {/* <clipPath id="jigsawShapeRightTab" clipPathUnits="userSpaceOnUse">
         <path d={`M 0 0 L ${pieceSize} 0 L ${pieceSize} ${pieceSize*0.375} C ${pieceSize+10} ${pieceSize*0.45}, ${pieceSize+10} ${pieceSize*0.55}, ${pieceSize} ${pieceSize*0.625} L ${pieceSize} ${pieceSize} L 0 ${pieceSize} Z`} />
       </clipPath> */}

          </defs>
        </svg>


        {/* Image Container */}
        <div style={{
          position: 'relative',
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '15px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
        }}>
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${currentImage})`,
            backgroundSize: 'cover', // Cover the container
            backgroundPosition: 'center', // Center the image
            filter: isVerified ? 'none' : 'blur(2px)',
            overflow: 'hidden'
          }} />

          {/* Cut-out Area (The "Hole") */}
          {!isVerified && (
            <div style={{
              position: 'absolute',
              left: `${targetPosition}px`, // Horizontal position of the hole
              top: `${pieceVerticalPosition}px`, // Vertical position of the hole
              width: `${pieceSize}px`, // Base width for clipping
              height: `${pieceSize}px`, // Base height for clipping
              backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker overlay to show the hole
              boxSizing: 'border-box',
              // backgroundImage: `,
              // The background size should match the container size to maintain alignment
              backgroundSize: `${containerWidth}px ${containerHeight}px`,
              // Background position needs to be offset so the correct part of the image
              // appears within the piece when it's at the target position.
              // The piece's top-left (0,0 in its local coordinates) corresponds to the
              // targetPosition and pieceVerticalPosition in the main image.
              backgroundPosition: `${-targetPosition}px ${-pieceVerticalPosition}px`,
              zIndex: 1,
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.93)',
              // Apply the selected clip path to create the hole shape
              clipPath: `url(${currentShapeId})`,
              // Optional: Add a border or shadow to the hole for better visibility
              // boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
            }} />
          )}

          {/* Movable Puzzle Piece */}
          {!isVerified && (
            <div style={{
              position: 'absolute',
              left: `${sliderPosition}px`, // Horizontal position controlled by slider
              top: `${pieceVerticalPosition}px`, // Vertical position (fixed)
              width: `${pieceSize}px`, // Base width for clipping
              height: `${pieceSize}px`, // Base height for clipping
              backgroundImage: `url(${currentImage})`,
              // The background size should match the container size to maintain alignment
              backgroundSize: `${containerWidth}px ${containerHeight}px`,
              // Background position needs to be offset so the correct part of the image
              // appears within the piece when it's at the target position.
              // The piece's top-left (0,0 in its local coordinates) corresponds to the
              // targetPosition and pieceVerticalPosition in the main image.
              backgroundPosition: `${-targetPosition}px ${-pieceVerticalPosition}px`,
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.88)',
              boxSizing: 'border-box',
              zIndex: 2,
              // Apply the same selected clip path to create the piece shape
              clipPath: `url(${currentShapeId})`,
              transition: isDragging ? 'none' : 'left 0.3s ease-in-out'
            }} />
          )}
        </div>

        {/* Slider Bar */}
        <div
          ref={sliderRef}
          style={{
            position: 'relative',
            height: '45px', // Slightly taller slider bar
            backgroundColor: '#e0e0e0', // Light gray background
            borderRadius: '22px', // More rounded corners
            cursor: isVerified ? 'default' : 'pointer',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)', // Inner shadow
            // Add touch event listeners
            touchAction: 'none', // Prevent default touch actions like scrolling
            overflow: 'hidden' // Hide overflowing blue track
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave} // Handle case where mouse leaves the slider while dragging
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          {/* Slider Track (Blue Progress) */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            // The width of the track should follow the slider position
            // Add half of the handle width (40/2=20) so the track reaches the handle center
            width: `${sliderPosition + pieceSize / 2}px`,
            backgroundColor: isVerified ? '#4CAF50' : '#2196F3', // Green when verified, blue otherwise
            borderRadius: '22px',
            transition: isDragging ? 'none' : 'width 0.3s ease-in-out',
            opacity: isVerified ? 1 : 0.8,
          }} />

          {/* Slider Handle */}
          <div
            style={{
              position: 'absolute',
              left: `${sliderPosition}px`,
              top: '2px', // Center vertically within the 45px track (45 - 40) / 2 = 2.5, use 2 or 3
              width: `${pieceSize}px`, // Handle width matches piece size for consistency
              height: `${pieceSize}px`, // Handle height matches piece size
              backgroundColor: isVerified ? '#81C784' : '#2196F3', // Lighter green when verified
              borderRadius: `${pieceSize / 2}px`, // Make it round
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              userSelect: 'none', // Prevent text selection during drag
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: isDragging ? 'none' : 'left 0.3s ease-in-out',
              cursor: isVerified ? 'default' : (isDragging ? 'grabbing' : 'grab'), // Change cursor
              fontSize: '20px' // Larger icon
            }}
          // Mouse and touch events are handled on the parent slider bar div
          >
            {isVerified ? '✓' : '»'} {/* Verified checkmark or drag arrow */}
          </div>
          {/* Text overlay on slider */}
          {!isVerified && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#666',
              fontSize: '14px',
              pointerEvents: 'none', // Allow clicks/drags to pass through text
              zIndex: 0 // Behind the handle
            }}>
              Drag to verify
            </div>
          )}
        </div>

        {/* Verification Message */}
        <div style={{
          marginTop: '15px',
          textAlign: 'center',
          minHeight: '20px' // Reserve space to prevent layout shifts
        }}>
          <span style={{ color: isVerified ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
            {isVerified ? 'Verification Successful!' : ''}
          </span>
        </div>


        {/* Reset Button */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={resetCaptcha}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800', // Orange color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'background-color 0.3s ease',
              opacity: isVerified ? 0 : 1, // Hide reset button if verified
              pointerEvents: isVerified ? 'none' : 'auto', // Disable button interaction if verified
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FB8C00'} // Darker orange on hover
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
          >
            Reset Captcha
          </button>
        </div>


      </div>
      </div>
      
      );
 };

      export default SliderCaptcha;