import React from "react";

const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-[22px] bg-[linear-gradient(90deg,#f3eadb_0%,#fcf8f1_50%,#f3eadb_100%)] ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
