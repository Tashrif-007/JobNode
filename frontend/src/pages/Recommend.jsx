import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

const RecommendedPosts = ({ jobSeekerId }) => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user.userId);
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3500/rec/recommend/${jobSeekerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const jobIds = data.recommendedjobs.top_jobs;
        const jobDetailsPromises = jobIds.map(async (id) => {
          const jobResponse = await fetch(`http://localhost:3500/post/getPostById/${id}`);
          return jobResponse.ok ? jobResponse.json() : null;
        });
        const jobs = await Promise.all(jobDetailsPromises);
        setRecommendedJobs(jobs.filter((job) => job !== null));
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobSeekerId) {
      fetchRecommendedJobs();
    }
  }, [jobSeekerId]);

  return (
    <div className="min-w-full min-h-screen rounded-lg bg-white shadow-lg p-8">
      <Navbar />
      <h1 className="text-4xl font-title text-primary-950">Recommended Jobs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : recommendedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {recommendedJobs.map((post) => (
            <PostCard
              key={post.id}
              title={post.name}
              location={post.location}
              description={post.description || "No description available."}
              salaryRange={`${post.salary}`}
              experience={`${post.experience} years`}
              skills={
                post.requiredSkills.length > 0
                  ? post.requiredSkills.map((reqSkill) => reqSkill.skill.name).join(", ")
                  : "No skills listed"
              }
              onApply={() => navigate(`/posts/apply/${post.id}`, { state: { post } })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No recommended jobs available.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendedPosts;
