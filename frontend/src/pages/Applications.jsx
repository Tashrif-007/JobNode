import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ApplicationCard from "../components/ApplicationCard";
import useGetUser from "../hooks/useGetUser";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = user?.userId;

        if (!userId) throw new Error("User ID is not available");

        let response;
        if (user.userType === "JobSeeker") {
          response = await fetch(`http://localhost:3500/apply/getApplicationsById/${userId}`);
        } else if (user.userType === "Company") {
          response = await fetch(`http://localhost:3500/apply/getApplicationsByCompany/${userId}`);
        } else {
          throw new Error("User type is not valid");
        }

        const data = await response.json();
        const apps = data.applications || data || [];
        setApplications(apps);
        setFilteredApplications(apps);
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

  // Fetch user details for each application
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDataMap = {};
      for (const app of applications) {
        if (!app.userId) continue;

        // Use the custom hook to fetch user data
        const { data } = useGetUser(app.userId);
        if (data) {
          userDataMap[app.userId] = data.name; // Store user name as job title
        }
      }
      setUserDetails(userDataMap);
    };

    if (applications.length > 0) {
      fetchUserDetails();
    }
  }, [applications]);

  // Handle Search and Filter Logic
  useEffect(() => {
    let filtered = applications.map((app) => ({
      ...app,
      jobTitle: userDetails[app.userId] || "Unknown", // Use fetched user name as job title
    }));

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.jobPost.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    setFilteredApplications(filtered);
  }, [searchQuery, filterStatus, applications, userDetails]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-10">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">My Applications</h1>
          <button
            onClick={() => setSearchQuery("")}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-500 shadow-sm rounded-lg hover:bg-blue-50"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            {["All", "Pending", "Accepted", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-${filterStatus === status ? "blue" : "gray"}-500 font-semibold`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white rounded-full p-2 shadow-sm w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-2 outline-none text-sm"
              placeholder="Search applications by title or company"
            />
            <i className="fas fa-search text-blue-500 px-3"></i>
          </div>
        </div>

        <hr className="border-t border-gray-300 mb-6" />

        {/* Applications List */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app, idx) => (
              <ApplicationCard app={app} key={idx} title={userDetails[app.userId] || "Unknown"} />
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
