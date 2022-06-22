import { useCallback, useState } from "react";

export function useUpdate() {
  const [, setSate] = useState();
  return useCallback(() => {
    setSate(() => {
      return undefined;
    });
  }, []);
}
