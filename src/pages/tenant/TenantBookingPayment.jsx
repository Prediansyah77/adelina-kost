import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    User,
    Phone,
    CreditCard,
    Building2,
    Layers3,
    CalendarDays,
    Upload,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    Wallet,
} from "lucide-react";



// =====================================================
// TENANT BOOKING PAYMENT
// =====================================================
//
// URL:
//
// /tenant/pembayaran-booking/:bookingId
//
// Alur:
//
// Pengajuan kamar
//       ↓
// Booking dibuat
//       ↓
// bookingId
//       ↓
// Halaman pembayaran booking
//       ↓
// Data tenant otomatis dari database
//       ↓
// Data kamar otomatis dari database
//       ↓
// Pilih 1 - 7 hari
//       ↓
// Hitung total pembayaran
//       ↓
// Upload bukti pembayaran
//       ↓
// POST /api/payments/booking
//
// Rumus:
//
// harga kamar / 30 × lama booking
//
// =====================================================



function TenantBookingPayment() {

    const navigate =
        useNavigate();


    const { bookingId } =
        useParams();



    // =====================================================
    // STATE
    // =====================================================

    const [booking, setBooking] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [submitting, setSubmitting] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState(false);



    // =====================================================
    // LAMA BOOKING
    // =====================================================

    const [bookingDays, setBookingDays] =
        useState(1);



    // =====================================================
    // FILE BUKTI PEMBAYARAN
    // =====================================================

    const [proofFile, setProofFile] =
        useState(null);


    const [fileName, setFileName] =
        useState("");



    // =====================================================
    // LOAD BOOKING
    // =====================================================

    useEffect(() => {

        const loadBooking =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    // =========================================
                    // CEK BOOKING ID
                    // =========================================

                    if (!bookingId) {

                        throw new Error(
                            "Booking ID tidak ditemukan."
                        );

                    }


                    // =========================================
                    // TOKEN
                    // =========================================

                    const token =
                        localStorage.getItem(
                            "token"
                        );


                    if (!token) {

                        navigate("/login");

                        return;

                    }


                    // =========================================
                    // REQUEST BOOKING
                    // =========================================

                    console.log(
                        "BOOKING ID:",
                        bookingId
                    );


                    const response =
                        await fetch(
                            `http://localhost:5000/api/bookings/${bookingId}`,
                            {
                                method: "GET",

                                headers: {

                                    Authorization:
                                        `Bearer ${token}`,

                                    "Content-Type":
                                        "application/json",

                                },

                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "BOOKING RESPONSE:",
                        data
                    );


                    // =========================================
                    // CEK RESPONSE
                    // =========================================

                    if (
                        !response.ok ||
                        !data?.success
                    ) {

                        throw new Error(
                            data?.message ||
                            "Gagal mengambil data booking."
                        );

                    }


                    // =========================================
                    // DATA BOOKING
                    // =========================================

                    if (!data?.data) {

                        throw new Error(
                            "Data booking tidak ditemukan."
                        );

                    }


                    setBooking(
                        data.data
                    );


                } catch (error) {

                    console.error(
                        "Load Booking Error:",
                        error
                    );


                    setError(
                        error.message ||
                        "Gagal mengambil data booking."
                    );


                } finally {

                    setLoading(false);

                }

            };


        loadBooking();

    }, [
        bookingId,
        navigate,
    ]);



    // =====================================================
    // FORMAT RUPIAH
    // =====================================================

    const formatPrice =
        (price) => {

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
    // DATA TENANT
    // =====================================================

    const tenant =
        booking?.tenant || {};



    // =====================================================
    // DATA ROOM
    // =====================================================

    const room =
        booking?.room || {};



    // =====================================================
    // HARGA KAMAR
    // =====================================================

    const roomPrice =
        Number(
            room?.price ??
            booking?.price ??
            0
        );



    // =====================================================
    // TOTAL PEMBAYARAN
    // =====================================================
    //
    // Harga kamar / 30 × lama booking
    //
    // Harga per hari tidak ditampilkan.
    //
    // Contoh:
    //
    // Rp750.000 / 30 × 7
    // = Rp175.000
    //
    // =====================================================

    const totalBookingPrice =
        useMemo(() => {

            return Math.round(
                (
                    roomPrice /
                    30
                ) *
                Number(bookingDays)
            );

        }, [
            roomPrice,
            bookingDays,
        ]);





    // =====================================================
    // HANDLE LAMA BOOKING
    // =====================================================

    const handleBookingDaysChange =
        (event) => {

            const days =
                Number(
                    event.target.value
                );


            if (
                days < 1 ||
                days > 7
            ) {

                return;

            }


            setBookingDays(
                days
            );

        };



    // =====================================================
    // HANDLE FILE
    // =====================================================

    const handleFileChange =
        (event) => {

            const file =
                event.target.files?.[0];


            if (!file) {

                setProofFile(null);

                setFileName("");

                return;

            }


            // ================================================
            // FORMAT FILE
            // ================================================

            const allowedTypes = [

                "image/jpeg",

                "image/jpg",

                "image/png",

                "image/webp",

                "application/pdf",

            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                setError(
                    "Format bukti pembayaran harus JPG, PNG, WEBP, atau PDF."
                );

                setProofFile(null);

                setFileName("");

                return;

            }


            // ================================================
            // UKURAN FILE
            // ================================================

            const maxSize =
                5 * 1024 * 1024;


            if (
                file.size > maxSize
            ) {

                setError(
                    "Ukuran file maksimal 5 MB."
                );

                setProofFile(null);

                setFileName("");

                return;

            }


            // ================================================
            // SIMPAN FILE
            // ================================================

            setError("");

            setProofFile(
                file
            );

            setFileName(
                file.name
            );

        };



    // =====================================================
    // SUBMIT PEMBAYARAN
    // =====================================================

    const handleSubmit =
        async () => {

            try {

                setSubmitting(true);

                setError("");


                // =========================================
                // TOKEN
                // =========================================

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    navigate("/login");

                    return;

                }


                // =========================================
                // BOOKING ID
                // =========================================

                if (!bookingId) {

                    throw new Error(
                        "Booking ID tidak ditemukan."
                    );

                }


                // =========================================
                // VALIDASI LAMA BOOKING
                // =========================================

                if (
                    bookingDays < 1 ||
                    bookingDays > 7
                ) {

                    throw new Error(
                        "Lama booking harus antara 1 sampai 7 hari."
                    );

                }


                // =========================================
                // VALIDASI HARGA
                // =========================================

                if (
                    roomPrice <= 0
                ) {

                    throw new Error(
                        "Harga kamar tidak valid."
                    );

                }


                // =========================================
                // VALIDASI FILE
                // =========================================

                if (!proofFile) {

                    throw new Error(
                        "Bukti pembayaran wajib diupload."
                    );

                }


                // =========================================
                // FORM DATA
                // =========================================

                const formData =
                    new FormData();


                // Booking ID
                formData.append(
                    "booking_id",
                    String(
                        bookingId
                    )
                );


                // Lama booking
                formData.append(
                    "booking_days",
                    String(
                        bookingDays
                    )
                );


                // Bukti pembayaran
                formData.append(
                    "proof_file",
                    proofFile
                );


                // =========================================
                // REQUEST
                // =========================================
                //
                // Endpoint pembayaran booking:
                //
                // POST /api/payments/booking
                //
                // Nominal pembayaran dihitung ulang
                // oleh backend berdasarkan:
                //
                // harga kamar / 30 × booking_days
                //
                // =========================================

                const response =
                    await fetch(
                        "http://localhost:5000/api/payments/booking",
                        {
                            method: "POST",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`,

                            },

                            body:
                                formData,

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "BOOKING PAYMENT RESPONSE:",
                    data
                );


                // =========================================
                // ERROR
                // =========================================

                if (
                    !response.ok ||
                    !data?.success
                ) {

                    throw new Error(
                        data?.message ||
                        "Gagal mengirim pembayaran."
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================

                setSuccess(
                    true
                );


            } catch (error) {

                console.error(
                    "Submit Booking Payment Error:",
                    error
                );


                setError(
                    error.message ||
                    "Gagal mengirim pembayaran."
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

                            Memuat data booking...

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
        !booking
    ) {

        return (

            <div className="min-h-screen bg-slate-50 px-4 py-12">

                <div className="mx-auto max-w-xl">

                    <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">

                        <div className="text-5xl">
                            ⚠️
                        </div>


                        <h1 className="mt-4 text-xl font-bold text-red-700">

                            Data Booking Tidak Dapat Dibuka

                        </h1>


                        <p className="mt-2 text-sm leading-6 text-red-600">

                            {error}

                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/tenant/dashboard"
                                )
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Kembali ke Dashboard

                        </button>

                    </div>

                </div>

            </div>

        );

    }



    // =====================================================
    // SUCCESS
    // =====================================================

    if (success) {

        return (

            <div className="min-h-screen bg-slate-50 px-4 py-12">

                <div className="mx-auto max-w-xl">

                    <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">

                            <CheckCircle2
                                size={44}
                            />

                        </div>


                        <h1 className="mt-6 text-2xl font-bold text-slate-900">

                            Pembayaran Berhasil Dikirim

                        </h1>


                        <p className="mt-3 text-sm leading-6 text-slate-500">

                            Bukti pembayaran booking telah
                            berhasil dikirim dan sedang
                            menunggu verifikasi pengelola
                            ADELINA KOST.

                        </p>


                        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                Ringkasan Pembayaran

                            </p>


                            <div className="mt-4 space-y-3">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">

                                        Kamar

                                    </span>


                                    <span className="text-sm font-bold text-slate-800">

                                        {room.room_number ||
                                            booking?.room_number ||
                                            "-"}

                                    </span>

                                </div>


                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">

                                        Lama Booking

                                    </span>


                                    <span className="text-sm font-bold text-slate-800">

                                        {bookingDays} hari

                                    </span>

                                </div>


                                <div className="flex items-center justify-between border-t border-slate-200 pt-3">

                                    <span className="text-sm font-bold text-slate-700">

                                        Total Pembayaran

                                    </span>


                                    <span className="text-lg font-bold text-blue-600">

                                        {formatPrice(
                                            totalBookingPrice
                                        )}

                                    </span>

                                </div>

                            </div>


                            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">

                                <span className="h-2 w-2 rounded-full bg-amber-500" />

                                MENUNGGU VERIFIKASI

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/tenant/dashboard"
                                )
                            }
                            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                        >

                            Kembali ke Dashboard

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

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/tenant/dashboard"
                        )
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                >

                    <ArrowLeft
                        size={17}
                    />

                    Kembali ke Dashboard

                </button>



                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mt-6">

                    <p className="text-sm font-bold text-blue-600">

                        ADELINA KOST

                    </p>


                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">

                        Pembayaran Booking

                    </h1>


                    <p className="mt-2 text-sm text-slate-500">

                        Booking ID:{" "}

                        <span className="font-bold text-slate-700">

                            {bookingId}

                        </span>

                    </p>

                </div>



                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_390px]">


                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div className="space-y-6">


                        {/* =================================================
                            DATA DIRI
                        ================================================= */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                    <User
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <h2 className="font-bold text-slate-900">

                                        Data Diri

                                    </h2>


                                    <p className="text-xs text-slate-500">

                                        Data dari registrasi akun

                                    </p>

                                </div>

                            </div>



                            <div className="mt-6 grid gap-5 sm:grid-cols-2">


                                {/* NAMA */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Nama Lengkap

                                    </p>


                                    <p className="mt-1 text-sm font-bold text-slate-800">

                                        {tenant.name ||
                                            booking?.tenant_name ||
                                            "-"}

                                    </p>

                                </div>


                                {/* PHONE */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Nomor HP

                                    </p>


                                    <div className="mt-1 flex items-center gap-2">

                                        <Phone
                                            size={15}
                                            className="text-slate-400"
                                        />

                                        <p className="text-sm font-bold text-slate-800">

                                            {tenant.phone ||
                                                booking?.tenant_phone ||
                                                "-"}

                                        </p>

                                    </div>

                                </div>


                                {/* NIK */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        NIK

                                    </p>


                                    <p className="mt-1 text-sm font-bold text-slate-800">

                                        {tenant.identity_number ||
                                            booking?.identity_number ||
                                            "-"}

                                    </p>

                                </div>


                                {/* STATUS */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Status

                                    </p>


                                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">

                                        <CheckCircle2
                                            size={13}
                                        />

                                        Calon Penghuni

                                    </span>

                                </div>

                            </div>

                        </div>



                        {/* =================================================
                            INFORMASI KAMAR
                        ================================================= */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                    <Building2
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <h2 className="font-bold text-slate-900">

                                        Informasi Kamar

                                    </h2>


                                    <p className="text-xs text-slate-500">

                                        Kamar yang Anda booking

                                    </p>

                                </div>

                            </div>



                            <div className="mt-6 grid gap-5 sm:grid-cols-2">


                                {/* KAMAR */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Kamar

                                    </p>


                                    <p className="mt-1 text-xl font-bold text-slate-900">

                                        {room.room_number ||
                                            booking?.room_number ||
                                            "-"}

                                    </p>

                                </div>


                                {/* BANGUNAN */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Bangunan

                                    </p>


                                    <p className="mt-1 text-sm font-bold text-slate-800">

                                        {room.building_name ||
                                            booking?.building_name ||
                                            "ADELINA KOST"}

                                    </p>

                                </div>


                                {/* LANTAI */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Lantai

                                    </p>


                                    <div className="mt-1 flex items-center gap-2">

                                        <Layers3
                                            size={15}
                                            className="text-slate-400"
                                        />

                                        <p className="text-sm font-bold text-slate-800">

                                            {room.floor_name ||
                                                booking?.floor_name ||
                                                "-"}

                                        </p>

                                    </div>

                                </div>


                                {/* HARGA */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Harga / Bulan

                                    </p>


                                    <p className="mt-1 text-sm font-bold text-slate-800">

                                        {formatPrice(
                                            roomPrice
                                        )}

                                    </p>

                                </div>

                            </div>

                        </div>



                        {/* =================================================
                            LAMA BOOKING
                        ================================================= */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                                    <CalendarDays
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <h2 className="font-bold text-slate-900">

                                        Lama Booking

                                    </h2>


                                    <p className="text-xs text-slate-500">

                                        Maksimal 7 hari

                                    </p>

                                </div>

                            </div>



                            <div className="mt-6">

                                <label
                                    htmlFor="bookingDays"
                                    className="text-sm font-semibold text-slate-700"
                                >

                                    Pilih jumlah hari

                                </label>


                                <select
                                    id="bookingDays"
                                    value={bookingDays}
                                    onChange={
                                        handleBookingDaysChange
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value={1}>
                                        1 Hari
                                    </option>

                                    <option value={2}>
                                        2 Hari
                                    </option>

                                    <option value={3}>
                                        3 Hari
                                    </option>

                                    <option value={4}>
                                        4 Hari
                                    </option>

                                    <option value={5}>
                                        5 Hari
                                    </option>

                                    <option value={6}>
                                        6 Hari
                                    </option>

                                    <option value={7}>
                                        7 Hari
                                    </option>

                                </select>

                            </div>



                            {/* =================================================
                                TOTAL
                            ================================================= */}

                            <div className="mt-5 rounded-2xl bg-slate-50 p-5">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">

                                        Harga kamar / bulan

                                    </span>


                                    <span className="text-sm font-semibold text-slate-800">

                                        {formatPrice(
                                            roomPrice
                                        )}

                                    </span>

                                </div>


                                <div className="mt-4 flex items-center justify-between">

                                    <span className="text-sm text-slate-500">

                                        Lama booking

                                    </span>


                                    <span className="text-sm font-semibold text-slate-800">

                                        {bookingDays} hari

                                    </span>

                                </div>


                                <div className="mt-4 border-t border-slate-200 pt-4">

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm font-bold text-slate-700">

                                            Total pembayaran

                                        </span>


                                        <span className="text-2xl font-bold text-blue-600">

                                            {formatPrice(
                                                totalBookingPrice
                                            )}

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* =================================================
                        RIGHT - PEMBAYARAN
                    ================================================= */}

                    <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">


                        {/* HEADER */}

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <Wallet
                                    size={21}
                                />

                            </div>


                            <div>

                                <h2 className="font-bold text-slate-900">

                                    Pembayaran

                                </h2>


                                <p className="text-xs text-slate-500">

                                    Pembayaran booking kamar

                                </p>

                            </div>

                        </div>



                        {/* TOTAL */}

                        <div className="mt-6 rounded-2xl bg-blue-50 p-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">

                                Total yang harus dibayar

                            </p>


                            <p className="mt-1 text-3xl font-bold text-blue-700">

                                {formatPrice(
                                    totalBookingPrice
                                )}

                            </p>


                            <p className="mt-2 text-xs text-blue-500">

                                Untuk booking {bookingDays} hari

                            </p>

                        </div>



                        {/* =================================================
                            REKENING TUJUAN
                        ================================================= */}

                        <div className="mt-5 rounded-2xl border border-slate-200 p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                                    <CreditCard
                                        size={18}
                                        className="text-slate-600"
                                    />

                                </div>


                                <div>

                                    <p className="text-xs text-slate-400">

                                        Tujuan Transfer

                                    </p>


                                    <p className="text-sm font-bold text-slate-800">

                                        BCA

                                    </p>

                                </div>

                            </div>



                            {/* NOMOR REKENING */}

                            <div className="mt-4 rounded-xl bg-slate-50 p-3">

                                <p className="text-xs text-slate-400">

                                    Nomor Rekening

                                </p>


                                <p className="mt-1 text-lg font-bold tracking-wide text-slate-900">

                                    2200940604

                                </p>

                            </div>



                            {/* NAMA PEMILIK */}

                            <div className="mt-3">

                                <p className="text-xs text-slate-400">

                                    Atas Nama

                                </p>


                                <p className="mt-1 text-sm font-bold text-slate-800">

                                    Prediansyah Pasaribu

                                </p>

                            </div>



                            {/* INFO */}

                            <p className="mt-4 text-xs leading-5 text-slate-500">

                                Silakan transfer sesuai dengan
                                jumlah total pembayaran yang
                                tertera di atas.

                            </p>

                        </div>



                        {/* =================================================
                            UPLOAD BUKTI
                        ================================================= */}

                        <div className="mt-6">

                            <label
                                htmlFor="proofFile"
                                className="text-sm font-semibold text-slate-700"
                            >

                                Bukti Pembayaran

                            </label>


                            <label
                                htmlFor="proofFile"
                                className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50"
                            >

                                <Upload
                                    size={28}
                                    className="text-blue-500"
                                />


                                <p className="mt-3 text-sm font-bold text-slate-700">

                                    {fileName
                                        ? fileName
                                        : "Pilih bukti pembayaran"}

                                </p>


                                <p className="mt-1 text-xs text-slate-400">

                                    JPG, PNG, WEBP, atau PDF
                                    maksimal 5 MB

                                </p>


                                <input
                                    id="proofFile"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                                    onChange={
                                        handleFileChange
                                    }
                                    className="hidden"
                                />

                            </label>

                        </div>



                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                                <p className="text-sm font-medium text-red-700">

                                    {error}

                                </p>

                            </div>

                        )}



                        {/* =================================================
                            SUBMIT
                        ================================================= */}

                        <button
                            type="button"
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                submitting
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {submitting ? (

                                <>

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Mengirim Pembayaran...

                                </>

                            ) : (

                                <>

                                    <CheckCircle2
                                        size={18}
                                    />

                                    Kirim Pembayaran

                                </>

                            )}

                        </button>



                        {/* =================================================
                            INFO
                        ================================================= */}

                        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                            <p className="text-xs leading-5 text-amber-700">

                                Pembayaran akan diperiksa oleh
                                pengelola ADELINA KOST. Booking
                                belum dianggap selesai sebelum
                                pembayaran diverifikasi.

                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}



export default TenantBookingPayment;