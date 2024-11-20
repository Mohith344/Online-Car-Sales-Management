import React from 'react'
import { Textarea } from "@/components/ui/textarea"

// Define the TextAreaField component with props:
// - `item`: Contains field configuration (label, required, name).
// - `handleInputChange`: Callback function to handle changes in the textarea field.
// - `value`: The current value of the textarea.

// Render a `textarea` element with:
// - A `placeholder` set to `item.label` for guiding users.
// - The `required` attribute if specified in `item.required`.
// - A `value` bound to the provided `value` or an empty string.
// - Styling applied through classes (e.g., border, padding, rounded corners).
// - An `onChange` event to update the field value through `handleInputChange`.


function TextAreaField({ item, handleInputChange,value }) {
  return (
    <textarea
      placeholder={item.label}
      required={item.required}
      value={value || ''}
      className=" bg-inherit border p-2 w-full rounded-md"
      onChange={(e) => handleInputChange(item.name, e.target.value)}
    />
  );
}

export default TextAreaField;
