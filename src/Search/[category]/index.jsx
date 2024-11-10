import React from 'react';
import Header from '@/components/header';
import Search from '@/components/Search';
import { useParams } from 'react-router-dom';
import CarItem from '@/components/CarItem';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useState } from 'react';

function SearchByCategory() {

    const { category } = useParams();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch listings based on category
        const fetchListingsByCategory = async () => {
          setLoading(true);
          try {
            const response = await fetch(`http://localhost:5000/api/listings/category/${category}`);
            if (!response.ok) {
              throw new Error('Failed to fetch listings');
            }
            const data = await response.json();
            setListings(data);
          } catch (error) {
            console.error('Error fetching listings by category:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (category) {
          fetchListingsByCategory();
        }
      }, [category]);


  return (
    <div className="w-screen min-h-screen text-center py-28 bg-[#eef0fc]">
      {/* Header */}
      <Header />

      {/* Search Component */}
      <div className="flex justify-center items-center w-full px-4 py-12">
        <div className="w-full max-w-4xl">
          <Search />
        </div>
      </div>

      <div className="w-full px-4 py-6 bg-[#eef0fc] flex justify-start">
        <div className="bg-white border border-gray-300 shadow-md rounded-full px-6 py-2 flex items-center">
          <span className="font-bold text-xl text-gray-800 capitalize">
            {category}
          </span>
        </div>
      </div>

{/* Listings */}
<div className="w-full px-4 py-6 bg-[#eef0fc] flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <Skeleton height={250} />
                  <div className="p-4">
                    <Skeleton height={30} width={`80%`} />
                    <Skeleton height={20} width={`60%`} style={{ marginTop: '0.5rem' }} />
                    <div className="grid grid-cols-3 gap-4 mt-5">
                      <div className="flex flex-col items-center">
                        <Skeleton circle={true} height={30} width={30} />
                        <Skeleton height={20} width={`80%`} style={{ marginTop: '0.5rem' }} />
                      </div>
                      <div className="flex flex-col items-center">
                        <Skeleton circle={true} height={30} width={30} />
                        <Skeleton height={20} width={`80%`} style={{ marginTop: '0.5rem' }} />
                      </div>
                      <div className="flex flex-col items-center">
                        <Skeleton circle={true} height={30} width={30} />
                        <Skeleton height={20} width={`80%`} style={{ marginTop: '0.5rem' }} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton height={25} width={`40%`} />
                      <Skeleton height={20} width={`30%`} />
                    </div>
                  </div>
                </div>
              ))
            : listings.length > 0
            ? listings.map((listing) => (
                <CarItem
                  key={listing.id}
                  car={{
                    name: listing.listingTitle,
                    image: listing.images ? `http://localhost:5000/uploads/${listing.images.split(',')[0]}` : '',
                    miles: listing.mileage,
                    fuelType: listing.fuelType,
                    gearType: listing.transmission,
                    price: listing.sellingPrice,
                  }}
                />
              ))
            : !loading && <p className="text-center text-gray-600">No listings found for this category.</p>}
        </div>
      </div>
    </div>
  );
}

export default SearchByCategory;