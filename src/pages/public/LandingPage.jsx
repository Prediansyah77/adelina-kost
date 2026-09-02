import {
    ArrowRight,
    BedDouble,
    CheckCircle2,
    MapPin,
    Navigation as NavigationIcon,
    ShieldCheck,
    Sparkles,
    Wifi,
    Wind,
    CookingPot,
    Shirt,
    Car,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { getPublicRooms } from "../../services/roomService";

import logo from "../../assets/adelina-kost-logo.png";


// =====================================================
// GOOGLE MAPS ADELINA KOST
// =====================================================

const GOOGLE_MAPS_BANGUNAN_LAMA =
    "https://maps.app.goo.gl/NnAr9RDaxM7DtVax8";

const GOOGLE_MAPS_BANGUNAN_BARU =
    "https://maps.app.goo.gl/VaRxTtRq1PAJTAZ39";


// =====================================================
// LANDING PAGE
// =====================================================

function LandingPage() {

    // =====================================================
    // STATE JUMLAH KAMAR TERSEDIA
    // =====================================================

    const [availableRooms, setAvailableRooms] = useState(0);


    // =====================================================
    // AMBIL DATA KAMAR DARI BACKEND
    // =====================================================

    useEffect(() => {

        const loadAvailableRooms = async () => {

            try {

                const response = await getPublicRooms();

                const roomData =
                    Array.isArray(response)
                        ? response
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];


                const totalAvailable =
                    roomData.filter(
                        (room) =>
                            room.status === "available"
                    ).length;


                setAvailableRooms(totalAvailable);

            } catch (error) {

                console.error(
                    "Landing Page Rooms Error:",
                    error
                );

                setAvailableRooms(0);

            }

        };


        loadAvailableRooms();

    }, []);


    return (

        <div>

            {/* =====================================================
                HERO
            ===================================================== */}

            <section
                id="beranda"
                className="
                    relative
                    overflow-hidden
                    bg-slate-50
                "
            >

                {/* DECORATIVE BACKGROUND */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-40
                        -top-40
                        h-96
                        w-96
                        rounded-full
                        bg-blue-100/50
                        blur-3xl
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-40
                        left-1/3
                        h-80
                        w-80
                        rounded-full
                        bg-indigo-100/40
                        blur-3xl
                    "
                />


                <div
                    className="
                        relative
                        mx-auto
                        grid
                        min-h-[650px]
                        max-w-7xl
                        items-center
                        gap-14
                        px-4
                        py-16
                        sm:px-6
                        lg:grid-cols-2
                        lg:px-8
                        lg:py-20
                    "
                >

                    {/* =================================================
                        TEXT
                    ================================================= */}

                    <div>

                        {/* BADGE */}

                        <div
                            className="
                                mb-6
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-blue-100
                                bg-white
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                text-blue-700
                                shadow-sm
                            "
                        >

                            <span
                                className="
                                    flex
                                    h-6
                                    w-6
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-50
                                "
                            >
                                <Sparkles size={13} />
                            </span>

                            Hunian nyaman di Pekanbaru

                        </div>


                        {/* TITLE */}

                        <h1
                            className="
                                max-w-2xl
                                text-4xl
                                font-bold
                                leading-[1.08]
                                tracking-tight
                                text-slate-950
                                sm:text-5xl
                                lg:text-6xl
                            "
                        >

                            Tempat Tinggal

                            <span className="block">
                                Nyaman untuk
                            </span>

                            <span
                                className="
                                    block
                                    text-blue-600
                                "
                            >
                                Aktivitas Sehari-hari
                            </span>

                        </h1>


                        {/* DESCRIPTION */}

                        <p
                            className="
                                mt-6
                                max-w-xl
                                text-base
                                leading-7
                                text-slate-600
                                sm:text-lg
                            "
                        >

                            Temukan kamar kos yang nyaman dengan
                            fasilitas yang mendukung kebutuhanmu,
                            berada di lokasi strategis Pekanbaru.

                        </p>


                        {/* =================================================
                            KAMAR TERSEDIA
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                inline-flex
                                items-center
                                gap-4
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                px-5
                                py-3
                                shadow-sm
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
                                    bg-emerald-50
                                "
                            >

                                <BedDouble
                                    size={20}
                                    className="text-emerald-600"
                                />

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    Kamar tersedia
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-xl
                                        font-bold
                                        text-emerald-600
                                    "
                                >

                                    {availableRooms}

                                    <span
                                        className="
                                            ml-1
                                            text-sm
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        kamar
                                    </span>

                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            BUTTON
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                            "
                        >

                            <Link
                                to="/kamar"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-blue-600/20
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:bg-blue-700
                                    hover:shadow-xl
                                "
                            >

                                Lihat Kamar

                                <ArrowRight size={17} />

                            </Link>


                            <a
                                href={GOOGLE_MAPS_BANGUNAN_LAMA}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    shadow-sm
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:bg-slate-50
                                    hover:shadow-md
                                "
                            >

                                <MapPin size={17} />

                                Lihat Lokasi

                            </a>

                        </div>


                        {/* =================================================
                            FEATURES
                        ================================================= */}

                        <div
                            className="
                                mt-10
                                grid
                                max-w-xl
                                grid-cols-2
                                gap-x-6
                                gap-y-4
                                sm:grid-cols-3
                            "
                        >

                            <FeatureItem>
                                Spring Bed
                            </FeatureItem>

                            <FeatureItem>
                                WiFi
                            </FeatureItem>

                            <FeatureItem>
                                Kamar mandi dalam
                            </FeatureItem>

                            <FeatureItem>
                                Kipas Angin
                            </FeatureItem>

                            <FeatureItem>
                                Lemari
                            </FeatureItem>

                            <FeatureItem>
                                Dapur Umum
                            </FeatureItem>

                            <FeatureItem>
                                Area Jemuran
                            </FeatureItem>

                            <FeatureItem>
                                Area Parkir
                            </FeatureItem>

                        </div>

                    </div>


                    {/* =================================================
                        HERO LOGO
                    ================================================= */}

                    <div
                        className="
                            relative
                            flex
                            min-h-[400px]
                            items-center
                            justify-center
                            lg:min-h-[520px]
                        "
                    >

                        {/* GLOW */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                h-72
                                w-72
                                rounded-full
                                bg-blue-200/40
                                blur-3xl
                                sm:h-96
                                sm:w-96
                            "
                        />


                        {/* DECORATIVE CIRCLE */}

                        <div
                            className="
                                absolute
                                h-[310px]
                                w-[310px]
                                rounded-full
                                border
                                border-blue-100
                                sm:h-[430px]
                                sm:w-[430px]
                            "
                        />


                        <div
                            className="
                                absolute
                                h-[250px]
                                w-[250px]
                                rounded-full
                                border
                                border-slate-200
                                sm:h-[350px]
                                sm:w-[350px]
                            "
                        />


                        {/* LOGO CARD */}

                        <div
                            className="
                                relative
                                z-10
                                flex
                                w-full
                                max-w-[520px]
                                items-center
                                justify-center
                                rounded-[2rem]
                                border
                                border-white
                                bg-white/80
                                px-6
                                py-10
                                shadow-2xl
                                shadow-slate-300/40
                                backdrop-blur-sm
                                sm:px-10
                                sm:py-12
                            "
                        >

                            <div
                                className="
                                    absolute
                                    left-5
                                    top-5
                                    h-3
                                    w-3
                                    rounded-full
                                    bg-blue-600
                                "
                            />


                            <div
                                className="
                                    absolute
                                    bottom-5
                                    right-5
                                    h-3
                                    w-3
                                    rounded-full
                                    bg-amber-400
                                "
                            />


                            <img
                                src={logo}
                                alt="ADELINA KOST"
                                className="
                                    relative
                                    z-10
                                    h-auto
                                    w-full
                                    max-w-[440px]
                                    object-contain
                                    drop-shadow-xl
                                "
                            />

                        </div>


                        {/* FLOATING LABEL */}

                        <div
                            className="
                                absolute
                                bottom-4
                                left-0
                                z-20
                                hidden
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                shadow-lg
                                sm:flex
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                "
                            >

                                <ShieldCheck size={18} />

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Nyaman & Aman
                                </p>

                                <p
                                    className="
                                        text-[11px]
                                        text-slate-500
                                    "
                                >
                                    Hunian untuk kebutuhan sehari-hari
                                </p>

                            </div>

                        </div>


                        {/* FLOATING LOCATION */}

                        <div
                            className="
                                absolute
                                right-0
                                top-8
                                z-20
                                hidden
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                shadow-lg
                                sm:flex
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-50
                                    text-emerald-600
                                "
                            >

                                <MapPin size={18} />

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Pekanbaru
                                </p>

                                <p
                                    className="
                                        text-[11px]
                                        text-slate-500
                                    "
                                >
                                    Lokasi strategis
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                KAMAR
            ===================================================== */}

            <section
                id="kamar"
                className="bg-white py-20"
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            justify-between
                            gap-5
                            md:flex-row
                            md:items-end
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                "
                            >
                                Pilihan kamar
                            </p>


                            <h2
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                Temukan kamar yang sesuai
                            </h2>


                            <p
                                className="
                                    mt-3
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-slate-500
                                    sm:text-base
                                "
                            >
                                Pilih kamar berdasarkan bangunan,
                                lantai, harga, dan ketersediaannya.
                            </p>

                        </div>


                        <Link
                            to="/kamar"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-blue-600
                                hover:text-blue-700
                            "
                        >
                            Lihat semua kamar
                            <ArrowRight size={16} />
                        </Link>

                    </div>


                    <div
                        className="
                            mt-10
                            grid
                            gap-6
                            md:grid-cols-2
                        "
                    >

                        {/* BANGUNAN 1 */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-6
                                transition
                                duration-200
                                hover:-translate-y-1
                                hover:border-blue-100
                                hover:bg-white
                                hover:shadow-lg
                            "
                        >

                            <div>

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-100
                                    "
                                >
                                    <BedDouble
                                        size={21}
                                        className="text-blue-600"
                                    />
                                </div>


                                <h3
                                    className="
                                        mt-5
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Bangunan 1
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-blue-600
                                    "
                                >
                                    ADELINA KOST 1
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    Pilihan kamar dari ADELINA KOST 1
                                </p>

                            </div>


                            <Link
                                to="/kamar?buildingId=1"
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    shadow-sm
                                    ring-1
                                    ring-slate-200
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                Lihat kamar
                                <ArrowRight size={15} />
                            </Link>

                        </div>


                        {/* BANGUNAN 2 */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-6
                                transition
                                duration-200
                                hover:-translate-y-1
                                hover:border-blue-100
                                hover:bg-white
                                hover:shadow-lg
                            "
                        >

                            <div>

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-100
                                    "
                                >
                                    <BedDouble
                                        size={21}
                                        className="text-blue-600"
                                    />
                                </div>


                                <h3
                                    className="
                                        mt-5
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Bangunan 2
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-blue-600
                                    "
                                >
                                    ADELINA KOST 2
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    Pilihan kamar dari ADELINA KOST 2
                                </p>

                            </div>


                            <Link
                                to="/kamar?buildingId=2"
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    shadow-sm
                                    ring-1
                                    ring-slate-200
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                Lihat kamar
                                <ArrowRight size={15} />
                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FASILITAS
            ===================================================== */}

            <section
                id="fasilitas"
                className="bg-slate-50 py-20"
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div className="max-w-2xl">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-blue-600
                            "
                        >
                            Fasilitas
                        </p>


                        <h2
                            className="
                                mt-2
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            Fasilitas untuk kebutuhan sehari-hari
                        </h2>


                        <p
                            className="
                                mt-3
                                text-sm
                                leading-6
                                text-slate-500
                                sm:text-base
                            "
                        >
                            ADELINA KOST menyediakan fasilitas
                            yang dirancang agar penghuni dapat
                            tinggal dengan nyaman.
                        </p>

                    </div>


                    <div
                        className="
                            mt-10
                            grid
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >

                        <Facility
                            icon={<BedDouble size={20} />}
                            title="Spring Bed"
                            description="Tempat tidur untuk kenyamanan penghuni."
                        />

                        <Facility
                            icon={<Shirt size={20} />}
                            title="Lemari"
                            description="Lemari untuk menyimpan pakaian dan barang pribadi."
                        />

                        <Facility
                            icon={<Wind size={20} />}
                            title="Kipas Angin"
                            description="Kipas angin untuk membantu menjaga sirkulasi udara."
                        />

                        <Facility
                            icon={<ShieldCheck size={20} />}
                            title="Kamar Mandi"
                            description="Kamar mandi pribadi untuk kebutuhan penghuni."
                        />

                        <Facility
                            icon={<Wifi size={20} />}
                            title="WiFi"
                            description="Internet untuk kebutuhan sehari-hari."
                        />

                        <Facility
                            icon={<CookingPot size={20} />}
                            title="Dapur Umum"
                            description="Area dapur umum yang dapat digunakan penghuni."
                        />

                        <Facility
                            icon={<Shirt size={20} />}
                            title="Area Jemuran"
                            description="Area jemuran untuk kebutuhan penghuni."
                        />

                        <Facility
                            icon={<Car size={20} />}
                            title="Area Parkir"
                            description="Area parkir untuk kendaraan penghuni."
                        />

                    </div>

                </div>

            </section>


            {/* =====================================================
                LOKASI
            ===================================================== */}

            <section
                id="lokasi"
                className="bg-white py-20"
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div className="max-w-3xl">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-blue-600
                            "
                        >
                            Lokasi
                        </p>


                        <h2
                            className="
                                mt-2
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            Dua lokasi untuk pilihanmu
                        </h2>


                        <p
                            className="
                                mt-4
                                text-sm
                                leading-7
                                text-slate-500
                                sm:text-base
                            "
                        >
                            ADELINA KOST memiliki dua bangunan
                            dengan lokasi yang berbeda. Pilih lokasi
                            bangunan yang paling sesuai dengan
                            kebutuhanmu.
                        </p>

                    </div>


                    <div
                        className="
                            mt-10
                            grid
                            gap-8
                            lg:grid-cols-2
                        "
                    >

                        {/* =================================================
                            BANGUNAN LAMA
                        ================================================= */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-7
                                shadow-sm
                                transition
                                hover:-translate-y-1
                                hover:shadow-lg
                                sm:p-8
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                "
                            >
                                <MapPin
                                    size={23}
                                    className="text-blue-600"
                                />
                            </div>


                            <p
                                className="
                                    mt-6
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-blue-600
                                "
                            >
                                Bangunan 1
                            </p>


                            <h3
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                ADELINA KOST 1
                            </h3>


                            <div
                                className="
                                    mt-6
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-slate-100
                                    bg-slate-50
                                    p-4
                                "
                            >

                                <NavigationIcon
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-blue-600
                                    "
                                />


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        JALAN SRIKANDI KOMPLEK WADYA GRAHA 1 BLOK MAWAR NO.41
                                        <br />
                                        Pekanbaru, Riau
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        Lihat lokasi lengkap
                                        melalui Google Maps.
                                    </p>

                                </div>

                            </div>


                            <a
                                href={GOOGLE_MAPS_BANGUNAN_LAMA}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-blue-700
                                "
                            >

                                <MapPin size={17} />

                                Buka di Google Maps

                                <ArrowRight size={16} />

                            </a>

                        </div>


                        {/* =================================================
                            BANGUNAN BARU
                        ================================================= */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-7
                                shadow-sm
                                transition
                                hover:-translate-y-1
                                hover:shadow-lg
                                sm:p-8
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                "
                            >
                                <MapPin
                                    size={23}
                                    className="text-blue-600"
                                />
                            </div>


                            <p
                                className="
                                    mt-6
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-blue-600
                                "
                            >
                                Bangunan 2
                            </p>


                            <h3
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                ADELINA KOST 2
                            </h3>


                            <div
                                className="
                                    mt-6
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-slate-100
                                    bg-slate-50
                                    p-4
                                "
                            >

                                <NavigationIcon
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-blue-600
                                    "
                                />


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        JALAN SRIKANDI KOMPLEK WADYA GRAHA 1 BLOK MAWAR NO.83
                                        <br />
                                        Pekanbaru, Riau
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        Lihat lokasi lengkap
                                        melalui Google Maps.
                                    </p>

                                </div>

                            </div>


                            <a
                                href={GOOGLE_MAPS_BANGUNAN_BARU}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-blue-700
                                "
                            >

                                <MapPin size={17} />

                                Buka di Google Maps

                                <ArrowRight size={16} />

                            </a>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                TENTANG
            ===================================================== */}

            <section
                id="tentang"
                className="
                    relative
                    overflow-hidden
                    bg-slate-950
                    py-20
                    text-white
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-72
                        w-72
                        -translate-x-1/2
                        rounded-full
                        bg-blue-600/10
                        blur-3xl
                    "
                />


                <div
                    className="
                        relative
                        mx-auto
                        max-w-4xl
                        px-4
                        text-center
                        sm:px-6
                        lg:px-8
                    "
                >

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-blue-400
                        "
                    >
                        Tentang ADELINA KOST
                    </p>


                    <h2
                        className="
                            mt-3
                            text-3xl
                            font-bold
                            tracking-tight
                            sm:text-4xl
                        "
                    >
                        Hunian sederhana, nyaman, dan terkelola dengan baik.
                    </h2>


                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-sm
                            leading-7
                            text-slate-400
                            sm:text-base
                        "
                    >
                        Kami menyediakan tempat tinggal yang nyaman
                        dengan fasilitas yang dibutuhkan untuk menunjang
                        aktivitas sehari-hari.
                    </p>


                    <Link
                        to="/kamar"
                        className="
                            mt-8
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-950/30
                            transition
                            hover:bg-blue-700
                        "
                    >
                        Cari Kamar
                        <ArrowRight size={17} />
                    </Link>

                </div>

            </section>

        </div>

    );

}


// =========================================================
// FEATURE ITEM
// =========================================================

function FeatureItem({ children }) {

    return (

        <div
            className="
                flex
                items-center
                gap-2.5
                text-sm
                text-slate-600
            "
        >

            <CheckCircle2
                size={17}
                className="
                    shrink-0
                    text-blue-600
                "
            />

            {children}

        </div>

    );

}


// =========================================================
// FACILITY COMPONENT
// =========================================================

function Facility({
    icon,
    title,
    description,
}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                duration-200
                hover:-translate-y-1
                hover:border-blue-100
                hover:shadow-lg
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
                    bg-blue-50
                    text-blue-600
                "
            >

                {icon}

            </div>


            <h3
                className="
                    mt-4
                    font-semibold
                    text-slate-800
                "
            >
                {title}
            </h3>


            <p
                className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-500
                "
            >
                {description}
            </p>

        </div>

    );

}


export default LandingPage;