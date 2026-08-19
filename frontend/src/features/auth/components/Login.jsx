import { FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { bookAnimation } from '../../../assets'
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser,loginAsync,selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import {MotionConfig, motion} from 'framer-motion'
import { AccountCircle, Lock, AdminPanelSettings, Person } from '@mui/icons-material'

export const Login = () => {
  const dispatch=useDispatch()
  const status=useSelector(selectLoginStatus)
  const error=useSelector(selectLoginError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,setValue,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const theme=useTheme()
  const is900=useMediaQuery(theme.breakpoints.down(900))
  const is600=useMediaQuery(theme.breakpoints.down(600))
  const is480=useMediaQuery(theme.breakpoints.down(480))
  
  const [selectedRole, setSelectedRole] = useState(null);

  const demoCredentials = {
    admin: {
      email: 'admin.lendinglibrary@gmail.com',
      password: 'Admin111111',
      label: 'Admin',
      icon: <AdminPanelSettings sx={{ color: '#1976d2' }} />
    },
    user: {
      email: 'user.lendinglibrary@gmail.com',
      password: 'User111111',
      label: 'User',
      icon: <Person sx={{ color: '#4caf50' }} />
    }
  };

  const fillDemoCredentials = (role) => {
    setSelectedRole(role);
    const creds = demoCredentials[role];
    
    setValue('email', creds.email, { 
      shouldValidate: true, 
      shouldDirty: true,
      shouldTouch: true 
    });
    setValue('password', creds.password, { 
      shouldValidate: true, 
      shouldDirty: true,
      shouldTouch: true 
    });
  };

  useEffect(()=>{
    if(loggedInUser && loggedInUser?.isVerified){
      navigate("/")
    }
    else if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
  },[loggedInUser, navigate])

  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  useEffect(()=>{
    if(status==='fullfilled' && loggedInUser?.isVerified===true){
      toast.success(`Login successful`)
      reset()
    }
    return ()=>{
      dispatch(clearLoginError())
      dispatch(resetLoginStatus())
    }
  },[status, dispatch, loggedInUser?.isVerified, reset])

  const handleLogin=(data)=>{
    const cred={...data}
    delete cred.confirmPassword
    dispatch(loginAsync(cred))
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

      {/* Login Form - Scrollable on mobile */}
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

        {/* Demo Credentials Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            mt: 2, 
            p: is480 ? 1.5 : 2, 
            width: is480 ? "100%" : '28rem',
            bgcolor: '#f5f7fa',
            borderRadius: 2
          }}
        >
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block', 
              mb: 1.5, 
              textAlign: 'center',
              fontSize: is480 ? '0.6rem' : '0.75rem'
            }}
          >
            🔑 Quick Demo Login - Click a role below
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{ flex: 1 }}
              onClick={() => fillDemoCredentials('admin')}
            >
              <Paper 
                elevation={selectedRole === 'admin' ? 4 : 1}
                sx={{ 
                  p: is480 ? 1 : 1.5, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: selectedRole === 'admin' ? '#e3f2fd' : 'white',
                  border: selectedRole === 'admin' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#e3f2fd'
                  }
                }}
              >
                <AdminPanelSettings sx={{ color: '#1976d2', fontSize: is480 ? 20 : 28 }} />
                <Typography variant="caption" display="block" fontWeight={600} sx={{ mt: 0.5, fontSize: is480 ? '0.6rem' : '0.75rem' }}>
                  Admin
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: is480 ? '6px' : '8px' }}>
                  Click to auto-fill
                </Typography>
              </Paper>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{ flex: 1 }}
              onClick={() => fillDemoCredentials('user')}
            >
              <Paper 
                elevation={selectedRole === 'user' ? 4 : 1}
                sx={{ 
                  p: is480 ? 1 : 1.5, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: selectedRole === 'user' ? '#e8f5e9' : 'white',
                  border: selectedRole === 'user' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#e8f5e9'
                  }
                }}
              >
                <Person sx={{ color: '#4caf50', fontSize: is480 ? 20 : 28 }} />
                <Typography variant="caption" display="block" fontWeight={600} sx={{ mt: 0.5, fontSize: is480 ? '0.6rem' : '0.75rem' }}>
                  User
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: is480 ? '6px' : '8px' }}>
                  Click to auto-fill
                </Typography>
              </Paper>
            </motion.div>
          </Stack>
          {selectedRole && (
            <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1, textAlign: 'center', fontSize: is480 ? '0.6rem' : '0.75rem' }}>
              ✅ {demoCredentials[selectedRole].label} credentials loaded. Click Login below.
            </Typography>
          )}
        </Paper>

        <Stack mt={2} spacing={1.5} width={is480 ? "100%" : '28rem'} component={'form'} noValidate onSubmit={handleSubmit(handleLogin)}>

          <motion.div whileHover={{ y: -3 }}>
            <TextField 
              fullWidth 
              {...register("email",{required:"Email is required",pattern:{value:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,message:"Enter a valid email"}})} 
              placeholder='Email'
              size={is480 ? "small" : "medium"}
              InputProps={{
                startAdornment: <AccountCircle sx={{ color: 'action.active', mr: 1, fontSize: is480 ? 18 : 24 }} />
              }}
            />
            {errors.email && <FormHelperText sx={{mt:0.5}} error>{errors.email.message}</FormHelperText>}
          </motion.div>

          <motion.div whileHover={{ y: -3 }}>
            <TextField 
              type='password' 
              fullWidth 
              {...register("password",{required:"Password is required"})} 
              placeholder='Password'
              size={is480 ? "small" : "medium"}
              InputProps={{
                startAdornment: <Lock sx={{ color: 'action.active', mr: 1, fontSize: is480 ? 18 : 24 }} />
              }}
            />
            {errors.password && <FormHelperText sx={{mt:0.5}} error>{errors.password.message}</FormHelperText>}
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <LoadingButton 
              fullWidth  
              sx={{ 
                height: is480 ? '2.2rem' : '2.5rem',
                fontSize: is480 ? '0.8rem' : '1rem'
              }} 
              loading={status==='pending'} 
              type='submit' 
              variant='contained'
            >
              Login
            </LoadingButton>
          </motion.div>

          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>

            <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.05 }}>
              <motion.div>
                <Typography 
                  mr={'1.5rem'} 
                  sx={{ 
                    textDecoration: "none", 
                    color: "text.primary",
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
                    textDecoration: "none", 
                    color: "text.primary",
                    fontSize: is480 ? '0.7rem' : '0.9rem'
                  }} 
                  to={'/signup'} 
                  component={Link}
                >
                  Don't have an account? <span style={{ color: theme.palette.primary.dark }}>Register</span>
                </Typography>
              </motion.div>
            </MotionConfig>

          </Stack>

        </Stack>
      </Stack>
    </Stack>
  )
}