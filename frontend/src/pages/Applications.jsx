import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming useAuth hook is imported

const JobApplications = () => {
  // Set up state variables for applications
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useAuth hook to get user info
  const { user } = useAuth(); // This will give the user object

  useEffect(() => {
    const fetchApplications = async () => {
      // Check if user is JobSeeker or Company and fetch data accordingly
      try {
        setLoading(true);
        setError(null); // Reset error before fetching

        let response;
        const userId = user?.userId;
        
        if (!userId) {
          throw new Error('User ID is not available');
        }

        if (user.userType === 'JobSeeker') {
          response = await fetch(`http://localhost:3500/apply/getApplicationsById/${userId}`);
          const data = await response.json();
          setApplications(data.applications||[]);
        } else if (user.userType === 'Company') {
          response = await fetch(`http://localhost:3500/apply/getApplicationsByCompany/${userId}`);
          const data = await response.json();
          setApplications(data||[]);
        } else {
          throw new Error('User type is not valid');
        }
      } catch (err) {
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchApplications();
    }
  }, [user]); // Fetch applications when user changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-10">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">My Applications</h1>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-500 shadow-sm rounded-lg hover:bg-blue-50">
              <i className="fas fa-sync-alt"></i>
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-500 shadow-sm rounded-lg hover:bg-blue-50">
              <i className="fas fa-sort"></i>
              <span>Sort</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            <button className="text-blue-500">All</button>
            <button className="text-gray-500">Pending</button>
            <button className="text-gray-500">Accepted</button>
            <button className="text-gray-500">Rejected</button>
          </div>

          <div className="flex items-center bg-white rounded-full p-2 shadow-sm w-80">
            <input type="text" className="flex-grow p-2 outline-none text-sm" placeholder="Search applications" />
            <div className="w-10 h-10 flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-50 rounded-full">
              <i className="fas fa-search"></i>
            </div>
            <div className="w-px h-7 bg-gray-300 mx-2"></div>
            <div className="w-10 h-10 flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-50 rounded-full">
              <i className="fas fa-filter"></i>
            </div>
          </div>
        </div>

        <hr className="border-t border-gray-300 mb-6" />

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render application cards */}
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.applicationId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white p-4">
                  <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                  <div className="text-sm">{app.jobPost.name}</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{app.jobPost.location}</span>
                    <span
                      className={`px-3 py-1 text-white rounded-full text-xs ${
                        app.status === 'Pending'
                          ? 'bg-blue-500'
                          : app.status === 'Accepted'
                          ? 'bg-green-500'
                          : app.status === 'Interview'
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Salary:</strong> {app.jobPost.salary}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Experience Required:</strong> {app.jobPost.experience}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div>No applications found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
