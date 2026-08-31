import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserRound,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Building2,
    Phone,
} from "lucide-react";

import { register } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    // =====================================================
    // FORM
    // =====================================================

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("laki-laki");
    const [identityNumber, setIdentityNumber] = useState("");
    const [occupation, setOccupation] = useState("");
    const [boardingPurpose, setBoardingPurpose] = useState("");
    const [ktpFile, setKtpFile] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // =====================================================
    // UI STATE
    // =====================================================

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // REGISTER
    // =====================================================

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // =================================================
        // VALIDASI PASSWORD
        // =================================================

        if (
            password !== confirmPassword
        ) {

            setError(
                "Password dan konfirmasi password tidak sama."
            );

            return;

        }


        // =================================================
        // VALIDASI NOMOR KTP
        // =================================================

        if (
            !/^[0-9]{16}$/.test(
                identityNumber
            )
        ) {

            setError(
                "Nomor KTP harus terdiri dari 16 digit."
            );

            return;

        }


        // =================================================
        // VALIDASI FOTO KTP
        // =================================================

        if (!ktpFile) {

            setError(
                "Foto KTP wajib diupload."
            );

            return;

        }


        // =================================================
        // VALIDASI GENDER
        // =================================================

        if (
            gender !== "laki-laki"
        ) {

            setError(
                "Pendaftaran hanya diperuntukkan bagi penghuni laki-laki."
            );

            return;

        }


        // =================================================
        // VALIDASI DATA WAJIB
        // =================================================

        if (
            !name.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !occupation.trim() ||
            !boardingPurpose.trim() ||
            !username.trim()
        ) {

            setError(
                "Semua data registrasi wajib diisi."
            );

            return;

        }


        // =================================================
        // VALIDASI UKURAN FOTO KTP
        // =================================================

        if (
            ktpFile.size >
            5 * 1024 * 1024
        ) {

            setError(
                "Ukuran foto KTP maksimal 5 MB."
            );

            return;

        }


        // =================================================
        // VALIDASI FORMAT FOTO KTP
        // =================================================

        const allowedKtpTypes = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp"

        ];


        if (
            !allowedKtpTypes.includes(
                ktpFile.type
            )
        ) {

            setError(
                "Foto KTP harus berupa JPG, JPEG, PNG, atau WEBP."
            );

            return;

        }


        // =================================================
        // LOADING
        // =================================================

        setLoading(true);


        try {

            // =================================================
            // KIRIM DATA REGISTRASI
            // =================================================

            const response =
                await register({

                    // =========================================
                    // DATA DIRI
                    // =========================================

                    name,

                    phone,

                    gender,

                    occupation,

                    address,

                    identityNumber,

                    boardingPurpose,


                    // =========================================
                    // FOTO KTP
                    //
                    // PENTING:
                    // Nama property harus "ktpFile"
                    // karena authService menerima ktpFile
                    // =========================================

                    ktpFile,


                    // =========================================
                    // DATA AKUN
                    // =========================================

                    username,

                    password,

                    confirmPassword

                });


            // =================================================
            // BERHASIL
            // =================================================

            setSuccess(

                response?.message ||

                "Akun berhasil dibuat."

            );


            // =================================================
            // RESET DATA DIRI
            // =================================================

            setName("");

            setPhone("");

            setGender(
                "laki-laki"
            );

            setOccupation("");

            setAddress("");

            setIdentityNumber("");

            setBoardingPurpose("");

            setKtpFile(null);


            // =================================================
            // RESET DATA AKUN
            // =================================================

            setUsername("");

            setPassword("");

            setConfirmPassword("");


            // =================================================
            // RESET INPUT FILE
            // =================================================

            const ktpInput =
                document.getElementById(
                    "ktpFile"
                );


            if (ktpInput) {

                ktpInput.value = "";

            }


            // =================================================
            // KEMBALI KE LOGIN
            // =================================================

            setTimeout(() => {

                navigate(
                    "/login"
                );

            }, 1500);


        } catch (error) {

            // =================================================
            // ERROR LOG
            // =================================================

            console.error(
                "Register Error:",
                error
            );


            // =================================================
            // TAMPILKAN ERROR
            // =================================================

            setError(

                error.response?.data?.message ||

                error.message ||

                "Gagal membuat akun."

            );


        } finally {

            // =================================================
            // SELESAI LOADING
            // =================================================

            setLoading(false);

        }

    };


    return (

        <>
            {/* =====================================================
                ANIMATION
            ===================================================== */}

            <style>{`

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }


                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }


                @keyframes slideRight {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }


                @keyframes slideLeft {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }


                .register-fade {
                    animation: fadeIn 0.8s ease-out both;
                }


                .register-slide-up {
                    animation: slideUp 0.8s ease-out both;
                }


                .register-slide-right {
                    animation: slideRight 0.8s ease-out both;
                }


                .register-slide-left {
                    animation: slideLeft 0.8s ease-out both;
                }


                .register-delay-1 {
                    animation-delay: 0.15s;
                }


                .register-delay-2 {
                    animation-delay: 0.3s;
                }


                .register-delay-3 {
                    animation-delay: 0.45s;
                }


                .register-delay-4 {
                    animation-delay: 0.6s;
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

            `}</style>


            {/* =====================================================
                PAGE
            ===================================================== */}

            <div className="min-h-screen overflow-hidden bg-slate-100">

                <div className="flex min-h-screen">


                    {/* =================================================
                        LEFT BRANDING
                    ================================================= */}

                    <div
                        className="
                            relative
                            hidden
                            overflow-hidden
                            bg-slate-950
                            lg:flex
                            lg:w-1/2
                        "
                    >

                        <div
                            className="
                                absolute
                                -left-32
                                -top-32
                                h-96
                                w-96
                                rounded-full
                                bg-blue-600/20
                                blur-3xl
                            "
                        />

                        <div
                            className="
                                absolute
                                -bottom-40
                                -right-20
                                h-96
                                w-96
                                rounded-full
                                bg-indigo-500/20
                                blur-3xl
                            "
                        />


                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-br
                                from-slate-950
                                via-slate-900
                                to-blue-950
                            "
                        />


                        <div
                            className="
                                absolute
                                inset-0
                                opacity-[0.025]
                            "
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />


                        <div
                            className="
                                relative
                                z-10
                                flex
                                w-full
                                flex-col
                                justify-between
                                p-12
                                xl:p-16
                            "
                        >


                            {/* LOGO */}

                            <div className="register-slide-right">

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-blue-600
                                            shadow-lg
                                            shadow-blue-600/30
                                        "
                                    >

                                        <Building2
                                            size={25}
                                            className="text-white"
                                        />

                                    </div>


                                    <div>

                                        <h1
                                            className="
                                                text-xl
                                                font-bold
                                                tracking-wide
                                                text-white
                                            "
                                        >
                                            ADELINA KOST
                                        </h1>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Management System
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* MAIN MESSAGE */}

                            <div className="max-w-xl">

                                <div
                                    className="
                                        register-slide-right
                                        register-delay-1
                                        mb-6
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-blue-400/20
                                        bg-blue-500/10
                                        px-4
                                        py-2
                                        text-sm
                                        text-blue-300
                                    "
                                >

                                    <ShieldCheck
                                        size={17}
                                    />

                                    Akun Penghuni

                                </div>


                                <h2
                                    className="
                                        register-slide-right
                                        register-delay-2
                                        text-4xl
                                        font-bold
                                        leading-tight
                                        text-white
                                        xl:text-5xl
                                    "
                                >

                                    Daftar akun

                                    <span
                                        className="
                                            block
                                            text-blue-400
                                        "
                                    >
                                        ADELINA KOST.
                                    </span>

                                </h2>


                                <p
                                    className="
                                        register-slide-right
                                        register-delay-3
                                        mt-6
                                        max-w-lg
                                        text-base
                                        leading-7
                                        text-slate-400
                                    "
                                >

                                    Buat akun penghuni untuk
                                    mengakses informasi kamar,
                                    tagihan, pembayaran, dan
                                    layanan ADELINA KOST.

                                </p>


                                <div className="mt-10 grid grid-cols-2 gap-4">

                                    <div
                                        className="
                                            register-slide-up
                                            register-delay-3
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            p-4
                                            backdrop-blur-sm
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            Akun Pribadi
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Akses menggunakan
                                            username dan password.
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            register-slide-up
                                            register-delay-4
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            p-4
                                            backdrop-blur-sm
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            Aman
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Password diproses
                                            secara aman.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div
                                className="
                                    register-fade
                                    text-sm
                                    text-slate-500
                                "
                            >

                                © {new Date().getFullYear()}
                                {" "}ADELINA KOST.
                                All rights reserved.

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT REGISTER
                    ================================================= */}

                    <div
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            px-5
                            py-10
                            sm:px-8
                            lg:w-1/2
                        "
                    >

                        <div className="w-full max-w-md">


                            {/* MOBILE LOGO */}

                            <div
                                className="
                                    register-fade
                                    mb-8
                                    flex
                                    flex-col
                                    items-center
                                    lg:hidden
                                "
                            >

                                <div
                                    className="
                                        mb-4
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-blue-600
                                        shadow-lg
                                        shadow-blue-600/20
                                    "
                                >

                                    <Building2
                                        size={28}
                                        className="text-white"
                                    />

                                </div>


                                <h1
                                    className="
                                        text-xl
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    ADELINA KOST
                                </h1>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Management System
                                </p>

                            </div>


                            {/* REGISTER CARD */}

                            <div
                                className="
                                    register-slide-left
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-7
                                    shadow-xl
                                    shadow-slate-200/60
                                    sm:p-9
                                "
                            >


                                {/* HEADER */}

                                <div
                                    className="
                                        register-slide-up
                                        register-delay-1
                                        mb-7
                                    "
                                >

                                    <p
                                        className="
                                            mb-2
                                            text-sm
                                            font-medium
                                            text-blue-600
                                        "
                                    >
                                        DAFTAR AKUN
                                    </p>


                                    <h2
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-800
                                            sm:text-3xl
                                        "
                                    >
                                        Buat akun penghuni
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        Isi data berikut untuk
                                        membuat akun ADELINA KOST.
                                    </p>

                                </div>


                                {/* ERROR */}

                                {error && (

                                    <div
                                        className="
                                            mb-5
                                            rounded-xl
                                            border
                                            border-red-200
                                            bg-red-50
                                            px-4
                                            py-3
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-red-700
                                            "
                                        >
                                            Pendaftaran gagal
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                leading-5
                                                text-red-600
                                            "
                                        >
                                            {error}
                                        </p>

                                    </div>

                                )}


                                {/* SUCCESS */}

                                {success && (

                                    <div
                                        className="
                                            mb-5
                                            rounded-xl
                                            border
                                            border-emerald-200
                                            bg-emerald-50
                                            px-4
                                            py-3
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-emerald-700
                                            "
                                        >
                                            Pendaftaran berhasil
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                leading-5
                                                text-emerald-600
                                            "
                                        >
                                            {success}
                                        </p>

                                    </div>

                                )}


                                {/* FORM */}

                                <form
                                    onSubmit={handleRegister}
                                    className="space-y-5"
                                >


                                    {/* NAMA */}

                                    <div>

                                        <label
                                            htmlFor="name"
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            Nama Lengkap
                                        </label>


                                        <div className="relative">

                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    inset-y-0
                                                    left-0
                                                    flex
                                                    items-center
                                                    pl-4
                                                "
                                            >

                                                <UserRound
                                                    size={19}
                                                    className="
                                                        text-slate-400
                                                    "
                                                />

                                            </div>


                                            <input
                                                id="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan nama lengkap sesuai KTP"
                                                autoComplete="name"
                                                required
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    bg-slate-50
                                                    py-3.5
                                                    pl-11
                                                    pr-4
                                                    text-sm
                                                    text-slate-800
                                                    outline-none
                                                    transition-all
                                                    duration-300
                                                    placeholder:text-slate-400
                                                    focus:border-blue-500
                                                    focus:bg-white
                                                    focus:ring-4
                                                    focus:ring-blue-500/10
                                                "
                                            />

                                        </div>

                                    </div>

                                    {/* NOMOR HP */}

                                    <div>

                                        <label
                                            htmlFor="phone"
                                            className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
        "
                                        >
                                            Nomor HP
                                        </label>

                                        <div className="relative">

                                            <div
                                                className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                flex
                items-center
                pl-4
            "
                                            >

                                                <Phone
                                                    size={19}
                                                    className="text-slate-400"
                                                />

                                            </div>


                                            <input
                                                id="phone"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(
                                                        e.target.value.replace(/\D/g, "")
                                                    )
                                                }
                                                placeholder="Contoh: 081234567890"
                                                autoComplete="tel"
                                                required
                                                className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-3.5
                pl-11
                pr-4
                text-sm
                text-slate-800
                outline-none
                transition-all
                duration-300
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
            "
                                            />

                                        </div>

                                    </div>
                                    {/* =====================================================
    GENDER
===================================================== */}

                                    <div>

                                        <label
                                            htmlFor="gender"
                                            className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
        "
                                        >
                                            Jenis Kelamin
                                        </label>


                                        <select
                                            id="gender"
                                            value={gender}
                                            onChange={(e) =>
                                                setGender(
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3.5
            text-sm
            text-slate-800
            outline-none
            transition-all
            duration-300
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
        "
                                        >

                                            <option value="laki-laki">
                                                Laki-laki
                                            </option>

                                        </select>

                                    </div>
                                    {/* =====================================================
    PEKERJAAN
===================================================== */}

                                    <div>

                                        <label
                                            htmlFor="occupation"
                                            className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
        "
                                        >
                                            Pekerjaan
                                        </label>


                                        <input
                                            id="occupation"
                                            type="text"
                                            value={occupation}
                                            onChange={(e) =>
                                                setOccupation(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: Karyawan Swasta"
                                            autoComplete="organization-title"
                                            required
                                            className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3.5
            text-sm
            text-slate-800
            outline-none
            transition-all
            duration-300
            placeholder:text-slate-400
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
        "
                                        />

                                    </div>
                                    {/* =====================================================
    ALAMAT
===================================================== */}

                                    <div>

                                        <label
                                            htmlFor="address"
                                            className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
        "
                                        >
                                            Alamat
                                        </label>


                                        <div className="relative">

                                            <div
                                                className="
                pointer-events-none
                absolute
                left-0
                top-0
                flex
                h-full
                items-start
                pl-4
                pt-4
            "
                                            >

                                                <Building2
                                                    size={19}
                                                    className="text-slate-400"
                                                />

                                            </div>


                                            <textarea
                                                id="address"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan alamat lengkap sesuai KTP"
                                                autoComplete="street-address"
                                                required
                                                rows={3}
                                                className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-3.5
                pl-11
                pr-4
                text-sm
                text-slate-800
                outline-none
                transition-all
                duration-300
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
            "
                                            />

                                        </div>

                                    </div>
                                    {/* =====================================================
    NOMOR KTP
===================================================== */}

                                    <div>

                                        <label
                                            htmlFor="identityNumber"
                                            className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
        "
                                        >
                                            Nomor KTP
                                        </label>

                                        <input
                                            id="identityNumber"
                                            type="text"
                                            value={identityNumber}
                                            onChange={(e) =>
                                                setIdentityNumber(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 16)
                                                )
                                            }
                                            placeholder="Masukkan 16 digit nomor KTP"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            maxLength={16}
                                            required
                                            className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3.5
            text-sm
            text-slate-800
            outline-none
            transition-all
            duration-300
            placeholder:text-slate-400
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
        "
                                        />



                                    </div>
                                    {/* =====================================================
    FOTO KTP
===================================================== */}

                                    <div>

                                        <label
                                            htmlFor="ktpFile"
                                            className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
        "
                                        >
                                            Foto KTP
                                        </label>


                                        <input
                                            id="ktpFile"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => {

                                                const file =
                                                    e.target.files?.[0] || null;

                                                setKtpFile(file);

                                            }}
                                            required
                                            className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            text-slate-700
            outline-none
            transition-all
            duration-300
            file:mr-4
            file:rounded-lg
            file:border-0
            file:bg-blue-600
            file:px-4
            file:py-2
            file:text-sm
            file:font-semibold
            file:text-white
            hover:file:bg-blue-700
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
        "
                                        />


                                        <p className="mt-1.5 text-xs text-slate-400">
                                            Format JPG, PNG, atau WEBP. Foto KTP harus terlihat jelas ya.
                                        </p>


                                        {ktpFile && (

                                            <p className="mt-2 text-xs font-medium text-emerald-600">
                                                File dipilih: {ktpFile.name}
                                            </p>

                                        )}

                                    </div>

                                    {/* =====================================================
    TUJUAN / ALASAN NGEKOS
===================================================== */}

                                    <div>

                                        <label
                                            htmlFor="boardingPurpose"
                                            className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
        "
                                        >
                                            Tujuan / Alasan Ngekos
                                        </label>


                                        <textarea
                                            id="boardingPurpose"
                                            value={boardingPurpose}
                                            onChange={(e) =>
                                                setBoardingPurpose(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: bekerja di sekitar Jalan Srikandi"
                                            required
                                            rows={3}
                                            className="
            w-full
            resize-none
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3.5
            text-sm
            text-slate-800
            outline-none
            transition-all
            duration-300
            placeholder:text-slate-400
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
        "
                                        />
                                    </div>
                                    {/* USERNAME */}

                                    <div>

                                        <label
                                            htmlFor="username"
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            Username
                                        </label>


                                        <div className="relative">

                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    inset-y-0
                                                    left-0
                                                    flex
                                                    items-center
                                                    pl-4
                                                "
                                            >

                                                <UserRound
                                                    size={19}
                                                    className="
                                                        text-slate-400
                                                    "
                                                />

                                            </div>


                                            <input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Buat username"
                                                autoComplete="username"
                                                required
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    bg-slate-50
                                                    py-3.5
                                                    pl-11
                                                    pr-4
                                                    text-sm
                                                    text-slate-800
                                                    outline-none
                                                    transition-all
                                                    duration-300
                                                    placeholder:text-slate-400
                                                    focus:border-blue-500
                                                    focus:bg-white
                                                    focus:ring-4
                                                    focus:ring-blue-500/10
                                                "
                                            />

                                        </div>

                                    </div>


                                    {/* PASSWORD */}

                                    <div>

                                        <label
                                            htmlFor="password"
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            Password
                                        </label>


                                        <div className="relative">

                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    inset-y-0
                                                    left-0
                                                    flex
                                                    items-center
                                                    pl-4
                                                "
                                            >

                                                <LockKeyhole
                                                    size={19}
                                                    className="
                                                        text-slate-400
                                                    "
                                                />

                                            </div>


                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Buat password"
                                                autoComplete="new-password"
                                                required
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    bg-slate-50
                                                    py-3.5
                                                    pl-11
                                                    pr-12
                                                    text-sm
                                                    text-slate-800
                                                    outline-none
                                                    transition-all
                                                    duration-300
                                                    placeholder:text-slate-400
                                                    focus:border-blue-500
                                                    focus:bg-white
                                                    focus:ring-4
                                                    focus:ring-blue-500/10
                                                "
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    inset-y-0
                                                    right-0
                                                    flex
                                                    items-center
                                                    pr-4
                                                    text-slate-400
                                                    transition
                                                    hover:text-slate-600
                                                "
                                            >

                                                {showPassword ? (
                                                    <EyeOff size={19} />
                                                ) : (
                                                    <Eye size={19} />
                                                )}

                                            </button>

                                        </div>

                                    </div>


                                    {/* CONFIRM PASSWORD */}

                                    <div>

                                        <label
                                            htmlFor="confirmPassword"
                                            className="
                                                mb-2
                                                block
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            Konfirmasi Password
                                        </label>


                                        <div className="relative">

                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    inset-y-0
                                                    left-0
                                                    flex
                                                    items-center
                                                    pl-4
                                                "
                                            >

                                                <LockKeyhole
                                                    size={19}
                                                    className="
                                                        text-slate-400
                                                    "
                                                />

                                            </div>


                                            <input
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    confirmPassword
                                                }
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ulangi password"
                                                autoComplete="new-password"
                                                required
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    bg-slate-50
                                                    py-3.5
                                                    pl-11
                                                    pr-12
                                                    text-sm
                                                    text-slate-800
                                                    outline-none
                                                    transition-all
                                                    duration-300
                                                    placeholder:text-slate-400
                                                    focus:border-blue-500
                                                    focus:bg-white
                                                    focus:ring-4
                                                    focus:ring-blue-500/10
                                                "
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    inset-y-0
                                                    right-0
                                                    flex
                                                    items-center
                                                    pr-4
                                                    text-slate-400
                                                    transition
                                                    hover:text-slate-600
                                                "
                                            >

                                                {showConfirmPassword ? (
                                                    <EyeOff size={19} />
                                                ) : (
                                                    <Eye size={19} />
                                                )}

                                            </button>

                                        </div>

                                    </div>


                                    {/* SUBMIT */}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="
                                            group
                                            mt-2
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-blue-600
                                            px-4
                                            py-3.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-lg
                                            shadow-blue-600/20
                                            transition-all
                                            duration-300
                                            hover:-translate-y-0.5
                                            hover:bg-blue-700
                                            hover:shadow-xl
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >

                                        {loading ? (

                                            <>
                                                <span
                                                    className="
                                                        h-5
                                                        w-5
                                                        animate-spin
                                                        rounded-full
                                                        border-2
                                                        border-white/30
                                                        border-t-white
                                                    "
                                                />

                                                Membuat akun...

                                            </>

                                        ) : (

                                            <>
                                                Daftar Akun

                                                <ArrowRight
                                                    size={18}
                                                    className="
                                                        transition-transform
                                                        duration-300
                                                        group-hover:translate-x-1
                                                    "
                                                />

                                            </>

                                        )}

                                    </button>

                                </form>


                                {/* LOGIN LINK */}

                                <div
                                    className="
                                        mt-7
                                        border-t
                                        border-slate-100
                                        pt-6
                                        text-center
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        Sudah memiliki akun?
                                    </p>


                                    <Link
                                        to="/login"
                                        className="
                                            mt-1
                                            inline-block
                                            text-sm
                                            font-semibold
                                            text-blue-600
                                            transition
                                            hover:text-blue-700
                                        "
                                    >
                                        Masuk ke akun
                                    </Link>

                                </div>


                                {/* SECURITY */}

                                <div
                                    className="
                                        register-fade
                                        mt-6
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >

                                    <ShieldCheck
                                        size={16}
                                        className="text-emerald-500"
                                    />

                                    <p
                                        className="
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Data akun diproses secara aman
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Register;