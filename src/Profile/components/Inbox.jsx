// frontend/src/components/Inbox.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react'; // Ensure you have a Header component
import { Separator } from "@/components/ui/separator";

function Inbox() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [testDriveBookings, setTestDriveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract user_email from Clerk's user object
  const userEmail = user && user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : '';

  useEffect(() => {
    if (!userEmail) return;

    const fetchInboxData = async () => {
      setLoading(true);
      setError('');

      try {
        const [ordersRes, bookingsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/orders?buyer_email=${encodeURIComponent(userEmail)}`),
          fetch(`http://localhost:5000/api/test_drive_bookings?user_email=${encodeURIComponent(userEmail)}`)
        ]);

        if (!ordersRes.ok) {
          throw new Error('Failed to fetch orders.');
        }
        if (!bookingsRes.ok) {
          throw new Error('Failed to fetch test drive bookings.');
        }

        const ordersData = await ordersRes.json();
        const bookingsData = await bookingsRes.json();

        setOrders(ordersData);
        setTestDriveBookings(bookingsData);
      } catch (err) {
        console.error(err);
        setError(err.message || 'An error occurred while fetching inbox data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInboxData();
  }, [userEmail]);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to cancel order.');
      }

      // Update orders state by removing the cancelled order
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      alert(result.message);
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while cancelling the order.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this test drive booking?');
    if (!confirmCancel) return;

    try {
      const res = await fetch(`http://localhost:5000/api/test_drive_bookings/${bookingId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to cancel test drive booking.');
      }

      // Update testDriveBookings state by removing the cancelled booking
      setTestDriveBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      alert(result.message);
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while cancelling the test drive booking.');
    }
  };

  if (loading) {
    return (
      <div>
        
        <div className="container mx-auto p-4">
          <p>Loading your inbox...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        
        <div className="container mx-auto p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <div className="container mx-auto p-4">
        <h1 className="font-bold text-4xl">Inbox</h1>
            <Separator className="w-[100%] mt-1"/>
        {/* Orders Section */}
        <section className="mb-8 mt-4">
          <h2 className="font-bold text-3xl">Your Orders</h2>
          {orders.length === 0 ? (
            <p>You have no orders.</p>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Car Model</th>
                  <th className="py-2 px-4 border">Order Date</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border text-center">{order.id}</td>
                    <td className="py-2 px-4 border text-center">{order.listingTitle}</td>
                    <td className="py-2 px-4 border text-center">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border text-center">{order.status}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Test Drive Bookings Section */}
        <Separator className="w-[100%] mt-1"/>
        <section>
          <h2 className="font-bold text-3xl">Your Test Drive Bookings</h2>
          {testDriveBookings.length === 0 ? (
            <p>You have no test drive bookings.</p>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Booking ID</th>
                  <th className="py-2 px-4 border">Car Model</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testDriveBookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="py-2 px-4 border text-center">{booking.id}</td>
                    <td className="py-2 px-4 border text-center">{booking.listingTitle}</td>
                    <td className="py-2 px-4 border text-center">{new Date(booking.test_drive_date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border text-center">{booking.test_drive_time}</td>
                    <td className="py-2 px-4 border text-center">{booking.status}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default Inbox;