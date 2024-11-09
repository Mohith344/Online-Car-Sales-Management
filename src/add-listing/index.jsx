import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
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
import { AiOutlineLoading } from "react-icons/ai";

function AddListing() {
  const [formData, setFormData] = useState({
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
    existingImages: [], // Existing image file names
    newImages: [], // New image File objects
  });

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/listings/${id}`);
          const data = await response.json();
          console.log("Fetched data:", data);
          setFormData({
            listingTitle: data.listingTitle,
            tagline: data.tagline,
            originalPrice: data.originalPrice,
            sellingPrice: data.sellingPrice,
            category: data.category,
            condition: data.condition,
            make: data.make,
            model: data.model,
            year: data.year,
            driveType: data.driveType,
            transmission: data.transmission,
            fuelType: data.fuelType,
            mileage: data.mileage,
            engineSize: data.engineSize,
            cylinder: data.cylinder,
            color: data.color,
            door: data.door,
            vin: data.vin,
            listingDescription: data.listingDescription,
            features: JSON.parse(data.features),
            existingImages: data.images ? data.images.split(",") : [],
            newImages: [],
          });
        } catch (error) {
          console.error("Error fetching listing:", error);
        }
      };

      fetchListing();
    }
  }, [id]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => {
      const newFeatures = checked
        ? [...prev.features, name]
        : prev.features.filter((feature) => feature !== name);
      return {
        ...prev,
        features: newFeatures,
      };
    });
    console.log(formData);
  };

  const handleImageChange = (updatedImages) => {
    const existing = updatedImages.filter((img) => typeof img === "string");
    const newImgs = updatedImages.filter((img) => img instanceof File);
    setFormData((prev) => ({
      ...prev,
      existingImages: existing,
      newImages: newImgs,
    }));
    console.log(formData);
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    dataToSend.append("features", JSON.stringify(formData.features));
    dataToSend.append("email", user.primaryEmailAddress.emailAddress);

    // Append existing images as JSON string
    dataToSend.append("existingImages", JSON.stringify(formData.existingImages));

    // Append new image files
    formData.newImages.forEach((image) => {
      dataToSend.append("newImages", image);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/listings${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        body: dataToSend,
      });

      if (response.ok) {
        console.log(id ? "Listing updated successfully" : "Listing added successfully");
        setLoading(false);
        navigate("/profile");
      } else {
        const errorText = await response.text();
        console.error("Failed to add/update listing:", response.statusText, errorText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white w-screen">
      <Header />
      <div className="pt-10 mt-20 px-4">
        <div className="mb-8 text-center">
          <h2 className="font-bold text-4xl">{id ? 'Edit Listing' : 'Add New Listing'}</h2>
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
                      value={formData[item.name]} // Pre-fill the form field
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                      value={formData[item.name]} // Pre-fill the form field
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                      value={formData[item.name]} // Pre-fill the form field
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
                      checked={formData.features.includes(item.name)}
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
          <Separator className="my-6" />
          {/* Car Images */}
          <UploadImages handleImageChange={handleImageChange} initialImages={formData.existingImages} />

          <div className="mt-10 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <AiOutlineLoading className="animate-spin" /> : id ? "Update Listing" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListing;