import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import React from "react";
import "../index.css";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Remove container class to allow full-width layout */}
      <main className="w-full">
        {/* Content wrapper with negative margin to allow button to reach edge */}
        <div className="pt-24 pb-6 px-10">
          {/* Flex container with relative positioning */}
          <div className="flex items-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              My Listing
            </h2>
            {/* Absolute positioning for the button */}
            <div className="absolute right-0 mr-10">
              <Link to="/add-listing">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  + Add New Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
