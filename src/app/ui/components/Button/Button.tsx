import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cva } from "class-variance-authority";

import { Text } from "../../../../utils/ui/Text";

import { cn } from "@/utils/helpers";

type ButtonProps = {
  variant?: "primary" | "secondary" | "base" | "link" | "link-disabled" | "disabled";
  tag?: "button" | "div" | "a" | typeof Link;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: any;
  href?: string;
  icon?: any;
  disabled?: boolean;
  children: ReactNode;
}

export const Button = ({
  className,
  variant,
  tag: Tag = "button",
  children,
  type = "button",
  href,
  icon,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  const isLink = Tag === Link;

  if (icon) {
    return (
      <Tag
        {...props}
        className={cn(
          buttonVariants({ variant }),
          className
        )}
        type={type}
        href={href || ''}
        onClick={onClick}
        disabled={disabled}
      >
        <Image src={icon} alt="icon" />
        <Text.Span>{children}</Text.Span>
      </Tag>
    );
  }

  return isLink && href ? (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant }),
        className
      )}
      onClick={onClick}
      {...props}
    >
      <Text.Span>{children}</Text.Span>
    </Link>
  ) : (
    <Tag
      {...props}
      className={cn(
        buttonVariants({ variant }),
        className
      )}
      type={type}
      href={href || ''}
      onClick={onClick}
      disabled={disabled}
    >
      <Text.Span>{children}</Text.Span>
    </Tag>
  );
}

const buttonVariants = cva(
  "block w-fit rounded-full px-8 py-2 border transition-all",
  {
    variants: {
      variant: {
        primary: "bg-primary border-primary hover:bg-primary/80",
        secondary: "bg-transparent border-primary hover:bg-primary hover:text-white",
        base: "bg-transparent",
        link: "bg-transparent underline border-transparent hover:text-primary",
        "link-disabled": "bg-transparent underline border-transparent text-black/40",
        disabled: "cursor-not-allowed"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);
