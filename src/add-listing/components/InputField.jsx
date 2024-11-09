import { Input } from '@/components/ui/input';
import React from 'react';

function InputField({ item, handleInputChange,value }) {
  return (
    <div>
      <Input
        type={item?.fieldType}
        name={item?.name}
        value={value || ''}
        required={item?.required}
        onChange={(e) => handleInputChange(item.name, e.target.value)}
      />
    </div>
  );
}

export default InputField;