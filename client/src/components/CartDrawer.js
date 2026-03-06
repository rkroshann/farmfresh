import React, { useState, useEffect } from 'react';
import {
    Drawer, Box, Typography, IconButton, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, Button, Divider,
    ButtonGroup, Chip
} from '@mui/material';
import { Close, Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { getCart, updateQuantity, removeFromCart, getCartTotal } from '../utils/cartManager';
import CheckoutModal from './CheckoutModal';

const DELIVERY_FEE = 30;

function CartDrawer({ open, onClose }) {
    const [cart, setCart] = useState([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setCart(getCart());
        }
    }, [open]);

    const handleUpdate = (id, qty) => {
        const updated = updateQuantity(id, qty);
        setCart(updated);
    };

    const handleRemove = (id) => {
        const updated = removeFromCart(id);
        setCart(updated);
    };

    const subtotal = getCartTotal();
    const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

    const handleOrderPlaced = () => {
        setIsCheckoutOpen(false);
        onClose();
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: { xs: '100vw', sm: 400 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShoppingBag color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">My Cart</Typography>
                        <Chip
                            label={`${cart.reduce((sum, item) => sum + item.quantity, 0)} Items`}
                            size="small"
                            sx={{ ml: 2, bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
                        />
                    </Box>
                    <IconButton onClick={onClose}><Close /></IconButton>
                </Box>

                {/* Cart Items */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                    {cart.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 10, px: 2 }}>
                            <Typography color="text.secondary">Your basket is empty</Typography>
                            <Button onClick={onClose} sx={{ mt: 2 }}>Start Shopping</Button>
                        </Box>
                    ) : (
                        <List>
                            {cart.map((item) => (
                                <ListItem
                                    key={item.id}
                                    sx={{ mb: 1, borderBottom: '1px solid #f9f9f9' }}
                                    secondaryAction={
                                        <Typography variant="subtitle2" fontWeight="bold">₹{item.price * item.quantity}</Typography>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar variant="rounded" src={item.image} sx={{ width: 60, height: 60, mr: 2 }} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>}
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" display="block" color="text.secondary">₹{item.price} / {item.unit}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <ButtonGroup size="small" variant="outlined" color="primary">
                                                        <Button onClick={() => handleUpdate(item.id, item.quantity - 1)}><Remove fontSize="small" /></Button>
                                                        <Button disabled sx={{ color: 'text.primary !important', px: 2, fontWeight: 'bold' }}>{item.quantity}</Button>
                                                        <Button onClick={() => handleUpdate(item.id, item.quantity + 1)}><Add fontSize="small" /></Button>
                                                    </ButtonGroup>
                                                    <IconButton size="small" sx={{ ml: 1, color: '#ff5252' }} onClick={() => handleRemove(item.id)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                {/* Footer */}
                {cart.length > 0 && (
                    <Box sx={{ p: 3, borderTop: '1px solid #eee', bgcolor: '#fff' }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                            <Typography variant="body2">₹{subtotal}</Typography>
                        </Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Delivery Fee</Typography>
                            <Typography variant="body2">₹{DELIVERY_FEE}</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">₹{total}</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={() => setIsCheckoutOpen(true)}
                            sx={{
                                py: 2,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                            }}
                        >
                            Checkout — ₹{total}
                        </Button>
                    </Box>
                )}
            </Box>

            <CheckoutModal
                open={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                total={total}
                onOrderPlaced={handleOrderPlaced}
            />
        </Drawer>
    );
}

export default CartDrawer;
