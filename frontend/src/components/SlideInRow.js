import React, { useEffect, useRef } from "react";

export default function SlideInRow({ children, delay = 0 }) {
  const rowRef = useRef(null);
  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      row.style.opacity = 0;
      row.style.transform = "translateX(100px)";
      setTimeout(() => {
        row.style.transition = "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)";
        row.style.opacity = 1;
        row.style.transform = "translateX(0)";
      }, delay);
    }
  }, [delay]);
  return (
    <tr ref={rowRef}>
      {children}
    </tr>
  );
}
