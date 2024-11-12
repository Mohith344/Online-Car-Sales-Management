// src/components/Features.jsx

import React from 'react';
import { FaCheck } from "react-icons/fa6";
import PropTypes from 'prop-types';

function Features({ features }) {
    console.log('Features prop:', features);
    console.log('Type of features:', typeof features);
    console.log('Is features an array?', Array.isArray(features));

    // Initialize an empty array to store features
    let featuresArray = [];

    // Helper function to check if a string is valid JSON
    const isJSON = (str) => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Process 'features' based on its type
    if (Array.isArray(features)) {
        featuresArray = features;
    } else if (typeof features === 'string') {
        if (isJSON(features)) {
            // If it's a JSON string, parse it into an array
            featuresArray = JSON.parse(features);
        } else {
            // Otherwise, split the string by commas
            featuresArray = features.split(',').map(item => item.trim());
        }
    }

    console.log('Processed Features Array:', featuresArray);

    // Check if 'featuresArray' has at least one feature
    if (featuresArray.length === 0) {
        return (
            <div className='mt-7 p-5 rounded-xl border shadow-md bg-white'>
                <h2 className='font-medium text-2xl mb-4'>Features</h2>
                <p className='text-gray-500'>No features available for this listing.</p>
            </div>
        );
    }

    return (
        <div className='mt-7 p-5 rounded-xl border shadow-md bg-white'>
            <h2 className='font-medium text-2xl mb-4'>Features</h2>
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {featuresArray.map((feature, index) => (
                    <li key={index} className='flex items-center hover:bg-gray-50 p-2 rounded-md'>
                        <FaCheck className='text-lg bg-blue-100 rounded-full animate-pulse text-primary mr-2' aria-hidden="true" />
                        <span className='text-gray-700'>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

Features.propTypes = {
    features: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
    ])
};

Features.defaultProps = {
    features: []
};

export default Features;