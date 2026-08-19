import { FormHelperText, Stack, TextField, Typography, useTheme, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { bookAnimation } from '../../../assets'
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser, signupAsync, selectSignupStatus, selectSignupError, clearSignupError, resetSignupStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import { MotionConfig , motion} from 'framer-motion'

export const Signup = () => {
  const dispatch=useDispatch()
  const status=useSelector(selectSignupStatus)
  const error=useSelector(selectSignupError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const theme=useTheme()
  const is900=useMediaQuery(theme.breakpoints.down(900))
  const is600=useMediaQuery(theme.breakpoints.down(600))
  const is480=useMediaQuery(theme.breakpoints.down(480))

  // handles user redirection
  useEffect(()=>{
    if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
    else if(loggedInUser){
      navigate("/")
    }
  },[loggedInUser, navigate])

  // handles signup error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  useEffect(()=>{
    if(status==='fullfilled'){
      toast.success("Welcome! Verify your email to start shopping on mern-ecommerce.")
      reset()
    }
    return ()=>{
      dispatch(clearSignupError())
      dispatch(resetSignupStatus())
    }
  },[status, dispatch, reset])

  // this function handles signup and dispatches the signup action with credentails that api requires
  const handleSignup=(data)=>{
    const cred={...data}
    delete cred.confirmPassword
    dispatch(signupAsync(cred))
  }

  return (
    <Stack 
      width={'100vw'} 
      height={'100vh'} 
      flexDirection={is900 ? 'column' : 'row'} 
      sx={{overflowY: "auto"}}
    >

      {/* ANIMATION - Full width on mobile, half on desktop */}
      <Stack 
        bgcolor={'black'} 
        flex={is900 ? 0.4 : 1} 
        justifyContent={'center'} 
        alignItems={'center'}
        sx={{
          width: is900 ? '100%' : 'auto',
          height: is900 ? '40vh' : '100vh',
          minHeight: is900 ? '200px' : 'auto'
        }}
      >
        <Lottie 
          animationData={bookAnimation} 
          style={{ 
            width: is900 ? '60%' : '80%', 
            height: is900 ? '60%' : '80%' 
          }}
        />
        <Typography 
          color="white" 
          variant="body2" 
          sx={{ 
            mt: 1, 
            opacity: 0.6,
            fontSize: is900 ? '0.8rem' : '1rem'
          }}
        >
          📚 Read. Learn. Grow.
        </Typography>
      </Stack> 

      {/* Signup Form - Scrollable on mobile */}
      <Stack 
        flex={1} 
        justifyContent={'center'} 
        alignItems={'center'} 
        sx={{ 
          p: is480 ? 1 : 2,
          overflowY: 'auto',
          height: is900 ? '60vh' : '100vh'
        }}
      >

        <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          <Stack rowGap={'.4rem'}>
            <Typography 
              variant='h2' 
              sx={{
                wordBreak:"break-word",
                fontSize: is480 ? '1.8rem' : is600 ? '2.2rem' : '3rem'
              }} 
              fontWeight={600}
            >
              The Lending Library
            </Typography>
            <Typography 
              alignSelf={'flex-end'} 
              color={'GrayText'} 
              variant='body2'
              sx={{
                fontSize: is480 ? '0.7rem' : '0.9rem'
              }}
            >
              - BUY. SELL. DONATE.
            </Typography>
          </Stack>
        </Stack>

        <Stack 
          mt={is480 ? 2 : 4} 
          spacing={is480 ? 1.5 : 2} 
          width={is480 ? "100%" : '28rem'} 
          component={'form'} 
          noValidate 
          onSubmit={handleSubmit(handleSignup)}
        >

          <MotionConfig whileHover={{ y: -3 }}>

            <motion.div>
              <TextField 
                fullWidth 
                {...register("name",{required:"Username is required"})} 
                placeholder='Username'
                size={is480 ? "small" : "medium"}
              />
              {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField 
                fullWidth 
                {...register("email",{required:"Email is required",pattern:{value:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,message:"Enter a valid email"}})} 
                placeholder='Email'
                size={is480 ? "small" : "medium"}
              />
              {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField 
                fullWidth 
                {...register("password",{required:"Password is required",pattern:{value:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,message:`at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters`}})} 
                placeholder='Password'
                size={is480 ? "small" : "medium"}
              />
              {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
            </motion.div>
            
            <motion.div>
              <TextField 
                fullWidth 
                {...register("confirmPassword",{required:"Confirm Password is required",validate:(value,fromValues)=>value===fromValues.password || "Passwords doesn't match"})} 
                placeholder='Confirm Password'
                size={is480 ? "small" : "medium"}
              />
              {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
            </motion.div>
          
          </MotionConfig>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <LoadingButton 
              sx={{ 
                height: is480 ? '2.2rem' : '2.5rem',
                fontSize: is480 ? '0.8rem' : '1rem'
              }} 
              fullWidth 
              loading={status==='pending'} 
              type='submit' 
              variant='contained'
            >
              Signup
            </LoadingButton>
          </motion.div>

          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>
            <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.05 }}>
              <motion.div>
                <Typography 
                  mr={'1.5rem'} 
                  sx={{
                    textDecoration:"none",
                    color:"text.primary",
                    fontSize: is480 ? '0.7rem' : '0.9rem'
                  }} 
                  to={'/forgot-password'} 
                  component={Link}
                >
                  Forgot password
                </Typography>
              </motion.div>

              <motion.div>
                <Typography 
                  sx={{
                    textDecoration:"none",
                    color:"text.primary",
                    fontSize: is480 ? '0.7rem' : '0.9rem'
                  }} 
                  to={'/login'} 
                  component={Link}
                >
                  Already a member? <span style={{ color: theme.palette.primary.dark }}>Login</span>
                </Typography>
              </motion.div>
            </MotionConfig>
          </Stack>

        </Stack>

      </Stack>
    </Stack>
  )
}