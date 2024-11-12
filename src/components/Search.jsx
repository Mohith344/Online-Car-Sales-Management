import React from "react";
import '../index.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BiSearchAlt2 } from "react-icons/bi";
import Data from "../Shared/Data"; // Ensure Data is imported correctly
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

function Search() {

  const navigate = useNavigate();

  const [condition, setCondition] = useState("");
  const [make, setMake] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = () => {
    // Construct query parameters based on selected filters
    const params = new URLSearchParams();

    if (condition) params.append('condition', condition);
    if (make) params.append('make', make);
    // Convert price amount string to numerical value
    if (price) {
      // Remove $ and commas, then parse to integer
      const maxPrice = parseInt(price.replace(/[$,]/g, ''));
      params.append('price', maxPrice);
    }

    // Navigate to SearchByOptions with query parameters
    navigate({
      pathname: '/Search',
      search: params.toString(),
    });
  }

  return (
    <div className="flex justify-center items-center p-2 bg-white rounded-md md:rounded-full 
    flex-col md:flex md:flex-row gap-10 px-5 w-[80%] mx-auto">
      <Select value={condition} onValueChange={setCondition}>
        <SelectTrigger className="w-full text-gray-800 dark:text-white p-5 outline-none md:border-none shadow-none text-lg">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Used">Used</SelectItem>
          <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="hidden md:block" />
      <Select value={make} onValueChange={setMake}>
        <SelectTrigger className="w-full text-gray-800 dark:text-white p-5 outline-none md:border-none shadow-none text-lg">
          <SelectValue placeholder="Car Makes" />
        </SelectTrigger>
        <SelectContent>
          {Data.CarMakes.map((carMake, index) => (
            <SelectItem key={index} value={carMake.name}>{carMake.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="hidden md:block" />
      <Select value={price} onValueChange={setPrice}>
        <SelectTrigger className="w-full text-gray-800 dark:text-white p-5 outline-none md:border-none shadow-none text-lg">
          <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent>
            {Data.Pricing.map((price, index) => (
                <SelectItem key={index} value={price.amount}>{price.amount}</SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div onClick={handleSearch} className="cursor-pointer">
        <BiSearchAlt2 className="text-[50px] bg-primary rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer" />
      </div>
    </div>
  );
}

export default Search;