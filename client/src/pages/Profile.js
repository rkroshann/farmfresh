import React from 'react';
import { Container, Typography, Box, Button, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import useStore from '../store/useStore';

function Profile() {
  const navigate = useNavigate();
  const { user } = useStore();
  
  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Avatar
          src={user?.profile?.avatar}
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          {user?.profile?.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {user?.email}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Role: <strong>{user?.role}</strong>
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography color="text.secondary">
            Profile editing feature coming soon!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
