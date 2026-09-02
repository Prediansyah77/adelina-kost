import {
    MapPin,
    Navigation,
    Building2,
    GraduationCap,
    ShoppingBag,
    Hospital,
    Car,
    CheckCircle2,
} from "lucide-react";

function Location() {

    // =====================================================
    // DATA LOKASI BANGUNAN
    // =====================================================

    const locations = [
        {
            id: 1,
            name: "Bangunan 1",
            type: "Bangunan Lama",

            address: [
                "Jalan Srikandi",
                "Pekanbaru, Riau",
            ],

            description:
                "Bangunan lama ADELINA KOST yang berada di kawasan Jalan Srikandi, Pekanbaru.",

            mapUrl:
                "https://maps.app.goo.gl/NnAr9RDaxM7DtVax8",
        },

        {
            id: 2,
            name: "Bangunan 2",
            type: "Bangunan Baru",

            address: [
                "Alamat Bangunan 2",
                "Pekanbaru, Riau",
            ],

            description:
                "Bangunan baru ADELINA KOST dengan lokasi yang berbeda dari bangunan lama.",

            mapUrl:
                "https://maps.app.goo.gl/VaRxTtRq1PAJTAZ39",
        },
    ];


    // =====================================================
    // TEMPAT DI SEKITAR
    // =====================================================

    const nearbyPlaces = [
        {
            icon: GraduationCap,
            title: "UMRI",
            description:
                "Dekat dengan Universitas Muhammadiyah Riau.",
        },
        {
            icon: ShoppingBag,
            title: "Mall SKA",
            description:
                "Pusat perbelanjaan dan berbagai kebutuhan sehari-hari.",
        },
        {
            icon: ShoppingBag,
            title: "Living World",
            description:
                "Pilihan tempat belanja, kuliner, dan hiburan.",
        },
        {
            icon: ShoppingBag,
            title: "Transmart",
            description:
                "Mudah menjangkau kebutuhan belanja harian.",
        },
        {
            icon: Hospital,
            title: "Rumah Sakit",
            description:
                "Akses menuju berbagai fasilitas kesehatan di sekitar.",
        },
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

                    <div className="max-w-3xl">

                        {/* BADGE */}

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">

                            <MapPin size={17} />

                            Lokasi ADELINA KOST

                        </div>


                        {/* TITLE */}

                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">

                            Dua lokasi,

                            <span className="block text-blue-600">
                                satu ADELINA KOST.
                            </span>

                        </h1>


                        {/* DESCRIPTION */}

                        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">

                            ADELINA KOST memiliki dua bangunan
                            dengan lokasi yang berbeda di Pekanbaru.
                            Pilih lokasi yang paling sesuai dengan
                            kebutuhanmu.

                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                LOCATION CARDS
            ===================================================== */}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                {/* SECTION HEADER */}

                <div className="mb-10 max-w-2xl">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Pilihan lokasi
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Temukan lokasi yang sesuai
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">

                        Setiap bangunan memiliki lokasi tersendiri.
                        Lihat alamat dan lokasi masing-masing bangunan
                        sebelum memilih kamar.

                    </p>

                </div>


                {/* =================================================
                    LOCATION GRID
                ================================================= */}

                <div className="grid gap-8 lg:grid-cols-2">

                    {locations.map((location) => (

                        <div
                            key={location.id}
                            className="
                                overflow-hidden
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                            "
                        >

                            {/* =========================================
                                LOCATION HEADER
                            ========================================= */}

                            <div className="p-7 sm:p-9">

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                        <Building2 size={23} />

                                    </div>


                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-blue-100
                                            bg-blue-50
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-semibold
                                            text-blue-600
                                        "
                                    >
                                        {location.type}
                                    </span>

                                </div>


                                {/* NAME */}

                                <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Lokasi {location.id}
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                    {location.name}
                                </h2>


                                {/* DESCRIPTION */}

                                <p className="mt-4 text-sm leading-6 text-slate-600">
                                    {location.description}
                                </p>


                                {/* ADDRESS */}

                                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                                    <MapPin
                                        size={20}
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-slate-800">
                                            Alamat
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-slate-500">

                                            {location.address.map(
                                                (line, index) => (
                                                    <span key={index}>
                                                        {line}

                                                        {index <
                                                            location.address.length -
                                                            1 && (
                                                                <br />
                                                            )}
                                                    </span>
                                                )
                                            )}

                                        </p>

                                    </div>

                                </div>


                                {/* STRATEGIC LOCATION */}

                                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                                    <Navigation
                                        size={20}
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-slate-800">
                                            Lokasi strategis
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">

                                            Pilih bangunan berdasarkan
                                            lokasi yang paling dekat
                                            dengan aktivitas dan kebutuhanmu.

                                        </p>

                                    </div>

                                </div>


                                {/* GOOGLE MAP */}

                                <a
                                    href={location.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        mt-7
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-blue-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition
                                        hover:bg-blue-700
                                        hover:shadow-md
                                    "
                                >

                                    <MapPin size={17} />

                                    Buka di Google Maps

                                    <span className="text-base">
                                        →
                                    </span>

                                </a>

                            </div>


                            {/* =========================================
                                MAP PLACEHOLDER
                            ========================================= */}

                            <div className="relative h-64 overflow-hidden border-t border-slate-100 bg-slate-200">

                                {/* MAP BACKGROUND */}

                                <div
                                    className="absolute inset-0 opacity-40"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(rgba(100,116,139,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.18) 1px, transparent 1px)",
                                        backgroundSize: "45px 45px",
                                    }}
                                />

                                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-blue-100/80" />


                                {/* MAP ROADS */}

                                <div className="absolute left-0 top-1/2 h-8 w-full -rotate-6 bg-white/70" />

                                <div className="absolute left-1/2 top-0 h-full w-7 rotate-12 bg-white/60" />

                                <div className="absolute left-0 top-1/3 h-4 w-full rotate-12 bg-white/50" />


                                {/* LOCATION MARKER */}

                                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30">

                                        <MapPin size={27} />

                                    </div>

                                    <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-center shadow-lg">

                                        <p className="text-sm font-bold text-slate-900">
                                            {location.name}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {location.address[0]}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* =====================================================
                NEARBY
            ===================================================== */}

            <section className="border-t border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                    <div className="mb-10 max-w-2xl">

                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Sekitar ADELINA KOST
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            Dekat dengan berbagai kebutuhan
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-500">

                            Beberapa fasilitas penting yang dapat
                            dijangkau dari kawasan ADELINA KOST.

                        </p>

                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

                        {nearbyPlaces.map((place) => {

                            const Icon = place.icon;

                            return (
                                <div
                                    key={place.title}
                                    className="
                                        group
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-5
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-blue-200
                                        hover:bg-white
                                        hover:shadow-lg
                                    "
                                >

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm transition duration-300 group-hover:bg-blue-600 group-hover:text-white">

                                        <Icon size={21} />

                                    </div>

                                    <h3 className="mt-5 text-sm font-semibold text-slate-900">
                                        {place.title}
                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        {place.description}
                                    </p>

                                </div>
                            );

                        })}

                    </div>

                </div>

            </section>


            {/* =====================================================
                PARKING / ACCESS
            ===================================================== */}

            <section className="bg-slate-50">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 sm:p-10">

                        <div className="grid gap-8 md:grid-cols-2 md:items-center">

                            <div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

                                    <Car size={23} />

                                </div>

                                <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">

                                    Akses yang mudah

                                </h2>

                                <p className="mt-4 text-sm leading-6 text-slate-600">

                                    ADELINA KOST memiliki dua bangunan
                                    di lokasi yang berbeda. Pilih lokasi
                                    yang paling sesuai dengan aktivitas
                                    sehari-harimu.

                                </p>

                            </div>


                            <div className="grid gap-3 sm:grid-cols-2">

                                <div className="flex items-center gap-3 rounded-2xl border border-white bg-white p-4">

                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-green-500"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        Dua lokasi bangunan
                                    </span>

                                </div>


                                <div className="flex items-center gap-3 rounded-2xl border border-white bg-white p-4">

                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-green-500"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        Area Pekanbaru
                                    </span>

                                </div>


                                <div className="flex items-center gap-3 rounded-2xl border border-white bg-white p-4">

                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-green-500"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        Mudah dijangkau
                                    </span>

                                </div>


                                <div className="flex items-center gap-3 rounded-2xl border border-white bg-white p-4">

                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-green-500"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        Area parkir tersedia
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

export default Location;