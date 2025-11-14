import React from "react";

const Header = () => {
  return (
    <header className="border-b border-[#262629] bg-black ">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="../../../red-hat-logo.png"
              alt="Red Hat Logo"
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#EE0000] rounded-sm flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm transform rotate-12"></div>
              </div>
              <div>
                <h1 className="text-white test-sm">
                  AI Contract Risk Analyzer
                </h1>
                <p className="text-gray-400 text-xs">Powered by Red Hat AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
