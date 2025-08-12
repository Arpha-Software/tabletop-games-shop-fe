import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { Text } from "../../../../utils/ui/Text";
import { cn } from "@/utils/helpers";

type ButtonProps = {
  variant?: "primary" | "secondary" | "base" | "link" | "link-disabled" | "disabled" | "plain" | "plain-focus";
  tag?: "button" | "div" | "a" | typeof Link;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: any;
  href?: string;
  icon?: any;
  disabled?: boolean;
  form?: string;
  children: ReactNode;
};

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
  form,
  ...props
}: ButtonProps) => {
  const isLink = Tag === Link;

  // shared props
  const common = {
    onClick,
    form,
    "aria-disabled": disabled || variant === "disabled" || variant === "link-disabled" ? true : undefined,
  };

  if (icon) {
    const content = (
      <>
        <Image src={icon} alt="icon" />
        <Text.Span>{children}</Text.Span>
      </>
    );

    if (isLink && href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant }), className)}
          {...common}
          {...props}
        >
          {content}
        </Link>
      );
    }

    return (
      <Tag
        {...props}
        {...common}
        className={cn(buttonVariants({ variant }), className)}
        // @ts-expect-error href is ignored for non-anchors
        href={href || undefined}
        type={type}
        disabled={disabled || variant === "disabled" || variant === "link-disabled"}
      >
        {content}
      </Tag>
    );
  }

  if (isLink && href) {
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant }), className)}
        {...common}
        {...props}
      >
        <Text.Span>{children}</Text.Span>
      </Link>
    );
  }

  return (
    <Tag
      {...props}
      {...common}
      className={cn(buttonVariants({ variant }), className)}
      // @ts-expect-error href is ignored for non-anchors
      href={href || undefined}
      type={type}
      disabled={disabled || variant === "disabled" || variant === "link-disabled"}
    >
      <Text.Span>{children}</Text.Span>
    </Tag>
  );
};

const buttonVariants = cva(
  [
    // foundation
    "inline-flex items-center justify-center gap-2",
    "px-5 py-2.5 rounded-2xl text-sm font-medium",
    "transition-all duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    "select-none",
    // disabled handling
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        // Brand filled
        primary: [
          "bg-primary text-white",
          "border border-primary",
          "shadow-sm hover:shadow-md",
          "hover:bg-primary/90 active:bg-primary/95 active:scale-[0.99]",
        ].join(" "),

        // Brand outline / subtle fill on hover
        secondary: [
          "bg-white text-primary",
          "border border-primary",
          "hover:bg-primary/10",
          "shadow-sm",
        ].join(" "),

        // Neutral outline button
        base: [
          "bg-white text-gray-700",
          "border border-gray-200",
          "hover:bg-gray-50 hover:border-gray-300",
          "shadow-sm",
        ].join(" "),

        // Link-like CTA
        link: [
          "bg-transparent border-transparent",
          "text-primary underline underline-offset-4",
          "hover:text-primary/80",
          "p-0", // no padding for pure links
        ].join(" "),

        // Disabled link look
        "link-disabled": [
          "bg-transparent border-transparent",
          "text-gray-400 underline underline-offset-4 pointer-events-none",
          "p-0",
        ].join(" "),

        // Plain texty button (no border)
        plain: [
          "bg-transparent border-transparent text-gray-700",
          "hover:text-primary",
          "shadow-none",
        ].join(" "),

        // Plain with bottom focus indicator
        "plain-focus": [
          "bg-transparent text-gray-700 border-b-2 border-transparent",
          "focus-within:border-primary hover:text-primary",
          "rounded-none px-0",
        ].join(" "),

        // Hard disabled style (kept for compatibility)
        disabled: [
          "bg-gray-200 text-gray-500",
          "border border-gray-200",
          "cursor-not-allowed",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "primary" },
  }
);
