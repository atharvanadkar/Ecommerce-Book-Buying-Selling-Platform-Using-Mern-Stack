import { FormHelperText, Paper, Stack, Typography, useMediaQuery, useTheme} from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync,selectCartItems } from '../../cart/CartSlice';
import {motion} from 'framer-motion'

export const ProductCard = ({id,title,image,price,thumbnail,brand,stockQuantity,handleAddRemoveFromWishlist,isWishlistCard,isAdminCard}) => {

    const navigate=useNavigate()
    const wishlistItems=useSelector(selectWishlistItems)
    const loggedInUser=useSelector(selectLoggedInUser)
    const cartItems=useSelector(selectCartItems)
    const dispatch=useDispatch()
    let isProductAlreadyinWishlist=-1

    const theme=useTheme()
    const is1410=useMediaQuery(theme.breakpoints.down(1410))
    const is932=useMediaQuery(theme.breakpoints.down(932))
    const is752=useMediaQuery(theme.breakpoints.down(752))
    const is500=useMediaQuery(theme.breakpoints.down(500))
    const is608=useMediaQuery(theme.breakpoints.down(608))
    const is488=useMediaQuery(theme.breakpoints.down(488))
    const is408=useMediaQuery(theme.breakpoints.down(408))

    isProductAlreadyinWishlist=wishlistItems.some((item)=>item.product._id===id)

    const isProductAlreadyInCart=cartItems.some((item)=>item.product._id===id)

    const handleAddToCart=async(e)=>{
        e.stopPropagation()
        const data={user:loggedInUser?._id,product:id}
        dispatch(addToCartAsync(data))
    }

    return (
        <>
        {
        isProductAlreadyinWishlist!==-1 ?
        <Stack 
            component={isAdminCard?"":isWishlistCard?"":is408?'':Paper} 
            mt={is408?2:0} 
            elevation={1} 
            p={2} 
            width={is408?'100%':is488?"160px":is608?"180px":is752?"220px":is932?'200px':is1410?'240px':'280px'} 
            sx={{cursor:"pointer"}} 
            onClick={()=>navigate(`/product-details/${id}`)}
        >

            {/* image display */}
            <Stack>
                {loggedInUser?.isAdmin ? 
                    <img 
                        width={'100%'} 
                        style={{
                            aspectRatio:'1/1',
                            objectFit:'contain',
                            maxHeight: { xs: '150px', sm: '200px', md: '250px' }
                        }} 
                        height={'100%'} 
                        src={thumbnail} 
                        alt={`${title} - cover image`} 
                    /> 
                    : 
                    <img 
                        width={'100%'} 
                        style={{
                            aspectRatio:'1/1',
                            objectFit:'contain',
                            maxHeight: { xs: '150px', sm: '200px', md: '250px' }
                        }} 
                        height={'100%'} 
                        src={image} 
                        alt={`${title} - cover image`} 
                    /> 
                }
            </Stack>

            {/* lower section */}
            <Stack flex={2} justifyContent={'flex-end'} spacing={1} rowGap={2}>

                <Stack>
                    <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography 
                            variant='h6' 
                            fontWeight={400}
                            sx={{
                                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: { xs: '100px', sm: '130px', md: '170px' }
                            }}
                        >
                            {title}
                        </Typography>
                        {
                        !isAdminCard && 
                        <motion.div whileHover={{scale:1.3,y:-10,zIndex:100}} whileTap={{scale:1}} transition={{duration:.4,type:"spring"}}>
                            <Checkbox 
                                onClick={(e)=>e.stopPropagation()} 
                                checked={isProductAlreadyinWishlist} 
                                onChange={(e)=>handleAddRemoveFromWishlist(e,id)} 
                                icon={<FavoriteBorder />} 
                                checkedIcon={<Favorite sx={{color:'red'}} />} 
                                size="small"
                            />
                        </motion.div>
                        }
                    </Stack>
                    <Typography 
                        color={"text.secondary"}
                        sx={{
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                        }}
                    >
                        by {brand}
                    </Typography>
                </Stack>

                <Stack sx={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                    <Typography 
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                            fontWeight: 600
                        }}
                    >
                        ₹{price}
                    </Typography>
                    {
                        !isWishlistCard? isProductAlreadyInCart?
                        ''
                        :
                        !isAdminCard &&
                        <motion.button 
                            whileHover={{scale:1.030}} 
                            whileTap={{scale:1}} 
                            onClick={(e)=>handleAddToCart(e)} 
                            style={{
                                padding: is408 ? "6px 10px" : is488 ? "6px 12px" : "8px 15px",
                                borderRadius:"3px",
                                outline:"none",
                                border:"none",
                                cursor:"pointer",
                                backgroundColor:"black",
                                color:"white",
                                fontSize: is408 ? '0.7rem' : is488 ? '0.65rem' : is500 ? '0.7rem' : '0.8rem'
                            }}
                        >
                            <div style={{display:"flex",alignItems:"center",columnGap:".3rem"}}>
                                <p>Add To Cart</p>
                            </div>
                        </motion.button>
                        :''
                    }
                    
                </Stack>
                {
                    stockQuantity<=20 && (
                        <FormHelperText 
                            sx={{
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                            }} 
                            error
                        >
                            {stockQuantity===1 ? "Only 1 copy left" : "Only few copies left"}
                        </FormHelperText>
                    )
                }
            </Stack>
        </Stack> 
        :''
        }
        </>
    )
}