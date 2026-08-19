import React from 'react'
import { Signup } from '../features/auth/components/Signup'
import { Container } from '@mui/material'

export const SignupPage = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Signup />
    </Container>
  )
}