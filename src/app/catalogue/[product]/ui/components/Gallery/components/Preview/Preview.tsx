'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ArrowIcon from '@/public/icons/arrowleft.svg';

type TProps = {
  images: string[];
  initialImageIndex?: number;
  onClose: () => void;
};

export const Preview = ({ images, initialImageIndex = 0, onClose }: TProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white text-black text-2xl p-2 rounded-full z-10"
      >
        ✕
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={handlePrev}
          className="absolute left-4 w-12 h-12 flex justify-center bg-white/50 hover:bg-white/80 text-black p-2 rounded-full z-10"
        >
          <Image src={ArrowIcon} alt="Previous" />
        </button>

        <div className="relative w-4/5 h-4/5">
          <Image
            src={images[currentIndex]}
            alt={`Preview image ${currentIndex + 1}`}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 w-12 h-12 flex justify-center bg-white/50 hover:bg-white/80 text-black p-2 rounded-full z-10 transform rotate-180"
        >
          <Image src={ArrowIcon} alt="Next" />
        </button>
      </div>
    </div>
  );
};
