
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slices/categorySlice';
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
import { FaChevronLeft, FaChevronRight, FaWineBottle } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Popularcategory.css';
import { fetchProductsByCategory } from '../redux/slices/product.Slice';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';  // નવો import ઉમેરો

export default function PopularCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [swiper, setSwiper] = useState(null);
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector(state => state.category);
  const { products, productsByCategory } = useSelector(state => state.product);
  const navigate = useNavigate();  // useNavigate hook ઉમેરો

  useEffect(() => {
    dispatch(fetchCategories());
    // Fetch products for each category
    if (categories.length > 0) {
      categories.forEach(category => {
        dispatch(fetchProductsByCategory(category._id));
      });
    }
  }, [dispatch, categories.length]);

  // Function to get product count for a category
  const getProductCount = (categoryId) => {
    if (productsByCategory[categoryId]) {
      return productsByCategory[categoryId].length;
    }
    return 0;
  };

  // Icon mapping object
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

  // Function to get icon based on category name
  const getCategoryIcon = (categoryName) => {
    for (const [key, icon] of Object.entries(iconMapping)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return <GiBroccoli size={35} />; // Default icon
  };

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleCategoryClick = (category) => {
    setActiveCategory(category.categoryName);
    // localStorage માંથી જૂની values કાઢી નાખો
    localStorage.removeItem('selectedSubCategoryId');
    localStorage.removeItem('searchQuery');
    // નવી category ID સેટ કરો
    localStorage.setItem('selectedCategoryId', category._id);
    // Vegetable પેજ પર navigate કરો
    navigate('/Vegetable');
  };
  return (
    <div className="db_popular a_header_container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="z_section-title mb-4">
          <span className="z_title-highlight">Popular</span>
          {' '}
          <span className="z_title-dark">Category</span>
        </h2>
        <div className="slider-nav d-flex gap-2">
          <button
            className="btn btn-outline-success rounded-circle p-2"
            onClick={() => swiper?.slidePrev()}
            style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            className="btn btn-outline-success rounded-circle p-2"
            onClick={() => swiper?.slideNext()}
            style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={6}
        onSwiper={setSwiper}
        navigation={false}
        breakpoints={{
          0: { slidesPerView: 1 },
          320: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1200: { slidesPerView: 6 },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <div
              className={`db_card text-center h-100 ${activeCategory === category.categoryName ? 'db_border_active' : ''}`}
              onClick={() => handleCategoryClick(category)}  // નવો onClick handler
            >
              <div className="db_card_body">
                <div className="db_icon">{getCategoryIcon(category.categoryName)}</div>
                <h6 className="db_card_title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>                  
                  {category.categoryName}
                </h6>
                <p className="db_card_subtitle">
                  {getProductCount(category._id)} Products
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}


