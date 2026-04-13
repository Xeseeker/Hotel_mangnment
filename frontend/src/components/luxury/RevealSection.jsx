import React from "react";
import { useInViewOnce } from "../../hooks/useInViewOnce";

const RevealSection = ({ children, className = "", ...rest }) => {
  const { ref, isVisible } = useInViewOnce();

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll overflow-visible ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
};

export default RevealSection;
