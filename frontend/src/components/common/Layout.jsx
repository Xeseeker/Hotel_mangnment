import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function isStaffRoute(pathname) {
  return pathname.startsWith("/receptionist") || pathname.startsWith("/admin");
}

/**
 * Shell: top navigation + page content + conditional marketing footer.
 * Staff routes stay focused without footer; public & customer pages get footer.
 */
const Layout = ({ children, onMenuClick }) => {
  const { pathname } = useLocation();
  const showFooter = !isStaffRoute(pathname);

  return (
    <>
      <Navbar onMenuClick={onMenuClick} />
      {children}
      {showFooter ? <Footer /> : null}
    </>
  );
};

export default Layout;
