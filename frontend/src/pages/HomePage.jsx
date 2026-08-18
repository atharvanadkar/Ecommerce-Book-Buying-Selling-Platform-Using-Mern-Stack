import React, { useEffect } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { ProductList } from '../features/products/components/ProductList'
import { ProductBanner } from '../features/products/components/ProductBanner'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Footer } from '../features/footer/Footer'

// Banner images - Book themed
const bannerImages = [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=400&fit=crop&q=80'
]

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
      <ProductBanner images={bannerImages} />
      <ProductList />
      <Footer />
    </>
  )
}