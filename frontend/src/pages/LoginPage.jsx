import React from 'react'
import { Login } from '../features/auth/components/Login'
import { Container } from '@mui/material'

export const LoginPage = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Login />
    </Container>
  )
}