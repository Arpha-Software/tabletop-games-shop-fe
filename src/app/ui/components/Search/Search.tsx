import Image from 'next/image';
import { Input } from '../Input';
import SearchIcon from '@/public/icons/search.svg';

interface SearchProps {
  className?: string; // Allow custom classNames for external styling
  inputClassName?: string; // Allow custom classNames for the Input component
}

export const Search = ({ className, inputClassName }: SearchProps) => {
  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder='Пошук'
        className={`rounded-3xl px-6 py-3 text-xs border border-secondary-100 ${inputClassName}`}
      />
      <Image
        src={SearchIcon}
        alt='search'
        width={20}
        height={20}
        className='absolute top-1/2 right-5 -translate-y-1/2'
      />
    </div>
  );
};
