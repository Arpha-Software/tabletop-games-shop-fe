import { cn } from "@/utils/helpers";
import { cva } from "class-variance-authority";
import { forwardRef, InputHTMLAttributes } from "react";

type TProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  variant?: "primary" | "secondary" | "disabled";
  uiSize?: "sm" | "md" | "lg";
  invalid?: boolean;
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, TProps>(function Input(
  { variant = "primary", uiSize = "md", invalid = false, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        inputVariants({ variant, size: uiSize }),
        invalid && "border-red-300 focus:ring-red-200 focus:border-red-400",
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});

const inputVariants = cva(
  [
    "w-full",
    "rounded-xl",
    "border",
    "border-gray-200",
    "bg-white",
    "px-4",
    "text-sm",
    "text-gray-900",
    "placeholder:text-gray-400",
    "outline-none",
    "transition-shadow",
    "focus:ring-2",
    "focus:ring-primary/40",
    "focus:border-primary/50",
    "disabled:bg-gray-50",
    "disabled:text-gray-400",
    "disabled:cursor-not-allowed",
    "read-only:bg-gray-50",
    "read-only:text-gray-600",
    "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
    "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s,color_9999s_ease-in-out_0s]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "",
        secondary: "bg-secondary-100 border-[#DCDCDC]",
        disabled: "bg-gray-50 text-gray-400 cursor-not-allowed",
      },
      size: {
        sm: "py-2 text-xs rounded-lg",
        md: "py-3",
        lg: "py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const inputVatiants = inputVariants;
