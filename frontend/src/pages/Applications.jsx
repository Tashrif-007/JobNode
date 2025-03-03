import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ApplicationCard from "../components/ApplicationCard";
import useGetUser from "../hooks/useGetUser";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
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

  useEffect(() => {
    const filterApplications = () => {
      let filtered = applications;

      // Filter by Status
      if (filterStatus !== "All") {
        filtered = filtered.filter((app) => app.status === filterStatus);
      }

      // Search by userName
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter((app) =>
          app.userName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredApplications(filtered);
    };

    filterApplications();
  }, [filterStatus, searchQuery, applications]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-10">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">My Applications</h1>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("All");
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-500 shadow-sm rounded-lg hover:bg-blue-50"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            {["All", "Pending", "Accepted", "Rejected", "Interview"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-${filterStatus === status ? "blue-500 underline" : "gray-500"} font-semibold`}
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
              placeholder="Search applications by user name"
            />
            <i className="fas fa-search text-blue-500 px-3"></i>
          </div>
        </div>

        <hr className="border-t border-gray-300 mb-6" />

        {/* Applications List */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app, idx) => <ApplicationCard app={app} newStatuss={app.status} key={idx} />)
          ) : (
            <div>No applications found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
