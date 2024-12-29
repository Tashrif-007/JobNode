import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const PostCard = ({ position, location, salary, experience, company, onLearnMore }) => {
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
