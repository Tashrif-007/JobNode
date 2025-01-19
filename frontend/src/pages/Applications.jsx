import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming the AuthContext is set up
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify
import ApplicationCard from '../components/ApplicationCard'; // Import the reusable ApplicationCard

const Applications = () => {
  const { user, isLoading: userLoading } = useAuth(); // Get user data and loading state from AuthContext
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);

  // Fetch the applications for the logged-in user when the user is loaded
  useEffect(() => {
    if (user && user.userId) {
      fetchApplications(user.userId, user.userType); // Pass userType to fetchApplications
    }
  }, [user]); // Dependency array should only depend on 'user'

  const fetchApplications = async (userId, userType) => {
    setLoading(true); // Set loading to true when fetching data
    let url = '';
    if (userType === 'JobSeeker') {
      url = `http://localhost:3500/apply/getApplicationsById/${userId}`;
    } else if (userType === 'Company') {
      url = `http://localhost:3500/apply/getApplicationsByCompany/${userId}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if(user.userType === 'JobSeeker') {
          setApplications(data.applications || []); // Ensure applications is always an array
        } else if(user.userType==='Company') {
          setApplications(data || []); // Ensure applications is always an array
        }
      } else {
        toast.error(data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('An error occurred while fetching your applications.');
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {  // Wait for both user data and applications to be fetched
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>
      {applications.length === 0 ? (
        <Typography>No applications found.</Typography>
      ) : (
        applications.map((application) => (
          <ApplicationCard key={application.applicationId} application={application} />
        ))
      )}
    </Box>
  );
};

export default Applications;
