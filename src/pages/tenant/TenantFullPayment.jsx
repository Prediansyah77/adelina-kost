import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

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
} from "lucide-react";

import { getRoomById } from "../../services/roomService";


// =====================================================
// TENANT FULL PAYMENT
// =====================================================
//
// URL:
//
// /tenant/pembayaran-full?roomId=17
//
// ALUR:
//
// User pilih kamar
//      ↓
// Pengajuan kamar
//      ↓
// Pilih "Pesan Kamar Tanpa DP"
//      ↓
// Halaman pembayaran penuh
//      ↓
// User transfer Rp750.000
//      ↓
// Upload bukti
//      ↓
// Submit
//      ↓
// Backend membuat booking + payment
//
// =====================================================


function TenantFullPayment() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();


    // =====================================================
    // ROOM ID
    // =====================================================

    const roomId =
        searchParams.get("roomId");


    // =====================================================
    // STATE ROOM
    // =====================================================

    const [roomData, setRoomData] =
        useState(null);


    // =====================================================
    // STATE TENANT
    // =====================================================

    const [tenantData, setTenantData] =
        useState(null);


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);


    // =====================================================
    // FILE
    // =====================================================

    const [proofFile, setProofFile] =
        useState(null);

    const [fileName, setFileName] =
        useState("");


    // =====================================================
    // PERIODE PEMBAYARAN
    // =====================================================

    const now =
        new Date();

    const paymentMonth =
        now.getMonth();

    const paymentYear =
        now.getFullYear();


    const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];


    const paymentMonthName =
        monthNames[paymentMonth];


    const paymentPeriod =
        `${paymentMonthName} ${paymentYear}`;


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");


                // =============================================
                // TOKEN
                // =============================================

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    navigate("/login");

                    return;

                }


                // =============================================
                // ROOM ID
                // =============================================

                if (!roomId) {

                    throw new Error(
                        "ID kamar tidak ditemukan."
                    );

                }


                // =================================================
                // AMBIL DATA KAMAR
                // =================================================

                const roomResponse =
                    await getRoomById(
                        roomId
                    );


                console.log(
                    "FULL PAYMENT ROOM RESPONSE:",
                    roomResponse
                );


                const room =
                    roomResponse?.data ??
                    roomResponse;


                if (!room) {

                    throw new Error(
                        "Data kamar tidak ditemukan."
                    );

                }


                // =============================================
                // CEK STATUS KAMAR
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


                setRoomData(
                    room
                );


                // =================================================
                // AMBIL DATA DIRI TENANT
                // =================================================
                //
                // Endpoint:
                //
                // GET /api/tenant-accounts/me
                //
                // JWT menentukan user yang sedang login.
                //
                // Response:
                //
                // result.data.tenant
                //
                // =================================================

                const tenantResponse =
                    await fetch(
                        "http://localhost:5000/api/tenant-accounts/me",
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


                const tenantResult =
                    await tenantResponse.json();


                console.log(
                    "MY TENANT ACCOUNT RESPONSE:",
                    tenantResult
                );


                if (
                    !tenantResponse.ok ||
                    !tenantResult?.success
                ) {

                    throw new Error(
                        tenantResult?.message ||
                        "Gagal mengambil data diri pengguna."
                    );

                }


                // =================================================
                // RESPONSE BACKEND:
                //
                // tenantResult.data.tenant
                // =================================================

                const tenant =
                    tenantResult?.data?.tenant;


                if (!tenant) {

                    throw new Error(
                        "Data penghuni belum terhubung dengan akun."
                    );

                }


                console.log(
                    "TENANT DATA:",
                    tenant
                );


                setTenantData(
                    tenant
                );


            } catch (error) {

                console.error(
                    "Load Full Payment Error:",
                    error
                );


                setError(
                    error.message ||
                    "Gagal mengambil data pembayaran."
                );


            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, [
        roomId,
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
    // HARGA KAMAR
    // =====================================================

    const roomPrice =
        Number(
            roomData?.price || 0
        );


    // =====================================================
    // TOTAL PEMBAYARAN
    // =====================================================

    const totalPayment =
        useMemo(() => {

            return roomPrice;

        }, [
            roomPrice
        ]);


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


            // =============================================
            // FORMAT FILE
            // =============================================

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


            // =============================================
            // MAX SIZE 5 MB
            // =============================================

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


            // =============================================
            // SIMPAN FILE
            // =============================================

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


                // =============================================
                // TOKEN
                // =============================================

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    navigate("/login");

                    return;

                }


                // =============================================
                // VALIDASI ROOM
                // =============================================

                if (!roomId) {

                    throw new Error(
                        "ID kamar tidak ditemukan."
                    );

                }


                if (!roomData) {

                    throw new Error(
                        "Data kamar belum tersedia."
                    );

                }


                // =============================================
                // VALIDASI HARGA
                // =============================================

                if (
                    roomPrice <= 0
                ) {

                    throw new Error(
                        "Harga kamar tidak valid."
                    );

                }


                // =============================================
                // VALIDASI FILE
                // =============================================

                if (!proofFile) {

                    throw new Error(
                        "Bukti pembayaran wajib diupload."
                    );

                }


                // =============================================
                // FORM DATA
                // =============================================

                const formData =
                    new FormData();


                // =============================================
                // ROOM ID
                // =============================================

                formData.append(
                    "room_id",
                    String(roomId)
                );


                // =============================================
                // PAYMENT TYPE
                // =============================================

                formData.append(
                    "payment_type",
                    "full"
                );


                // =============================================
                // AMOUNT
                // =============================================

                formData.append(
                    "amount",
                    String(totalPayment)
                );


                // =============================================
                // PAYMENT MONTH
                // =============================================

                formData.append(
                    "payment_month",
                    String(paymentMonth + 1)
                );


                // =============================================
                // PAYMENT YEAR
                // =============================================

                formData.append(
                    "payment_year",
                    String(paymentYear)
                );


                // =============================================
                // PROOF
                // =============================================

                formData.append(
                    "proof_file",
                    proofFile
                );


                console.log(
                    "SUBMIT FULL PAYMENT:",
                    {
                        roomId,
                        amount: totalPayment,
                        paymentMonth:
                            paymentMonth + 1,
                        paymentYear
                    }
                );


                // =============================================
                // REQUEST
                // =============================================

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
                    "FULL PAYMENT RESPONSE:",
                    data
                );


                if (
                    !response.ok ||
                    !data?.success
                ) {

                    throw new Error(
                        data?.message ||
                        "Gagal mengirim pembayaran penuh."
                    );

                }


                // =============================================
                // SUCCESS
                // =============================================

                setSuccess(
                    true
                );


            } catch (error) {

                console.error(
                    "Submit Full Payment Error:",
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

                            Memuat informasi pembayaran...

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
        !roomData
    ) {

        return (

            <div className="min-h-screen bg-slate-50 px-4 py-12">

                <div className="mx-auto max-w-xl">

                    <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">

                        <div className="text-5xl">
                            ⚠️
                        </div>

                        <h1 className="mt-4 text-xl font-bold text-red-700">

                            Pembayaran Tidak Dapat Dilanjutkan

                        </h1>

                        <p className="mt-2 text-sm leading-6 text-red-600">

                            {error}

                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/kamar/${roomId}`
                                )
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

                            Pembayaran Penuh Berhasil Dikirim

                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">

                            Bukti pembayaran penuh untuk
                            periode{" "}
                            <strong>
                                {paymentPeriod}
                            </strong>{" "}
                            telah berhasil dikirim dan
                            sedang menunggu verifikasi
                            pengelola ADELINA KOST.

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

                                        {roomData?.room_number ||
                                            "-"
                                        }

                                    </span>

                                </div>


                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">
                                        Periode
                                    </span>

                                    <span className="text-sm font-bold text-slate-800">

                                        {paymentPeriod}

                                    </span>

                                </div>


                                <div className="flex items-center justify-between border-t border-slate-200 pt-3">

                                    <span className="text-sm font-bold text-slate-700">

                                        Total Pembayaran

                                    </span>

                                    <span className="text-lg font-bold text-blue-600">

                                        {formatPrice(
                                            totalPayment
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
                            `/kamar/${roomData?.id || roomId}`
                        )
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                >

                    <ArrowLeft
                        size={17}
                    />

                    Kembali ke Detail Kamar

                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mt-6">

                    <p className="text-sm font-bold text-blue-600">

                        ADELINA KOST

                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">

                        Pembayaran Penuh

                    </h1>

                    <p className="mt-2 text-sm text-slate-500">

                        Pembayaran penuh sewa kamar untuk
                        periode{" "}
                        <strong>
                            {paymentPeriod}
                        </strong>

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

                                        {tenantData?.name ||
                                            "-"
                                        }

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

                                            {tenantData?.phone ||
                                                "-"
                                            }

                                        </p>

                                    </div>

                                </div>


                                {/* NIK */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        NIK

                                    </p>

                                    <p className="mt-1 text-sm font-bold text-slate-800">

                                        {tenantData?.identity_number ||
                                            "-"
                                        }

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

                                        {tenantData?.status === "aktif"
                                            ? "Penghuni Aktif"
                                            : "Calon Penghuni"
                                        }

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

                                        Kamar yang akan dipesan

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

                                        {roomData?.room_number ||
                                            "-"
                                        }

                                    </p>

                                </div>


                                {/* BANGUNAN */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                        Bangunan

                                    </p>

                                    <p className="mt-1 text-sm font-bold text-slate-800">

                                        {roomData?.building_name ||
                                            "ADELINA KOST"
                                        }

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

                                            {roomData?.floor_name ||
                                                "-"
                                            }

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
                            PERIODE
                        ================================================= */}

                        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600">

                                    <CalendarDays
                                        size={21}
                                    />

                                </div>

                                <div>

                                    <h2 className="font-bold text-blue-900">

                                        Periode Sewa

                                    </h2>

                                    <p className="text-xs text-blue-600">

                                        Pembayaran penuh 1 bulan

                                    </p>

                                </div>

                            </div>


                            <div className="mt-5 rounded-2xl bg-white p-5">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">

                                        Bulan Pembayaran

                                    </span>

                                    <span className="text-sm font-bold text-slate-900">

                                        {paymentPeriod}

                                    </span>

                                </div>


                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                                    <span className="text-sm font-bold text-slate-700">

                                        Total Sewa

                                    </span>

                                    <span className="text-xl font-bold text-blue-600">

                                        {formatPrice(
                                            totalPayment
                                        )}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">


                        {/* HEADER */}

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <CreditCard
                                    size={21}
                                />

                            </div>

                            <div>

                                <h2 className="font-bold text-slate-900">

                                    Pembayaran

                                </h2>

                                <p className="text-xs text-slate-500">

                                    Pembayaran penuh

                                </p>

                            </div>

                        </div>


                        {/* TOTAL */}

                        <div className="mt-6 rounded-2xl bg-blue-50 p-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">

                                Total Yang Harus Dibayar

                            </p>

                            <p className="mt-1 text-3xl font-bold text-blue-700">

                                {formatPrice(
                                    totalPayment
                                )}

                            </p>

                            <p className="mt-2 text-xs text-blue-500">

                                Sewa {paymentPeriod}

                            </p>

                        </div>


                        {/* REKENING */}

                        <div className="mt-5 rounded-2xl border border-slate-200 p-4">

                            <p className="text-xs text-slate-400">

                                Tujuan Transfer

                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">

                                BCA

                            </p>


                            <div className="mt-4 rounded-xl bg-slate-50 p-3">

                                <p className="text-xs text-slate-400">

                                    Nomor Rekening

                                </p>

                                <p className="mt-1 text-lg font-bold tracking-wide text-slate-900">

                                    2200940604

                                </p>

                            </div>


                            <div className="mt-3">

                                <p className="text-xs text-slate-400">

                                    Atas Nama

                                </p>

                                <p className="mt-1 text-sm font-bold text-slate-800">

                                    Prediansyah Pasaribu

                                </p>

                            </div>


                            <p className="mt-4 text-xs leading-5 text-slate-500">

                                Silakan transfer sesuai
                                jumlah pembayaran{" "}
                                <strong>
                                    {formatPrice(totalPayment)}
                                </strong>{" "}
                                untuk periode{" "}
                                <strong>
                                    {paymentPeriod}
                                </strong>.

                            </p>

                        </div>


                        {/* UPLOAD */}

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

                                    {fileName ||
                                        "Pilih bukti pembayaran"
                                    }

                                </p>

                                <p className="mt-1 text-xs text-slate-400">

                                    JPG, PNG, WEBP,
                                    atau PDF maksimal 5 MB

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
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                submitting ||
                                !roomData ||
                                !tenantData
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

                                    Submit Pembayaran Penuh

                                </>

                            )}

                        </button>


                        {/* INFO */}

                        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                            <p className="text-xs leading-5 text-amber-700">

                                Booking belum tercatat sebelum
                                pembayaran dikirim. Setelah Anda
                                submit pembayaran penuh, sistem
                                akan mencatat booking dan
                                pembayaran dengan status menunggu
                                verifikasi.

                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default TenantFullPayment;