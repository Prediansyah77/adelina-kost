import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicRooms } from "../../services/roomService";

function PublicRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // AMBIL DATA KAMAR
    // =====================================================

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getPublicRooms();

                /*
                 * Bisa menerima:
                 *
                 * 1. Array langsung
                 * 2. Object { success: true, data: [] }
                 *
                 * Dibuat aman agar rooms selalu berupa array.
                 */

                const roomData = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

                setRooms(roomData);

            } catch (error) {
                console.error(
                    "Public Rooms Error:",
                    error
                );

                setError(
                    error.message ||
                    "Gagal mengambil data kamar"
                );

            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, []);


    // =====================================================
    // FORMAT HARGA
    // =====================================================

    const formatPrice = (price) => {
        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }
        ).format(price);
    };


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {
        if (status === "available") {
            return "Tersedia";
        }

        if (status === "occupied") {
            return "Terisi";
        }

        if (status === "inactive") {
            return "Tidak Aktif";
        }

        return status;
    };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusClass = (status) => {
        if (status === "available") {
            return "bg-emerald-100 text-emerald-700";
        }

        if (status === "occupied") {
            return "bg-red-100 text-red-700";
        }

        return "bg-slate-200 text-slate-600";
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                    <div className="flex min-h-[400px] items-center justify-center">

                        <div className="text-center">

                            <div
                                className="
                                    mx-auto
                                    h-10
                                    w-10
                                    animate-spin
                                    rounded-full
                                    border-4
                                    border-slate-200
                                    border-t-blue-600
                                "
                            />

                            <p className="mt-4 text-sm text-slate-500">
                                Memuat data kamar...
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                    <div
                        className="
                            mx-auto
                            max-w-xl
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-8
                            text-center
                        "
                    >

                        <div className="text-4xl">
                            ⚠️
                        </div>

                        <h2
                            className="
                                mt-4
                                text-xl
                                font-bold
                                text-red-700
                            "
                        >
                            Gagal Memuat Kamar
                        </h2>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-red-600
                            "
                        >
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="
                                mt-6
                                rounded-xl
                                bg-red-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-red-700
                            "
                        >
                            Coba Lagi
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // HALAMAN UTAMA
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                HERO / HEADER
            ================================================= */}

            <section
                className="
                    border-b
                    border-slate-200
                    bg-white
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        py-12
                        sm:px-6
                        sm:py-16
                        lg:px-8
                    "
                >

                    <div className="max-w-3xl">

                        {/* BADGE */}

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-blue-100
                                bg-blue-50
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-blue-600
                            "
                        >
                            <span>
                                🏠
                            </span>

                            <span>
                                Kamar ADELINA KOST
                            </span>

                        </div>


                        {/* TITLE */}

                        <h1
                            className="
                                mt-5
                                text-4xl
                                font-bold
                                tracking-tight
                                text-slate-900
                                sm:text-5xl
                            "
                        >
                            Pilih Kamar
                            <span className="text-blue-600">
                                {" "}yang Sesuai
                            </span>
                        </h1>


                        {/* DESCRIPTION */}

                        <p
                            className="
                                mt-4
                                max-w-2xl
                                text-base
                                leading-7
                                text-slate-500
                                sm:text-lg
                            "
                        >
                            Temukan kamar kos yang nyaman
                            dan sesuai kebutuhanmu di
                            ADELINA KOST. Informasi kamar
                            diperbarui berdasarkan data
                            terbaru.
                        </p>


                        {/* SUMMARY */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-wrap
                                gap-3
                            "
                        >

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                "
                            >

                                <p className="text-xs text-slate-400">
                                    Total Kamar
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-lg
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    {rooms.length}
                                </p>

                            </div>


                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-emerald-100
                                    bg-emerald-50
                                    px-4
                                    py-3
                                "
                            >

                                <p className="text-xs text-emerald-600">
                                    Tersedia
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-lg
                                        font-bold
                                        text-emerald-700
                                    "
                                >
                                    {
                                        rooms.filter(
                                            (room) =>
                                                room.status ===
                                                "available"
                                        ).length
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                ROOM LIST
            ================================================= */}

            <section
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-10
                    sm:px-6
                    sm:py-12
                    lg:px-8
                "
            >

                {/* SECTION TITLE */}

                <div
                    className="
                        mb-7
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Daftar Kamar
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Pilih kamar yang sesuai
                            dengan kebutuhanmu.
                        </p>

                    </div>


                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-400
                        "
                    >
                        {rooms.length} kamar
                    </p>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {rooms.length === 0 ? (

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-12
                            text-center
                            shadow-sm
                        "
                    >

                        <div className="text-5xl">
                            🏠
                        </div>

                        <h2
                            className="
                                mt-4
                                text-xl
                                font-bold
                                text-slate-800
                            "
                        >
                            Belum Ada Data Kamar
                        </h2>

                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Data kamar belum tersedia
                            untuk saat ini.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       ROOM GRID
                    ================================================= */

                    <div
                        className="
                            grid
                            gap-6
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {rooms.map((room) => (

                            <article
                                key={room.id}
                                className="
                                    group
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-sm
                                    transition
                                    duration-300
                                    hover:-translate-y-1
                                    hover:shadow-xl
                                "
                            >

                                {/* =================================================
                                    ROOM IMAGE
                                ================================================= */}

                                <div
                                    className="
                                        relative
                                        flex
                                        h-56
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        bg-gradient-to-br
                                        from-blue-50
                                        via-slate-50
                                        to-slate-100
                                    "
                                >

                                    {/* DECORATION */}

                                    <div
                                        className="
                                            absolute
                                            -right-10
                                            -top-10
                                            h-32
                                            w-32
                                            rounded-full
                                            bg-blue-100
                                            opacity-60
                                            blur-2xl
                                        "
                                    />

                                    <div
                                        className="
                                            absolute
                                            -bottom-10
                                            -left-10
                                            h-32
                                            w-32
                                            rounded-full
                                            bg-indigo-100
                                            opacity-60
                                            blur-2xl
                                        "
                                    />


                                    {/* BED ICON */}

                                    <div
                                        className="
                                            relative
                                            text-7xl
                                            transition
                                            duration-300
                                            group-hover:scale-110
                                        "
                                    >
                                        🛏️
                                    </div>


                                    {/* STATUS */}

                                    <div
                                        className="
                                            absolute
                                            right-4
                                            top-4
                                        "
                                    >

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                rounded-full
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-bold
                                                shadow-sm
                                                ${getStatusClass(
                                                room.status
                                            )}
                                            `}
                                        >

                                            {getStatusLabel(
                                                room.status
                                            )}

                                        </span>

                                    </div>

                                </div>


                                {/* =================================================
                                    ROOM CONTENT
                                ================================================= */}

                                <div className="p-6">

                                    {/* BUILDING */}

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-blue-600
                                        "
                                    >
                                        {room.building_name ||
                                            "ADELINA KOST"}
                                    </p>


                                    {/* ROOM NUMBER */}

                                    <h3
                                        className="
                                            mt-1
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                        "
                                    >
                                        Kamar{" "}
                                        {room.room_number}
                                    </h3>


                                    {/* FLOOR */}

                                    {room.floor_name ? (

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-slate-500
                                            "
                                        >

                                            <span>
                                                📍
                                            </span>

                                            <span>
                                                {room.floor_name}
                                            </span>

                                        </div>

                                    ) : (

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-slate-400
                                            "
                                        >

                                            <span>
                                                🏢
                                            </span>

                                            <span>
                                                Informasi lantai
                                                belum tersedia
                                            </span>

                                        </div>

                                    )}


                                    {/* DIVIDER */}

                                    <div
                                        className="
                                            my-5
                                            border-t
                                            border-slate-100
                                        "
                                    />


                                    {/* PRICE */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                            "
                                        >
                                            Harga sewa
                                        </p>

                                        <div
                                            className="
                                                mt-1
                                                flex
                                                items-baseline
                                                gap-1
                                            "
                                        >

                                            <span
                                                className="
                                                    text-xl
                                                    font-bold
                                                    text-slate-900
                                                "
                                            >
                                                {formatPrice(
                                                    room.price
                                                )}
                                            </span>

                                            <span
                                                className="
                                                    text-sm
                                                    text-slate-400
                                                "
                                            >
                                                / bulan
                                            </span>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        ACTION
                                    ================================================= */}

                                    <div className="mt-6">

                                        {room.status ===
                                            "available" ? (

                                            <Link
                                                to={`/kamar/${room.id}`}
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    bg-blue-600
                                                    px-5
                                                    py-3
                                                    text-sm
                                                    font-bold
                                                    text-white
                                                    shadow-sm
                                                    transition
                                                    hover:bg-blue-700
                                                    hover:shadow-md
                                                "
                                            >

                                                <span>
                                                    Lihat Detail
                                                </span>

                                                <span
                                                    className="
                                                        transition
                                                        duration-200
                                                        group-hover:translate-x-1
                                                    "
                                                >
                                                    →
                                                </span>

                                            </Link>

                                        ) : (

                                            <button
                                                disabled
                                                className="
                                                    flex
                                                    w-full
                                                    cursor-not-allowed
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-slate-100
                                                    px-5
                                                    py-3
                                                    text-sm
                                                    font-semibold
                                                    text-slate-400
                                                "
                                            >
                                                Kamar Tidak Tersedia
                                            </button>

                                        )}

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}


export default PublicRooms;