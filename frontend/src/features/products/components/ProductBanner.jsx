import MobileStepper from '@mui/material/MobileStepper';
import { Box, useTheme } from '@mui/material';
import { useState } from 'react';

// REMOVED: import SwipeableViews from 'react-swipeable-views';
// REMOVED: import { autoPlay } from 'react-swipeable-views-utils';
// REMOVED: const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const ProductBanner = ({images}) => {

    const theme = useTheme()
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images?.length || 0;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    // If no images, return nothing
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <>
            {/* Simple image display - replaced AutoPlaySwipeableViews */}
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        style={{
                            display: index === activeStep ? 'block' : 'none',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <Box
                            component="img"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                            src={image}
                            alt={'Banner Image'}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation dots */}
            <div style={{ alignSelf: 'center', marginTop: '10px' }}>
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={null}
                    backButton={null}
                    sx={{
                        '& .MuiMobileStepper-dot': {
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#1976d2'
                            }
                        }
                    }}
                />
            </div>
        </>
    )
}