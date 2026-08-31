import { useEffect, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    BedDouble,
    Building2,
    Layers3,
    CheckCircle2,
    ArrowLeft,
    Send,
    Loader2,
} from "lucide-react";

import { getRoomById } from "../../services/roomService";


// =====================================================
// TENANT ROOM APPLICATION
// =====================================================
//
// URL:
//
// /tenant/pengajuan-kamar?roomId=16
//
// Alur:
//
// Pilih kamar
//      ↓
// Halaman pengajuan kamar
//      ↓
// Klik Kirim Pengajuan
//      ↓
// POST /api/bookings
//      ↓
// Booking dibuat di database
//      ↓
// Dapat booking_id
//      ↓
// Pindah otomatis ke:
//
// /tenant/pembayaran-booking/:bookingId
//
// =====================================================


function TenantRoomApplication() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();


    // =====================================================
    // ROOM ID
    // =====================================================

    const roomId =
        searchParams.get("roomId");


    // =====================================================
    // STATE
    // =====================================================

    const [room, setRoom] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD ROOM
    // =====================================================

    useEffect(() => {

        const loadRoom = async () => {

            try {

                setLoading(true);

                setError("");


                // =================================================
                // CEK ROOM ID
                // =================================================

                if (!roomId) {

                    throw new Error(
                        "Kamar belum dipilih."
                    );

                }


                // =================================================
                // CEK TOKEN
                // =================================================

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    navigate("/login");

                    return;

                }


                // =================================================
                // AMBIL DATA KAMAR
                // =================================================

                const response =
                    await getRoomById(roomId);


                console.log(
                    "ROOM API RESPONSE:",
                    response
                );


                const roomData =
                    response?.data ??
                    response;


                if (!roomData) {

                    throw new Error(
                        "Data kamar tidak ditemukan."
                    );

                }


                // =================================================
                // CEK STATUS KAMAR
                // =================================================

                const roomStatus =
                    String(
                        roomData.status || ""
                    ).toLowerCase();


                if (
                    roomStatus !== "available" &&
                    roomStatus !== "tersedia"
                ) {

                    throw new Error(
                        "Kamar sudah tidak tersedia."
                    );

                }


                // =================================================
                // SIMPAN ROOM
                // =================================================

                setRoom(
                    roomData
                );


            } catch (error) {

                console.error(
                    "Tenant Room Application Error:",
                    error
                );


                setError(
                    error.message ||
                    "Gagal mengambil data kamar."
                );


            } finally {

                setLoading(false);

            }

        };


        loadRoom();

    }, [
        roomId,
        navigate,
    ]);


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice = (
        price
    ) => {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }
        ).format(
            Number(price) || 0
        );

    };


    // =====================================================
    // SUBMIT BOOKING
    // =====================================================

    const handleSubmit =
        async () => {

            try {

                setSubmitting(true);

                setError("");


                // =================================================
                // CEK TOKEN
                // =================================================

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    navigate(
                        "/login"
                    );

                    return;

                }


                // =================================================
                // CEK ROOM
                // =================================================

                if (!roomId) {

                    throw new Error(
                        "Kamar belum dipilih."
                    );

                }


                // =================================================
                // CEK DATA ROOM
                // =================================================

                if (!room) {

                    throw new Error(
                        "Data kamar belum tersedia."
                    );

                }


                // =================================================
                // REQUEST CREATE BOOKING
                // =================================================

                console.log(
                    "CREATE BOOKING ROOM ID:",
                    roomId
                );


                const response =
                    await fetch(
                        "http://localhost:5000/api/bookings",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,

                            },

                            body:
                                JSON.stringify({

                                    room_id:
                                        Number(roomId),

                                }),

                        }
                    );


                // =================================================
                // AMBIL RESPONSE
                // =================================================

                const data =
                    await response.json();


                console.log(
                    "CREATE BOOKING RESPONSE:",
                    data
                );


                // =================================================
                // CEK ERROR BACKEND
                // =================================================

                if (
                    !response.ok ||
                    !data?.success
                ) {

                    throw new Error(
                        data?.message ||
                        "Gagal mengirim pengajuan kamar."
                    );

                }


                // =================================================
                // AMBIL DATA BOOKING
                // =================================================

                const bookingData =
                    data?.data;


                console.log(
                    "BOOKING DATA:",
                    bookingData
                );


                // =================================================
                // AMBIL BOOKING ID
                // =================================================
                //
                // Kita dukung beberapa kemungkinan response:
                //
                // data.data.id
                // data.data.booking_id
                // data.booking_id
                //
                // =================================================

                const newBookingId =
                    bookingData?.id ??
                    bookingData?.booking_id ??
                    data?.booking_id;


                console.log(
                    "NEW BOOKING ID:",
                    newBookingId
                );


                // =================================================
                // CEK BOOKING ID
                // =================================================

                if (!newBookingId) {

                    throw new Error(
                        "Pengajuan berhasil dibuat, tetapi Booking ID tidak diterima dari server."
                    );

                }


                // =================================================
                // PINDAH KE PEMBAYARAN
                // =================================================
                //
                // CONTOH:
                //
                // /tenant/pembayaran-booking/15
                //
                // =================================================

                navigate(
                    `/tenant/pembayaran-booking/${newBookingId}`
                );


            } catch (error) {

                console.error(
                    "Submit Booking Error:",
                    error
                );


                setError(
                    error.message ||
                    "Gagal mengirim pengajuan kamar."
                );


            } finally {

                setSubmitting(false);

            }

        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div className="flex min-h-[70vh] items-center justify-center">

                    <div className="text-center">

                        <Loader2
                            size={40}
                            className="mx-auto animate-spin text-blue-600"
                        />

                        <p className="mt-4 text-sm font-medium text-slate-600">

                            Memuat informasi kamar...

                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && !room) {

        return (

            <div className="min-h-screen bg-slate-50 px-4 py-12">

                <div className="mx-auto max-w-xl">

                    <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">

                        <div className="text-5xl">
                            ⚠️
                        </div>


                        <h1 className="mt-4 text-xl font-bold text-red-700">

                            Pengajuan Tidak Dapat Dilanjutkan

                        </h1>


                        <p className="mt-2 text-sm leading-6 text-red-600">

                            {error}

                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/kamar")
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Kembali ke Kamar

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/kamar/${room.id}`
                        )
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                >

                    <ArrowLeft
                        size={17}
                    />

                    Kembali ke detail kamar

                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mt-6">

                    <p className="text-sm font-bold text-blue-600">

                        ADELINA KOST

                    </p>


                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">

                        Pengajuan Kamar

                    </h1>


                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

                        Periksa kembali informasi kamar
                        sebelum mengirim pengajuan kepada
                        pengelola.

                    </p>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">


                    {/* =================================================
                        ROOM INFORMATION
                    ================================================= */}

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


                        {/* ROOM PREVIEW */}

                        <div className="flex h-64 items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100">

                            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white text-7xl shadow-sm">

                                🛏️

                            </div>

                        </div>


                        <div className="p-7">


                            {/* ROOM */}

                            <div>

                                <p className="text-sm font-semibold text-blue-600">

                                    {room.building_name ||
                                        "ADELINA KOST"}

                                </p>


                                <h2 className="mt-1 text-3xl font-bold text-slate-900">

                                    Kamar{" "}
                                    {room.room_number}

                                </h2>

                            </div>


                            {/* LOCATION */}

                            <div className="mt-6 space-y-4">


                                {/* BUILDING */}

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                        <Building2
                                            size={19}
                                        />

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-400">

                                            Bangunan

                                        </p>


                                        <p className="text-sm font-semibold text-slate-700">

                                            {room.building_name ||
                                                "-"}

                                        </p>

                                    </div>

                                </div>


                                {/* FLOOR */}

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                        <Layers3
                                            size={19}
                                        />

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-400">

                                            Lantai

                                        </p>


                                        <p className="text-sm font-semibold text-slate-700">

                                            {room.floor_name ||
                                                "Informasi lantai belum tersedia"}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* PRICE */}

                            <div className="mt-7 rounded-2xl bg-slate-50 p-5">

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                    Harga sewa

                                </p>


                                <div className="mt-1 flex items-baseline gap-2">

                                    <span className="text-2xl font-bold text-slate-900">

                                        {formatPrice(
                                            room.price
                                        )}

                                    </span>


                                    <span className="text-sm text-slate-400">

                                        / bulan

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        CONFIRMATION
                    ================================================= */}

                    <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">


                        {/* HEADER */}

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                <Send
                                    size={20}
                                />

                            </div>


                            <div>

                                <h2 className="font-bold text-slate-900">

                                    Konfirmasi Pengajuan

                                </h2>


                                <p className="text-xs text-slate-500">

                                    Pastikan kamar sudah sesuai

                                </p>

                            </div>

                        </div>


                        {/* SUMMARY */}

                        <div className="mt-6 space-y-4">


                            {/* ROOM */}

                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                                <span className="text-sm text-slate-500">

                                    Kamar

                                </span>


                                <span className="text-sm font-bold text-slate-800">

                                    {room.room_number}

                                </span>

                            </div>


                            {/* PRICE */}

                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                                <span className="text-sm text-slate-500">

                                    Harga

                                </span>


                                <span className="text-sm font-bold text-slate-800">

                                    {formatPrice(
                                        room.price
                                    )}

                                </span>

                            </div>


                            {/* STATUS */}

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">

                                    Status

                                </span>


                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">

                                    <CheckCircle2
                                        size={13}
                                    />

                                    Tersedia

                                </span>

                            </div>

                        </div>


                        {/* INFO */}

                        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                            <p className="text-xs leading-5 text-amber-700">

                                Setelah pengajuan dikirim,
                                Anda akan diarahkan ke halaman
                                pembayaran booking. Pengelola
                                akan melakukan verifikasi setelah
                                pembayaran dikirim.

                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                                <p className="text-sm font-medium text-red-700">

                                    {error}

                                </p>

                            </div>

                        )}


                        {/* SUBMIT */}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {submitting ? (

                                <>

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Membuat Booking...

                                </>

                            ) : (

                                <>

                                    <Send
                                        size={17}
                                    />

                                    Kirim Pengajuan

                                </>

                            )}

                        </button>


                        <p className="mt-3 text-center text-xs leading-5 text-slate-400">

                            Dengan mengirim pengajuan,
                            Anda menyatakan bahwa informasi
                            yang diberikan benar.

                        </p>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default TenantRoomApplication;