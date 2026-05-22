import AppRoutes from './routes/AppRoutes'
import SiteHeader from './components/common/SiteHeader.tsx'
import { EvGoldLogo } from '@/assets/goldLogo.tsx'
import { useAuthStore } from "@/store/authStore.ts";

export default function App() {
  const authenticated = useAuthStore((state) => state.authenticated)
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  function handleLogout() {
    localStorage.removeItem('accessToken')
    setAuthenticated(false)
    setUser(null)
  }
  return (
    <div>
      <SiteHeader logo={<EvGoldLogo />}>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-200">
          <a className={'gold-text gold-underline'} href="/">
            Home
          </a>
          <a className={'gold-text gold-underline'} href="/vehicle/search">
            Vehicles
          </a>
          {
            authenticated ?
              <a href="/" className={'gold-text gold-underline'} onClick={()=> handleLogout()}>Logout</a> :
              <a className={'gold-text gold-underline'} href="/login">Login</a>
          }
          <a className={'gold-text gold-underline'} href="/signup">
            Signup
          </a>
          <ul>
            <li>
            <a href={'/user/profile'}>User DashBoard</a>
            </li>
            <li>
            <a href={'/owner/profile'}>Owner Dashboard</a>
            </li>
            <li>
            <a href={'/driver/profile'}>Driver Dashboard</a>
            </li>
          </ul>
        </nav>
      </SiteHeader>
      <AppRoutes />
    </div>
  )
}
