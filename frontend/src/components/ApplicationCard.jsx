import { Typography, Button, Card, CardContent, CardActions } from '@mui/material';

const ApplicationCard = ({ application }) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {application.jobPost.position}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Company:</strong> {application.jobPost.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Location:</strong> {application.jobPost.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Status:</strong> {application.status || 'Pending'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          sx={{ marginTop: 1 }}
          onClick={() => window.open(`http://localhost:3500${application.cvPath}`, '_blank')}
        >
          View CV
        </Button>
      </CardActions>
    </Card>
  );
};

export default ApplicationCard;
