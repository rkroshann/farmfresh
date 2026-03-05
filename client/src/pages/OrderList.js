import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

function OrderList() {
  const navigate = useNavigate();
  
  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          📦 My Orders
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Order history and tracking will appear here.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Orders can be placed from product detail pages.
        </Typography>
      </Box>
    </Container>
  );
}

export default OrderList;
