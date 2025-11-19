import React from "react";

function Header() {
  return (
    <nav className="w-full py-4 flex justify-center items-center">
      <img
        src="/physiCalcLogo.png"
        alt="PhysiCalc Logo"
        className="h-[80px] w-auto object-contain"
      />
    </nav>
  );
}

export default Header;
