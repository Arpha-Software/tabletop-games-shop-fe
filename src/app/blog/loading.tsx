import { Loader } from "../ui/components";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-svh w-full bg-white z-50">
      <Loader />
    </div>
  );
}
