import { cn } from "@/utils/helpers";
import { Text } from "@/utils/ui/Text";

type TProps = {
  price: number;
  className?: string;
}

export const Price = ({ price, className }: TProps) => {
  return (
    <Text.Paragraph className={cn("text-2xl", className)}>{price} грн</Text.Paragraph>
  )
}
