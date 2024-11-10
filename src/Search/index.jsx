// src/components/SearchByOptions.jsx

import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Search from '@/components/Search';
import { useLocation } from 'react-router-dom';
import CarItem from '@/components/CarItem';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Separator } from '@/components/ui/separator';

function SearchByOptions() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const condition = queryParams.get('condition') || '';
  const make = queryParams.get('make') || '';
  const price = queryParams.get('price') || '';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch listings based on search filters
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct API URL with query parameters
        const apiUrl = new URL('http://localhost:5000/api/listings/Search');
        if (condition) apiUrl.searchParams.append('condition', condition);
        if (make) apiUrl.searchParams.append('make', make);
        if (price) apiUrl.searchParams.append('price', price);

        const response = await fetch(apiUrl.toString());

        if (!response.ok) {
          const errorText = await response.text(); 
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error.message); 
        // Optionally, you can set an error state here to display an error message to users
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [condition, make, price]);

  return (
    <div  className="w-screen min-h-screen text-center py-28 bg-[#eef0fc]">
      {/* Header */}
      <Header />

      {/* Search Component */}
      <div className="flex justify-center items-center w-full px-4 py-12">
        <div className="w-full max-w-4xl">
          <Search />
        </div>
      </div>

      {/* Search Filters Summary */}
      <div className="w-full px-4 py-4 bg-[#eef0fc] flex justify-start">
        <div className="bg-white border border-gray-300 shadow-md rounded-full px-6 py-2 flex items-center">
          <span className="font-bold text-xl text-gray-800 capitalize">
            {condition || 'Any Condition'}, {make || 'Any Make'}, {price || 'Any Price'}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full px-4 py-2 bg-red-100 text-red-700 text-center">
          {error}
        </div>
      )}


      {/* Listings */}
      <div className="w-full px-4 py-6 bg-[#eef0fc] flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            // Display Skeleton Loaders
            Array.from({ length: 6 }).map((_, index) => (
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
        ) : error ? (
            // Display only error message
            null            

          ) : listings.length > 0 ? (
            // Display Car Items
            listings.map((listing) => (
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
          ) : (
            // No Listings Found
            <p className="text-center text-gray-600 col-span-full">No listings found for the selected criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchByOptions;