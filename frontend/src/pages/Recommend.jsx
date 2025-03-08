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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Recommended Job Posts</h1>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => (
              <PostCard
                key={job.jobPostId}
                title={job.name}               // job name as title
                location={job.location}         // job location
                description={job.position}      // job position as description
                salaryRange={`$${job.salary}`}   // job salary range
                experience={`${job.experience} years`}  // job experience required
                skills={extractSkills(job.requiredSkills)}  // Comma-separated skill names
                jobPostId={job.jobPostId}       // jobPostId
                deadline={new Date(job.deadline).toLocaleDateString()} // formatted deadline
              />
            ))
          ) : (
            <p className="text-center text-lg text-gray-600">No recommended jobs found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
