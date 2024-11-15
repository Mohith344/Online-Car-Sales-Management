// frontend/src/components/TestDriveBook.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './header'; // Ensure you have a Header component

function TestDriveBooking() {
  const { id } = useParams(); // Assuming 'id' is the listing ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_email: '',
    phone_number: '',
    test_drive_date: '',
    test_drive_time: '',
    additional_info: '',
  });
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');

    // Basic client-side validation
    const { user_email, phone_number, test_drive_date, test_drive_time } = formData;
    if (!user_email || !phone_number || !test_drive_date || !test_drive_time) {
      setFeedback('Please fill in all required fields.');
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/test_drive_bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: parseInt(id, 10),
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle errors (e.g., duplicate booking)
        setFeedback(result.message || 'Failed to process test drive booking.');
        setIsModalOpen(true);
        return;
      }

      // Success
      setFeedback(result.message);
      setIsModalOpen(true);
      // Optionally, navigate to a confirmation page
      // navigate('/confirmation');
    } catch (error) {
      console.error('Error processing test drive booking:', error);
      setFeedback('An unexpected error occurred.');
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optionally, reset form or navigate away
    navigate(`/listing-details/${id}`);
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center w-screen pt-24 min-h-screen  bg-gray-100">
        <form
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl mb-6">Book a Test Drive</h2>
          
          <div className="mb-4">
            <label htmlFor="user_email" className="block text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-blue-50"
              required
              placeholder='Please Enter Your Registered Email Address'
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
               className="w-full px-3 py-2 border rounded bg-blue-50"
              required
              pattern="\d{10}" // Example pattern for 10-digit numbers
              title="Please enter a valid 10-digit phone number."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="test_drive_date" className="block text-gray-700">
              Test Drive Date
            </label>
            <input
              type="date"
              id="test_drive_date"
              name="test_drive_date"
              value={formData.test_drive_date}
              onChange={handleChange}
             className="w-full px-3 py-2 border rounded bg-blue-50"
              required
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
            />
          </div>

          <div className="mb-4">
            <label htmlFor="test_drive_time" className="block text-gray-700">
              Test Drive Time
            </label>
            <input
              type="time"
              id="test_drive_time"
              name="test_drive_time"
              value={formData.test_drive_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-blue-50"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="additional_info" className="block text-gray-700">
              Additional Information (Optional)
            </label>
            <textarea
              id="additional_info"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-blue-50"
              rows="4"
              placeholder="Any special requests or notes..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Book Test Drive
          </button>
        </form>

        {/* Modal for feedback */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Notification</h3>
                <button
                  type="button"
                  className=" bg-red-400 hover:bg-red-600"
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
              </div>
              <p className="mb-4">{feedback}</p>
              <button
                type="button"
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestDriveBooking;