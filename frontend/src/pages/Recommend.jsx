import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { RefreshCw, Search } from "lucide-react";

const RecommendationPage = () => {
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(recommendedJobs, filteredJobs)
  useEffect(() => {
    if (user?.userType === "JobSeeker") {
      fetchRecommendedJobs();
    }
  }, [user]);

  useEffect(() => {
    // Filter jobs by company name whenever the search term changes
    if (searchTerm.trim() === "") {
      setFilteredJobs(recommendedJobs);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = recommendedJobs.filter(
        job => job.user.name?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, recommendedJobs]);

  const fetchRecommendedJobs = async () => {
    try {
      const response = await fetch(`http://localhost:3500/rec/recommend/${user.userId}`);
      const data = await response.json();
      if (response.ok) {
        // Assuming the response is an array of job posts
        setRecommendedJobs(data);
        setFilteredJobs(data);
      } else {
        toast.error(data.message || "Failed to fetch recommended jobs");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching recommended jobs");
    } finally {
      setLoading(false);
    }
  };

  // Function to extract skill names and join them as a comma-separated string
  const extractSkills = (requiredSkills) => {
    return requiredSkills.map(skill => skill.skill.name).join(', ');
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Recommended Jobs</h1>
            <button 
              onClick={fetchRecommendedJobs} 
              className="text-white p-2 rounded-full hover:bg-purple-400 transition-all"
              title="Refresh recommendations"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
              </div>
            ) : (
              <>
                {filteredJobs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <PostCard 
                        key={job.jobPostId}
                        jobPostId={job.jobPostId}
                        title={job.name}
                        companyName={job.user.name}
                        position={job.position}
                        location={job.location}
                        salaryRange={job.salary}
                        experience={`${job.experience} years`}
                        skills={extractSkills(job.requiredSkills)}
                        deadline={job.deadline}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-purple-100 rounded-lg p-8 text-center">
                    <div className="text-purple-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {searchTerm ? (
                      <>
                        <p className="text-lg text-purple-700 font-medium">No companies match your search.</p>
                        <p className="text-gray-600 mt-2">Try a different company name or clear your search.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg text-purple-700 font-medium">No recommended jobs found.</p>
                        <p className="text-gray-600 mt-2">Update your profile and skills to get personalized recommendations.</p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;