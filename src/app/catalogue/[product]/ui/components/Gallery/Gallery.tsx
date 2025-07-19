'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Preview } from './components/Preview';

type TProps = {
  images: string[];
};

export const Gallery = ({ images }: TProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  const openPreview = (index: number) => {
    setPreviewImageIndex(index);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className='w-full flex gap-4'>
        <div className='w-[512px] h-[512px] bg-slate-400 rounded-lg flex items-center justify-center'>
          <span className='text-gray-500'>No image available</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='w-full flex gap-4'>
        <Image
          src={images[0]}
          alt='Main product image'
          width={1000}
          height={1000}
          className='w-[512px] h-[512px] bg-slate-400 rounded-lg object-cover cursor-pointer'
          onClick={() => openPreview(0)}
        />

        {images.length > 1 && (
          <div className='flex flex-col justify-start gap-4'>
            {images.slice(1, 4).map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Product image ${index + 2}`}
                width={512}
                height={512}
                className='w-40 h-40 bg-slate-400 rounded-lg object-cover cursor-pointer'
                onClick={() => openPreview(index + 1)}
              />
            ))}
          </div>
        )}
      </div>
      {showPreview &&
        createPortal(
          <Preview images={images} initialImageIndex={previewImageIndex} onClose={closePreview} />,
          document.body
        )}
    </>
  );
};
