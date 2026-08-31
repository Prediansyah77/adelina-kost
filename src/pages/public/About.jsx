import {
    Building2,
    ShieldCheck,
    Heart,
    Users,
    CheckCircle2,
    Home,
    Wifi,
    MapPin,
} from "lucide-react";

function About() {

    const values = [
        {
            icon: ShieldCheck,
            title: "Aman & Teratur",
            description:
                "Pengelolaan kost dilakukan dengan mengutamakan kenyamanan, keamanan, dan keteraturan penghuni.",
        },
        {
            icon: Heart,
            title: "Nyaman untuk Tinggal",
            description:
                "Lingkungan dan fasilitas dirancang untuk mendukung kebutuhan penghuni dalam aktivitas sehari-hari.",
        },
        {
            icon: Users,
            title: "Lingkungan yang Nyaman",
            description:
                "ADELINA KOST ditujukan untuk menciptakan lingkungan tempat tinggal yang nyaman bagi para penghuni.",
        },
    ];

    const highlights = [
        "Kost khusus pria",
        "Bukan kos kawasan bebas",
        "Lokasi strategis di Pekanbaru",
        "Kamar dengan kamar mandi pribadi",
        "WiFi tersedia",
        "Area parkir tersedia",
        "Dapur dan area jemuran bersama",
    ];

    return (
        <div className="bg-slate-50">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-white">

                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                        {/* =================================================
                            TEXT
                        ================================================= */}

                        <div className="max-w-2xl">

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">

                                <Building2 size={17} />

                                Tentang ADELINA KOST

                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">

                                Tempat tinggal yang

                                <span className="block text-blue-600">
                                    nyaman & teratur.
                                </span>

                            </h1>

                            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">

                                ADELINA KOST merupakan tempat tinggal
                                di Pekanbaru yang menyediakan kamar
                                kost dengan fasilitas yang mendukung
                                kebutuhan penghuni sehari-hari.

                            </p>

                        </div>


                        {/* =================================================
                            BRAND CARD
                        ================================================= */}

                        <div className="relative">

                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10">

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">

                                    <Building2 size={30} />

                                </div>

                                <h2 className="mt-7 text-2xl font-bold text-slate-900">

                                    ADELINA KOST

                                </h2>

                                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-blue-600">
                                    Pekanbaru
                                </p>

                                <div className="mt-6 h-px bg-slate-200" />

                                <div className="mt-6 flex items-start gap-3">

                                    <MapPin
                                        size={20}
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />

                                    <p className="text-sm leading-6 text-slate-600">

                                        Jalan Srikandi,
                                        <br />
                                        Pekanbaru, Riau

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                ABOUT
            ===================================================== */}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Tentang Kami
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">

                            Hunian untuk kebutuhan
                            sehari-hari.

                        </h2>

                        <p className="mt-5 text-sm leading-7 text-slate-600">

                            ADELINA KOST hadir sebagai pilihan tempat
                            tinggal bagi pekerja maupun mahasiswa yang
                            membutuhkan hunian yang nyaman dan memiliki
                            akses mudah ke berbagai fasilitas di sekitar
                            Pekanbaru.

                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-600">

                            Kami menyediakan berbagai fasilitas dasar
                            yang dibutuhkan penghuni, mulai dari tempat
                            tidur, lemari, kamar mandi pribadi, WiFi,
                            hingga fasilitas bersama seperti dapur,
                            area parkir, dan area jemuran.

                        </p>

                    </div>


                    {/* =================================================
                        HIGHLIGHTS
                    ================================================= */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

                        <p className="text-base font-semibold text-slate-900">
                            Keunggulan ADELINA KOST
                        </p>

                        <div className="mt-6 space-y-4">

                            {highlights.map((item) => (

                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >

                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-green-500"
                                    />

                                    <p className="text-sm text-slate-600">
                                        {item}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                VALUES
            ===================================================== */}

            <section className="border-y border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                    <div className="mx-auto mb-10 max-w-2xl text-center">

                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Nilai Kami
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">

                            Kenyamanan menjadi prioritas.

                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-500">

                            Kami berusaha memberikan pengalaman
                            tinggal yang nyaman dan teratur bagi
                            setiap penghuni.

                        </p>

                    </div>


                    <div className="grid gap-5 md:grid-cols-3">

                        {values.map((value) => {

                            const Icon = value.icon;

                            return (
                                <div
                                    key={value.title}
                                    className="
                                        group
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-6
                                        text-center
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-blue-200
                                        hover:bg-white
                                        hover:shadow-lg
                                    "
                                >

                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">

                                        <Icon size={23} />

                                    </div>

                                    <h3 className="mt-5 text-base font-semibold text-slate-900">
                                        {value.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {value.description}
                                    </p>

                                </div>
                            );

                        })}

                    </div>

                </div>

            </section>


            {/* =====================================================
                SUMMARY
            ===================================================== */}

            <section className="bg-slate-50">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                    <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-600/20 sm:p-10 lg:p-12">

                        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

                            <div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">

                                    <Home size={23} />

                                </div>

                                <h2 className="mt-6 text-2xl font-bold sm:text-3xl">

                                    ADELINA KOST

                                </h2>

                                <p className="mt-3 text-sm leading-6 text-blue-100">

                                    Tempat tinggal yang nyaman,
                                    strategis, dan mendukung aktivitas
                                    sehari-hari di Pekanbaru.

                                </p>

                            </div>


                            <div className="grid gap-3 sm:grid-cols-2">

                                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">

                                    <Wifi
                                        size={20}
                                        className="shrink-0"
                                    />

                                    <span className="text-sm">
                                        WiFi tersedia
                                    </span>

                                </div>

                                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">

                                    <MapPin
                                        size={20}
                                        className="shrink-0"
                                    />

                                    <span className="text-sm">
                                        Lokasi strategis
                                    </span>

                                </div>

                                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">

                                    <Building2
                                        size={20}
                                        className="shrink-0"
                                    />

                                    <span className="text-sm">
                                        Kamar nyaman
                                    </span>

                                </div>

                                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">

                                    <ShieldCheck
                                        size={20}
                                        className="shrink-0"
                                    />

                                    <span className="text-sm">
                                        Pengelolaan teratur
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default About;