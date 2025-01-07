import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming the AuthContext is set up
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify
import ApplicationCard from '../components/ApplicationCard'; // Import the reusable ApplicationCard

const Applications = () => {
  const { user } = useAuth(); // Get user data from AuthContext
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the applications for the logged-in user
  useEffect(() => {
    fetchApplications(user.userId);
  }, [user, navigate]);

  const fetchApplications = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3500/apply/getApplicationsById/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications);
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

  if (loading) {
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
          <ApplicationCard key={application.id} application={application} />
        ))
      )}
    </Box>
  );
};

export default Applications;
