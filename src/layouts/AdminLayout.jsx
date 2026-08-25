import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import {
    Menu,
    X,
    LayoutDashboard,
    Building2,
    Layers3,
    BedDouble,
    Users,
    FileText,
    History,
    Receipt,
    Wallet,
    Banknote,
    Landmark,
    BarChart3,
} from 'lucide-react'


// =====================================================
// ANIMATION STYLE
// =====================================================

const animationStyles = `
    @keyframes sidebarEnter {
        from {
            opacity: 0;
            transform: translateX(-25px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes mobileSidebarEnter {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes overlayFade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes navbarEnter {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes contentEnter {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes logoEnter {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes avatarEnter {
        from {
            opacity: 0;
            transform: scale(0.7);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .admin-sidebar-enter {
        animation: sidebarEnter 0.5s ease-out both;
    }

    .admin-mobile-sidebar-enter {
        animation: mobileSidebarEnter 0.3s ease-out both;
    }

    .admin-overlay-fade {
        animation: overlayFade 0.25s ease-out both;
    }

    .admin-navbar-enter {
        animation: navbarEnter 0.45s ease-out both;
    }

    .admin-content-enter {
        animation: contentEnter 0.45s ease-out both;
    }

    .admin-logo-enter {
        animation: logoEnter 0.5s ease-out both;
    }

    .admin-avatar-enter {
        animation: avatarEnter 0.45s ease-out both;
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`


// =====================================================
// MENU UTAMA
// =====================================================

const menuUtama = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Bangunan',
        path: '/admin/buildings',
        icon: Building2,
    },
    {
        name: 'Lantai',
        path: '/admin/floors',
        icon: Layers3,
    },
    {
        name: 'Kamar',
        path: '/admin/rooms',
        icon: BedDouble,
    },
    {
        name: 'Penghuni',
        path: '/admin/tenants',
        icon: Users,
    },
    {
        name: 'Kontrak',
        path: '/admin/contracts',
        icon: FileText,
    },
    {
        name: 'Riwayat',
        path: '/admin/history',
        icon: History,
    },
]


// =====================================================
// MENU KEUANGAN
// =====================================================

const menuKeuangan = [
    {
        name: 'Tagihan',
        path: '/admin/bills',
        icon: Receipt,
    },
    {
        name: 'Pembayaran',
        path: '/admin/payments',
        icon: Wallet,
    },
    {
        name: 'Pengeluaran',
        path: '/admin/expenses',
        icon: Banknote,
    },
    {
        name: 'Rekening Bank',
        path: '/admin/bank-accounts',
        icon: Landmark,
    },
    {
        name: 'Laporan',
        path: '/admin/reports',
        icon: BarChart3,
    },
]


// =====================================================
// MENU ITEM
// =====================================================

