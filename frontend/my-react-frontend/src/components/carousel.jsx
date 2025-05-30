import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import cucine1 from '../assets/Cucine1.jpg';
import cucine2 from '../assets/cusine2.jpg';
import cucine3 from '../assets/cusine3.jpg';
import cucine4 from '../assets/cusine4.jpg';
import cucine5 from '../assets/cusine5.jpg';

import { Pagination, Navigation } from 'swiper/modules';

const images = [cucine1, cucine2, cucine3, cucine4, cucine5];

const Carousel = ({ style }) => {
  return (
    <div style={{ width: '80%', margin: 'auto', ...style }}>
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        loop={true}
        style={{ height: '500px' }} // height of entire Swiper
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                style={{
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
