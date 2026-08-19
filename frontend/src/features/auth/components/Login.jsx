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
  const {register,handleSubmit,reset,setValue,formState: { errors }} = useForm() // ← Added setValue
  const navigate=useNavigate()
  const theme=useTheme()
  const is900=useMediaQuery(theme.breakpoints.down(900))
  const is480=useMediaQuery(theme.breakpoints.down(480))
  
  // State for demo credential selection
  const [selectedRole, setSelectedRole] = useState(null);

  // Demo credentials
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

  // FIXED: Auto-fill demo credentials using react-hook-form's setValue
  const fillDemoCredentials = (role) => {
    setSelectedRole(role);
    const creds = demoCredentials[role];
    
    // Use react-hook-form's setValue to properly set the values
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

  // handles user redirection
  useEffect(()=>{
    if(loggedInUser && loggedInUser?.isVerified){
      navigate("/")
    }
    else if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
  },[loggedInUser, navigate])

  // handles login error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  // handles login status and dispatches reset actions to relevant states in cleanup
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
    <Stack width={'100vw'} height={'100vh'} flexDirection={'row'} sx={{overflowY:"hidden"}}>
        
        {
          !is900 && 
          <Stack bgcolor={'black'} flex={1} justifyContent={'center'} alignItems={'center'}>
            <Lottie animationData={bookAnimation} style={{ width: '80%', height: '80%' }}/>
            <Typography color="white" variant="body2" sx={{ mt: 2, opacity: 0.6 }}>
              📚 Read. Learn. Grow.
            </Typography>
          </Stack> 
        }

        <Stack flex={1} justifyContent={'center'} alignItems={'center'} sx={{ p: 2 }}>

              <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>

                <Stack rowGap={'.4rem'}>
                  <Typography variant='h2' sx={{wordBreak:"break-word"}} fontWeight={600}>The Lending Library</Typography>
                  <Typography alignSelf={'flex-end'} color={'GrayText'} variant='body2'>- BUY. SELL. DONATE.</Typography>
                </Stack>

              </Stack>

              {/* Demo Credentials Section */}
              <Paper 
                elevation={2} 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  width: is480 ? "95vw" : '28rem',
                  bgcolor: '#f5f7fa',
                  borderRadius: 2
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, textAlign: 'center' }}>
                  🔑 Quick Demo Login - Click a role below
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {/* Admin Button */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ flex: 1 }}
                    onClick={() => fillDemoCredentials('admin')}
                  >
                    <Paper 
                      elevation={selectedRole === 'admin' ? 4 : 1}
                      sx={{ 
                        p: 1.5, 
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
                      <AdminPanelSettings sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="caption" display="block" fontWeight={600} sx={{ mt: 0.5 }}>
                        Admin
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '8px' }}>
                        Click to auto-fill
                      </Typography>
                    </Paper>
                  </motion.div>

                  {/* User Button */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ flex: 1 }}
                    onClick={() => fillDemoCredentials('user')}
                  >
                    <Paper 
                      elevation={selectedRole === 'user' ? 4 : 1}
                      sx={{ 
                        p: 1.5, 
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
                      <Person sx={{ color: '#4caf50', fontSize: 28 }} />
                      <Typography variant="caption" display="block" fontWeight={600} sx={{ mt: 0.5 }}>
                        User
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '8px' }}>
                        Click to auto-fill
                      </Typography>
                    </Paper>
                  </motion.div>
                </Stack>
                {selectedRole && (
                  <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                    ✅ {demoCredentials[selectedRole].label} credentials loaded. Click Login below.
                  </Typography>
                )}
              </Paper>

                <Stack mt={3} spacing={2} width={is480?"95vw":'28rem'} component={'form'} noValidate onSubmit={handleSubmit(handleLogin)}>

                    <motion.div whileHover={{y:-5}}>
                      <TextField 
                        fullWidth 
                        {...register("email",{required:"Email is required",pattern:{value:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,message:"Enter a valid email"}})} 
                        placeholder='Email'
                        InputProps={{
                          startAdornment: <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
                        }}
                      />
                      {errors.email && <FormHelperText sx={{mt:1}} error>{errors.email.message}</FormHelperText>}
                    </motion.div>

                    
                    <motion.div whileHover={{y:-5}}>
                      <TextField 
                        type='password' 
                        fullWidth 
                        {...register("password",{required:"Password is required"})} 
                        placeholder='Password'
                        InputProps={{
                          startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />
                        }}
                      />
                      {errors.password && <FormHelperText sx={{mt:1}} error>{errors.password.message}</FormHelperText>}
                    </motion.div>
                    
                    <motion.div whileHover={{scale:1.020}} whileTap={{scale:1}}>
                      <LoadingButton 
                        fullWidth  
                        sx={{height:'2.5rem'}} 
                        loading={status==='pending'} 
                        type='submit' 
                        variant='contained'
                      >
                        Login
                      </LoadingButton>
                    </motion.div>

                    <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'} >

                      <MotionConfig whileHover={{x:2}} whileTap={{scale:1.050}}>
                          <motion.div>
                              <Typography mr={'1.5rem'} sx={{textDecoration:"none",color:"text.primary"}} to={'/forgot-password'} component={Link}>Forgot password</Typography>
                          </motion.div>

                          <motion.div>
                            <Typography sx={{textDecoration:"none",color:"text.primary"}} to={'/signup'} component={Link}>Don't have an account? <span style={{color:theme.palette.primary.dark}}>Register</span></Typography>
                          </motion.div>
                      </MotionConfig>

                    </Stack>

                </Stack>
        </Stack>
    </Stack>
  )
}