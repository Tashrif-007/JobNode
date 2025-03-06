import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import { 
  RefreshCw,
} from 'lucide-react';

const Recommendations = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchPostById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3500/post/getPostById/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      return null;
    }
  };

  const fetchRecommendedPosts = async () => {
    if (!user || !user.userId) {
      console.error("User ID is null or undefined");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3500/rec/recommend/${user.userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const { recommendedJob } = await response.json();
      const postPromises = recommendedJob.map((id) => fetchPostById(id));
      const fetchedPosts = await Promise.all(postPromises);
      setPosts(fetchedPosts.filter((post) => post !== null));
    } catch (error) {
      console.error("Error fetching recommended posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchRecommendedPosts();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wide">Recommended Jobs</h1>
            <button
              onClick={fetchRecommendedPosts}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-6 pt-0">
          <h2 className="text-2xl font-semibold mb-4">
            {loading ? "Fetching recommendations..." : "Recommended Job Openings"}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
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
                  jobPostId={post.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p className="text-xl">No job recommendations available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
