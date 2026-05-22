import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import VehiclesPage from '../pages/vechicle/VehiclesPage.tsx'
import VehicleDetailPage from '../pages/vechicle/VehicleDetailPage.tsx'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import VehicleSearchPage from '@/pages/vechicle/VehicleSearchPage.tsx'
import VehicleRegisterPage from '@/pages/vechicle/VehicleRegisterPage.tsx'
import DriverRegisterPage from '@/pages/driver/DriverRegisterPage.tsx'
import DriverProfilePage from '@/pages/driver/DriverProfilePage.tsx'
import OwnerRegisterPage from '@/pages/owner/OwnerRegisterPage.tsx'
import OwnerProfilePage from '@/pages/owner/OwnerProfilePage.tsx'
import UserProfilePage from '@/pages/UserProfilePage.tsx'
import OwnerVehicleDetailPage from '@/pages/owner/OwnerVehicleDetailPage.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/user/profile" element={<UserProfilePage />} />
      <Route path="/owner/register" element={<OwnerRegisterPage />} />
      <Route path="/owner/profile" element={<OwnerProfilePage />} />
      <Route path="/owner/profile/vehicles/:id" element={<OwnerVehicleDetailPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/vehicle/register" element={<VehicleRegisterPage />} />
      <Route path="/vehicle/search" element={<VehicleSearchPage />} />
      <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
      <Route path="/driver/register" element={<DriverRegisterPage />} />
      <Route path="/driver/profile" element={<DriverProfilePage />} />
    </Routes>
  )
}
