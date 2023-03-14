import { useEffect, useState, useRef } from 'react'
import _ from "lodash-es"

interface IDimensions {
  width: number;
  height: number;
}

const useResizeObserver = (el: HTMLElement) => {
  const [dimensions, setDimensions] = useState<IDimensions | null>(null);
  const observerRef = useRef(el ? el : null)

  useEffect(() => {

    const observeTarget = observerRef.current

    if (!observeTarget) return

    const resizeObserver = new ResizeObserver(_.throttle(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    }, 500));

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [el]);

  return { dimensions, ref: observerRef };
}

export default useResizeObserver