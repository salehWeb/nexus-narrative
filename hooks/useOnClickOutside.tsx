import { RefObject, useCallback, useEffect } from "react";

const useOnClickOutside = (ref: RefObject<HTMLElement> | RefObject<HTMLElement>[] | null, handler: (event: MouseEvent) => void) => {

  const array = useCallback((refs: RefObject<HTMLElement>[], event: MouseEvent) => {
    let isClickedIn = false;

    for (let i = 0; i < refs.length; i++) {
      const currentRef = refs[i]?.current;
      if (currentRef === null) continue;

      if (event.composedPath().includes(currentRef)) {
        isClickedIn = true;
        break;
      }
    }

    if (!isClickedIn) handler(event);
  }, [handler])

  const listener = useCallback((event: MouseEvent) => {
    if (Array.isArray(ref)) array(ref, event);
    else if (ref?.current === null) handler(event);
    else if (ref?.current && !event.composedPath().includes(ref.current)) handler(event);
  }, [ref, array, handler])

  useEffect(() => {
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, [listener]);
}

export default useOnClickOutside;
