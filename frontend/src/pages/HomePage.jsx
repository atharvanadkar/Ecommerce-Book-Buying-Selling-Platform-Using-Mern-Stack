import React, { useEffect } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { ProductList } from '../features/products/components/ProductList'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Footer } from '../features/footer/Footer'
import { Container } from '@mui/material'

export const HomePage = () => {

  const dispatch = useDispatch()
  const addressStatus = useSelector(selectAddressStatus)

  useEffect(() => {
    if (addressStatus === 'fulfilled') {
      dispatch(resetAddressStatus())
    }
  }, [addressStatus, dispatch])

  return (
    <>
      <Navbar isProductList={true} />
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 }, mt: { xs: 1, sm: 2 } }}>
        <ProductList />
      </Container>
      <Footer />
    </>
  )
}