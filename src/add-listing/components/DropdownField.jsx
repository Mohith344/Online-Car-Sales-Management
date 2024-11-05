import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DropdownField = ({ item }) => {
  const [selectedValue, setSelectedValue] = useState(item?.defaultValue || null);

  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  return (
    <Select onValueChange={handleSelect} value={selectedValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={item?.label || 'Select an option'}>
          {selectedValue || 'Select an option'}
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