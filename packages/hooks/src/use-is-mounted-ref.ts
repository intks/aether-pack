import { useRef } from "react";
import useIsomorphicLayoutEffect from "./use-isomorphic-layout-effect";

const useIsMountedRef = () => {
  const isMountedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef;
};

export default useIsMountedRef;
