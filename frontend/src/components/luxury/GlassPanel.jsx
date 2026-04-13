import React from "react";

const GlassPanel = ({ children, className = "", ...rest }) => (
  <div
    className={`glass rounded-luxury border border-white/30 p-6 shadow-glass ${className}`.trim()}
    {...rest}
  >
    {children}
  </div>
);

export default GlassPanel;
