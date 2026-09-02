import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/adelina-kost-logo.png";

import {
    Menu,
    X,
    Home,
    BedDouble,
    MapPin,
    Info,
    LogIn,
    Armchair,
    Wind,
    CookingPot,
    Bath,
    Wifi,
    Car,
    Sun,
    LayoutDashboard
} from "lucide-react";

import { useEffect, useState } from "react";


function PublicLayout({ children }) {

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] =
        useState(false);

    const [isLoggedIn, setIsLoggedIn] =
        useState(false);

    const [userRole, setUserRole] =
        useState(null);


    // =====================================================
    // CEK STATUS LOGIN
    // =====================================================

    useEffect(() => {

        const checkAuthentication = () => {

            const token =
                localStorage.getItem("token");

            const userStorage =
                localStorage.getItem("user");


            // =============================================
            // BELUM LOGIN
            // =============================================

            if (
                !token ||
                !userStorage
            ) {

                setIsLoggedIn(false);

                setUserRole(null);

                return;

            }


            // =============================================
            // AMBIL DATA USER
            // =============================================

            try {

                const user =
                    JSON.parse(userStorage);


                setIsLoggedIn(true);

                setUserRole(
                    user?.role || null
                );

            } catch (error) {

                console.error(
                    "PublicLayout User Storage Error:",
                    error
                );


                setIsLoggedIn(false);

                setUserRole(null);

            }

        };


        checkAuthentication();


        // =============================================
        // CEK JIKA LOCAL STORAGE BERUBAH
        // =============================================

        window.addEventListener(
            "storage",
            checkAuthentication
        );


        return () => {

            window.removeEventListener(
                "storage",
                checkAuthentication
            );

        };

    }, []);


    // =====================================================
    // DASHBOARD
    // =====================================================

    const handleDashboard = () => {

        setMenuOpen(false);


        // =============================================
        // PENGHUNI
        // =============================================

        if (
            userRole === "penghuni"
        ) {

            navigate(
                "/tenant/dashboard"
            );

            return;

        }


        // =============================================
        // ADMIN
        // =============================================

        if (
            userRole === "admin"
        ) {

            navigate(
                "/admin/dashboard"
            );

            return;

        }


        // =============================================
        // ROLE TIDAK DIKENAL
        // =============================================

        navigate("/login");

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = () => {

        setMenuOpen(false);

        navigate("/login");

    };


    return (

        <div className="min-h-screen bg-white text-slate-800">


            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <header
                className="
                    sticky
                    top-0
                    z-50
                    border-b
                    border-slate-200
                    bg-white/95
                    backdrop-blur
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        max-w-7xl
                        items-center
                        justify-between
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >


                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <Link
                        to="/"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <img
                            src={logo}
                            alt="ADELINA KOST"
                            className="h-16 w-auto object-contain"
                        />


                        <div>

                            <p
                                className="
                                    text-base
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                ADELINA KOST
                            </p>


                            <p
                                className="
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                "
                            >
                                Pekanbaru
                            </p>

                        </div>

                    </Link>


                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}

                    <nav
                        className="
                            hidden
                            items-center
                            gap-7
                            md:flex
                        "
                    >

                        {/* BERANDA */}

                        <Link
                            to="/"
                            className="
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:text-blue-600
                            "
                        >
                            Beranda
                        </Link>


                        {/* KAMAR */}




                        {/* FASILITAS */}

                        <Link
                            to="/fasilitas"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                            className="
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:text-blue-600
                            "
                        >
                            Fasilitas
                        </Link>


                        {/* LOKASI */}

                        <Link
                            to="/lokasi"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                            className="
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:text-blue-600
                            "
                        >
                            Lokasi
                        </Link>


                        {/* TENTANG */}

                        <Link
                            to="/tentang"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                            className="
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:text-blue-600
                            "
                        >
                            Tentang
                        </Link>

                    </nav>


                    {/* =================================================
                        DESKTOP AUTH
                    ================================================= */}

                    <div className="hidden md:block">

                        {isLoggedIn ? (

                            <button
                                type="button"
                                onClick={
                                    handleDashboard
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-blue-700
                                    hover:shadow-md
                                "
                            >

                                <LayoutDashboard
                                    size={17}
                                />

                                Dashboard

                            </button>

                        ) : (

                            <button
                                type="button"
                                onClick={
                                    handleLogin
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-blue-700
                                    hover:shadow-md
                                "
                            >

                                <LogIn size={16} />

                                Login

                            </button>

                        )}

                    </div>


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                        className="
                            inline-flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            md:hidden
                        "
                    >

                        {menuOpen ? (

                            <X size={21} />

                        ) : (

                            <Menu size={21} />

                        )}

                    </button>

                </div>


                {/* =================================================
                    MOBILE MENU
                ================================================= */}

                {menuOpen && (

                    <div
                        className="
                            border-t
                            border-slate-100
                            bg-white
                            px-4
                            py-4
                            md:hidden
                        "
                    >

                        <nav
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >


                            {/* BERANDA */}

                            <Link
                                to="/"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="
                                    rounded-lg
                                    px-3
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                "
                            >
                                Beranda
                            </Link>


                            {/* KAMAR */}

                            <Link
                                to="/kamar"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="
                                    rounded-lg
                                    px-3
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                "
                            >
                                Kamar
                            </Link>


                            {/* FASILITAS */}

                            <Link
                                to="/fasilitas"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="
                                    rounded-lg
                                    px-3
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                "
                            >
                                Fasilitas
                            </Link>


                            {/* LOKASI */}

                            <Link
                                to="/lokasi"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="
                                    rounded-lg
                                    px-3
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                "
                            >
                                Lokasi
                            </Link>


                            {/* TENTANG */}

                            <Link
                                to="/tentang"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="
                                    rounded-lg
                                    px-3
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                "
                            >
                                Tentang
                            </Link>


                            {/* =================================================
                                MOBILE AUTH
                            ================================================= */}

                            {isLoggedIn ? (

                                <button
                                    type="button"
                                    onClick={
                                        handleDashboard
                                    }
                                    className="
                                        mt-2
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-blue-600
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-blue-700
                                    "
                                >

                                    <LayoutDashboard
                                        size={17}
                                    />

                                    Dashboard

                                </button>

                            ) : (

                                <button
                                    type="button"
                                    onClick={
                                        handleLogin
                                    }
                                    className="
                                        mt-2
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-blue-600
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-blue-700
                                    "
                                >

                                    <LogIn size={16} />

                                    Login

                                </button>

                            )}

                        </nav>

                    </div>

                )}

            </header>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <main>

                {children}

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer
                className="
                    border-t
                    border-slate-200
                    bg-slate-950
                    text-white
                "
            >

                <div
                    className="
                        mx-auto
                        grid
                        max-w-7xl
                        gap-10
                        px-4
                        py-12
                        sm:px-6
                        md:grid-cols-4
                        lg:px-8
                    "
                >


                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-600
                                "
                            >

                                <Home size={19} />

                            </div>


                            <div>

                                <p className="font-bold">
                                    ADELINA KOST
                                </p>


                                <p
                                    className="
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Pekanbaru
                                </p>

                            </div>

                        </div>


                        <p
                            className="
                                mt-4
                                max-w-sm
                                text-sm
                                leading-6
                                text-slate-400
                            "
                        >
                            Tempat tinggal nyaman dengan fasilitas
                            yang mendukung kebutuhan penghuni
                            untuk aktivitas sehari-hari.
                        </p>

                    </div>


                    {/* =================================================
                        NAVIGASI
                    ================================================= */}

                    <div>

                        <p className="font-semibold">
                            Navigasi
                        </p>


                        <div
                            className="
                                mt-4
                                flex
                                flex-col
                                gap-3
                                text-sm
                                text-slate-400
                            "
                        >

                            <Link
                                to="/"
                                className="hover:text-white"
                            >
                                Beranda
                            </Link>


                            <Link
                                to="/kamar"
                                className="hover:text-white"
                            >
                                Kamar
                            </Link>


                            <Link
                                to="/fasilitas"
                                className="hover:text-white"
                            >
                                Fasilitas
                            </Link>


                            <Link
                                to="/lokasi"
                                className="hover:text-white"
                            >
                                Lokasi
                            </Link>


                            <Link
                                to="/tentang"
                                className="hover:text-white"
                            >
                                Tentang
                            </Link>

                        </div>

                    </div>


                    {/* =================================================
                        FASILITAS
                    ================================================= */}

                    <div>

                        <p className="font-semibold">
                            Fasilitas
                        </p>


                        <div
                            className="
                                mt-4
                                space-y-3
                                text-sm
                                text-slate-400
                            "
                        >

                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <BedDouble size={17} />
                                Spring Bed
                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <Armchair size={17} />
                                Lemari
                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <Wind size={17} />
                                Kipas Angin
                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <Bath size={17} />
                                Kamar Mandi
                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <Wifi size={17} />
                                WiFi
                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <CookingPot size={17} />
                                Dapur Umum
                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <Car size={17} />
                                Area Parkir
                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <Sun size={17} />
                                Area Jemuran
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        INFORMASI
                    ================================================= */}

                    <div>

                        <p className="font-semibold">
                            Informasi
                        </p>


                        <div
                            className="
                                mt-4
                                space-y-3
                                text-sm
                                text-slate-400
                            "
                        >

                            <p
                                className="
                                    flex
                                    items-start
                                    gap-2
                                "
                            >

                                <MapPin
                                    size={17}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <span>
                                    Jalan Srikandi,
                                    Pekanbaru
                                </span>

                            </p>


                            <p
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <BedDouble size={17} />

                                Kos khusus pria

                            </p>


                            <p
                                className="
                                    flex
                                    items-start
                                    gap-2
                                "
                            >

                                <Info
                                    size={17}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <span>
                                    Lingkungan nyaman
                                    dan strategis
                                </span>

                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    COPYRIGHT
                ================================================= */}

                <div
                    className="
                        border-t
                        border-slate-800
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            px-4
                            py-5
                            text-center
                            text-xs
                            text-slate-500
                            sm:px-6
                            lg:px-8
                        "
                    >

                        © {new Date().getFullYear()}
                        {" "}
                        ADELINA KOST.
                        All rights reserved.

                    </div>

                </div>

            </footer>

        </div>

    );

}


export default PublicLayout;