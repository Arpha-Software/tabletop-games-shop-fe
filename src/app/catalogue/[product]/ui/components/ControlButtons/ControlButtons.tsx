import { Button } from "@/app/ui/components";
import { cn } from "@/utils/helpers";

type TProps = {
  className?: string;
}

export const ControlButtons = ({ className }: TProps) => {
  return (
    <div className={cn("flex gap-4", className)}>
      <Button variant='primary'>Купити зараз</Button>
      <Button variant='secondary'>В кошик</Button>
    </div>
  )
}
