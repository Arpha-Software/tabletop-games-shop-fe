import { cn } from "@/utils/helpers";
import { cva } from "class-variance-authority";
import { InputHTMLAttributes } from "react";

type TProps = {
  variant?: 'primary' | 'secondary'
  className?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  variant = 'primary',
  className,
  ...props
}: TProps) => {
  return (
    <input
      className={cn(
        inputVatiants({ variant }),
        className,
      )}
      {...props}
    />
  )
}

const inputVatiants = cva(
  "w-full text-xs text-black px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] focus:outline-none focus:border-secondary ",
  {
    variants: {
      variant: {
        primary: "bg-secondary-100",
        secondary: "",
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

