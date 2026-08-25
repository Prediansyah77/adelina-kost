import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from './pages/Login'

import ProtectedRoute from './components/ProtectedRoute'

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import Rooms from './pages/Rooms'
import Buildings from './pages/Buildings'
import Floors from './pages/Floors'
import Tenants from './pages/Tenants'
import Contracts from './pages/Contracts'
import History from './pages/History'
import Bills from './pages/Bills'
import Payments from './pages/Payments'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import BankAccounts from './pages/BankAccounts'


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =====================================================
            ROOT
            ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* =====================================================
            LOGIN
            ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =====================================================
            PROTECTED ADMIN AREA
            ===================================================== */}

        <Route
          element={<ProtectedRoute />}
        >


          {/* =================================================
              ADMIN LAYOUT
              ================================================= */}

          <Route
            path="/admin"
            element={<AdminLayout />}
          >


            {/* =================================================
                DASHBOARD
                /admin/dashboard
                ================================================= */}

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />


            {/* =================================================
                BANGUNAN
                /admin/buildings
                ================================================= */}

            <Route
              path="buildings"
              element={<Buildings />}
            />


            {/* =================================================
                LANTAI
                /admin/floors
                ================================================= */}

            <Route
              path="floors"
              element={<Floors />}
            />


            {/* =================================================
                KAMAR
                /admin/rooms
                ================================================= */}

            <Route
              path="rooms"
              element={<Rooms />}
            />


            {/* =================================================
                PENGHUNI
                /admin/tenants
                ================================================= */}

            <Route
              path="tenants"
              element={<Tenants />}
            />


            {/* =================================================
                KONTRAK
                /admin/contracts
                ================================================= */}

            <Route
              path="contracts"
              element={<Contracts />}
            />


            {/* =================================================
                RIWAYAT
                /admin/history
                ================================================= */}

            <Route
              path="history"
              element={<History />}
            />


            {/* =================================================
                TAGIHAN
                /admin/bills
                ================================================= */}

            <Route
              path="bills"
              element={<Bills />}
            />


            {/* =================================================
                PEMBAYARAN
                /admin/payments
                ================================================= */}

            <Route
              path="payments"
              element={<Payments />}
            />


            {/* =================================================
                PENGELUARAN
                /admin/expenses
                ================================================= */}

            <Route
              path="expenses"
              element={<Expenses />}
            />


            {/* =================================================
                REKENING BANK
                /admin/bank-accounts
                ================================================= */}

            <Route
              path="bank-accounts"
              element={<BankAccounts />}
            />


            {/* =================================================
                LAPORAN
                /admin/reports
                ================================================= */}

            <Route
              path="reports"
              element={<Reports />}
            />


          </Route>

        </Route>


        {/* =====================================================
            FALLBACK
            ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />


      </Routes>

    </BrowserRouter>

  )
}


export default App