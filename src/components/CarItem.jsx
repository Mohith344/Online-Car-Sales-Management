// Import necessary modules and components
// - React for creating the component
// - Separator for visual separation between sections
// - Icons for car details (fuel type, mileage, gear type)
// - Link for routing to car listing details page

import React from 'react'
import { Separator } from './ui/separator'
import { BsFuelPumpDieselFill } from "react-icons/bs";
import { IoSpeedometerSharp } from "react-icons/io5";
import { GiGearStick } from "react-icons/gi";
import { Link } from 'react-router-dom';


function CarItem({car}) {
  return (
    // Link component to navigate to the car details page when clicked
    <Link to={'/listing-details/'+car?.id}>
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105">
        <h2 className='absolute m-2 bg-green-500 px-2 rounded-full text-sm pb-1 text-white'>New</h2>
        <img src={car.image} alt={car.name} width={300} height={250}
            className='rounded-t-xl w-full h-48 object-cover'
        />

        <div className='p-4'> 
            <h2 className='font-bold text-black text-lg mb-2'>{car.name}</h2>
            <Separator />
            <div className='grid grid-cols-3 mt-5 gap-4'>
                <div className='flex flex-col items-center'>
                <IoSpeedometerSharp className='text-xl mb-2 text-blue-500'/>
                <h2>{car.miles} Miles</h2>
                </div>

                <div className='flex flex-col items-center'>
                <BsFuelPumpDieselFill className='text-xl mb-2 text-green-500'/>
                <h2>{car.fuelType}</h2>
                </div>

                <div className='flex flex-col items-center'>
                <GiGearStick className='text-xl mb-2 text-red-500'/>
                <h2>{car.gearType}</h2>
                </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center mt-1">
                <h2 className='text-lg font-bold text-black'>${car.price}</h2>
                <button className="text-blue-500 hover:underline bg-inherit">View Details</button>
            </div>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default CarItem