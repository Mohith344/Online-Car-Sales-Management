import Header from '@/components/header'
import React, { useEffect, useState } from 'react';
import DetailHeader from '../components/DetailHeader'
import { useParams } from 'react-router-dom'
import ImageGallery from '../components/imageGallery';
import Descriptions from '../components/Descriptions';
import Features from '../components/features';
import Pricing from '../components/Pricing';
import Specifications from '../components/Specifications';
import TestDriveBook from '../components/TestDriveBook';



function ListingDetail() {

    const {id} = useParams();
    const [carDetails, setcarDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(id)

        useEffect(() => {
      const fetchDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/listings/${id}`);
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
    
          const data = await response.json();
          setcarDetails(data);
        } catch (err) {
          console.error('Error fetching listing:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      if (id) {
        fetchDetails();
      }
    }, [id]);

    console.log(carDetails);
    const arr = carDetails?.images.split(',')[0];
    console.log(arr);
    


  return (
    <div>
        <Header />
        <div className="w-screen min-h-screen py-32 px-16 ">
            {/* DetailHeader */}
            <DetailHeader carDetails={carDetails} />
        
            <div className='grid grid-cols-1 md:grid-cols-3 pt-10'>
                {/*Left*/}
                <div className='md:col-span-2'>
                {/*ImageGallery*/}
                <ImageGallery arr={arr} />
                {/*Descriptions*/}
                <Descriptions carDetails={carDetails} />
                {/*Features*/}
                <Features features={carDetails?.features} />
                </div>

                {/*Right*/}
                <div className='px-8'>
                    {/*Pricing*/}
                    <Pricing carDetails={carDetails}/>
                    {/*Specifications*/}
                    <Specifications carDetails={carDetails}/>
                    {/*TestDriveBook*/}
                    <TestDriveBook carDetails={carDetails}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ListingDetail