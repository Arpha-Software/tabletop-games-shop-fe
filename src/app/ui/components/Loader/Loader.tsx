import { cn } from "@/utils/helpers";

export const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
      <div className="w-16 h-16 border-4 border-secondary border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
