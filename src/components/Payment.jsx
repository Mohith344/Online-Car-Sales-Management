import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/header';

function Payment() {
  const { id } = useParams(); // Get listing ID from URL
  console.log('Listing ID:', id);
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    buyer_email: '',
    phone_number: '',
    bank_name: '',
    account_number: '',
    routing_number: '',
  });
  const [feedback, setFeedback] = React.useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.buyer_email || !formData.phone_number || !formData.bank_name ||
        !formData.account_number || !formData.routing_number) {
      setFeedback('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listing_id: id,
          buyer_email: formData.buyer_email,
          phone_number: formData.phone_number,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          routing_number: formData.routing_number,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Listing already booked: ${errorData.message}`);
      }

      const result = await response.json();
      console.log(result.message);
      console.log('Owner Email:', result.owner_email);

      // Navigate to Confirmation page with owner_email as state
      navigate('/confirmation', { state: { owner_email: result.owner_email } });
    } catch (error) {
      console.error('Error processing booking:', error);
      setFeedback(error.message || 'Failed to process booking.');
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center w-screen  min-h-screen  py-32 px-16 bg-gray-100">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-6">Payment Details</h2>
          {feedback && <p className="text-red-500 mb-4">{feedback}</p>}
          
          <div className="mb-4">
            <label htmlFor="buyer_email" className="block text-gray-700">Email Address</label>
            <input
              
              type="email"
              id="buyer_email"
              name="buyer_email"
              value={formData.buyer_email}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-sm shadow-sm px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-sm shadow-sm px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bank_name" className="block text-gray-700">Bank Name</label>
            <input
              type="text"
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
               className="w-full bg-slate-50 border rounded-sm shadow-sm px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="account_number" className="block text-gray-700">Account Number</label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
               className="w-full bg-slate-50 border rounded-sm shadow-sm px-3 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="routing_number" className="block text-gray-700">Routing Number</label>
            <input
              type="text"
              id="routing_number"
              name="routing_number"
              value={formData.routing_number}
              onChange={handleChange}
               className="w-full bg-slate-50 border rounded-sm shadow-sm px-3 py-2"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Submit Booking</button>
        </form>
      </div>
    </div>
  );
}

export default Payment;