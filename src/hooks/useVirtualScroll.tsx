import { RefObject, useEffect, useState } from "react";

interface Props<T> {
  ref: RefObject<HTMLElement>;
  array: T[];
  childHeight: number;
}

const useVirtualScroll = <T,>({ ref, array, childHeight }: Props<T>) => {
  const [slidingWindow, setSlidingWindow] = useState<typeof array>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  useEffect(() => {
    const element = ref.current; // Copy the ref to a variable
    if (element) {
      let startIndex = 0;
      const parentHeight = element.clientHeight;
      const size = Math.ceil(parentHeight / childHeight) * 2;
      let endIndex = startIndex + size;
      const updateState = () => {
        setSlidingWindow(array.slice(startIndex, endIndex));
        setStartIndex(startIndex);
        setEndIndex(endIndex);
      };

      const incrementIndex = () => {
        endIndex = endIndex < array.length - 1 ? endIndex + 1 : endIndex;
        startIndex = endIndex - size;
      };

      const decrementIndex = () => {
        startIndex = startIndex > 0 ? startIndex - 1 : startIndex;
        endIndex = startIndex + size;
      };

      const onScroll = () => {
        const scrollTop = element.scrollTop;
        const isOnTop = scrollTop < childHeight;
        const isOnBottom =
          element.scrollHeight - scrollTop < element.clientHeight + childHeight;
        if (isOnBottom && endIndex < array.length) {
          incrementIndex();
          updateState();
          element.scrollTop -= childHeight;
        } else if (isOnTop && startIndex > 0) {
          decrementIndex();
          updateState();
          element.scrollTop += childHeight;
        }
      };

      updateState();
      element.addEventListener("scroll", onScroll);
      return () => {
        element.removeEventListener("scroll", onScroll);
      };
    }
  }, [ref, array, childHeight]);

  return { scrollData: slidingWindow, startIndex, endIndex };
};

export default useVirtualScroll;
