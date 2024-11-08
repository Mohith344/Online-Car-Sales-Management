import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DropdownField = ({ item, handleInputChange }) => {
  return (
    <Select onValueChange={(value) => handleInputChange(item.name, value)}>
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
