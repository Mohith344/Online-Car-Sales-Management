import React, { useEffect, useState } from "react";
import CarItem from "./CarItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function MostSearchedCar() {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings/search?limit=8');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCarData(data);
      } catch (err) {
        console.error('Error fetching car data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  if (loading) {
    return (
      <div className="mx-20">
        <h2 className="font-bold text-3xl text-center mt-16 mb-7">
          Most Searched Cars
        </h2>
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-20">
        <h2 className="font-bold text-3xl text-center mt-16 mb-7">
          Most Searched Cars
        </h2>
        <div className="w-full px-4 py-2 bg-red-100 text-red-700 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-20">
      <h2 className="font-bold text-3xl text-center mt-16 mb-7">
        Most Searched Cars
      </h2>
      {carData.length > 0 ? (
        <Carousel>
          <CarouselContent>
            {carData.map((car, index) => (
              <CarouselItem className="basis-1/4" key={car.id || index}>
                <CarItem
                  key={car.id}
                  car={{
                    id: car.id,
                    name: car.listingTitle,
                    image: car.images ? `http://localhost:5000/uploads/${car.images.split(',')[0]}` : '',
                    miles: car.mileage,
                    fuelType: car.fuelType,
                    gearType: car.transmission,
                    price: car.sellingPrice,
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className="text-center text-gray-600">No cars found.</p>
      )}
    </div>
  );
}

export default MostSearchedCar;