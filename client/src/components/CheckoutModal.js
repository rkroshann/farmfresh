import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, Box, Grid,
    Stepper, Step, StepLabel, Divider
} from '@mui/material';
import { LocalShipping, Payment, CheckCircle } from '@mui/icons-material';
import toast from 'react-hot-toast';

const steps = ['Address', 'Payment', 'Confirm'];

function CheckoutModal({ open, onClose, total, onOrderPlaced }) {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!formData.name || !formData.phone || !formData.address) {
                toast.error('Please fill in all required fields');
                return;
            }
        }
        if (activeStep === 1) {
            setActiveStep(activeStep + 1);
            setTimeout(() => {
                onOrderPlaced();
                toast.success('Order placed successfully! 🌾');
            }, 1500);
            return;
        }
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 1 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                {activeStep === 0 && (
                    <Box sx={{ pt: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Delivery Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Delivery Address"
                                    name="address"
                                    multiline
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="ZIP Code"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                        <Payment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Payment Method
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            For this simulation, we only support <strong>Cash on Delivery</strong>.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 4 }}>
                            <Typography variant="h6">Total Payable:</Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                ₹{total}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Processing Order...
                        </Typography>
                        <Typography color="text.secondary">
                            Our farm team will contact you shortly to confirm the delivery!
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                {activeStep < 2 && (
                    <>
                        <Button onClick={onClose} color="inherit">
                            Cancel
                        </Button>
                        {activeStep > 0 && (
                            <Button onClick={handleBack} color="inherit">
                                Back
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            startIcon={activeStep === 1 ? <LocalShipping /> : null}
                            sx={{
                                background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                                px: 4
                            }}
                        >
                            {activeStep === 1 ? 'Place Order' : 'Next'}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default CheckoutModal;
