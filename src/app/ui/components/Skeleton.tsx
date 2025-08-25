import { cn } from '@/utils/helpers';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export const Skeleton = ({ className, rounded = 'lg', ...rest }: Props) => (
  <div
    className={cn(
      'animate-pulse bg-gray-100/80 dark:bg-gray-800/40',
      rounded === 'sm' && 'rounded',
      rounded === 'md' && 'rounded-md',
      rounded === 'lg' && 'rounded-lg',
      rounded === 'xl' && 'rounded-xl',
      rounded === 'full' && 'rounded-full',
      className
    )}
    {...rest}
  />
);
