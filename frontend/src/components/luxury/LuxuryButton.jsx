import React from "react";
import { Link } from "react-router-dom";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

/**
 * Luxury-styled button or Link. Pass `to` for navigation; otherwise renders <button>.
 */
const LuxuryButton = ({
  variant = "primary",
  className = "",
  children,
  to,
  type = "button",
  ...rest
}) => {
  const v = variants[variant] || variants.primary;
  const combined = `${v} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combined} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={combined} {...rest}>
      {children}
    </button>
  );
};

export default LuxuryButton;
