import React from "react";

/**
 * Rounded luxury surface with soft shadow and optional hover lift.
 */
const LuxuryCard = ({
  children,
  className = "",
  hover = true,
  padding = "p-0",
  ...rest
}) => {
  const lift = hover ? "hover:-translate-y-1 hover:shadow-panel-hover" : "";
  return (
    <div
      className={`overflow-hidden rounded-luxury border border-gold-100/90 bg-white/95 shadow-panel backdrop-blur-sm transition-all duration-500 ${lift} ${padding} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
};

export default LuxuryCard;
