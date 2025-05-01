import React from 'react';
import { FaLeaf, FaCarrot } from 'react-icons/fa';
import leafIcon from '../image/leaf.png';
import Testimonial from './Testimonial';
import WhyUs from './WhyUs';
import testImage from '../image/testimg.png';

function Aboutus() {
  return (
    <div className="x_about_main_section">
      <div className="a_header_container pb-5">
        <div className="x_about_content_wrapper">
          <div className="x_about_left_content">
            <div className='d-flex align-items-center' >
              <img src={leafIcon} alt="Leaf Icon" className="x_leaf_icon" />
              <h5 className="x_get_to_know mb-0">Get to Know us</h5>
            </div>
            <h2 className="x_welcome_title">
              Welcome to Nest Mart<br />
              <span className="x_provider_text">your fresh market</span>
            </h2>
            
            <p className="x_about_description">
              We bring together local farmers and conscious consumers,<br />
              offering the finest selection of fresh, organic produce and<br />
              essential groceries.
            </p>
            <p className="x_about_sub_description">
              From farm-fresh vegetables to premium pantry essentials,<br />
              we ensure quality in every product. Our commitment to<br />
              freshness and sustainability makes healthy living accessible.
            </p>

            <div className="x_feature_points">
              <div className="x_feature_item">
                <div className="x_feature_circle">
                  <span className="x_feature_number">01</span>
                </div>
                <div className="x_feature_text">
                  Farm Fresh<br />Daily Produce
                </div>
              </div>
              <div className="x_feature_item">
                <div className="x_feature_circle">
                  <span className="x_feature_number">02</span>
                </div>
                <div className="x_feature_text">
                  Quality Grocery<br />Everyday
                </div>
              </div>
            </div>
          </div>

          <div className="x_about_right_content">
            <div className="x_experience_badge">
              <div className="x_badge_content">
                <div className="x_badge_inner">
                  <span className="x_years">18</span>
                  <span className="x_exp_text">Years of<br />experience</span>
                </div>
              </div>
            </div>
            <div className="x_image_wrapper">
              <div className="x_splash_overlay">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#2c6145" d="M47.5,-57.5C62.2,-47.2,75.2,-32.5,79.1,-15.2C83,2.1,77.8,22,67.1,37.5C56.4,53,40.2,64.2,22.7,69.3C5.2,74.4,-13.6,73.4,-30.4,67.1C-47.2,60.8,-62,49.2,-70.8,33.4C-79.6,17.6,-82.4,-2.5,-76.6,-19.6C-70.8,-36.7,-56.4,-50.8,-41,-59.8C-25.6,-68.8,-9.2,-72.7,4.9,-78.5C19,-84.3,32.8,-67.8,47.5,-57.5Z" transform="translate(100 100)" />
                </svg>
              </div>
              <img 
                src={testImage}
                alt="Fresh Produce" 
                className="x_main_image" 
              />
            </div>
          </div>
        </div>
      </div>
      <WhyUs></WhyUs>
      <Testimonial></Testimonial>
    </div>
  );
}

export default Aboutus;