import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function ImageSlider() {
    return (
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
            <SwiperSlide><img src="/images/image1.jpg" alt="Slide 1" /></SwiperSlide>
            <SwiperSlide><img src="/images/image2.jpg" alt="Slide 2" /></SwiperSlide>
            <SwiperSlide><img src="/images/image3.jpg" alt="Slide 3" /></SwiperSlide>
        </Swiper>
    );
}

export default ImageSlider;
