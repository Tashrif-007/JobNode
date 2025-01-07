import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PostCard from "../components/PostCard";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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
      state: { post }, // Passing the entire post details to ApplyPage via state
    });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Posts
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/create-post")}
        sx={{ marginBottom: 3 }}
      >
        Create New Post
      </Button>
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))" }}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            position={post.position}
            location={post.location}
            salary={post.salary}
            experience={post.experience}
            company={post.name}
            skills={post.requiredSkills.map((reqSkill) => reqSkill.skill.name)} // Mapping skills
            onApply={() => handleApply(post)} // Pass post object to ApplyPage
          />
        ))}
      </Box>
    </Box>
  );
};

export default Posts;
