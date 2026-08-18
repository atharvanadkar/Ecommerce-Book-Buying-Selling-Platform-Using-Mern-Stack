import React, { useState, useEffect } from 'react';
import { Box, useTheme, Container } from '@mui/material';

export const ProductBanner = ({ images }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const maxSteps = images?.length || 0;

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || maxSteps === 0) return;
        
        const interval = setInterval(() => {
            setActiveStep((prevActiveStep) => 
                prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [autoPlay, maxSteps]);

    // If no images, return nothing
    if (!images || images.length === 0) {
        return null;
    }

    const goToSlide = (index) => {
        setAutoPlay(false);
        setActiveStep(index);
        setTimeout(() => setAutoPlay(true), 5000);
    };

    return (
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
            <Box sx={{ 
                position: 'relative', 
                width: '100%', 
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                {/* Image Display with Smooth Transitions */}
                <Box sx={{ 
                    width: '100%', 
                    height: { xs: 180, sm: 250, md: 350, lg: 400 }, 
                    position: 'relative',
                    backgroundColor: '#f5f5f5'
                }}>
                    {images.map((image, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                opacity: activeStep === index ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                                cursor: 'default' // ← Removed pointer cursor
                            }}
                        >
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 2
                                }}
                                src={image}
                                alt={`Banner ${index + 1}`}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Navigation Dots */}
                {maxSteps > 1 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            zIndex: 10
                        }}
                    >
                        {images.map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => goToSlide(index)}
                                sx={{
                                    width: { xs: 8, sm: 10, md: 12 },
                                    height: { xs: 8, sm: 10, md: 12 },
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    backgroundColor: activeStep === index ? '#1976d2' : 'rgba(255,255,255,0.7)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.2)',
                                        backgroundColor: '#1976d2'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
};