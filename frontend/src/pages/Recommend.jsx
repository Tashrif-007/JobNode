import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { RefreshCw } from "lucide-react";

const RecommendationPage = () => {
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userType === "JobSeeker") {
      fetchRecommendedJobs();
    }
  }, [user]);

  const fetchRecommendedJobs = async () => {
    try {
      const response = await fetch(`http://localhost:3500/rec/recommend/${user.userId}`);
      const data = await response.json();
      if (response.ok) {
        // Assuming the response is an array of job posts
        setRecommendedJobs(data);
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

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
              </div>
            ) : (
              <>
                {recommendedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedJobs.map((job) => (
                      <div 
                        key={job.jobPostId} 
                        className="bg-purple-100 rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-purple-200"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="bg-purple-200 p-3 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h2 className="text-xl font-bold text-purple-800">{job.name}</h2>
                              <span className="bg-purple-300 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                ${job.salary}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 mt-1">{job.position}</p>
                            
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Exp: {job.experience} years
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 font-medium">Skills:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {job.requiredSkills.map(skillObj => (
                                  <span key={skillObj.skill.id} className="bg-purple-200 text-purple-700 px-2 py-1 rounded text-xs">
                                    {skillObj.skill.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                              
                              <button 
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                onClick={() => window.location.href = `/job-posts/${job.jobPostId}`}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-purple-100 rounded-lg p-8 text-center">
                    <div className="text-purple-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg text-purple-700 font-medium">No recommended jobs found.</p>
                    <p className="text-gray-600 mt-2">Update your profile and skills to get personalized recommendations.</p>
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