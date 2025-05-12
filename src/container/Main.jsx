import React from 'react'
import SearchHeader from './SearchHeader'
import FirstSlider from './FirstSlider'
import PopularCategories from './PopularCategories'
import Bestseller from './Bestseller'
import AdvertiseCards from './AdvertiseCards'
import Recommended from './Recommended'
import WhyUs from './WhyUs'
import Testimonial from './Testimonial'
import Footer from './Footer'
import Subscribe from './Subscribe'

export default function Main() {
  return (
        <>
           
            <FirstSlider></FirstSlider>
            <PopularCategories></PopularCategories>
            <Bestseller></Bestseller>
            <AdvertiseCards></AdvertiseCards>
            <Recommended></Recommended>
            <WhyUs></WhyUs>
            <Testimonial></Testimonial>
            <Subscribe></Subscribe>
       
        </>
  )
}
