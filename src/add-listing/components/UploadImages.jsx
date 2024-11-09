import React, { useState, useEffect } from "react";
import { IoCloseCircle } from "react-icons/io5";

function UploadImages({ handleImageChange, initialImages = [] }) {
  const [existingImages, setExistingImages] = useState([]); // URLs of existing images
  const [newImages, setNewImages] = useState([]); // File objects for new uploads

  useEffect(() => {
    if (initialImages.length > 0) {
      setExistingImages(initialImages);
    }
  }, [initialImages]);

  const onFileSelected = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    setNewImages((prev) => [...prev, ...fileArray]);
    handleImageChange([...existingImages, ...fileArray]);
  };

  const onExistingImageRemove = (image) => {
    const updatedExisting = existingImages.filter((img) => img !== image);
    setExistingImages(updatedExisting);
    handleImageChange([...updatedExisting, ...newImages]);
  };

  const onNewImageRemove = (file) => {
    const updatedNew = newImages.filter((img) => img !== file);
    setNewImages(updatedNew);
    handleImageChange([...existingImages, ...updatedNew]);
  };

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload Car Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {/* Display Existing Images */}
        {existingImages.map((image, index) => (
          <div key={`existing-${index}`} className="relative">
            <IoCloseCircle
              className="absolute m-2 text-lg text-white bg-black rounded-full cursor-pointer"
              onClick={() => onExistingImageRemove(image)}
            />
            <img
              src={`http://localhost:5000/uploads/${image}`}
              alt="Existing Listing"
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}

        {/* Display New Images */}
        {newImages.map((image, index) => (
          <div key={`new-${index}`} className="relative">
            <IoCloseCircle
              className="absolute m-2 text-lg text-white bg-black rounded-full cursor-pointer"
              onClick={() => onNewImageRemove(image)}
            />
            <img
              src={URL.createObjectURL(image)}
              alt="New Listing"
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}

        {/* Upload Button */}
        <label htmlFor="upload-images" className="cursor-pointer">
          <div className="border rounded-xl border-dotted border-primary bg-blue-100 p-10 cursor-pointer hover:shadow-md">
            <h2 className="text-lg text-center text-primary">+</h2>
          </div>
        </label>
        <input
          type="file"
          multiple
          id="upload-images"
          onChange={onFileSelected}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default UploadImages;