// src/components/ImageGallery.jsx

import React from 'react';

function ImageGallery({ arr }) {
  const firstImage = arr ? arr : null;
  console.log(firstImage);

  return (
    <div>
      {firstImage ? (
        <img 
          src={`http://localhost:5000/uploads/${firstImage}`} 
          alt="Car" 
          className="w-full h-[500px] object-cover rounded-lg" 
          loading="lazy"
        />
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;