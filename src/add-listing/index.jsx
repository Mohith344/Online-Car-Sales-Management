import Header from '@/components/header'
import React from 'react'
import carDetails from '../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import TextAreaField from './components/TextAreaField'
import features from '../Shared/features.json'
import { Checkbox } from '@radix-ui/react-checkbox'
import CheckBoxField from './components/CheckBoxField'

function AddListing() {
  return (
    <div className="min-h-screen bg-white w-screen">
      <Header />
      <div className="pt-10 px-4">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="font-bold text-4xl">Add New Listing</h2>
        </div>
        
        {/* Form section */}
        <form className="w-full">
          {/* Car Details Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 w-full">
            <h2 className="font-medium text-xl mb-6">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {carDetails.carDetails.map((item, index) => (
                <div key={index} className="w-full">
                  <label className="text-sm">
                    {item?.label} {item.required && <span className="text-red-600">*</span>}
                  </label>
                  {item.fieldType === 'text' || item.fieldType === 'number' ? (
                    <InputField item={item} />
                  ) : item.fieldType === 'dropdown' ? (
                    <DropdownField item={item} />
                  ): null}
                </div>
              ))}
            </div>
          </div>

          {/* Features List Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 w-full">
            <h2 className="font-medium text-xl mb-6">Features List</h2>
            {/* Add features checkboxes/inputs here */}
            <div className='grid grid-cols-2 md:grid-cols-3'>
              {features.features.map((item,index)=>(
                <div key={index} className='flex gap-2 items-center'>
                  <Checkbox className='bg-current border-double'/> <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Car Image Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 w-full">
            <h2 className="font-medium text-xl mb-6">Car Images</h2>
            {/* Add image upload interface here */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddListing
