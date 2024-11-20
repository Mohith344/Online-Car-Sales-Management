import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define a reusable DropdownField component
// Props:
// - `item`: An object containing dropdown configuration (name, label, options, etc.)
// - `handleInputChange`: Callback function to handle value changes in the dropdown
// - `value`: The currently selected value of the dropdown
// Use the `Select` component to create a dropdown
// Bind `value` to the `Select` component and handle value changes via the `onValueChange` prop
// Call `handleInputChange` with the dropdown's name and the selected value when a new value is chosen

// Render a styled trigger (button-like UI) for the dropdown using `SelectTrigger`
// Display the placeholder or currently selected value inside the trigger

// Render dropdown options using `SelectContent`
// Map over `item.options` to dynamically create `SelectItem` components for each option
// Display a fallback `SelectItem` with a disabled state if no options are available


const DropdownField = ({ item, handleInputChange,value }) => {
  return (
    <Select value={value} onValueChange={(value) => handleInputChange(item.name, value)}>
      <SelectTrigger
        className="w-full p-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <SelectValue placeholder={item?.label || 'Select an option'}>
          {item?.defaultValue || 'Select an option'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {item?.options?.length > 0 ? (
          item.options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled>No options available</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default DropdownField;
