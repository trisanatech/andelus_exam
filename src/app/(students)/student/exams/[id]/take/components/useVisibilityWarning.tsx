import { useEffect } from "react";
import { toast } from "sonner"; // or your shadcn toast

export function useVisibilityWarning() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        toast("Warning: Do not navigate away from the exam tab.", { variant: "warning", duration: 3000 });
      }
    };
    const handleBlur = () => {
      toast("Warning: The exam window lost focus.", { variant: "warning", duration: 3000 });
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);
}
