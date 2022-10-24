import { useEffect, useRef, useState } from "react";

const LazyLoader = props => {
  const { show, delay = 1000 } = props;
  const [showLoader, setShowLoader] = useState(props.show);
  const timerRef = useRef(null);
  useEffect(() => {
    if (!show) {
      setShowLoader(false);
      clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      setShowLoader(true);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [show, delay]);

  return showLoader ? props.children : null;
};

export default LazyLoader;
