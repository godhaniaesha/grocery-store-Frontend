import React from 'react';
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Images
import slide1 from "../img/Kassets/01.png";
import slide2 from "../img/Kassets/02.png";
import slide3 from "../img/Kassets/03.png";

const PrevArrow = ({ onClick }) => (
  <button className="custom-arrow prev-arrow" onClick={onClick}>
    <FaChevronLeft />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button className="custom-arrow next-arrow" onClick={onClick}>
    <FaChevronRight />
  </button>
);

export default function Slide2({setIsVegetablePage}) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const slides = [
    {
      title: "Quality Veges at an affordable price",
      subtitle: "Eat every day",
      buttonText: "Order Now",
      image: slide1
    },
    {
      title: "Delivery on your doorstep",
      subtitle: "Shop $50 & get free delivery",
      buttonText: "Order Now",
      image: slide2
    },
    {
      title: "Natural Premium Vegetables",
      subtitle: "Save up to 40%",
      buttonText: "Order Now",
      image: slide3
    }
  ];

  const handleordernowClick = () => {
    
    localStorage.setItem('activePage', 'Vegetables');
    setIsVegetablePage(true);
  };
  return (
    <div className="z_slider_conta1 slider-container">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slide-item">
            <div className="slide-image">
              <img src={slide.image} alt={slide.title} />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                {/* <button className="z_button"  onClick={() => handleordernowClick()}  style={{width:'100px'}}>{slide.buttonText}</button> */}
                <button
                  className="z_button"
                  style={{ width: "100px" }}
                  onClick={() => handleordernowClick()}
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
