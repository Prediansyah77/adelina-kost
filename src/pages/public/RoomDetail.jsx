import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRoomById } from "../../services/roomService";


// =====================================================
// ROOM DETAIL
// =====================================================

function RoomDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // AMBIL DETAIL KAMAR
    // =====================================================

    useEffect(() => {

        const loadRoom = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getRoomById(id);


                /*
                 * Bisa menerima:
                 *
                 * 1. { success: true, data: {...} }
                 * 2. object kamar langsung
                 */

                const roomData =
                    response?.data ?? response;


                if (!roomData) {

                    throw new Error(
                        "Data kamar tidak ditemukan"
                    );

                }


                setRoom(roomData);

            } catch (error) {

                console.error(
                    "Room Detail Error:",
                    error
                );

                setError(
                    error.message ||
                    "Gagal mengambil detail kamar"
                );

            } finally {

                setLoading(false);

            }

        };


        loadRoom();

    }, [id]);


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

        return status || "-";

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
    // PESAN KAMAR
    // =====================================================
    //
    // ALUR:
    //
    // Belum login
    //      ↓
    // /login
    //
    // Sudah login
    //      ↓
    // /tenant/pengajuan-kamar?roomId=...
    //
    // =====================================================

    const handlePesanKamar = () => {

        const token =
            localStorage.getItem("token");

        const userStorage =
            localStorage.getItem("user");


        // =================================================
        // BELUM LOGIN
        // =================================================

        if (!token || !userStorage) {

            navigate("/login");

            return;

        }


        // =================================================
        // SUDAH LOGIN
        // =================================================

        navigate(
            `/tenant/pengajuan-kamar?roomId=${room.id}`
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div
                    className="
                        mx-auto
                        flex
                        min-h-[70vh]
                        max-w-7xl
                        items-center
                        justify-center
                        px-4
                    "
                >

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

                        <p
                            className="
                                mt-4
                                text-sm
                                text-slate-500
                            "
                        >
                            Memuat detail kamar...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !room) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div
                    className="
                        mx-auto
                        max-w-3xl
                        px-4
                        py-16
                        sm:px-6
                    "
                >

                    <div
                        className="
                            rounded-3xl
                            border
                            border-red-200
                            bg-red-50
                            p-8
                            text-center
                        "
                    >

                        <div className="text-5xl">
                            ⚠️
                        </div>


                        <h1
                            className="
                                mt-4
                                text-2xl
                                font-bold
                                text-red-700
                            "
                        >
                            Kamar Tidak Ditemukan
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-red-600
                            "
                        >
                            {error ||
                                "Data kamar tidak tersedia."}
                        </p>


                        <Link
                            to="/kamar"
                            className="
                                mt-6
                                inline-flex
                                items-center
                                justify-center
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
                            "
                        >
                            ← Kembali ke Daftar Kamar
                        </Link>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // DETAIL KAMAR
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* =================================================
                MAIN
            ================================================= */}

            <main
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >


                {/* =================================================
                    BACK
                ================================================= */}

                <Link
                    to="/kamar"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-slate-500
                        transition
                        hover:text-blue-600
                    "
                >
                    ← Kembali ke daftar kamar
                </Link>


                {/* =================================================
                    DETAIL CARD
                ================================================= */}

                <div
                    className="
                        mt-6
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            grid
                            lg:grid-cols-2
                        "
                    >


                        {/* =================================================
                            IMAGE / ROOM PREVIEW
                        ================================================= */}

                        <div
                            className="
                                relative
                                flex
                                min-h-[380px]
                                items-center
                                justify-center
                                bg-gradient-to-br
                                from-blue-50
                                via-slate-50
                                to-slate-100
                                lg:min-h-[620px]
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-40
                                    w-40
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    bg-white
                                    text-8xl
                                    shadow-sm
                                "
                            >
                                🛏️
                            </div>


                            {/* STATUS */}

                            <div
                                className="
                                    absolute
                                    right-6
                                    top-6
                                "
                            >

                                <span
                                    className={`
                                        inline-flex
                                        rounded-full
                                        px-4
                                        py-2
                                        text-sm
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
                            CONTENT
                        ================================================= */}

                        <div
                            className="
                                flex
                                flex-col
                                p-8
                                sm:p-10
                            "
                        >


                            {/* =================================================
                                BUILDING
                            ================================================= */}

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-blue-600
                                "
                            >
                                {room.building_name ||
                                    "ADELINA KOST"}
                            </p>


                            {/* =================================================
                                ROOM NAME
                            ================================================= */}

                            <h1
                                className="
                                    mt-2
                                    text-4xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                Kamar{" "}
                                {room.room_number}
                            </h1>


                            {/* =================================================
                                LOCATION
                            ================================================= */}

                            <div
                                className="
                                    mt-6
                                    space-y-3
                                "
                            >

                                {/* BANGUNAN */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-blue-50
                                            text-base
                                        "
                                    >
                                        🏢
                                    </span>

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Bangunan
                                        </p>

                                        <p
                                            className="
                                                font-medium
                                                text-slate-700
                                            "
                                        >
                                            {room.building_name ||
                                                "Bangunan belum tersedia"}
                                        </p>

                                    </div>

                                </div>


                                {/* LANTAI */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-blue-50
                                            text-base
                                        "
                                    >
                                        📍
                                    </span>

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Lantai
                                        </p>

                                        <p
                                            className="
                                                font-medium
                                                text-slate-700
                                            "
                                        >
                                            {room.floor_name ||
                                                "Informasi lantai belum tersedia"}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                PRICE
                            ================================================= */}

                            <div
                                className="
                                    mt-8
                                    rounded-2xl
                                    bg-slate-50
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
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
                                        gap-2
                                    "
                                >

                                    <p
                                        className="
                                            text-3xl
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        {formatPrice(
                                            room.price
                                        )}
                                    </p>

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
                                FACILITIES
                            ================================================= */}

                            <div className="mt-8">

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Fasilitas
                                </h2>


                                <div
                                    className="
                                        mt-4
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >


                                    {/* SPRING BED */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            🛏️
                                        </span>

                                        <span>
                                            Spring Bed
                                        </span>

                                    </div>


                                    {/* KIPAS */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            🌀
                                        </span>

                                        <span>
                                            Kipas Angin
                                        </span>

                                    </div>


                                    {/* KAMAR MANDI */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            🚿
                                        </span>

                                        <span>
                                            Kamar Mandi
                                        </span>

                                    </div>


                                    {/* WIFI */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            📶
                                        </span>

                                        <span>
                                            WiFi
                                        </span>

                                    </div>


                                    {/* LEMARI */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            🗄️
                                        </span>

                                        <span>
                                            Lemari
                                        </span>

                                    </div>


                                    {/* DAPUR UMUM */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            🍳
                                        </span>

                                        <span>
                                            Dapur Umum
                                        </span>

                                    </div>


                                    {/* AREA PARKIR */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            🅿️
                                        </span>

                                        <span>
                                            Area Parkir
                                        </span>

                                    </div>


                                    {/* JEMURAN */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        <span>
                                            👕
                                        </span>

                                        <span>
                                            Area Jemuran
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                ACTION
                            ================================================= */}

                            <div className="mt-8">

                                {room.status ===
                                    "available" ? (

                                    <button
                                        type="button"
                                        onClick={handlePesanKamar}
                                        className="
                                            w-full
                                            rounded-xl
                                            bg-blue-600
                                            px-5
                                            py-3.5
                                            text-sm
                                            font-bold
                                            text-white
                                            shadow-sm
                                            transition
                                            hover:bg-blue-700
                                            hover:shadow-md
                                        "
                                    >
                                        Pesan Kamar
                                    </button>

                                ) : (

                                    <div
                                        className="
                                            w-full
                                            rounded-xl
                                            bg-slate-100
                                            px-5
                                            py-3.5
                                            text-center
                                            text-sm
                                            font-semibold
                                            text-slate-400
                                        "
                                    >
                                        Kamar sedang tidak tersedia
                                    </div>

                                )}

                            </div>


                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default RoomDetail;