import React from "react";
import Data from "../Shared/Data";
import { Link } from "react-router-dom";

function Category() {
  return (
     // Main container for category section, with top margin for spacing
    <div className="mt-40">
      <h2 className="font-bold text-xl text-center mb-10">Browse by Type</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 px-20">
        {Data.Category.map((category, index) => (
          <Link to={"Search/" + category.name}>
            <div
              key={index}
              className="flex flex-col items-center border rounded-md p-3 hover:shadow-xl cursor-pointer"
            >
              <img
                src={category.icon}
                alt={category.name}
                width={40}
                height={40}
              />
              <h2 className="mt-2 text-center">{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Category;
