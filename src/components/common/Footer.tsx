import React from "react";
import { FaFilm } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded-t-3xl border-t border-base-100 mt-20">
        <div className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Terms of service</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Help Center</a>
        </div>
        <div>
          <div className="flex items-center gap-2 text-lg font-black text-primary mb-2 select-none">
            <FaFilm className="text-xl text-secondary" /> FLIXORA
          </div>
          <p>© 2026 Flixora Media Inc. All rights reserved.</p>
        </div>
      </footer>
      ;
    </>
  );
};

export default Footer;
