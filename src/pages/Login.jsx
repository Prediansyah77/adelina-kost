import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LockKeyhole,
    UserRound,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Building2,
} from "lucide-react";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                username,
                password,
            });

            const { token, user } = response.data.data;

            // =====================================================
            // SIMPAN TOKEN
            // =====================================================

            localStorage.setItem("token", token);

            // =====================================================
            // SIMPAN DATA USER
            // =====================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // =====================================================
            // REDIRECT BERDASARKAN ROLE
            // =====================================================

            if (user.role === "admin") {

                navigate("/admin/dashboard");

            } else if (user.role === "penghuni") {

                navigate("/tenant/dashboard");

            } else {

                // Jika role tidak dikenal
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setError(
                    "Role pengguna tidak dikenali"
                );

            }

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Gagal melakukan login"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            {/* =====================================================
                ANIMATION STYLE
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

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.92);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes floatGlow {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }

                    50% {
                        transform: translate(15px, 20px) scale(1.08);
                    }
                }

                @keyframes floatGlowReverse {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }

                    50% {
                        transform: translate(-20px, -15px) scale(1.06);
                    }
                }

                @keyframes pulseSoft {
                    0%,
                    100% {
                        opacity: 0.45;
                    }

                    50% {
                        opacity: 0.8;
                    }
                }

                @keyframes errorShake {
                    0% {
                        transform: translateX(0);
                    }

                    25% {
                        transform: translateX(-4px);
                    }

                    50% {
                        transform: translateX(4px);
                    }

                    75% {
                        transform: translateX(-3px);
                    }

                    100% {
                        transform: translateX(0);
                    }
                }

                .login-fade {
                    animation: fadeIn 0.8s ease-out both;
                }

                .login-slide-up {
                    animation: slideUp 0.8s ease-out both;
                }

                .login-slide-right {
                    animation: slideRight 0.8s ease-out both;
                }

                .login-slide-left {
                    animation: slideLeft 0.8s ease-out both;
                }

                .login-scale {
                    animation: scaleIn 0.7s ease-out both;
                }

                .login-glow {
                    animation: floatGlow 8s ease-in-out infinite;
                }

                .login-glow-reverse {
                    animation: floatGlowReverse 10s ease-in-out infinite;
                }

                .login-pulse {
                    animation: pulseSoft 3s ease-in-out infinite;
                }

                .login-error {
                    animation:
                        errorShake 0.45s ease-out,
                        fadeIn 0.35s ease-out;
                }

                .login-delay-1 {
                    animation-delay: 0.15s;
                }

                .login-delay-2 {
                    animation-delay: 0.3s;
                }

                .login-delay-3 {
                    animation-delay: 0.45s;
                }

                .login-delay-4 {
                    animation-delay: 0.6s;
                }

                .login-delay-5 {
                    animation-delay: 0.75s;
                }

                .login-delay-6 {
                    animation-delay: 0.9s;
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


            <div className="min-h-screen overflow-hidden bg-slate-100">

                <div className="flex min-h-screen">


                    {/* =====================================================
                        LEFT BRANDING PANEL
                    ===================================================== */}

                    <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2">


                        {/* Background decoration */}

                        <div
                            className="login-glow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
                        />

                        <div
                            className="login-glow-reverse absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
                        />

                        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl login-pulse" />

                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />


                        {/* Subtle grid */}

                        <div
                            className="absolute inset-0 opacity-[0.025]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />


                        {/* Content */}

                        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">


                            {/* Logo */}

                            <div className="login-slide-right">

                                <div className="flex items-center gap-3">

                                    <div className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 transition duration-300 hover:scale-105 hover:rotate-2 hover:bg-blue-500">

                                        <Building2
                                            size={25}
                                            className="text-white transition-transform duration-300 group-hover:scale-110"
                                        />

                                    </div>

                                    <div>

                                        <h1 className="text-xl font-bold tracking-wide text-white">
                                            ADELINA KOST
                                        </h1>

                                        <p className="text-xs text-slate-400">
                                            Management System
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Main message */}

                            <div className="max-w-xl">


                                <div className="login-slide-right login-delay-1 mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur-sm transition duration-300 hover:border-blue-400/40 hover:bg-blue-500/15">

                                    <ShieldCheck
                                        size={17}
                                        className="animate-pulse"
                                    />

                                    Sistem Manajemen Kost

                                </div>


                                <h2 className="login-slide-right login-delay-2 text-4xl font-bold leading-tight text-white xl:text-5xl">

                                    Kelola ADELINA KOST

                                    <span className="block text-blue-400 transition-colors duration-300">
                                        lebih mudah & teratur.
                                    </span>

                                </h2>


                                <p className="login-slide-right login-delay-3 mt-6 max-w-lg text-base leading-7 text-slate-400">

                                    Kelola penghuni, kamar, kontrak, tagihan,
                                    pembayaran, dan keuangan ADELINA KOST
                                    dalam satu sistem terintegrasi.

                                </p>


                                {/* Feature */}

                                <div className="mt-10 grid grid-cols-2 gap-4">


                                    <div className="login-slide-up login-delay-4 group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-950/20">

                                        <p className="text-sm font-semibold text-white">
                                            Manajemen Penghuni
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Data penghuni tersimpan terorganisir.
                                        </p>

                                    </div>


                                    <div className="login-slide-up login-delay-5 group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-950/20">

                                        <p className="text-sm font-semibold text-white">
                                            Keuangan Kost
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Pantau tagihan dan pembayaran.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Footer */}

                            <div className="login-fade login-delay-5 text-sm text-slate-500">

                                © {new Date().getFullYear()} ADELINA KOST.
                                All rights reserved.

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        RIGHT LOGIN PANEL
                    ===================================================== */}

                    <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">


                        <div className="w-full max-w-md">


                            {/* Mobile Logo */}

                            <div className="login-scale mb-8 flex flex-col items-center lg:hidden">

                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 transition duration-300 hover:scale-105">

                                    <Building2
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <h1 className="text-xl font-bold text-slate-800">
                                    ADELINA KOST
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Management System
                                </p>

                            </div>


                            {/* Login Card */}

                            <div className="login-slide-left rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-300/40 sm:p-9">


                                {/* Header */}

                                <div className="login-slide-up login-delay-1 mb-8">

                                    <p className="mb-2 text-sm font-medium text-blue-600">
                                        LOGIN
                                    </p>

                                    <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                                        Selamat datang 👋
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Silakan masuk untuk mengakses
                                        sistem ADELINA KOST.
                                    </p>

                                </div>


                                {/* Error */}

                                {error && (

                                    <div className="login-error mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                        <div className="flex items-start gap-3">

                                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                                !
                                            </div>

                                            <div>

                                                <p className="text-sm font-semibold text-red-700">
                                                    Login gagal
                                                </p>

                                                <p className="mt-0.5 text-xs leading-5 text-red-600">
                                                    {error}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )}


                                {/* Form */}

                                <form
                                    onSubmit={handleLogin}
                                    className="space-y-5"
                                >


                                    {/* Username */}

                                    <div className="login-slide-up login-delay-2">

                                        <label
                                            htmlFor="username"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Username
                                        </label>

                                        <div className="relative">

                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">

                                                <UserRound
                                                    size={19}
                                                    className="text-slate-400 transition-colors duration-300"
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
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:shadow-md focus:shadow-blue-500/5"
                                                placeholder="Masukkan username"
                                                autoComplete="username"
                                                required
                                            />

                                        </div>

                                    </div>


                                    {/* Password */}

                                    <div className="login-slide-up login-delay-3">

                                        <div className="mb-2 flex items-center justify-between">

                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-semibold text-slate-700"
                                            >
                                                Password
                                            </label>

                                        </div>

                                        <div className="relative">

                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">

                                                <LockKeyhole
                                                    size={19}
                                                    className="text-slate-400"
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
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:shadow-md focus:shadow-blue-500/5"
                                                placeholder="Masukkan password"
                                                autoComplete="current-password"
                                                required
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-all duration-300 hover:scale-110 hover:text-slate-600 active:scale-95"
                                                aria-label={
                                                    showPassword
                                                        ? "Sembunyikan password"
                                                        : "Tampilkan password"
                                                }
                                            >

                                                {showPassword ? (
                                                    <EyeOff size={19} />
                                                ) : (
                                                    <Eye size={19} />
                                                )}

                                            </button>

                                        </div>

                                    </div>


                                    {/* Login Button */}

                                    <div className="login-slide-up login-delay-4">

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                        >

                                            {loading ? (
                                                <>
                                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                                    Memproses login...

                                                </>
                                            ) : (
                                                <>
                                                    Masuk ke Sistem

                                                    <ArrowRight
                                                        size={18}
                                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                                    />

                                                </>
                                            )}

                                        </button>

                                    </div>

                                </form>


                                {/* =====================================================
                                    REGISTER
                                ===================================================== */}

                                <div className="login-fade login-delay-5 mt-6 text-center">

                                    <p className="text-sm text-slate-500">

                                        Belum punya akun?

                                        <Link
                                            to="/register"
                                            className="ml-1 font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700 hover:underline"
                                        >
                                            Daftar Akun
                                        </Link>

                                    </p>

                                </div>


                                {/* Security Info */}

                                <div className="login-fade login-delay-5 mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">

                                    <ShieldCheck
                                        size={16}
                                        className="text-green-500 transition-transform duration-300 hover:scale-110"
                                    />

                                    <p className="text-xs text-slate-400">
                                        Akses aman berdasarkan hak akses pengguna
                                    </p>

                                </div>

                            </div>


                            {/* Mobile Footer */}

                            <p className="login-fade login-delay-6 mt-6 text-center text-xs text-slate-400 lg:hidden">

                                © {new Date().getFullYear()} ADELINA KOST

                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Login;