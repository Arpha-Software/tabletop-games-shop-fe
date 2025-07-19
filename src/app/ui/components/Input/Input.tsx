import { cn } from "@/utils/helpers";
import { cva } from "class-variance-authority";
import { InputHTMLAttributes } from "react";

type TProps = {
  variant?: 'primary' | 'secondary'
  className?: string
  label?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  variant = 'primary',
  className,
  label,
  ...props
}: TProps) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={cn(
          inputVatiants({ variant }),
          className,
        )}
        {...props}
      />
    </div>
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

