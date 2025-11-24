import React from "react";

function Header() {
  return (
    <nav className="w-full py-5 flex justify-center items-center">
      <a href="/">
        <img
          src="/physiCalcLogo.png"
          alt="PhysiCalc Logo"
          className="h-[80px] w-auto object-contain"
        />
      </a>
    </nav>
  );
}

export default Header;
