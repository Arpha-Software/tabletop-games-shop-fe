import { ReactNode } from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/utils";

type ButtonProps = {
  variant?: "primary" | "secondary" | "disabled";
  tag?: "button" | "div" | "a";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}

export const Button = ({
  className,
  variant,
  tag: Tag = "button",
  children,
  type = "button",
  href,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <Tag
      {...props}
      className={cn(
        buttonVariants({ variant }),
        className
      )}
      type={type}
      href={href}
      onClick={onClick}
    >
      { children }
    </Tag>
  )
}

const buttonVariants = cva(
  "block rounded-full px-8 py-2 border transition-all",
  {
    variants: {
      variant: {
        primary: "bg-primary border-primary hover:bg-primary/80",
        secondary: "bg-transparent border-primary hover:bg-primary hover:text-white",
        disabled: "cursor-not-allowed"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);
