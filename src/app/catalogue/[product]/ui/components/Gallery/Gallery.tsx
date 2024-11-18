import Image from 'next/image';

type TProps = {
  images: string[];
}

export const Gallery = ({ images }: TProps) => {
  const [mainImage, ...restImages] = images;

  return (
    <div className='w-full flex gap-4'>
      <Image
        src={mainImage}
        alt='image'
        width={1000}
        height={1000}
        className='w-[512px] h-[512px] bg-slate-400 rounded-lg'
      />

      <div className='flex flex-col justify between gap-4'>
        {restImages.splice(0, 3).map((image, index) => (
          <Image
            key={index}
            src={image}
            alt='image'
            width={512}
            height={512}
            className='w-40 h-40 bg-slate-400 rounded-lg'
          />
        ))}
      </div>
    </div>
  )
}