function MenuItem({ item, onClick }) {

    const Icon = item.icon

    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-300 hover:translate-x-1 hover:bg-slate-800 hover:text-white'
                }`
            }
        >

            <Icon
                size={18}
                className="shrink-0 transition-transform duration-200 group-hover:scale-110"
            />

            <span>
                {item.name}
            </span>

        </NavLink>
    )
}


// =====================================================
// SIDEBAR CONTENT
// =====================================================

function SidebarContent({ onItemClick }) {

    return (
        <>

            {/* =================================================
                LOGO
            ================================================= */}

            <div className="flex h-16 items-center border-b border-slate-800 px-6">

                <div className="admin-logo-enter cursor-default">

                    <h1 className="text-lg font-bold tracking-wide transition-colors duration-200 hover:text-blue-400">
                        ADELINA KOST
                    </h1>

                    <p className="text-xs text-slate-400">
                        Management System
                    </p>

                </div>

            </div>


            {/* =================================================
                MENU
            ================================================= */}

            <nav className="flex-1 overflow-y-auto p-4">


                {/* =================================================
                    MENU UTAMA
                ================================================= */}

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Menu Utama
                </p>


                <div className="space-y-1">

                    {menuUtama.map((item) => (

                        <MenuItem
                            key={item.path}
                            item={item}
                            onClick={onItemClick}
                        />

                    ))}

                </div>


                {/* =================================================
                    KEUANGAN
                ================================================= */}

                <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Keuangan
                </p>


                <div className="space-y-1">

                    {menuKeuangan.map((item) => (

                        <MenuItem
                            key={item.path}
                            item={item}
                            onClick={onItemClick}
                        />

                    ))}

                </div>

            </nav>

        </>
    )
}


// =====================================================
// ADMIN LAYOUT
// =====================================================

function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false)


    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout = () => {

        // Hapus JWT token
        localStorage.removeItem('token')

        // Hapus data user
        localStorage.removeItem('user')

        // Arahkan ke halaman login
        window.location.href = '/login'

    }


    return (

        <>

            {/* =================================================
                ANIMATION
            ================================================= */}

            <style>{animationStyles}</style>


            <div className="min-h-screen bg-slate-100">


                {/* =================================================
                    DESKTOP SIDEBAR
                ================================================= */}

                <aside className="admin-sidebar-enter fixed left-0 top-0 hidden h-screen w-64 flex-col bg-slate-900 text-white shadow-xl lg:flex">

                    <SidebarContent />

                </aside>


                {/* =================================================
                    MOBILE SIDEBAR
                ================================================= */}

                {sidebarOpen && (

                    <div className="fixed inset-0 z-50 lg:hidden">


                        {/* OVERLAY */}

                        <div
                            className="admin-overlay-fade absolute inset-0 bg-black/50 backdrop-blur-[1px]"
                            onClick={() => setSidebarOpen(false)}
                        />


                        {/* SIDEBAR */}

                        <aside className="admin-mobile-sidebar-enter relative flex h-full w-72 flex-col bg-slate-900 text-white shadow-2xl">


                            {/* CLOSE BUTTON */}

                            <div className="absolute right-4 top-4">

                                <button
                                    onClick={() =>
                                        setSidebarOpen(false)
                                    }
                                    className="rounded-lg p-2 text-slate-300 transition-all duration-200 hover:rotate-90 hover:bg-slate-800 hover:text-white active:scale-90"
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            <SidebarContent
                                onItemClick={() =>
                                    setSidebarOpen(false)
                                }
                            />

                        </aside>

                    </div>

                )}


                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="lg:ml-64">


                    {/* =================================================
                        NAVBAR
                    ================================================= */}

                    <header className="admin-navbar-enter sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">


                        {/* LEFT */}

                        <div className="flex items-center gap-3">


                            {/* MOBILE MENU */}

                            <button
                                onClick={() =>
                                    setSidebarOpen(true)
                                }
                                className="rounded-lg p-2 text-slate-600 transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:text-slate-900 active:scale-90 lg:hidden"
                            >

                                <Menu size={22} />

                            </button>


                            {/* TITLE */}

                            <div>

                                <h2 className="font-semibold text-slate-800 transition-colors duration-200 hover:text-blue-600">
                                    ADELINA KOST
                                </h2>

                                <p className="text-xs text-slate-500">

                                </p>

                            </div>

                        </div>


                        {/* RIGHT */}

                        <div className="flex items-center gap-3">


                            {/* USER INFO */}

                            <div className="hidden text-right sm:block">

                                <p className="text-sm font-medium text-slate-800">

                                </p>

                                <p className="text-xs text-slate-500">
                                    ADMIN
                                </p>

                            </div>


                            {/* AVATAR */}

                            <div className="admin-avatar-enter flex h-9 w-9 cursor-default items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:shadow-md">

                                A

                            </div>


                            {/* LOGOUT */}

                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm active:translate-y-0 active:scale-95"
                            >

                                Keluar

                            </button>

                        </div>

                    </header>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <section className="admin-content-enter p-4 lg:p-6">

                        <Outlet />

                    </section>

                </main>

            </div>

        </>
    )
}


export default AdminLayoutn