import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

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
      const res = await fetch("http://localhost:3500/post/getAllPosts");
      const data = await res.json();
      setPosts(data);
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

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="min-w-full min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold text-primary">Job Posts</h1>
          {user && user.userType === "Company" && (
            <button
              className="bg-primary text-white rounded-full px-6 py-3 shadow-md transition-all hover:bg-primary-600"
              onClick={() => navigate("/create-post")}
            >
              Create New Post
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search for job title, skills, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-full"
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            placeholder="Salary (e.g. 100-200)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="number"
            placeholder="Experience (years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
          <button
            onClick={fetchPosts}
            className="bg-primary text-white rounded-lg py-3 px-6 shadow-md hover:bg-primary-600"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            {loading ? "Loading job openings..." : "Latest Job Openings"}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
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
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No job postings found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSalary("");
                  setExperience("");
                  setLocation("");
                  setSkills("");
                  fetchAllPosts();
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View All Jobs
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Posts;
