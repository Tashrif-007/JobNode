import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify'; 
import ApplicationCard from '../components/ApplicationCard'; 

const Applications = () => {
  const { user, isLoading: userLoading } = useAuth(); 
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.userId) {
      fetchApplications(user.userId, user.userType); 
    }
  }, [user]); 

  const fetchApplications = async (userId, userType) => {
    setLoading(true); 
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
          setApplications(data.applications || []); 
        } else if(user.userType==='Company') {
          setApplications(data || []); 
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

  if (userLoading || loading) {  
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
