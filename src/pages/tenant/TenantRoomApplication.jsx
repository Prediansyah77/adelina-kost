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
    CreditCard,
    Loader2,
} from "lucide-react";

import { getRoomById } from "../../services/roomService";


// =====================================================
// TENANT ROOM APPLICATION
// =====================================================
//
// URL:
//
// DP:
// /tenant/pengajuan-kamar?roomId=16&paymentType=dp
//
// FULL:
// /tenant/pengajuan-kamar?roomId=16&paymentType=full
//
// ALUR:
//
// Pilih kamar
//      ↓
// Halaman pengajuan kamar
//      ↓
// Pilih metode pembayaran
//      ↓
// Halaman pembayaran
//      ↓
// User upload bukti pembayaran
//      ↓
// Submit pembayaran
//      ↓
// BARU backend membuat booking
//
// PENTING:
//
// File ini TIDAK membuat booking.
//
// Tidak ada:
//      POST /api/bookings
//
// Booking baru dibuat oleh backend ketika
// pembayaran benar-benar disubmit.
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
    // PAYMENT TYPE
    // =====================================================
    //
    // dp   = pembayaran DP
    // full = pembayaran penuh tanpa DP
    //
    // Default kita gunakan "dp" agar URL lama
    // tetap bisa berjalan.
    //
    // =====================================================

    const paymentType =
        String(
            searchParams.get("paymentType") || "dp"
        ).toLowerCase();


    const isFullPayment =
        paymentType === "full";


    const isDpPayment =
        paymentType === "dp";


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


                // =============================================
                // CEK ROOM ID
                // =============================================

                if (!roomId) {

                    throw new Error(
                        "Kamar belum dipilih."
                    );

                }


                // =============================================
                // CEK PAYMENT TYPE
                // =============================================

                if (
                    !isDpPayment &&
                    !isFullPayment
                ) {

                    throw new Error(
                        "Metode pembayaran tidak valid."
                    );

                }


                // =============================================
                // CEK TOKEN
                // =============================================

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


                // =============================================
                // AMBIL DATA KAMAR
                // =============================================

                const response =
                    await getRoomById(
                        roomId
                    );


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


                // =============================================
                // CEK STATUS KAMAR
                // =============================================

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


                // =============================================
                // SIMPAN ROOM
                // =============================================

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
        isDpPayment,
        isFullPayment,
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
    // PAYMENT INFORMATION
    // =====================================================

    const paymentTitle =
        isFullPayment
            ? "Pembayaran Penuh"
            : "Pembayaran DP";


    const paymentSubtitle =
        isFullPayment
            ? "Lanjutkan ke pembayaran penuh"
            : "Lanjutkan ke pembayaran DP";


    const paymentButtonText =
        isFullPayment
            ? "Lanjut ke Pembayaran Penuh"
            : "Lanjut ke Pembayaran DP";


    // =====================================================
    // LANJUT KE PEMBAYARAN
    // =====================================================
    //
    // PENTING:
    //
    // TIDAK ADA POST /api/bookings DI SINI.
    //
    // Kita hanya membawa:
    //
    // - roomId
    // - paymentType
    //
    // ke halaman pembayaran.
    //
    // Booking baru dibuat ketika user benar-benar
    // mengirim pembayaran.
    //
    // =====================================================

    const handleContinueToPayment = () => {

        try {

            setSubmitting(true);
            setError("");

            // =============================================
            // CEK TOKEN
            // =============================================

            const token =
                localStorage.getItem("token");

            if (!token) {

                navigate("/login");

                return;

            }


            // =============================================
            // CEK ROOM ID
            // =============================================

            if (!roomId) {

                throw new Error(
                    "Kamar belum dipilih."
                );

            }


            // =============================================
            // CEK DATA ROOM
            // =============================================

            if (!room) {

                throw new Error(
                    "Data kamar belum tersedia."
                );

            }


            // =============================================
            // CEK STATUS ROOM
            // =============================================

            const roomStatus =
                String(
                    room.status || ""
                ).toLowerCase();

            if (
                roomStatus !== "available" &&
                roomStatus !== "tersedia"
            ) {

                throw new Error(
                    "Kamar sudah tidak tersedia."
                );

            }


            // =============================================
            // PEMBAYARAN FULL / TANPA DP
            // =============================================

            if (isFullPayment) {

                navigate(
                    `/tenant/pembayaran-full?roomId=${roomId}`
                );

                return;

            }


            // =============================================
            // PEMBAYARAN DP
            // =============================================

            navigate(
                `/tenant/pembayaran-booking?roomId=${roomId}&paymentType=dp`
            );

        } catch (error) {

            console.error(
                "Continue Payment Error:",
                error
            );

            setError(
                error.message ||
                "Gagal melanjutkan ke pembayaran."
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

    if (
        error &&
        !room
    ) {

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
                        sebelum melanjutkan ke pembayaran.

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

                                <BedDouble
                                    size={76}
                                    className="text-blue-500"
                                />

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

                                <CreditCard
                                    size={20}
                                />

                            </div>


                            <div>

                                <h2 className="font-bold text-slate-900">

                                    {paymentTitle}

                                </h2>


                                <p className="text-xs text-slate-500">

                                    {paymentSubtitle}

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
                                    Harga sewa
                                </span>


                                <span className="text-sm font-bold text-slate-800">

                                    {formatPrice(
                                        room.price
                                    )}

                                </span>

                            </div>


                            {/* PAYMENT TYPE */}

                            {isDpPayment ? (

                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                                    <span className="text-sm text-slate-500">
                                        DP Booking
                                    </span>


                                    <span className="text-sm font-bold text-blue-600">

                                        Rp25.000

                                    </span>

                                </div>

                            ) : (

                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                                    <span className="text-sm text-slate-500">
                                        Pembayaran
                                    </span>


                                    <span className="text-sm font-bold text-blue-600">

                                        {formatPrice(
                                            room.price
                                        )}

                                    </span>

                                </div>

                            )}


                            {/* STATUS */}

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Status kamar
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

                        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                            {isDpPayment ? (

                                <p className="text-xs leading-5 text-blue-700">

                                    Belum ada booking yang dibuat.
                                    Booking baru akan tercatat setelah
                                    Anda mengirim pembayaran DP dan
                                    bukti pembayaran berhasil dikirim.

                                </p>

                            ) : (

                                <p className="text-xs leading-5 text-blue-700">

                                    Belum ada booking yang dibuat.
                                    Booking baru akan tercatat setelah
                                    Anda mengirim pembayaran penuh dan
                                    bukti pembayaran berhasil dikirim.

                                </p>

                            )}

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                                <p className="text-sm font-medium text-red-700">

                                    {error}

                                </p>

                            </div>

                        )}


                        {/* CONTINUE */}

                        <button
                            type="button"
                            onClick={
                                handleContinueToPayment
                            }
                            disabled={submitting}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {submitting ? (

                                <>

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Membuka Pembayaran...

                                </>

                            ) : (

                                <>

                                    <CreditCard
                                        size={17}
                                    />

                                    {paymentButtonText}

                                </>

                            )}

                        </button>


                        {/* NOTE */}

                        <p className="mt-3 text-center text-xs leading-5 text-slate-400">

                            Booking belum dibuat pada tahap ini.
                            Booking hanya akan dibuat setelah
                            pembayaran benar-benar dikirim.

                        </p>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default TenantRoomApplication;