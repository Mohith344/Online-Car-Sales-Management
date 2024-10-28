import React from "react";
import Search from "./Search";

function Hero() {
  return (
    <div>
      <div className="w-screen min-h-screen flex flex-col justify-center items-center text-center p-10 gap-6 bg-[#eef0fc]">
        <h2 className="text-2xl text-gray-700 mt-20">Find Cars for Sale</h2>
        <h1 className="text-[60px] font-bold">Find Your Dream Car</h1>
        <Search />
        <img src="/tesla.png" className="mt-10 w-[80%]" />
      </div>
    </div>
  );
}

export default Hero;
