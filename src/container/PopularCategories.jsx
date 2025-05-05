
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
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Popularcategory.css';

export default function PopularCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [swiper, setSwiper] = useState(null);
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.category);
  console.log(categories,"categories");
  

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const defaultCategories = [
    { name: "Salt", count: 98, icon: <GiSaltShaker size={35} /> },
    { name: "Coffee & Tea", count: 120, icon: <GiCoffeeCup size={35} /> },
    { name: "Oil", count: 250, icon: <GiOilDrum size={35} /> },
    { name: "Vinegar", count: 1180, icon: <FaWineBottle size={35} /> },
    { name: "Super Food", count: 540, icon: <GiBroccoli size={35} /> },
    { name: "Nuts & Seeds", count: 85, icon: <GiBroccoli size={35} /> },
    { name: "Wheat & Grains", count: 620, icon: <GiWheat size={30} /> },
    { name: "Milk & Dairy", count: 410, icon: <GiMilkCarton size={30} /> },
    { name: "Meat & Poultry", count: 300, icon: <GiMeat size={30} /> },
    { name: "Fruits & Vegetables", count: 920, icon: <GiFruitBowl size={30} /> },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        {displayCategories.map((category) => (
          <SwiperSlide key={category.categoryName}>
            <div 
              className={`db_card text-center h-100 ${activeCategory === category.categoryName ? 'db_border_active' : ''}`}
              onClick={() => setActiveCategory(category.categoryName)}
            >
              <div className="db_card_body">
                <div className="db_icon">{category.icon}</div>
                <h6 className="db_card_title">{category.categoryName}</h6>
                <p className="db_card_subtitle">
                  {category.count} Products
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
