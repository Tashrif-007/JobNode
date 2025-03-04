import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

const Posts = () => {
  const [posts, setPosts] = useState([]); // Stores the posts to display
  const [search, setSearch] = useState(""); // Search input value
  const [salary, setSalary] = useState(""); // Salary filter value
  const [location, setLocation] = useState(""); // Location filter value
  const [experience, setExperience] = useState(""); // Experience filter value
  const [skills, setSkills] = useState(""); // Skills filter value
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch posts based on filters
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      // Add search query to the parameters
      if (search) queryParams.append("search", search);
      if (salary) queryParams.append("salary", salary);
      if (location) queryParams.append("location", location);
      if (experience) queryParams.append("experience", experience);
      if (skills) queryParams.append("skills", skills);

      // Fetch posts from the backend
      const response = await fetch(`http://localhost:3500/post/searchFilteredPosts?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data); // Update the posts state with the search results
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all posts initially
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
    fetchAllPosts(); // Fetch all posts when the component mounts
  }, []);

  return (
    <div className="min-w-full min-h-screen rounded-lg bg-white shadow-lg p-8">
      <Navbar/>
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-title text-primary-950">Job Posts</h1>
        {user && user.userType === "Company" && (
          <button
            className="bg-primary text-white rounded-full px-6 py-2 shadow-md transition-all hover:bg-primary-600 hover:shadow-lg"
            onClick={() => navigate("/create-post")}
          >
            Create New Post
          </button>
        )}
      </header>

      {/* Filter Section */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for job title, skills, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
          onKeyDown={handleKeyDown}
        />

        {/* Salary Filter */}
        <input
          type="text"
          placeholder="Salary (e.g. 100-200)"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Experience Filter */}
        <input
          type="number"
          placeholder="Experience (years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Location Filter */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Skills Filter */}
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Search Button */}
        <button
            onClick={fetchPosts}
            className="capitalize bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]"
          >
            {loading ? "searching": "search"}
          </button>
      </div>

      {/* Job Posts Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold">
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
                fetchAllPosts(); // Fetch all posts if the user clears the filters
              }}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View All Jobs
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Posts;
