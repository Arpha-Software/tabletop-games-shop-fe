import { cn } from "@/utils/helpers";
import { Text } from "@/utils/ui/Text";

type TProps = {
  text: string;
  className?: string;
}

export const Description = ({ text, className }: TProps) => {
  return (
    <Text.Paragraph className={cn(className)}>{text}</Text.Paragraph>
  )
}
