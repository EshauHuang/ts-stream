import { useEffect, useState } from 'react'
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
    const getDimensions = _.throttle(() => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDimensions({ width, height })
    })
    window.addEventListener("resize", getDimensions)

    return () => {
      window.removeEventListener("resize", getDimensions);
    }

  }, []);

  return { dimensions };
}

export default useWindowResize