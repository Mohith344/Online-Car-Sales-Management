import Header from '@/components/header'
import React from 'react'

function AddListing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className='pt-32 px-10 md:px-20'>
        {/* Separate heading from form */}
        <div className='mb-8'>
          <h2 className='font-bold text-4xl'>Add New Listing</h2>
        </div>
        
        {/* Form section */}
        <form className='max-w-4xl'>
          {/* Car Details Section */}
          <div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
            <h2 className='font-medium text-xl mb-6'>Car Details</h2>
            {/* Add form fields here */}
          </div>

          {/* Features List Section */}
          <div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
            <h2 className='font-medium text-xl mb-6'>Features List</h2>
            {/* Add features checkboxes/inputs here */}
          </div>

          {/* Car Image Section */}
          <div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
            <h2 className='font-medium text-xl mb-6'>Car Images</h2>
            {/* Add image upload interface here */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddListing