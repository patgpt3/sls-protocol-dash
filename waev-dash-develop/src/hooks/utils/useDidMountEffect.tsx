import { useEffect, useRef } from 'react';

// Only fires after initial load.
export const useDidMountEffect = (func: Function, deps: boolean[]| string[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};
