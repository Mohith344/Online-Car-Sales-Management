import React from 'react'

function Descriptions({carDetails}) {
  return (
    <div>
      {/* Check if the carDetails object has a listingDescription */}
        {carDetails?.listingDescription ? (
    <div className='p-5 rounded-xl bg-white shadow-md mt-6 border'>
        <h2 className='my-2 font-medium text-2xl'>Description</h2>
        <p className='text-gray-500'>{carDetails?.listingDescription}</p>

    </div>
        ) :( <dvi className="w-full h-[100px] mt-7 bg-slate-200 animate-pulse rounded-xl">

        </dvi>
        )}
    </div>
  )
}

export default Descriptions