import { Input } from '@/components/ui/input';
import React from 'react';


// Props:
// - `item`: An object containing input field configuration (e.g., name, fieldType, required).
// - `handleInputChange`: Callback function to handle value changes in the input field.
// - `value`: The current value of the input field.

// Use the `Input` component to render a styled input field.
// - Bind the `type` attribute to `item.fieldType` for input type flexibility (e.g., text, number, email).
// - Bind the `name` attribute to `item.name` for unique identification.
// - Set `value` to the current value or an empty string if no value is provided.
// - Make the field required if `item.required` is true.
// - Attach the `onChange` event handler to capture user input and call `handleInputChange`
//   with the input's name and the new value.

// Wrap the input field in a `div` to allow for additional styling or structure if needed.


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