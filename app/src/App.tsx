import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Buildings from '@/pages/Buildings'
import HvacEnergy from '@/pages/HvacEnergy'
import Alarms from '@/pages/Alarms'
import AccessControl from '@/pages/AccessControl'
import Maintenance from '@/pages/Maintenance'
import Reports from '@/pages/Reports'
import UsersPage from '@/pages/UsersPage'
import Units from '@/pages/Units'
import Billing from '@/pages/Billing'
import Visitors from '@/pages/Visitors'
import Parking from '@/pages/Parking'
import Amenities from '@/pages/Amenities'
import AmenitySettings from '@/pages/AmenitySettings'
import Complaints from '@/pages/Complaints'
import Announcements from '@/pages/Announcements'
import Leases from '@/pages/Leases'
import MeterReadings from '@/pages/MeterReadings'
import Vendors from '@/pages/Vendors'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/buildings" element={<Buildings />} />
          <Route path="/hvac-energy" element={<HvacEnergy />} />
          <Route path="/alarms" element={<Alarms />} />
          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/units" element={<Units />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/amenities/settings" element={<AmenitySettings />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/leases" element={<Leases />} />
          <Route path="/meter-readings" element={<MeterReadings />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
