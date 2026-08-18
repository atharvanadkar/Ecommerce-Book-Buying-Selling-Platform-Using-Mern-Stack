import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

export const ProductBanner = ({ images }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const maxSteps = images?.length || 0;

    // Auto-play functionality - CONTINUOUSLY CHANGES IMAGES
    useEffect(() => {
        if (!autoPlay || maxSteps === 0) return;
        
        const interval = setInterval(() => {
            setActiveStep((prevActiveStep) => 
                prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
            );
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [autoPlay, maxSteps]);

    // If no images, return nothing
    if (!images || images.length === 0) {
        return null;
    }

    const handleNext = () => {
        setAutoPlay(false);
        setActiveStep((prevActiveStep) => 
            prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
        );
        // Restart auto-play after user interaction
        setTimeout(() => setAutoPlay(true), 5000);
    };

    const handleBack = () => {
        setAutoPlay(false);
        setActiveStep((prevActiveStep) => 
            prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
        );
        setTimeout(() => setAutoPlay(true), 5000);
    };

    const goToSlide = (index) => {
        setAutoPlay(false);
        setActiveStep(index);
        setTimeout(() => setAutoPlay(true), 5000);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* Image Display with Smooth Transitions */}
            <Box sx={{ width: '100%', height: { xs: 200, sm: 300, md: 400 }, position: 'relative' }}>
                {images.map((image, index) => (
                    <Box
                        key={index}
                        component={Link}
                        to={`/product-details/${image._id || '1'}`}
                        sx={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: activeStep === index ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out', // ← SMOOTH TRANSITION
                            textDecoration: 'none'
                        }}
                    >
                        <Box
                            component="img"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            src={image}
                            alt={`Banner ${index + 1}`}
                        />
                        {/* Optional overlay text */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                p: 3,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                color: 'white'
                            }}
                        >
                            <Box sx={{ typography: 'h4', fontWeight: 600 }}>
                                The Lending Library
                            </Box>
                            <Box sx={{ typography: 'body1', opacity: 0.9 }}>
                                Discover your next great read
                            </Box>
                        </Box>
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
                                width: 12,
                                height: 12,
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
    );
};