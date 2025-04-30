
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
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
import { FaWineBottle } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Popularcategory.css';

export default function PopularCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [swiper, setSwiper] = useState(null);

  const categories = [
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
            className="btn btn-outline-success rounded-circle" 
            onClick={() => swiper?.slidePrev()}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button 
            className="btn btn-outline-success rounded-circle" 
            onClick={() => swiper?.slideNext()}
          >
            <i className="fa fa-chevron-right"></i>
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
          <SwiperSlide key={category.name}>
            <div 
              className={`db_card text-center h-100 ${activeCategory === category.name ? 'db_border_active' : ''}`}
              onClick={() => setActiveCategory(category.name)}
            >
              <div className="db_card_body">
                <div className="db_icon">{category.icon}</div>
                <h6 className="db_card_title">{category.name}</h6>
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
