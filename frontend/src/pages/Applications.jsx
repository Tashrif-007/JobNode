import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../components/ApplicationCard'
const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth(); 
  const handleChat = async (receiverId) => {
    try {
      const senderId = user.userId;
      console.log(applications)
      console.log(senderId, receiverId);
      const res = await fetch("http://localhost:3500/conversation/createConversation", {
        method: "POST",
        body: JSON.stringify({senderId, receiverId})
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
    navigate('/chats');
  }
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchApplications();
    }
  }, [user]); 

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
            applications.map((app,idx) => (
              <ApplicationCard app={app} key={idx}/>
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
