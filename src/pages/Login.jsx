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
    CheckCircle2,
    MapPin,
} from "lucide-react";

import api from "../services/api";
import logo from "../assets/adelina-kost-logo.png";


// =====================================================
// LOGIN
// =====================================================

function Login() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // HANDLE LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        username,
                        password,
                    }
                );


            const {
                token,
                user,
            } = response.data.data;


            // =================================================
            // SIMPAN TOKEN
            // =================================================

            localStorage.setItem(
                "token",
                token
            );


            // =================================================
            // SIMPAN USER
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // =================================================
            // REDIRECT ROLE
            // =================================================

            if (
                user.role === "admin"
            ) {

                navigate(
                    "/admin/dashboard"
                );

            }

            else if (
                user.role === "penghuni"
            ) {

                navigate(
                    "/tenant/dashboard"
                );

            }

            else {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                setError(
                    "Role pengguna tidak dikenali"
                );

            }


        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Gagal melakukan login"
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RETURN
    // =====================================================

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


                @keyframes floatOne {

                    0%,
                    100% {
                        transform: translate(0, 0);
                    }

                    50% {
                        transform: translate(20px, 20px);
                    }

                }


                @keyframes floatTwo {

                    0%,
                    100% {
                        transform: translate(0, 0);
                    }

                    50% {
                        transform: translate(-20px, -15px);
                    }

                }


                @keyframes shake {

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
                    animation:
                        fadeIn
                        0.7s
                        ease-out
                        both;
                }


                .login-up {
                    animation:
                        slideUp
                        0.7s
                        ease-out
                        both;
                }


                .login-right {
                    animation:
                        slideRight
                        0.7s
                        ease-out
                        both;
                }


                .login-left {
                    animation:
                        slideLeft
                        0.7s
                        ease-out
                        both;
                }


                .login-scale {
                    animation:
                        scaleIn
                        0.6s
                        ease-out
                        both;
                }


                .login-float-one {
                    animation:
                        floatOne
                        8s
                        ease-in-out
                        infinite;
                }


                .login-float-two {
                    animation:
                        floatTwo
                        10s
                        ease-in-out
                        infinite;
                }


                .login-delay-1 {
                    animation-delay:
                        0.1s;
                }


                .login-delay-2 {
                    animation-delay:
                        0.2s;
                }


                .login-delay-3 {
                    animation-delay:
                        0.3s;
                }


                .login-delay-4 {
                    animation-delay:
                        0.4s;
                }


                .login-delay-5 {
                    animation-delay:
                        0.5s;
                }


                .login-delay-6 {
                    animation-delay:
                        0.6s;
                }


                .login-error {
                    animation:
                        shake
                        0.4s
                        ease-out;
                }


                @media (
                    prefers-reduced-motion: reduce
                ) {

                    *,
                    *::before,
                    *::after {

                        animation-duration:
                            0.01ms !important;

                        animation-iteration-count:
                            1 !important;

                        transition-duration:
                            0.01ms !important;

                    }

                }

            `}</style>


            {/* =====================================================
                MAIN WRAPPER
            ===================================================== */}

            <div
                className="
                    min-h-screen
                    overflow-hidden
                    bg-slate-100
                "
            >

                <div
                    className="
                        flex
                        min-h-screen
                    "
                >


                    {/* =================================================
                        LEFT BRANDING
                    ================================================= */}

                    <section
                        className="
                            relative
                            hidden
                            overflow-hidden
                            lg:flex
                            lg:w-1/2
                        "
                    >

                        {/* Background */}

                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-br
                                from-slate-950
                                via-blue-950
                                to-slate-900
                            "
                        />


                        {/* Glow */}

                        <div
                            className="
                                login-float-one
                                absolute
                                -left-32
                                -top-32
                                h-96
                                w-96
                                rounded-full
                                bg-blue-500/20
                                blur-3xl
                            "
                        />

                        <div
                            className="
                                login-float-two
                                absolute
                                -bottom-40
                                -right-32
                                h-96
                                w-96
                                rounded-full
                                bg-indigo-500/20
                                blur-3xl
                            "
                        />


                        {/* Grid */}

                        <div
                            className="
                                absolute
                                inset-0
                                opacity-[0.035]
                            "
                            style={{
                                backgroundImage:
                                    `
                                    linear-gradient(
                                        rgba(255,255,255,1)
                                        1px,
                                        transparent 1px
                                    ),
                                    linear-gradient(
                                        90deg,
                                        rgba(255,255,255,1)
                                        1px,
                                        transparent 1px
                                    )
                                    `,
                                backgroundSize:
                                    "40px 40px",
                            }}
                        />


                        {/* Left Content */}

                        <div
                            className="
                                relative
                                z-10
                                flex
                                min-h-screen
                                w-full
                                flex-col
                                justify-between
                                p-10
                                xl:p-14
                            "
                        >


                            {/* =================================================
                                LOGO
                            ================================================= */}

                            <div
                                className="
                                    login-right
                                "
                            >

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-16
                                            w-32
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white
                                            p-2
                                            shadow-2xl
                                            shadow-black/20
                                        "
                                    >

                                        <img
                                            src={logo}
                                            alt="ADELINA KOST"
                                            className="
                                                h-full
                                                w-full
                                                object-contain
                                            "
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-lg
                                                font-bold
                                                tracking-wide
                                                text-white
                                            "
                                        >
                                            ADELINA KOST
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-medium
                                                text-slate-400
                                            "
                                        >
                                            Management System
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                MAIN MESSAGE
                            ================================================= */}

                            <div
                                className="
                                    max-w-2xl
                                "
                            >

                                {/* Badge */}

                                <div
                                    className="
                                        login-right
                                        login-delay-1
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
                                        font-medium
                                        text-blue-300
                                        backdrop-blur-sm
                                    "
                                >

                                    <ShieldCheck
                                        size={17}
                                    />

                                    Sistem Manajemen Kost

                                </div>


                                {/* Title */}

                                <h1
                                    className="
                                        login-right
                                        login-delay-2
                                        text-4xl
                                        font-bold
                                        leading-tight
                                        tracking-tight
                                        text-white
                                        xl:text-5xl
                                    "
                                >

                                    Kelola ADELINA KOST

                                    <span
                                        className="
                                            mt-1
                                            block
                                            text-blue-400
                                        "
                                    >
                                        lebih mudah &
                                        teratur.
                                    </span>

                                </h1>


                                {/* Description */}

                                <p
                                    className="
                                        login-right
                                        login-delay-3
                                        mt-6
                                        max-w-xl
                                        text-base
                                        leading-7
                                        text-slate-400
                                    "
                                >

                                    Kelola penghuni, kamar,
                                    kontrak, tagihan,
                                    pembayaran, dan keuangan
                                    ADELINA KOST dalam satu
                                    sistem terintegrasi.

                                </p>


                                {/* Features */}

                                <div
                                    className="
                                        mt-9
                                        grid
                                        grid-cols-2
                                        gap-4
                                    "
                                >

                                    <LoginFeature
                                        title="Penghuni"
                                        description="Data penghuni terorganisir."
                                        delay="login-delay-4"
                                    />


                                    <LoginFeature
                                        title="Kamar"
                                        description="Pantau status kamar."
                                        delay="login-delay-4"
                                    />


                                    <LoginFeature
                                        title="Tagihan"
                                        description="Kelola pembayaran."
                                        delay="login-delay-5"
                                    />


                                    <LoginFeature
                                        title="Keuangan"
                                        description="Pantau kondisi finansial."
                                        delay="login-delay-5"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                LEFT FOOTER
                            ================================================= */}

                            <div
                                className="
                                    login-fade
                                    login-delay-6
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    <MapPin
                                        size={16}
                                        className="
                                            text-blue-400
                                        "
                                    />

                                    Pekanbaru, Riau

                                </div>


                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        text-slate-600
                                    "
                                >

                                    © {new Date().getFullYear()}
                                    {" "}
                                    ADELINA KOST.
                                    {" "}
                                    All rights reserved.

                                </p>

                            </div>

                        </div>

                    </section>


                    {/* =====================================================
                        RIGHT LOGIN AREA
                    ===================================================== */}

                    <main
                        className="
                            relative
                            flex
                            min-h-screen
                            w-full
                            items-center
                            justify-center
                            overflow-hidden
                            bg-slate-50
                            px-5
                            py-10
                            sm:px-8
                            lg:w-1/2
                            lg:px-12
                        "
                    >

                        {/* Background Decoration */}

                        <div
                            className="
                                absolute
                                -right-32
                                -top-32
                                h-80
                                w-80
                                rounded-full
                                bg-blue-100/60
                                blur-3xl
                            "
                        />

                        <div
                            className="
                                absolute
                                -bottom-32
                                -left-32
                                h-80
                                w-80
                                rounded-full
                                bg-indigo-100/50
                                blur-3xl
                            "
                        />


                        {/* =================================================
                            LOGIN WRAPPER
                        ================================================= */}

                        <div
                            className="
                                relative
                                z-10
                                w-full
                                max-w-md
                            "
                        >


                            {/* =================================================
                                MOBILE LOGO
                            ================================================= */}

                            <div
                                className="
                                    login-scale
                                    mb-7
                                    flex
                                    flex-col
                                    items-center
                                    lg:hidden
                                "
                            >

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-5
                                        py-3
                                        shadow-lg
                                    "
                                >

                                    <img
                                        src={logo}
                                        alt="ADELINA KOST"
                                        className="
                                            h-16
                                            w-auto
                                            max-w-[240px]
                                            object-contain
                                        "
                                    />

                                </div>


                                <p
                                    className="
                                        mt-3
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.2em]
                                        text-slate-400
                                    "
                                >
                                    Management System
                                </p>

                            </div>


                            {/* =================================================
                                LOGIN CARD
                            ================================================= */}

                            <div
                                className="
                                    login-left
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-7
                                    shadow-xl
                                    shadow-slate-200/70
                                    sm:p-9
                                "
                            >


                                {/* =================================================
                                    CARD LOGO
                                ================================================= */}

                                <div
                                    className="
                                        login-scale
                                        mb-7
                                        flex
                                        justify-center
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-20
                                            w-44
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-slate-100
                                            bg-slate-50
                                            p-3
                                            shadow-sm
                                        "
                                    >

                                        <img
                                            src={logo}
                                            alt="ADELINA KOST"
                                            className="
                                                h-full
                                                w-full
                                                object-contain
                                            "
                                        />

                                    </div>

                                </div>


                                {/* =================================================
                                    HEADER
                                ================================================= */}

                                <div
                                    className="
                                        login-up
                                        login-delay-1
                                        mb-7
                                    "
                                >

                                    <div
                                        className="
                                            mb-2
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-blue-600
                                            "
                                        />

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.2em]
                                                text-blue-600
                                            "
                                        >
                                            LOGIN
                                        </p>

                                    </div>


                                    <h2
                                        className="
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                            sm:text-3xl
                                        "
                                    >
                                        Selamat datang 👋
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        Masuk untuk mengakses
                                        sistem ADELINA KOST.
                                    </p>

                                </div>


                                {/* =================================================
                                    ERROR
                                ================================================= */}

                                {error && (

                                    <div
                                        className="
                                            login-error
                                            mb-5
                                            rounded-2xl
                                            border
                                            border-red-200
                                            bg-red-50
                                            px-4
                                            py-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-6
                                                    w-6
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-red-100
                                                    text-xs
                                                    font-bold
                                                    text-red-600
                                                "
                                            >
                                                !
                                            </div>


                                            <div>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-red-700
                                                    "
                                                >
                                                    Login gagal
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

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                    FORM
                                ================================================= */}

                                <form
                                    onSubmit={handleLogin}
                                    className="
                                        space-y-5
                                    "
                                >


                                    {/* =================================================
                                        USERNAME
                                    ================================================= */}

                                    <div
                                        className="
                                            login-up
                                            login-delay-2
                                        "
                                    >

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


                                        <div
                                            className="
                                                relative
                                            "
                                        >

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
                                                    transition
                                                    duration-300
                                                    placeholder:text-slate-400
                                                    focus:border-blue-500
                                                    focus:bg-white
                                                    focus:ring-4
                                                    focus:ring-blue-500/10
                                                "
                                                placeholder="Masukkan username"
                                                autoComplete="username"
                                                required
                                            />

                                        </div>

                                    </div>


                                    {/* =================================================
                                        PASSWORD
                                    ================================================= */}

                                    <div
                                        className="
                                            login-up
                                            login-delay-3
                                        "
                                    >

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


                                        <div
                                            className="
                                                relative
                                            "
                                        >

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
                                                    transition
                                                    duration-300
                                                    placeholder:text-slate-400
                                                    focus:border-blue-500
                                                    focus:bg-white
                                                    focus:ring-4
                                                    focus:ring-blue-500/10
                                                "
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
                                                aria-label={
                                                    showPassword
                                                        ? "Sembunyikan password"
                                                        : "Tampilkan password"
                                                }
                                            >

                                                {showPassword ? (

                                                    <EyeOff
                                                        size={19}
                                                    />

                                                ) : (

                                                    <Eye
                                                        size={19}
                                                    />

                                                )}

                                            </button>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        LOGIN BUTTON
                                    ================================================= */}

                                    <div
                                        className="
                                            login-up
                                            login-delay-4
                                        "
                                    >

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
                                                transition
                                                duration-300
                                                hover:-translate-y-0.5
                                                hover:bg-blue-700
                                                hover:shadow-xl
                                                hover:shadow-blue-600/30
                                                active:translate-y-0
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

                                                    Memproses login...

                                                </>

                                            ) : (

                                                <>

                                                    Masuk ke Sistem

                                                    <ArrowRight
                                                        size={18}
                                                        className="
                                                            transition
                                                            duration-300
                                                            group-hover:translate-x-1
                                                        "
                                                    />

                                                </>

                                            )}

                                        </button>

                                    </div>

                                </form>


                                {/* =================================================
                                    REGISTER
                                ================================================= */}

                                <div
                                    className="
                                        login-fade
                                        login-delay-5
                                        mt-6
                                        text-center
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >

                                        Belum punya akun?

                                        <Link
                                            to="/register"
                                            className="
                                                ml-1
                                                font-semibold
                                                text-blue-600
                                                transition
                                                hover:text-blue-700
                                                hover:underline
                                            "
                                        >
                                            Daftar Akun
                                        </Link>

                                    </p>

                                </div>


                                {/* =================================================
                                    SECURITY
                                ================================================= */}

                                <div
                                    className="
                                        login-fade
                                        login-delay-6
                                        mt-7
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        border-t
                                        border-slate-100
                                        pt-6
                                    "
                                >

                                    <ShieldCheck
                                        size={16}
                                        className="
                                            text-emerald-500
                                        "
                                    />

                                    <p
                                        className="
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Akses aman berdasarkan
                                        hak akses pengguna
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                MOBILE FOOTER
                            ================================================= */}

                            <p
                                className="
                                    login-fade
                                    mt-6
                                    text-center
                                    text-xs
                                    text-slate-400
                                    lg:hidden
                                "
                            >

                                © {new Date().getFullYear()}
                                {" "}
                                ADELINA KOST

                            </p>

                        </div>

                    </main>

                </div>

            </div>

        </>

    );

}


// =====================================================
// LOGIN FEATURE
// =====================================================

function LoginFeature({
    title,
    description,
    delay,
}) {

    return (

        <div
            className={`
                login-up
                ${delay}
                group
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                backdrop-blur-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:border-blue-400/30
                hover:bg-white/10
            `}
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <CheckCircle2
                    size={16}
                    className="
                        shrink-0
                        text-blue-400
                    "
                />


                <p
                    className="
                        text-sm
                        font-semibold
                        text-white
                    "
                >
                    {title}
                </p>

            </div>


            <p
                className="
                    mt-1.5
                    text-xs
                    leading-5
                    text-slate-500
                "
            >
                {description}
            </p>

        </div>

    );

}


// =====================================================
// EXPORT
// =====================================================

export default Login;