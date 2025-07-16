import Image from 'next/image';

type TProps = {
  images: string[];
}

export const Gallery = ({ images }: TProps) => {
  // Handle empty or undefined images array
  if (!images || images.length === 0) {
    return (
      <div className='w-full flex gap-4'>
        <div className='w-[512px] h-[512px] bg-slate-400 rounded-lg flex items-center justify-center'>
          <span className='text-gray-500'>No image available</span>
        </div>
      </div>
    );
  }
  console.log('images', images)
  return (
    <div className='w-full flex gap-4'>
      <Image
        src={images[0]}
        alt='Main product image'
        width={1000}
        height={1000}
        className='w-[512px] h-[512px] bg-slate-400 rounded-lg object-cover'
      />

      {images.length > 1 && (
        <div className='flex flex-col justify-between gap-4'>
          {images.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Product image ${index + 2}`}
              width={512}
              height={512}
              className='w-40 h-40 bg-slate-400 rounded-lg object-cover'
            />
          ))}
        </div>
      )}
    </div>
  )
}
