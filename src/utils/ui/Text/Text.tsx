import { cn } from "@/utils/helpers";
import { ReactNode } from "react";

type TProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export const Text = ({ children, className }: TProps) => {
  return <span className={cn(className)}>{children}</span>;
};

Text.Header = ({ children, className, id }: TProps) => {
  return (
    <h1 className={cn("text-3xl font-primary font-bold", className)} id={id}>
      {children}
    </h1>
  );
};

Text.Subheader = ({ children, className }: TProps) => {
  return (
    <h2 className={cn("font-secondary", className)}>
      {children}
    </h2>
  );
};

Text.Paragraph = ({ children, className }: TProps) => {
  return (
    <p className={cn("font-secondary font-medium text-base", className)}>
      {children}
    </p>
  );
};

Text.Span = ({ children, className }: TProps) => {
  return (
    <span className={cn("font-secondary font-medium text-base", className)}>
      {children}
    </span>
  );
}
