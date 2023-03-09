import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import _ from "lodash-es"

interface IDimensions {
  width: number;
  height: number;
}

const useWindowResize = () => {
  const [dimensions, setDimensions] = useState<IDimensions | null>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDimensions({ width, height })
    })

    return () => {
      window.removeEventListener("resize", () => {
      });
    }

  }, []);

  return { dimensions };
}

export default useWindowResize