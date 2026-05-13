import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductSwiper = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const defaultImages = [
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600',
    'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600',
    'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  return (
    <div className="w-full">
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs]}
        className="main-swiper rounded-lg overflow-hidden"
      >
        {displayImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumb-swiper mt-4"
      >
        {displayImages.map((image, index) => (
          <SwiperSlide key={index}>
            <button className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden border-2 border-transparent hover:border-primary-500 transition-colors">
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSwiper;
