import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "../styles/Home.css";
import banner1 from "../img/Kassets/banner1.png";
import banner2 from "../img/Kassets/banner2.png";
import banner3 from "../img/Kassets/banner3.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function Home({setIsTodayDealsPage}) {
    const handleShopNowClick = () => {
        setIsTodayDealsPage(true);
       
        localStorage.setItem('activePage', 'Today deals');
       
    };
    return (
        <section className="Z_slider-section">
            <div className="">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={false}
                    pagination={{ clickable: true }}
                    effect="fade"
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="Z_mySwiper"
                >
                    {/* Slide 1 */}
                    <SwiperSlide>
                        <motion.div
                            className="slider-item"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <img className="Z_BannerImg" src={banner1} alt="Organic Vegetables" />
                            <div className="Z_slider-content">
                                <motion.span 
                                    className="Z_organic_txt"
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 1 }}
                                >
                                    <span className="text-danger Z_pr_text">100%</span> Organic Vegetables
                                </motion.span>
                                <motion.h2 
                                    className="Z_subtitle"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                >
                                    The best way to stuff your wallet.
                                </motion.h2>
                                <motion.p 
                                    className="Z_lorem_txt"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 1 }}
                                >
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia libero atque ipsum.
                                </motion.p>
                                <motion.button 
                                    className="z_button py-2 px-5"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShopNowClick()} 
                                >
                                    Shop Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </SwiperSlide>

                    {/* Slide 2 */}
                    <SwiperSlide>
                        <motion.div
                            className="slider-item"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <img className="Z_BannerImg" src={banner2} alt="We Deliver to Your Doorstep" />
                            <div className="Z_slider-content">
                                <motion.span 
                                    className="Z_organic_txt"
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 1 }}
                                >
                                    <span className="text-danger Z_pr_text">100%</span> Organic Vegetables
                                </motion.span>
                                <motion.h2 
                                    className="Z_subtitle"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                >
                                    We Deliver to Your Doorstep
                                </motion.h2>
                                <motion.p 
                                    className="Z_lorem_txt"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 1 }}
                                >
                                    We have prepared special discounts for you on grocery products. Don't miss these opportunities...
                                </motion.p>
                                <motion.button 
                                    className="z_button py-2 px-5"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShopNowClick()}
                                >
                                    Shop Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </SwiperSlide>

                    {/* Slide 3 */}
                    <SwiperSlide>
                        <motion.div
                            className="slider-item"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <img className="Z_BannerImg" src={banner3} alt="Fresh from the Farm" />
                            <div className="Z_slider-content">
                                <motion.span 
                                    className="Z_organic_txt"
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 1 }}
                                >
                                    <span className="text-danger Z_pr_text">100%</span> Organic Vegetables
                                </motion.span>
                                <motion.h2 
                                    className="Z_subtitle"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                >
                                    Fresh from the Farm, Straight to Your Plate!
                                </motion.h2>
                                <motion.p 
                                    className="Z_lorem_txt"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 1 }}
                                >
                                    We have prepared special discounts for you on grocery products. Don't miss these opportunities...
                                </motion.p>
                                <motion.button 
                                    className="z_button py-2 px-5"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShopNowClick()}
                                >
                                    Shop Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
    );
}

export default Home;
