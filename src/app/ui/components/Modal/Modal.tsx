'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useScrollPrevent } from "@/hooks/useScrollPrevent";

import Arrow from '@/public/arrowleft.svg';

type ModalProps = {
  children: (setState: React.Dispatch<React.SetStateAction<boolean>>, showConfirmation: boolean) => React.ReactNode;
};

export function Modal({ children }: ModalProps) {
  useScrollPrevent();

  const [showConfirmation, setShowConfirmation] = useState(false); // Internal state
  const router = useRouter();

  const handleBack = () => {
    if (!showConfirmation) router.back();


    if (setShowConfirmation) {
      setShowConfirmation(false);
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <section className='fixed bg-white shadow-lg max-w-[550px] w-full h-auto pb-11 z-20 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='border-b px-8 py-4'>
          <button onClick={handleBack} className="flex items-center gap-3 hover:opacity-60 transition-all">
            <Image src={Arrow} alt="Arrow icon" />
            <span>Назад</span>
          </button>
        </div>

        <div>{children(setShowConfirmation, showConfirmation)}</div>
      </section>

      <div className="absolute w-full h-svh z-10 backdrop-blur-sm bg-black/50" />
    </>
  );
}
