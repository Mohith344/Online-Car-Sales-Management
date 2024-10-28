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

function Search() {
  return (
    <div className="flex justify-center items-center p-2 bg-white rounded-md md:rounded-full 
    flex-col md:flex md:flex-row gap-10 px-5 w-[60%] mx-auto">
      <Select>
        <SelectTrigger className="w-full text-gray-800 dark:text-white p-5 outline-none md:border-none shadow-none text-lg">
          <SelectValue placeholder="Cars" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="old">Old</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="hidden md:block" />
      <Select>
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
      <Select>
        <SelectTrigger className="w-full text-gray-800 dark:text-white p-5 outline-none md:border-none shadow-none text-lg">
          <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent>
            {Data.Pricing.map((price, index) => (
                <SelectItem key={index} value={price.amount}>{price.amount}</SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div>
        <BiSearchAlt2 className="text-[50px] bg-primary rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer" />
      </div>
    </div>
  );
}

export default Search;