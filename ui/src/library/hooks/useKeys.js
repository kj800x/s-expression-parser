import { useEffect, useCallback } from "react";

export const useKeys = (handlers) => {
  const handleKeyPress = useCallback(
    (event) => {
      if (handlers[event.key]) {
        handlers[event.key](event);
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};
