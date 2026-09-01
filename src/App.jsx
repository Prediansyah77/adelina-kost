import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import LandingPage from "./pages/public/LandingPage";
import PublicRooms from "./pages/public/PublicRooms";
import RoomDetail from "./pages/public/RoomDetail";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Rooms from "./pages/Rooms";
import Buildings from "./pages/Buildings";
import Floors from "./pages/Floors";
import Tenants from "./pages/Tenants";
import Contracts from "./pages/Contracts";
import History from "./pages/History";
import Bills from "./pages/Bills";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import BankAccounts from "./pages/BankAccounts";
import Facilities from "./pages/public/Facilities";
import Location from "./pages/public/Location";
import About from "./pages/public/About";

// =====================================================
// TENANT
// =====================================================

import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantRoomApplication from "./pages/tenant/TenantRoomApplication";
import TenantBookingPayment from "./pages/tenant/TenantBookingPayment";
import TenantFullPayment from "./pages/tenant/TenantFullPayment";


// =====================================================
// ROLE PROTECTED ROUTE
// =====================================================

function RoleProtectedRoute({
  allowedRole,
  children,
}) {

  const token =
    localStorage.getItem("token");

  const userStorage =
    localStorage.getItem("user");


  // ===================================================
  // BELUM LOGIN
  // ===================================================

  if (!token || !userStorage) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ===================================================
  // PARSE USER
  // ===================================================

  let user;

  try {

    user =
      JSON.parse(userStorage);

  } catch (error) {

    console.error(
      "User localStorage tidak valid:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ===================================================
  // CEK ROLE
  // ===================================================

  if (
    String(user.role).toLowerCase() !==
    String(allowedRole).toLowerCase()
  ) {

    // ================================================
    // ADMIN
    // ================================================

    if (
      String(user.role).toLowerCase() ===
      "admin"
    ) {

      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );

    }


    // ================================================
    // PENGHUNI
    // ================================================

    if (
      String(user.role).toLowerCase() ===
      "penghuni"
    ) {

      return (
        <Navigate
          to="/tenant/dashboard"
          replace
        />
      );

    }


    // ================================================
    // ROLE TIDAK DIKENALI
    // ================================================

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ===================================================
  // ROLE SESUAI
  // ===================================================

  return children;

}


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =====================================================
            PUBLIC WEBSITE
            ===================================================== */}

        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
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
            REGISTER
            ===================================================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================================
            PUBLIC ROOMS
            ===================================================== */}

        <Route
          path="/kamar"
          element={
            <PublicLayout>
              <PublicRooms />
            </PublicLayout>
          }
        />


        {/* =====================================================
            PUBLIC ROOM DETAIL
            ===================================================== */}

        <Route
          path="/kamar/:id"
          element={
            <PublicLayout>
              <RoomDetail />
            </PublicLayout>
          }
        />


        {/* =====================================================
            PUBLIC FACILITIES
            ===================================================== */}

        <Route
          path="/fasilitas"
          element={
            <PublicLayout>
              <Facilities />
            </PublicLayout>
          }
        />


        {/* =====================================================
            PUBLIC LOCATION
            ===================================================== */}

        <Route
          path="/lokasi"
          element={
            <PublicLayout>
              <Location />
            </PublicLayout>
          }
        />


        {/* =====================================================
            PUBLIC ABOUT
            ===================================================== */}

        <Route
          path="/tentang"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />


        {/* =====================================================
            =====================================================
            PROTECTED ADMIN AREA
            =====================================================
            ===================================================== */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            path="/admin"
            element={
              <RoleProtectedRoute
                allowedRole="admin"
              >
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >

            {/* =================================================
                DASHBOARD
                ================================================= */}

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />


            {/* =================================================
                BUILDINGS
                ================================================= */}

            <Route
              path="buildings"
              element={<Buildings />}
            />


            {/* =================================================
                FLOORS
                ================================================= */}

            <Route
              path="floors"
              element={<Floors />}
            />


            {/* =================================================
                ROOMS
                ================================================= */}

            <Route
              path="rooms"
              element={<Rooms />}
            />


            {/* =================================================
                TENANTS
                ================================================= */}

            <Route
              path="tenants"
              element={<Tenants />}
            />


            {/* =================================================
                CONTRACTS
                ================================================= */}

            <Route
              path="contracts"
              element={<Contracts />}
            />


            {/* =================================================
                HISTORY
                ================================================= */}

            <Route
              path="history"
              element={<History />}
            />


            {/* =================================================
                BILLS
                ================================================= */}

            <Route
              path="bills"
              element={<Bills />}
            />


            {/* =================================================
                PAYMENTS
                ================================================= */}

            <Route
              path="payments"
              element={<Payments />}
            />


            {/* =================================================
                EXPENSES
                ================================================= */}

            <Route
              path="expenses"
              element={<Expenses />}
            />


            {/* =================================================
                BANK ACCOUNTS
                ================================================= */}

            <Route
              path="bank-accounts"
              element={<BankAccounts />}
            />


            {/* =================================================
                REPORTS
                ================================================= */}

            <Route
              path="reports"
              element={<Reports />}
            />

          </Route>

        </Route>


        {/* =====================================================
            =====================================================
            PROTECTED TENANT AREA
            =====================================================
            ===================================================== */}

        <Route
          element={<ProtectedRoute />}
        >

          {/* ===================================================
              TENANT DASHBOARD
              =================================================== */}

          <Route
            path="/tenant"
            element={
              <RoleProtectedRoute
                allowedRole="penghuni"
              >
                <TenantDashboard />
              </RoleProtectedRoute>
            }
          >

            {/* =================================================
                DASHBOARD

                /tenant/dashboard
                ================================================= */}

            <Route
              path="dashboard"
              element={<TenantDashboard />}
            />

          </Route>


          {/* ===================================================
              PENGAJUAN KAMAR

              /tenant/pengajuan-kamar?roomId=13
              =================================================== */}

          <Route
            path="/tenant/pengajuan-kamar"
            element={
              <RoleProtectedRoute
                allowedRole="penghuni"
              >
                <TenantRoomApplication />
              </RoleProtectedRoute>
            }
          />


          {/* ===================================================
              PEMBAYARAN BOOKING - AWAL / DP

              Belum ada bookingId.

              Contoh:
              /tenant/pembayaran-booking?roomId=13&paymentType=dp
              =================================================== */}

          <Route
            path="/tenant/pembayaran-booking"
            element={
              <RoleProtectedRoute
                allowedRole="penghuni"
              >
                <TenantBookingPayment />
              </RoleProtectedRoute>
            }
          />


          {/* ===================================================
              PEMBAYARAN BOOKING - BOOKING SUDAH ADA

              Digunakan ketika bookingId sudah dibuat
              setelah pembayaran DP berhasil dibuat.

              Contoh:
              /tenant/pembayaran-booking/15
              =================================================== */}

          <Route
            path="/tenant/pembayaran-booking/:bookingId"
            element={
              <RoleProtectedRoute
                allowedRole="penghuni"
              >
                <TenantBookingPayment />
              </RoleProtectedRoute>
            }
          />

        </Route>


        {/* =====================================================
            FALLBACK
            ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ===================================================
    PEMBAYARAN PENUH TANPA DP

    Contoh:
    /tenant/pembayaran-full?roomId=17
    =================================================== */}

        <Route
          path="/tenant/pembayaran-full"
          element={
            <RoleProtectedRoute
              allowedRole="penghuni"
            >
              <TenantFullPayment />
            </RoleProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;