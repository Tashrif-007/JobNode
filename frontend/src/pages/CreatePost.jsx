import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    position: "",
    salary: "",
    experience: "",
    location: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3500/post/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Post created successfully!");
        navigate("/posts");
      } else {
        alert("Error creating post!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Create a New Job Post
      </Typography>
      <form onSubmit={handleSubmit}>
      <TextField
          label="Company Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Position"
          name="position"
          fullWidth
          margin="normal"
          value={formData.position}
          onChange={handleChange}
          required
        />
        <TextField
          label="Salary"
          name="salary"
          fullWidth
          margin="normal"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          required
        />
        <TextField
          label="Experience (years)"
          name="experience"
          fullWidth
          margin="normal"
          type="number"
          value={formData.experience}
          onChange={handleChange}
          required
        />
        <TextField
          label="Location"
          name="location"
          fullWidth
          margin="normal"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ marginTop: 3 }}
        >
          Create Post
        </Button>
      </form>
    </Box>
  );
};

export default CreatePost;
