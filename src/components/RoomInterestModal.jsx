import { useState } from "react";


function RoomInterestModal({
    room,
    onClose,
}) {

    const [formData, setFormData] = useState({
        name: "",
        whatsapp: "",
        moveInDate: "",
    });

    const [error, setError] = useState("");


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (event) => {

        event.preventDefault();

        setError("");


        // =================================================
        // VALIDASI
        // =================================================

        if (!formData.name.trim()) {

            setError(
                "Nama lengkap wajib diisi."
            );

            return;

        }


        if (!formData.whatsapp.trim()) {

            setError(
                "Nomor WhatsApp wajib diisi."
            );

            return;

        }


        if (!formData.moveInDate) {

            setError(
                "Rencana tanggal masuk wajib diisi."
            );

            return;

        }


        // =================================================
        // NOMOR WHATSAPP ADELINA KOST
        // =================================================

        const adminWhatsApp =
            "6282382884853";


        // =================================================
        // DATA KAMAR
        // =================================================

        const roomNumber =
            room?.room_number || "-";

        const building =
            room?.building_name ||
            "Bangunan belum tersedia";

        const floor =
            room?.floor_name ||
            "Informasi lantai belum tersedia";

        const price =
            new Intl.NumberFormat(
                "id-ID",
                {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                }
            ).format(room?.price || 0);


        // =================================================
        // PESAN WHATSAPP
        // =================================================

        const message =
            `Halo ADELINA KOST 👋

Saya ingin menanyakan ketersediaan kamar.

👤 Nama: ${formData.name}
📱 WhatsApp: ${formData.whatsapp}

🏠 Kamar: ${roomNumber}
🏢 Bangunan: ${building}
📍 Lantai: ${floor}
💰 Harga: ${price} / bulan

📅 Rencana masuk:
${formData.moveInDate}

Apakah kamar tersebut masih tersedia?

Terima kasih.`;


        // =================================================
        // URL WHATSAPP
        // =================================================

        const whatsappUrl =
            `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(
                message
            )}`;


        // =================================================
        // BUKA WHATSAPP
        // =================================================

        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );

    };


    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-slate-950/50
                px-4
                py-6
                backdrop-blur-sm
            "
        >

            <div
                className="
                    w-full
                    max-w-lg
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-2xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        border-b
                        border-slate-200
                        px-6
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                "
                            >
                                Minat Kamar
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Kamar {room?.room_number}
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Isi data terlebih dahulu
                                sebelum menghubungi kami.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                text-xl
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-700
                            "
                            aria-label="Tutup"
                        >
                            ×
                        </button>

                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    {/* =================================================
                        NAMA
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="name"
                            className="
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            Nama Lengkap
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap"
                            className="
                                mt-2
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                text-slate-800
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* =================================================
                        WHATSAPP
                    ================================================= */}

                    <div className="mt-5">

                        <label
                            htmlFor="whatsapp"
                            className="
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            Nomor WhatsApp
                        </label>

                        <input
                            id="whatsapp"
                            name="whatsapp"
                            type="tel"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            placeholder="Contoh: 081234567890"
                            className="
                                mt-2
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                text-slate-800
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* =================================================
                        TANGGAL MASUK
                    ================================================= */}

                    <div className="mt-5">

                        <label
                            htmlFor="moveInDate"
                            className="
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            Rencana Tanggal Masuk
                        </label>

                        <input
                            id="moveInDate"
                            name="moveInDate"
                            type="date"
                            value={formData.moveInDate}
                            onChange={handleChange}
                            className="
                                mt-2
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                text-slate-800
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                mt-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-600
                            "
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        INFO
                    ================================================= */}

                    <div
                        className="
                            mt-5
                            rounded-xl
                            bg-blue-50
                            px-4
                            py-3
                            text-sm
                            leading-5
                            text-blue-700
                        "
                    >
                        Setelah formulir dikirim, WhatsApp
                        akan terbuka dengan pesan yang sudah
                        berisi informasi kamar.
                    </div>


                    {/* =================================================
                        ACTION
                    ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex-1
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-slate-600
                                transition
                                hover:bg-slate-50
                            "
                        >
                            Batal
                        </button>


                        <button
                            type="submit"
                            className="
                                flex-1
                                rounded-xl
                                bg-blue-600
                                px-4
                                py-3
                                text-sm
                                font-bold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                hover:shadow-md
                            "
                        >
                            Lanjut ke WhatsApp
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default RoomInterestModal;