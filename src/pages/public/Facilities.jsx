import {
    BedDouble,
    Armchair,
    Wind,
    Bath,
    Wifi,
    CookingPot,
    Car,
    Sun,
    CheckCircle2,
} from "lucide-react";

function Facilities() {

    const facilities = [
        {
            icon: BedDouble,
            title: "Spring Bed",
            description:
                "Tempat tidur yang nyaman untuk mendukung waktu istirahat penghuni.",
        },
        {
            icon: Armchair,
            title: "Lemari",
            description:
                "Lemari tersedia untuk menyimpan pakaian dan barang pribadi penghuni.",
        },
        {
            icon: Wind,
            title: "Kipas Angin",
            description:
                "Kipas angin tersedia di kamar untuk membantu menjaga sirkulasi udara.",
        },
        {
            icon: Bath,
            title: "Kamar Mandi Pribadi",
            description:
                "Setiap kamar dilengkapi dengan kamar mandi pribadi.",
        },
        {
            icon: Wifi,
            title: "WiFi",
            description:
                "Fasilitas WiFi tersedia untuk menunjang kebutuhan internet sehari-hari.",
        },
        {
            icon: CookingPot,
            title: "Dapur Umum",
            description:
                "Area dapur umum dapat digunakan penghuni untuk kebutuhan memasak.",
        },
        {
            icon: Car,
            title: "Area Parkir",
            description:
                "Tersedia area parkir untuk kendaraan penghuni.",
        },
        {
            icon: Sun,
            title: "Area Jemuran",
            description:
                "Tersedia area jemuran untuk kebutuhan mencuci dan menjemur pakaian.",
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

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">

                            <CheckCircle2 size={17} />

                            Fasilitas ADELINA KOST

                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">

                            Fasilitas yang mendukung

                            <span className="block text-blue-600">
                                aktivitas sehari-hari.
                            </span>

                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">

                            ADELINA KOST menyediakan berbagai fasilitas
                            yang dirancang untuk memberikan kenyamanan
                            bagi penghuni dalam menjalani aktivitas
                            sehari-hari.

                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FACILITIES
            ===================================================== */}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                <div className="mb-10 max-w-2xl">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Fasilitas
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Semua yang kamu butuhkan
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Fasilitas kamar dan fasilitas bersama tersedia
                        untuk membantu menciptakan lingkungan tempat
                        tinggal yang nyaman.
                    </p>

                </div>


                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {facilities.map((facility) => {

                        const Icon = facility.icon;

                        return (
                            <div
                                key={facility.title}
                                className="
                                    group
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-blue-200
                                    hover:shadow-lg
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        transition
                                        duration-300
                                        group-hover:bg-blue-600
                                        group-hover:text-white
                                    "
                                >

                                    <Icon size={23} />

                                </div>


                                <h3 className="mt-5 text-base font-semibold text-slate-900">

                                    {facility.title}

                                </h3>


                                <p className="mt-2 text-sm leading-6 text-slate-500">

                                    {facility.description}

                                </p>

                            </div>
                        );

                    })}

                </div>

            </section>


            {/* =====================================================
                HIGHLIGHT
            ===================================================== */}

            <section className="border-t border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

                    <div
                        className="
                            rounded-3xl
                            border
                            border-blue-100
                            bg-blue-50
                            p-8
                            sm:p-10
                            lg:flex
                            lg:items-center
                            lg:justify-between
                            lg:gap-12
                        "
                    >

                        <div className="max-w-2xl">

                            <p className="text-sm font-semibold text-blue-600">
                                Kenyamanan Penghuni
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">

                                Tinggal lebih nyaman di
                                ADELINA KOST.

                            </h2>

                            <p className="mt-4 text-sm leading-6 text-slate-600">

                                Dengan fasilitas kamar dan fasilitas
                                bersama yang mendukung kebutuhan
                                sehari-hari, penghuni dapat menjalani
                                aktivitas dengan lebih nyaman.

                            </p>

                        </div>


                        <div className="mt-8 shrink-0 lg:mt-0">

                            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white px-5 py-4 shadow-sm">

                                <CheckCircle2
                                    size={22}
                                    className="text-green-500"
                                />

                                <div>

                                    <p className="text-sm font-semibold text-slate-900">
                                        Fasilitas tersedia
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Untuk kebutuhan penghuni
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Facilities;