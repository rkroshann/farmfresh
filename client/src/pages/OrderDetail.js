import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

function OrderDetail() {
  const navigate = useNavigate();
  
  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          📋 Order Details
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Detailed order information and tracking will be shown here.
        </Typography>
      </Box>
    </Container>
  );
}

export default OrderDetail;
