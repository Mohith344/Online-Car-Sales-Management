// DetailHeader.jsx

import React from 'react';
import { IoCalendar } from "react-icons/io5";
import { IoSpeedometerSharp } from "react-icons/io5";
import { GiGearStickPattern } from "react-icons/gi";
import { GiGasPump } from "react-icons/gi";

function DetailHeader({ carDetails }) {
  return (
    <div>
      <div>
         {/* Check if carDetails is provided */}
        {carDetails ? (
          <>
            <h2 className="font-bold text-3xl">{carDetails.listingTitle}</h2>
            <p>{carDetails.tagline}</p>

            <div className="flex gap-2 mt-3">
              <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
                <IoCalendar className="h-5 w-5 text-primary" />
                <h2 className="text-primary text-sm">{carDetails.year}</h2>
              </div>

              <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
                <IoSpeedometerSharp className="h-5 w-5 text-primary" />
                <h2 className="text-primary text-sm">{carDetails.mileage.toLocaleString()} Miles</h2>
              </div>

              <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
                <GiGearStickPattern className="h-5 w-5 text-primary" />
                <h2 className="text-primary text-sm">{carDetails.transmission}</h2>
              </div>

              <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
                <GiGasPump className="h-5 w-5 text-primary" />
                <h2 className="text-primary text-sm">{carDetails.fuelType}</h2>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full rounded-xl h-[100px] bg-slate-200 animate-pulse"></div>
        )}
      </div>
    </div>
  );
}

export default DetailHeader;