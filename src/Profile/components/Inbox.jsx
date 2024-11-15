// frontend/src/components/Inbox.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Separator } from "@/components/ui/separator";


function Inbox() {
  const { user } = useUser();
  const [outgoingOrders, setOutgoingOrders] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [outgoingBookings, setOutgoingBookings] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
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
        // Fetch outgoing orders
        const ordersRes = await fetch(`http://localhost:5000/api/orders?buyer_email=${encodeURIComponent(userEmail)}`);
        if (!ordersRes.ok) {
          throw new Error('Failed to fetch your orders.');
        }
        const ordersData = await ordersRes.json();
        setOutgoingOrders(ordersData);

        // Fetch incoming orders
        const incomingOrdersRes = await fetch(`http://localhost:5000/api/orders/incoming?owner_email=${encodeURIComponent(userEmail)}`);
        if (!incomingOrdersRes.ok) {
          throw new Error('Failed to fetch incoming orders.');
        }
        const incomingOrdersData = await incomingOrdersRes.json();
        setIncomingOrders(incomingOrdersData);

        // Fetch outgoing test drive bookings
        const bookingsRes = await fetch(`http://localhost:5000/api/test_drive_bookings?user_email=${encodeURIComponent(userEmail)}`);
        if (!bookingsRes.ok) {
          throw new Error('Failed to fetch your test drive bookings.');
        }
        const bookingsData = await bookingsRes.json();
        setOutgoingBookings(bookingsData);

        // Fetch incoming test drive bookings
        const incomingBookingsRes = await fetch(`http://localhost:5000/api/test_drive_bookings/incoming?owner_email=${encodeURIComponent(userEmail)}`);
        if (!incomingBookingsRes.ok) {
          throw new Error('Failed to fetch incoming test drive bookings.');
        }
        const incomingBookingsData = await incomingBookingsRes.json();
        setIncomingBookings(incomingBookingsData);
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

      // Update outgoingOrders state by removing the cancelled order
      setOutgoingOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      alert(result.message);
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while cancelling the order.');
    }
  };

  const handleAcceptOrder = async (orderId) => {
    const confirmAccept = window.confirm('Do you want to accept this order?');
    if (!confirmAccept) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/accept`, {
        method: 'POST',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to accept order.');
      }

      // Update incomingOrders state by updating the order's status
      setIncomingOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'accepted' } : order
        )
      );
      alert(result.message);
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while accepting the order.');
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

      // Update outgoingBookings state by removing the cancelled booking
      setOutgoingBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      alert(result.message);
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while cancelling the test drive booking.');
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    const confirmAccept = window.confirm('Do you want to accept this test drive booking?');
    if (!confirmAccept) return;

    try {
      const res = await fetch(`http://localhost:5000/api/test_drive_bookings/${bookingId}/accept`, {
        method: 'POST',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to accept test drive booking.');
      }

      // Update incomingBookings state by updating the booking's status
      setIncomingBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: 'accepted' } : booking
        )
      );
      alert(result.message);
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while accepting the test drive booking.');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="container mx-auto p-4 animate-bounce">
          <p>Loading your inbox...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="container mx-auto p-4">
          <p className="text-red-500 animate-pulse">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="font-bold text-4xl">Inbox</h1>
          <Separator />
        {/* Outgoing Orders */}
        <section className="mb-8">
          <h2 className="font-bold  mt-3 text-3xl">Your Orders</h2>
          {outgoingOrders.length === 0 ? (
            <p>You have no orders.</p>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Car Model</th>
                  <th className="py-2 px-4 border">Booking Date</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {outgoingOrders.map(order => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border text-center">{order.id}</td>
                    <td className="py-2 px-4 border text-center">{order.listingTitle}</td>
                    <td className="py-2 px-4 border text-center">{new Date(order.booking_date).toLocaleDateString()}</td>
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
        <Separator />
        {/* Incoming Orders */}
        <section className="mb-8">
          <h2 className="font-bold mt-3 text-3xl">Incoming Orders</h2>
          {incomingOrders.length === 0 ? (
            <p>No incoming orders.</p>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Buyer Email</th>
                  <th className="py-2 px-4 border">Car Model</th>
                  <th className="py-2 px-4 border">Booking Date</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomingOrders.map(order => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border text-center">{order.id}</td>
                    <td className="py-2 px-4 border text-center">{order.buyer_email}</td>
                    <td className="py-2 px-4 border text-center">{order.listingTitle}</td>
                    <td className="py-2 px-4 border text-center">{new Date(order.booking_date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border text-center">{order.status}</td>
                    <td className="py-2 px-4 border text-center">
                      {order.status !== 'accepted' && (
                        <>
                          <button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <span className="text-green-600 font-semibold">Accepted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <Separator />
        {/* Outgoing Test Drive Bookings */}
        <section className="mb-8">
          <h2 className="font-bold mt-3 text-3xl">Your Test Drive Bookings</h2>
          {outgoingBookings.length === 0 ? (
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
                {outgoingBookings.map(booking => (
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
        <Separator />
        {/* Incoming Test Drive Bookings */}
        <section>
          <h2 className="font-bold  mt-3text-3xl">Incoming Test Drive Bookings</h2>
          {incomingBookings.length === 0 ? (
            <p>No incoming test drive bookings.</p>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Booking ID</th>
                  <th className="py-2 px-4 border">User Email</th>
                  <th className="py-2 px-4 border">Car Model</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomingBookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="py-2 px-4 border text-center">{booking.id}</td>
                    <td className="py-2 px-4 border text-center">{booking.user_email}</td>
                    <td className="py-2 px-4 border text-center">{booking.listingTitle}</td>
                    <td className="py-2 px-4 border text-center">{new Date(booking.test_drive_date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border text-center">{booking.test_drive_time}</td>
                    <td className="py-2 px-4 border text-center">{booking.status}</td>
                    <td className="py-2 px-4 border text-center">
                      {booking.status !== 'accepted' && (
                        <>
                          <button
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'accepted' && (
                        <span className="text-green-600 font-semibold">Accepted</span>
                      )}
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