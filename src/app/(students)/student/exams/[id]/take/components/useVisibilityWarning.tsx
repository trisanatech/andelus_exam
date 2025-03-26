import { useEffect } from "react";
import { toast } from "sonner"; 

export function useVisibilityWarning() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        toast("Warning: Do not navigate away from the exam tab.", {
          duration: 5000,
          style: { backgroundColor: "#DC2626", color: "white" }, // Red background
        });
      }
    };

    const handleBlur = () => {
      toast("Warning: The exam window lost focus.", {
        duration: 5000,
        style: { backgroundColor: "#DC2626", color: "white" }, // Red background
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);
}
