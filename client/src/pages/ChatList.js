import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

function ChatList() {
  const navigate = useNavigate();
  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4">Messages</Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          This page is under development
        </Typography>
      </Box>
    </Container>
  );
}

export default ChatList;
