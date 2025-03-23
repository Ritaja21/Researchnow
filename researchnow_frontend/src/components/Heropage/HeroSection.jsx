import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./HeroSection.css";
import { assets } from "../../assets/assets"; // Adjusted asset import

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      {/* Left Text Section */}
      <div className="hero-text">
        <h1>Find. <br /> Contribute. <br /> Grow.</h1>
        <button className="joinnow" onClick={() => navigate("/opportunities")}>
          Search Opportunities
        </button>
      </div>

      {/* Right Swiper Section */}
      <div className="hero-swiper">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="swiper-container"
        >
          <SwiperSlide>
            <div className="swiper-slide-content">
              <img src={assets.landingimg1} alt="Research 1" className="swiper-image" />
              
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="swiper-slide-content">
              <img src={assets.landingimg4} alt="Research 2" className="swiper-image" />
              
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="swiper-slide-content">
              <img src={assets.landingimg3} alt="Research 3" className="swiper-image" />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSection;
