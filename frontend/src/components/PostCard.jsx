import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Modal, Box, Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PostCard = ({ title, location, description, salaryRange, experience, skills, jobPostId }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [cv, setCv] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkApplication = async () => {
      if (user?.userType === "JobSeeker") {
        try {
          const response = await fetch("http://localhost:3500/apply/exists", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobPostId: jobPostId,
              jobSeekerId: user.userId,
            }),
          });

          const data = await response.json();
          console.log({data})
          if (data.message === "exists") setAlreadyApplied(true);
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkApplication();
  }, [user, jobPostId]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cv) {
      toast.error("Please upload your CV.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cv);
    formData.append("name", user.name);
    formData.append("userId", user.userId);
    formData.append("status", "Pending");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3500/apply/applyToPost/${jobPostId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setAlreadyApplied(true);
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to apply.");
      }
    } catch (error) {
      toast.error("An error occurred while applying.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-6 rounded-md shadow-lg hover:scale-105 transition-transform duration-200">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{location}</p>
      <p>{description}</p>
      <p>Salary: {salaryRange}</p>
      <p>Experience: {experience}</p>
      <p>Skills: {skills}</p>

      {user?.userType === "JobSeeker" && (
        alreadyApplied ? (
          <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4">Already Applied</button>
        ) : (
          <button
            className="bg-primary text-white px-4 py-2 rounded-md mt-4 hover:bg-primary-600"
            onClick={() => setOpen(true)}
          >
            Apply Now
          </button>
        )
      )}

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Apply for {title}
          </Typography>
          <form onSubmit={handleApply}>
            <TextField
              type="file"
              fullWidth
              inputProps={{ accept: ".pdf,.doc,.docx" }}
              onChange={(e) => setCv(e.target.files[0])}
              required
              sx={{ marginBottom: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Applying..." : "Submit Application"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default PostCard;
