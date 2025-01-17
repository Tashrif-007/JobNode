import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the path if needed
import { toast } from "react-toastify";
import { Box, Button, Typography, TextField } from "@mui/material";

const ApplyPage = () => {
  const { user } = useAuth(); // Get user data from AuthContext
  const navigate = useNavigate();
  const location = useLocation(); // Access the location object to get passed state
  const { post } = location.state || {}; // Get post details from location.state

  const [cv, setCv] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cv) {
      toast.error("Please upload your CV.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cv);
    formData.append("userId", user.userId); // Use user ID from context
    formData.append("status", "Pending");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to apply.");
        return;
      }

      const response = await fetch(
        `http://localhost:3500/apply/applyToPost/${post.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header with Bearer token
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        navigate("/applications"); // Redirect to applications page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error(error.message || "An error occurred while submitting the application.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {post ? (
        <>
          <Typography variant="h4" gutterBottom>
            Apply for {post.position} position at {post.name}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: "20px" }}>
              <Typography variant="body1" gutterBottom>
                Upload your CV
              </Typography>
              <TextField
                type="file"
                fullWidth
                inputProps={{ accept: ".pdf,.doc,.docx" }}
                onChange={(e) => setCv(e.target.files[0])}
                required
                sx={{
                  marginTop: "10px",
                  "& input": { padding: "8px 10px" },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "10px 0", fontWeight: "bold", fontSize: "16px" }}
            >
              Submit Application
            </Button>
          </form>
        </>
      ) : (
        <Typography variant="h6" color="error">
          Job details not found.
        </Typography>
      )}
    </Box>
  );
};

export default ApplyPage;
