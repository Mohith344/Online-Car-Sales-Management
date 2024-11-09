import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import CarItem from "@/components/CarItem";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function MyListing() {
  const [listings, setListings] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/listings/user/${user.primaryEmailAddress.emailAddress}`);
        const data = await response.json();
        setListings(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    if (user) {
      fetchListings();
    }
  }, [user]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-4xl">My Listing</h2>
        <Link to="/add-listing">
          <Button>+ Add New Listing</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded-lg p-4">
            <CarItem
              car={{
                name: listing.listingTitle,
                image: `http://localhost:5000/uploads/${listing.images.split(',')[0]}`,
                miles: listing.mileage,
                fuelType: listing.fuelType,
                gearType: listing.transmission,
                price: listing.sellingPrice,
              }}
            />
            <div className="rounde-lg gap-2 bg-gray-50 p-2 flex justify-between mt-4">
              <Button  className="w-full bg-slate-600 hover:bg-blue-500"><FaEdit /></Button>
              <Button className="bg-red-400 hover:bg-red-500"><MdDelete /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListing;
