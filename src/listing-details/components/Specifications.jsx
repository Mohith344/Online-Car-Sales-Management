import React from 'react';
import PropTypes from 'prop-types';
import {
  FaCalendarAlt,      // Year
  FaCarSide,         // Category
  FaPalette,         // Color
  FaCarCrash,        // Condition
  FaCogs,            // Cylinder
  FaDoorOpen,        // Door
  FaRoad,            // Drive Type
  FaCog,             // Engine Size
  FaGasPump,         // Fuel Type
  FaTachometerAlt,   // Mileage
  FaMoneyCheckAlt,   // Original Price
  FaTags,            // Selling Price
  FaIdBadge,         // VIN
} from 'react-icons/fa';

function Specifications({ carDetails }) {
  console.log('Specifications prop:', carDetails);

  const formatCurrency = (num) => {
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(num));
  };

  const specifications = [
    { label: 'Year', value: carDetails?.Year || 'N/A', icon: <FaCalendarAlt /> },
    { label: 'Category', value: carDetails?.category || 'N/A', icon: <FaCarSide /> },
    { label: 'Color', value: carDetails?.color || 'N/A', icon: <FaPalette /> },
    { label: 'Condition', value: carDetails?.condition || 'N/A', icon: <FaCarCrash /> },
    { label: 'Cylinders', value: carDetails?.cylinder || 'N/A', icon: <FaCogs /> },
    { label: 'Doors', value: carDetails?.door || 'N/A', icon: <FaDoorOpen /> },
    { label: 'Drive Type', value: carDetails?.driveType || 'N/A', icon: <FaRoad /> },
    { label: 'Engine Size', value: carDetails?.engineSize ? `${carDetails?.engineSize} L` : 'N/A', icon: <FaCog /> },
    { label: 'Fuel Type', value: carDetails?.fuelType || 'N/A', icon: <FaGasPump /> },
    { label: 'Mileage', value: carDetails?.mileage ? `${carDetails?.mileage} km` : 'N/A', icon: <FaTachometerAlt /> },
    { label: 'Original Price', value: carDetails?.originalPrice ? formatCurrency(carDetails?.originalPrice) : 'N/A', icon: <FaMoneyCheckAlt /> },
    { label: 'Selling Price', value: carDetails?.sellingPrice ? formatCurrency(carDetails?.sellingPrice) : 'N/A', icon: <FaTags /> },
    { label: 'VIN', value: carDetails?.vin || 'N/A', icon: <FaIdBadge /> },
  ];

  return (
    <div className="p-6 rounded-xl shadow-md mt-7 bg-white">
      <h2 className="text-2xl font-medium mb-6">Specifications</h2>
      {specifications.length === 0 ? (
        <p className="text-gray-500">No specifications available for this listing.</p>
      ) : (
        <div className="space-y-3">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex items-center  rounded-lg shadow-sm transition-transform transform hover:animate-pulse"
            >
              <div className="text-blue-500 text-xl mr-3 hover:animate-bounce">
                {spec.icon}
              </div>
              <div className="flex justify-between w-full">
                <h3 className="text-md font-semibold text-gray-800">{spec.label}</h3>
                <p className="text-md text-gray-700">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Specifications.propTypes = {
  carDetails: PropTypes.shape({
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    color: PropTypes.string,
    condition: PropTypes.string,
    cylinder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    door: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    driveType: PropTypes.string,
    engineSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fuelType: PropTypes.string,
    mileage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sellingPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vin: PropTypes.string,
  }).isRequired,
};

export default Specifications;
