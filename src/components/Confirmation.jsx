import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/header';

function Confirmation() {
  const location = useLocation();
  const { owner_email } = location.state || {};

  return (
    <div>
      <Header />
      <div className="flex w-screen justify-center items-center min-h-screen bg-green-100">
        <div className="bg-white p-8 rounded shadow-md text-center hover:animate-bounce max-w-md">
          <h2 className="text-2xl mb-4">Booking Successful!</h2>
          <p className="mb-4">Your booking has been confirmed. Please contact the seller to finalize the details.</p>
          {owner_email && (
            <p>
              <strong>Seller's Email:</strong> <a href={`mailto:${owner_email}`} className="text-blue-500">{owner_email}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Confirmation;