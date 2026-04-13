import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-gold-200/50 bg-gradient-to-b from-cream-50/95 to-cream-100/90">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/60 bg-white shadow-soft">
                <span className="font-serif text-lg font-bold text-gold-700">EG</span>
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-elysium-ink">Elysium Grand</p>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gold-700/90">
                  Hotel
                </p>
              </div>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-dark-600">
              A five-star boutique sanctuary where timeless elegance meets intuitive hospitality.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-700">Discover</p>
            <ul className="mt-4 space-y-3 text-sm text-dark-700">
              <li>
                <Link to="/" className="transition hover:text-gold-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="transition hover:text-gold-600">
                  Rooms &amp; Suites
                </Link>
              </li>
              <li>
                <Link to="/#gallery" className="transition hover:text-gold-600">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/meeting-room" className="transition hover:text-gold-600">
                  Meeting room &amp; events
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-gold-600">
                  Join &amp; Book
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-700">Guest care</p>
            <ul className="mt-4 space-y-3 text-sm text-dark-700">
              <li>
                <Link to="/login" className="transition hover:text-gold-600">
                  Sign in
                </Link>
              </li>
              <li>
                <a href="#location" className="transition hover:text-gold-600">
                  Location
                </a>
              </li>
              <li>
                <a href="mailto:concierge@elysiumgrand.example" className="transition hover:text-gold-600">
                  Concierge
                </a>
              </li>
            </ul>
          </div>

          <div id="footer-contact">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-700">Visit</p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-dark-600">
              108 Gramercy Terrace
              <br />
              New York, NY 10010
              <br />
              <span className="mt-2 block text-gold-700">+1 (212) 555-0148</span>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gold-200/40 pt-8 sm:flex-row">
          <p className="text-xs text-dark-500">
            &copy; {year} Elysium Grand Hotel. All rights reserved.
          </p>
          <p className="text-xs tracking-wide text-dark-500">Crafted for exceptional stays.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
