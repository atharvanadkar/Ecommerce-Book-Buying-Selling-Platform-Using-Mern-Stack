import React from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { AdminDashBoard } from '../features/admin/components/AdminDashBoard'
// import { UserProfile } from '../features/user/components/UserProfile'

export const AdminDashboardPage = () => {
  return (
    <>
    <Navbar isProductList={true}/>
    <AdminDashBoard/>
    </>
  )
}
