import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 py-4">
          Recommended Jobs For You
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          </div>
        ) : (
          <>
            {recommendedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedJobs.map((job) => (
                  <div 
                    key={job.jobPostId} 
                    className="transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <PostCard
                      key={job.jobPostId}
                      title={job.name}
                      location={job.location}
                      description={job.position}
                      salaryRange={`$${job.salary}`}
                      experience={`${job.experience} years`}
                      skills={extractSkills(job.requiredSkills)}
                      jobPostId={job.jobPostId}
                      deadline={new Date(job.deadline).toLocaleDateString()}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white bg-opacity-60 rounded-lg shadow-md p-12 text-center backdrop-filter backdrop-blur-sm">
                <div className="text-purple-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-center text-xl text-purple-700 font-medium">We don't have any job recommendations for you yet.</p>
                <p className="text-gray-600 mt-2">Update your profile and skills to get personalized recommendations.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;