import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

function UploadImages({ handleImageChange }) {
  const [selectedFileList, setSelectedFileList] = useState([]);

  const onFileSelected = (event) => {
    const files = event.target.files;
    console.log(files);

    const newFiles = [];
    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      newFiles.push(file);
    }
    setSelectedFileList((prev) => [...prev, ...newFiles]);
    handleImageChange([...selectedFileList, ...newFiles]); // Call handleImageChange with the selected files
  };

  const onImageRemove = (image, index) => {
    const result = selectedFileList.filter((item) => item !== image);
    setSelectedFileList(result);
    handleImageChange(result); // Update the parent component with the new file list
  };

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload Car Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {selectedFileList.map((image, index) => (
          <div key={index}>
            <IoCloseCircle
              className="absolute m-2 text-lg text-white"
              onClick={() => onImageRemove(image, index)}
            />
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}

        <label htmlFor="upload-images">
          <div className="border rounded-xl border-dotted border-primary bg-blue-100 p-10 cursor-pointer hover:shadow-md">
            <h2 className="text-lg text-center text-primary">+</h2>
          </div>
        </label>
        <input
          type="file"
          multiple={true}
          id="upload-images"
          onChange={onFileSelected}
          className="opacity-0"
        />
      </div>
    </div>
  );
}

export default UploadImages;