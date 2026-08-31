import { Link } from 'react-router-dom'
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
    Sun
} from 'lucide-react'
import { useState } from 'react'


function PublicLayout({ children }) {

    const [menuOpen, setMenuOpen] = useState(false)


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
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3"
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
                                text-white
                                shadow-sm
                            "
                        >

                            <Home size={20} />

                        </div>


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

                        {/* =================================================
                            BERANDA
                        ================================================= */}

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



                        {/* =================================================
                            KAMAR
                        ================================================= */}

                        <Link
                            to="/kamar"
                            className="
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:text-blue-600
                            "
                        >
                            Kamar
                        </Link>



                        {/* =================================================
                            FASILITAS
                        ================================================= */}

                        <Link
                            to="/fasilitas"
                            onClick={() => setMenuOpen(false)}
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



                        {/* =================================================
                            LOKASI
                        ================================================= */}

                        <Link
                            to="/lokasi"
                            onClick={() => setMenuOpen(false)}
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



                        {/* =================================================
                            TENTANG
                        ================================================= */}

                        <Link
                            to="/tentang"
                            onClick={() => setMenuOpen(false)}
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
                        DESKTOP LOGIN
                    ================================================= */}

                    <div className="hidden md:block">

                        <Link
                            to="/login"
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
                            "
                        >

                            <LogIn size={16} />

                            Login

                        </Link>

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

                        {menuOpen
                            ? <X size={21} />
                            : <Menu size={21} />
                        }

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

                        <nav className="flex flex-col gap-1">


                            {/* =================================================
                                BERANDA
                            ================================================= */}

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



                            {/* =================================================
                                KAMAR
                            ================================================= */}

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



                            {/* =================================================
                                FASILITAS
                            ================================================= */}

                            <Link
                                to="/#fasilitas"
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



                            {/* =================================================
                                LOKASI
                            ================================================= */}

                            <Link
                                to="/#lokasi"
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



                            {/* =================================================
                                TENTANG
                            ================================================= */}

                            <Link
                                to="/#tentang"
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
                                LOGIN
                            ================================================= */}

                            <Link
                                to="/login"
                                onClick={() =>
                                    setMenuOpen(false)
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
                                "
                            >

                                <LogIn size={16} />

                                Login

                            </Link>

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


                            {/* BERANDA */}

                            <Link
                                to="/"
                                className="hover:text-white"
                            >
                                Beranda
                            </Link>



                            {/* KAMAR */}

                            <Link
                                to="/kamar"
                                className="hover:text-white"
                            >
                                Kamar
                            </Link>



                            {/* FASILITAS */}

                            <Link
                                to="/#fasilitas"
                                className="hover:text-white"
                            >
                                Fasilitas
                            </Link>



                            {/* LOKASI */}

                            <Link
                                to="/#lokasi"
                                className="hover:text-white"
                            >
                                Lokasi
                            </Link>



                            {/* TENTANG */}

                            <Link
                                to="/#tentang"
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


                            {/* SPRING BED */}

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



                            {/* LEMARI */}

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



                            {/* KIPAS ANGIN */}

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



                            {/* KAMAR MANDI */}

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



                            {/* WIFI */}

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



                            {/* DAPUR UMUM */}

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



                            {/* AREA PARKIR */}

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



                            {/* AREA JEMURAN */}

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


                            {/* LOKASI */}

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



                            {/* JENIS KOS */}

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



                            {/* INFO TAMBAHAN */}

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

    )

}


export default PublicLayout