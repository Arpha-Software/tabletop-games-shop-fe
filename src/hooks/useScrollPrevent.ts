import { useEffect } from "react";

export const useScrollPrevent = (isEnabled = true) => {
  useEffect(() => {
    if (!isEnabled) return;

    document.body.style.overflow = "hidden";

    return () => {
      if (isEnabled) {
        document.body.style.overflow = "auto";
      }
    };
  }, [isEnabled]);

  return;
}
