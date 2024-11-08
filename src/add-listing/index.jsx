import Header from "@/components/header";
import React from "react";
import carDetails from "../Shared/carDetails.json";
import InputField from "./components/InputField";
import DropdownField from "./components/DropdownField";
import TextAreaField from "./components/TextAreaField";
import features from "../Shared/features.json";
import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import UploadImages from "./components/UploadImages";
import { Separator } from "@/components/ui/separator";

function AddListing() {
  const [formData, setFormData] = React.useState({
    listingTitle: "",
    tagline: "",
    originalPrice: "",
    sellingPrice: "",
    category: "",
    condition: "",
    make: "",
    model: "",
    year: "",
    driveType: "",
    transmission: "",
    fuelType: "",
    mileage: "",
    engineSize: "",
    cylinder: "",
    color: "",
    door: "",
    vin: "",
    listingDescription: "",
    features: [],
    images: [], // Add images to formData
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData); // Log the updated formData
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prevFormData) => {
      const newFeatures = checked
        ? [...prevFormData.features, name]
        : prevFormData.features.filter((feature) => feature !== name);
      return {
        ...prevFormData,
        features: newFeatures,
      };
    });
    console.log(formData); // Log the updated formData
  };

    const handleImageChange = (images) => {
    setFormData({
      ...formData,
      images: images,
    });
  };
  
  const onsubmit = async (e) => {
    e.preventDefault();
  
    // Prepare form data
    const dataToSend = new FormData();
    dataToSend.append("listingTitle", formData.listingTitle);
    dataToSend.append("tagline", formData.tagline);
    dataToSend.append("originalPrice", parseFloat(formData.originalPrice) || null);
    dataToSend.append("sellingPrice", parseFloat(formData.sellingPrice) || 0);
    dataToSend.append("category", formData.category);
    dataToSend.append("condition", formData.condition);
    dataToSend.append("make", formData.make);
    dataToSend.append("model", formData.model);
    dataToSend.append("year", formData.year ? parseInt(formData.year, 10) : null);
    dataToSend.append("driveType", formData.driveType);
    dataToSend.append("transmission", formData.transmission);
    dataToSend.append("fuelType", formData.fuelType);
    dataToSend.append("mileage", parseInt(formData.mileage, 10) || null);
    dataToSend.append("engineSize", parseFloat(formData.engineSize) || null);
    dataToSend.append("cylinder", parseInt(formData.cylinder, 10) || null);
    dataToSend.append("color", formData.color);
    dataToSend.append("door", parseInt(formData.door, 10) || null);
    dataToSend.append("vin", formData.vin);
    dataToSend.append("listingDescription", formData.listingDescription);
    dataToSend.append("features", JSON.stringify(formData.features)); // Convert array to JSON string
    formData.images.forEach((image) => {
      dataToSend.append("images", image);
    });
  
    try {
      const response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        body: dataToSend,
      });
  
      if (response.ok) {
        console.log("Listing added successfully");
        // Optionally clear the form or show a success message
      } else {
        const errorText = await response.text();
        console.error("Failed to add listing:", response.statusText, errorText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white w-screen">
      <Header />
      <div className="pt-10 mt-20 px-4">
        <div className="mb-8 text-center">
          <h2 className="font-bold text-4xl">Add New Listing</h2>
        </div>
        <form className="w-full" onSubmit={onsubmit}>
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 w-full">
            <h2 className="font-medium text-xl mb-6">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {carDetails.carDetails.map((item, index) => (
                <div key={index} className="w-full">
                  <label className="text-sm">
                    {item?.label}{" "}
                    {item.required && <span className="text-red-600">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-medium text-2xl mb-6">Features List</h2>
            <div className="p-4 border rounded-md shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {features.features.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-1 border rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Checkbox
                      id={`feature-${index}`}
                      className="w-4 h-4 bg-white border border-gray-300 rounded-md flex items-center justify-center"
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "4px",
                      }}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(item.name, checked)
                      }
                    >
                      <CheckboxIndicator className="flex items-center justify-center">
                        <CheckCircledIcon
                          className="text-white"
                          style={{
                            backgroundColor: "blue",
                            borderRadius: "4px",
                          }}
                        />
                      </CheckboxIndicator>
                    </Checkbox>
                    <label
                      htmlFor={`feature-${index}`}
                      className="text-gray-700 text-sm"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator className="my-6"/>
          {/* Car Images */}
          <UploadImages handleImageChange={handleImageChange} />

          <div className="mt-10 flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListing;