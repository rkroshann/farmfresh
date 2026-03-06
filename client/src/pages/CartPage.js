import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardMedia, IconButton,
    Button, AppBar, Toolbar, Divider, Paper, Chip
} from '@mui/material';
import {
    ArrowBack, Add, Remove, Delete, ShoppingCartCheckout,
    RemoveShoppingCart
} from '@mui/icons-material';
import { getCart, updateQuantity, removeFromCart, clearCart, getCartTotal } from '../utils/cartManager';
import toast from 'react-hot-toast';

function CartPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setCart(getCart());
    }, []);

    const handleUpdateQuantity = (productId, newQty) => {
        const updated = updateQuantity(productId, newQty);
        setCart(updated);
    };

    const handleRemove = (productId, productName) => {
        const updated = removeFromCart(productId);
        setCart(updated);
        toast.success(`${productName} removed from cart`);
    };

    const handleClearCart = () => {
        clearCart();
        setCart([]);
        toast.success('Cart cleared');
    };

    const totalPrice = getCartTotal();

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* App Bar */}
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate('/marketplace')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        🛒 My Cart
                    </Typography>
                    {cart.length > 0 && (
                        <Button
                            color="inherit"
                            startIcon={<RemoveShoppingCart />}
                            onClick={handleClearCart}
                            sx={{ textTransform: 'none' }}
                        >
                            Clear Cart
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                {cart.length === 0 ? (
                    /* Empty Cart State */
                    <Paper
                        elevation={0}
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            px: 4,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #ffffff 0%, #f0f7f0 100%)',
                            border: '2px dashed #c8e6c9'
                        }}
                    >
                        <RemoveShoppingCart sx={{ fontSize: 80, color: '#c8e6c9', mb: 2 }} />
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                            Your cart is empty
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Explore our marketplace and add fresh farm products to your cart!
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/marketplace')}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #388e3c, #2e7d32)',
                                }
                            }}
                        >
                            Browse Marketplace
                        </Button>
                    </Paper>
                ) : (
                    <>
                        {/* Cart Items */}
                        {cart.map((item, index) => (
                            <Card
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    mb: 2,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {/* Product Image */}
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        objectFit: 'cover',
                                        flexShrink: 0
                                    }}
                                    image={item.image}
                                    alt={item.name}
                                />

                                {/* Product Info */}
                                <Box sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    px: 3,
                                    py: 2,
                                    minWidth: 0
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        ₹{item.price} / {item.unit}
                                    </Typography>

                                    {/* Quantity Controls */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            sx={{
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 2,
                                                width: 32,
                                                height: 32,
                                                '&:hover': { bgcolor: '#fce4ec', borderColor: '#ef5350' }
                                            }}
                                        >
                                            <Remove fontSize="small" />
                                        </IconButton>
                                        <Chip
                                            label={item.quantity}
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                minWidth: 48,
                                                bgcolor: '#e8f5e9',
                                                color: '#2e7d32'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            sx={{
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 2,
                                                width: 32,
                                                height: 32,
                                                '&:hover': { bgcolor: '#e8f5e9', borderColor: '#4caf50' }
                                            }}
                                        >
                                            <Add fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Price & Remove */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    px: 3,
                                    py: 2,
                                    minWidth: 120
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#4caf50',
                                            mb: 1
                                        }}
                                    >
                                        ₹{item.price * item.quantity}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemove(item.id, item.name)}
                                        sx={{
                                            color: '#ef5350',
                                            '&:hover': { bgcolor: '#fce4ec' }
                                        }}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Card>
                        ))}

                        {/* Order Summary */}
                        <Divider sx={{ my: 3 }} />
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #ffffff 0%, #f0f7f0 100%)',
                                border: '1px solid #c8e6c9'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Order Summary
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Subtotal
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    ₹{totalPrice}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Delivery Fee
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    ₹30
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Total Amount
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                                    ₹{totalPrice + 30}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<ShoppingCartCheckout />}
                                sx={{
                                    mt: 3,
                                    borderRadius: 3,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #388e3c, #2e7d32)',
                                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)',
                                    }
                                }}
                                onClick={() => toast.success('Order placed successfully! OUR farm team will contact you soon. 🌾')}
                            >
                                Place Order — ₹{totalPrice + 30}
                            </Button>
                        </Paper>
                    </>
                )}
            </Container>
        </Box>
    );
}

export default CartPage;
