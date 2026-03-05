import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

function ChatList() {
  const navigate = useNavigate();
  
  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          💬 Messages
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Chat functionality will be added here.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          For now, you can contact farmers directly from product pages.
        </Typography>
      </Box>
    </Container>
  );
}

export default ChatList;
