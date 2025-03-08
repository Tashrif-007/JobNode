import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import { 
  Search, 
  RefreshCw,
  MapPin,
  DollarSign,
  Clock,
  Code
} from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (search) queryParams.append("search", search);
      if (salary) queryParams.append("salary", salary);
      if (location) queryParams.append("location", location);
      if (experience) queryParams.append("experience", experience);
      if (skills) queryParams.append("skills", skills);

      const response = await fetch(`http://localhost:3500/post/searchFilteredPosts?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      if(user?.userType==='JobSeeker') {
        const res = await fetch("http://localhost:3500/post/getAllPosts");
        const data = await res.json();
        setPosts(data)
      }
      else {
        const res = await fetch(`http://localhost:3500/post/getPostById/${userId}`);
        const data = await res.json();
        setPosts(data)
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchPosts();
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSalary("");
    setExperience("");
    setLocation("");
    setSkills("");
    fetchAllPosts();
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);
  console.log(posts)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wide">Job Posts</h1>
            {user && user.userType === "Company" && (
              <button
                className="bg-white text-purple-600 rounded-full px-6 py-3 shadow-md transition-all hover:bg-gray-100"
                onClick={() => navigate("/create-post")}
              >
                Create New Post
              </button>
            )}
            <button
              onClick={resetFilters}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Search Filters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for job title, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Salary (e.g. 100-200)"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                placeholder="Experience (years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Code className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button
              onClick={fetchPosts}
              className="bg-indigo-500 text-white rounded-full py-2 px-6 shadow-md hover:bg-indigo-600 transition-all duration-300"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Latest Job Openings */}
        <div className="p-6 pt-0">
          <h2 className="text-2xl font-semibold mb-4">
            {loading ? "Loading job openings..." : "Latest Job Openings"}
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
                  companyName={post.user.name}
                  salaryRange={`${post.salary}`}
                  experience={`${post.experience} years`}
                  skills={
                    post.requiredSkills.length > 0
                      ? post.requiredSkills.map((reqSkill) => reqSkill.skill.name).join(", ")
                      : "No skills listed"
                    
                  }
                  deadline={post.deadline}
                  jobPostId={post.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p className="text-xl">No job postings found matching your criteria.</p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-all duration-300"
              >
                View All Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;