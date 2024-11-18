import { cn } from '@/utils/helpers';
import { Text } from '@/utils/ui/Text';

type TProps = {
  text: string;
  className?: string;
}

export const Title = ({ text, className }: TProps) => {
  return (
    <Text.Header className={cn(className)}>{text}</Text.Header>
  )
}
