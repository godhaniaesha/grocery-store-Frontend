import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slices/categorySlice';
import { useNavigate } from 'react-router-dom';
import "../styles/x_app.css";
import "../styles/denisha.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export function Category({ onCategoryClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, isLoading, error } = useSelector(state => state.category);
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const handlePrevClick = () => {
    setActiveButton("prev");
    setTimeout(() => setActiveButton(null), 200);
  };

  const handleNextClick = () => {
    setActiveButton("next");
    setTimeout(() => setActiveButton(null), 200);
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    // Store the selected category in localStorage
    localStorage.setItem('selectedCategoryId', categoryId);
    localStorage.setItem('selectedCategoryName', categoryName);
    
    // If onCategoryClick prop is provided, use it
    if (onCategoryClick) {
      onCategoryClick(categoryId, categoryName);
    } else {
      // Otherwise use the default navigation
        ``.setItem('activePage', 'Vegetables');
      navigate('/vegetables');
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className='a_header_container'>
        <h2 className="x_category-title">Top Categories</h2>
        <span className="line"></span>
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
              320: { slidesPerView: 2, spaceBetween: 30 },
              375: { slidesPerView: 2, spaceBetween: 30 },
              425: { slidesPerView: 2, spaceBetween: 30 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 4, spaceBetween: 20 },
              1400: { slidesPerView: 5, spaceBetween: 20 },
              1600: { slidesPerView: 6, spaceBetween: 20 },
            }}
            className="x_category-swiper ps-0 ps-md-5"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <div 
                  className="x_category-item category-margin" 
                  onClick={() => handleCategoryClick(category._id, category.categoryName)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="x_category-image-wrapper">
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
      </div>
    </>
  );
}

export default Category;
