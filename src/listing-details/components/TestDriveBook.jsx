// frontend/src/components/Pricing.jsx
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { MdOutlineDriveEta } from "react-icons/md";

function TestDriveBook({ carDetails }) {
  const {id} = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  console.log(isSignedIn);
  console.log(carDetails);
  console.log(id);
   // Access isSignedIn from Clerk
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = () => {
    if (isSignedIn) {
      // Navigate to Payment page with listing ID
       navigate(`/test-drive-booking/${id}`);
    } else {
      // Open modal with sign-in/sign-up prompt
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='p-10 mt-4 border rounded-xl shadow-md'>
        <h2 className='font-bold text-4xl'>Want Test Drive!!</h2>
        <h2>click below!!</h2>
      <Button className="w-full mt-7" size="lg" onClick={handleBookNow}>
        <MdOutlineDriveEta className='text-xl mr-1' />Book Test Drive
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <h3 className="text-xl mb-4">Authentication Required</h3>
            <p className="mb-6">Please sign up or sign in to proceed with your booking.</p>
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-300 bg-red-400 hover:bg-red-600 rounded-md "
              onClick={handleCloseModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestDriveBook;