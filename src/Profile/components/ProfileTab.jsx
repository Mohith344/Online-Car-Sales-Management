// frontend/src/components/ProfileTab.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Define colors for the pie chart
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

function ProfileTab() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    listingCount: 0,
    orderCount: 0,
    bookingCount: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract user information from Clerk
  const firstName = user?.firstName || 'First';
  const lastName = user?.lastName || 'Last';
  const email = user?.primaryEmailAddress?.emailAddress || 'email@example.com';
  const avatarUrl = user?.profileImageUrl;

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/profile/stats/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Failed to fetch profile statistics.');
        const data = await res.json();

        // Ensure totalEarnings is a number
        const totalEarnings = typeof data.totalEarnings === 'number' ? data.totalEarnings : parseFloat(data.totalEarnings) || 0;

        setStats({
          listingCount: data.listingCount,
          orderCount: data.orderCount,
          bookingCount: data.bookingCount,
          totalEarnings: totalEarnings,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || 'An error occurred while fetching profile stats.');
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchStats();
  }, [email]);

  // Data for Pie Chart
  const pieData = [
    { name: 'Listings', value: stats.listingCount },
    { name: 'Orders', value: stats.orderCount },
    { name: 'Bookings', value: stats.bookingCount },
  ];

  // Data for Bar Chart
  const barData = [
    { name: 'Listings', Earnings: stats.listingCount },
    { name: 'Orders', Earnings: stats.orderCount },
    { name: 'Bookings', Earnings: stats.bookingCount },
    { name: 'Total', Earnings: stats.totalEarnings },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* User Information */}
      <div className="flex items-center mb-8">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-20 h-20 rounded-full mr-4"
          />
        )}
        <div>
          <h2 className="text-2xl font-semibold">{`${firstName} ${lastName}`}</h2>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl mb-4">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl mb-4">Earnings Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Earnings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl mb-4">Profile Details</h3>
        <ul>
          <li><strong>Number of Listings:</strong> {stats.listingCount}</li>
          <li><strong>Number of Orders:</strong> {stats.orderCount}</li>
          <li><strong>Number of Test Drive Bookings:</strong> {stats.bookingCount}</li>
          <li><strong>Estimated Total Earnings:</strong> ${stats.totalEarnings.toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileTab;