import { cn } from "@/utils/helpers";
import React, { ComponentProps, FC } from "react";

type BaseProps<T extends keyof JSX.IntrinsicElements> = ComponentProps<T> & {
  className?: string;
};

type TextCompound = FC<BaseProps<'span'>> & {
  Header: FC<BaseProps<'h1'>>;
  Subheader: FC<BaseProps<'h2'>>;
  Paragraph: FC<BaseProps<'p'>>;
  Span: FC<BaseProps<'span'>>;
};

export const Text = (({ children, className, ...props }: BaseProps<'span'>) => {
  return (
    <span {...props} className={cn(className)}>
      {children}
    </span>
  );
}) as TextCompound;

Text.Header = ({ children, className, ...props }: BaseProps<'h1'>) => {
  return (
    <h1 {...props} className={cn("text-3xl font-primary font-bold", className)}>
      {children}
    </h1>
  );
};

Text.Subheader = ({ children, className, ...props }: BaseProps<'h2'>) => {
  return (
    <h2 {...props} className={cn("font-secondary", className)}>
      {children}
    </h2>
  );
};

Text.Paragraph = ({ children, className, ...props }: BaseProps<'p'>) => {
  return (
    <p {...props} className={cn("font-secondary font-medium text-base", className)}>
      {children}
    </p>
  );
};

Text.Span = ({ children, className, ...props }: BaseProps<'span'>) => {
  return (
    <span {...props} className={cn("font-secondary font-medium text-base", className)}>
      {children}
    </span>
  );
};
