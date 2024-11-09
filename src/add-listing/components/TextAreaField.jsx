import React from 'react'
import { Textarea } from "@/components/ui/textarea"


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
