import { Button } from '@/components/ui/button'
import React from 'react'
import { MdSell } from "react-icons/md";
function Pricing({carDetails}) {
  return (
    <div className='p-10 border rounded-xl shadow-md'>
        <h2>Our Price</h2>
        <h2 className='font-bold text-4xl'>${carDetails?.sellingPrice}</h2>
        <Button className="w-full mt-7" size="lg"><MdSell className='text-lg mr-1' />Buy Now</Button>
    </div>
  )
}

export default Pricing