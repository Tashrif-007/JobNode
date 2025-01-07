import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip"; // For displaying skills

const PostCard = ({ position, location, salary, experience, company, skills, onLearnMore }) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
            Job Position
          </Typography>
          <Typography variant="h5" component="div">
            {position}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            {location}
          </Typography>
          <Typography variant="body2">
            <strong>Salary:</strong> ${salary} <br />
            <strong>Experience:</strong> {experience} years <br />
            <strong>Company:</strong> {company}
          </Typography>

          {/* Display Skills as Chips */}
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>Required Skills:</Typography>
            <Box sx={{ marginTop: 1 }}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Chip key={index} label={skill} sx={{ marginRight: 1, marginBottom: 1 }} />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No skills listed</Typography>
              )}
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={onLearnMore}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default PostCard;
