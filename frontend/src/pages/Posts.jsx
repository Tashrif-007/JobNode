import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3500/post/getAllPosts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleApply = (post) => {
    navigate(`/posts/apply/${post.id}`, {
      state: { post }, 
    });
  };

  return (
    <div className="min-w-full min-h-screen rounded-lg bg-white shadow-lg p-8">
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
      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Latest Job Openings</h2>
        <div className="grid grid-cols-3 gap-8 mt-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.position}
              location={post.location}
              description={post.description || "No description available."}
              salaryRange={`$${post.salary}`}
              experience={`${post.experience} years`}
              skills={
                post.requiredSkills.length > 0
                  ? post.requiredSkills.map((reqSkill) => reqSkill.skill.name).join(", ")
                  : "No skills listed"
              }
              onApply={() => handleApply(post)} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Posts;
