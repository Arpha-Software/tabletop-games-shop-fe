import { ReactNode, MouseEventHandler } from "react";
import Link from "next/link";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { Text } from "../../../../utils/ui/Text";
import { cn } from "@/utils/helpers";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "base"
  | "link"
  | "link-disabled"
  | "disabled"
  | "plain"
  | "plain-focus";

type ButtonTag = "button" | "div" | "a" | typeof Link;

type ButtonPropsBase = {
  variant?: ButtonVariant;
  tag?: ButtonTag;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
  icon?: any;
  disabled?: boolean;
  children: ReactNode;
};

type ButtonPropsForButton = {
  tag?: "button";
  type?: "button" | "submit" | "reset";
  form?: string;
} & ButtonPropsBase;

type ButtonPropsForDiv = {
  tag: "div";
  type?: never;
  form?: never;
} & ButtonPropsBase;

type ButtonPropsForAnchor = {
  tag: "a";
  href: string;
  type?: never;
  form?: never;
} & ButtonPropsBase;

type ButtonPropsForNextLink = {
  tag: typeof Link;
  href: string;
  type?: never;
  form?: never;
} & ButtonPropsBase;

type ButtonProps =
  | ButtonPropsForButton
  | ButtonPropsForDiv
  | ButtonPropsForAnchor
  | ButtonPropsForNextLink
  | (ButtonPropsBase & {
      // Fallback when tag omitted or mismatched; we'll normalize below.
      type?: "button" | "submit" | "reset";
      form?: string;
    });

export const Button = ({
  className,
  variant,
  tag = "button",
  children,
  type = "button",
  href,
  icon,
  disabled,
  onClick,
  form,
  ...props
}: ButtonProps) => {
  const isTrulyDisabled =
    disabled || variant === "disabled" || variant === "link-disabled";

  const content = icon ? (
    <>
      <Image src={icon} alt="icon" />
      <Text.Span>{children}</Text.Span>
    </>
  ) : (
    <Text.Span>{children}</Text.Span>
  );

  // 1) Next.js Link – only if href is provided
  if (tag === Link && href) {
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant }), className)}
        aria-disabled={isTrulyDisabled || undefined}
        onClick={(e) => {
          if (isTrulyDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onClick?.(e as any);
        }}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // 2) Native anchor – only if href is provided
  if (tag === "a" && href) {
    return (
      <a
        href={isTrulyDisabled ? undefined : href}
        className={cn(buttonVariants({ variant }), className)}
        aria-disabled={isTrulyDisabled || undefined}
        onClick={(e) => {
          if (isTrulyDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onClick?.(e as any);
        }}
        {...props}
      >
        {content}
      </a>
    );
  }

  // 3) Everything else -> normalize to 'button' | 'div' (no href here ever)
  const BtnTag: "button" | "div" = tag === "div" ? "div" : "button";

  const baseProps = {
    className: cn(buttonVariants({ variant }), className),
    "aria-disabled": isTrulyDisabled || undefined,
    ...props,
  };

  if (BtnTag === "button") {
    return (
      <button
        {...baseProps}
        type={type}
        disabled={isTrulyDisabled}
        form={form}
        onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
      >
        {content}
      </button>
    );
  }

  // Render as div (interactive container)
  return (
    <div
      {...baseProps}
      onClick={onClick as MouseEventHandler<HTMLDivElement> | undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (isTrulyDisabled) return;
        if (e.key === "Enter" || e.key === " ") {
          (onClick as any)?.(e);
        }
      }}
    >
      {content}
    </div>
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
          "p-0",
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
