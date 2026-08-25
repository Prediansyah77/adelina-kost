import { useEffect, useMemo, useState } from "react";
import axios from "axios";

// =====================================================
// KONFIGURASI API
// =====================================================

const API_URL = "http://localhost:5000/api";

// =====================================================
// NAMA BULAN
// =====================================================

const MONTHS = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
];

// =====================================================
// FORMAT RUPIAH
// =====================================================

const formatRupiah = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(number);
};

// =====================================================
// FORMAT TANGGAL
// =====================================================

const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    const dateString =
        typeof value === "string"
            ? value.slice(0, 10)
            : value;

    const parts = String(dateString).split("-");

    if (parts.length !== 3) {
        return "-";
    }

    const [year, month, day] = parts;

    return `${day} ${MONTHS[Number(month) - 1]?.label || month
        } ${year}`;
};

// =====================================================
// NORMALISASI STATUS TAGIHAN
// =====================================================
//
// Database saat ini menggunakan:
// unpaid
// paid
// late
//
// Kita trim + lowercase supaya aman jika backend
// mengirim "unpaid ", "UNPAID", dll.
//
// Status kosong / tidak dikenal dianggap unpaid
// karena StatusBadge juga menampilkannya sebagai
// BELUM LUNAS.
// =====================================================

const normalizeBillStatus = (status) => {
    const normalized = String(status || "")
        .trim()
        .toLowerCase();

    if (normalized === "paid") {
        return "paid";
    }

    if (normalized === "late") {
        return "late";
    }

    return "unpaid";
};

// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({ status }) => {
    const normalized = normalizeBillStatus(status);

    if (normalized === "paid") {
        return (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                LUNAS
            </span>
        );
    }

    if (normalized === "late") {
        return (
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                TERLAMBAT
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            BELUM LUNAS
        </span>
    );
};

// =====================================================
// ICON
// =====================================================

const Icon = ({ children }) => {
    return (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
            {children}
        </span>
    );
};

// =====================================================
// HELPER SORT KAMAR
// =====================================================

const getRoomNumberForSort = (roomNumber) => {
    if (
        roomNumber === null ||
        roomNumber === undefined
    ) {
        return Number.MAX_SAFE_INTEGER;
    }

    const value = String(roomNumber).trim();

    // Ambil angka pertama dari nomor kamar.
    //
    // Contoh:
    // "1"       -> 1
    // "2"       -> 2
    // "10"      -> 10
    // "Kamar 3" -> 3

    const match = value.match(/\d+/);

    if (!match) {
        return Number.MAX_SAFE_INTEGER;
    }

    return Number(match[0]);
};

// =====================================================
// COMPONENT
// =====================================================

function Bills() {

    // =================================================
    // CURRENT DATE
    // =================================================

    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // =================================================
    // STATE
    // =================================================

    const [selectedMonth, setSelectedMonth] =
        useState(currentMonth);

    const [selectedYear, setSelectedYear] =
        useState(currentYear);

    const [bills, setBills] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    // =================================================
    // GET TOKEN
    // =================================================

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("authToken") ||
            ""
        );
    };

    // =================================================
    // FETCH BILLS SESUAI BULAN + TAHUN
    // =================================================

    const fetchBills = async (
        month = selectedMonth,
        year = selectedYear
    ) => {
        try {
            setError("");
            setRefreshing(true);

            const token = getToken();

            console.log(
                `FETCH BILLS: ${month}/${year}`
            );

            const response = await axios.get(
                `${API_URL}/bills`,
                {
                    params: {
                        month: Number(month),
                        year: Number(year),
                    },

                    headers: token
                        ? {
                            Authorization:
                                `Bearer ${token}`,
                        }
                        : {},
                }
            );

            console.log(
                "BILL API RESPONSE:",
                response.data
            );

            if (
                response.data &&
                response.data.success
            ) {
                const data = Array.isArray(
                    response.data.data
                )
                    ? response.data.data
                    : [];

                setBills(data);

                console.log(
                    `TAGIHAN ${month}/${year}:`,
                    data
                );

                console.log(
                    "GENERATION:",
                    response.data.generation
                );
            } else {
                setBills([]);

                setError(
                    response.data?.message ||
                    "Gagal mengambil data tagihan"
                );
            }

        } catch (err) {

            console.error(
                "BILL SERVICE ERROR:",
                err
            );

            console.error(
                "BILL API ERROR RESPONSE:",
                err.response?.data
            );

            setBills([]);

            setError(
                err.response?.data?.message ||
                "Gagal mengambil data tagihan"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };

    // =================================================
    // LOAD AWAL
    // =================================================

    useEffect(() => {

        fetchBills(
            selectedMonth,
            selectedYear
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =================================================
    // KETIKA BULAN / TAHUN BERUBAH
    // LANGSUNG REQUEST KE BACKEND
    // =================================================

    useEffect(() => {

        if (
            selectedMonth === currentMonth &&
            selectedYear === currentYear
        ) {
            return;
        }

        fetchBills(
            selectedMonth,
            selectedYear
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedMonth,
        selectedYear,
    ]);

    // =================================================
    // GENERATE YEAR OPTIONS
    // =================================================

    const years = useMemo(() => {

        const result = [];

        for (
            let year = currentYear - 2;
            year <= currentYear + 2;
            year++
        ) {
            result.push(year);
        }

        return result;

    }, [currentYear]);

    // =================================================
    // FILTER + SORT DATA
    // =================================================

    const filteredBills = useMemo(() => {

        const filtered = bills.filter((bill) => {

            const billMonth = Number(
                bill.billing_month
            );

            const billYear = Number(
                bill.billing_year
            );

            return (
                billMonth ===
                Number(selectedMonth) &&
                billYear ===
                Number(selectedYear)
            );
        });

        // =================================================
        // SORT KAMAR ASCENDING
        // =================================================

        return [...filtered].sort((a, b) => {

            const roomA =
                getRoomNumberForSort(
                    a.room_number
                );

            const roomB =
                getRoomNumberForSort(
                    b.room_number
                );

            // Kalau nomor kamar berbeda
            if (roomA !== roomB) {
                return roomA - roomB;
            }

            // Kalau nomor kamar sama,
            // gunakan ID sebagai urutan kedua

            const idA = Number(a.id || 0);
            const idB = Number(b.id || 0);

            return idA - idB;
        });

    }, [
        bills,
        selectedMonth,
        selectedYear,
    ]);

    // =================================================
    // TOTAL TAGIHAN
    // =================================================

    const totalAmount = useMemo(() => {

        return filteredBills.reduce(
            (total, bill) =>
                total +
                Number(bill.amount || 0),
            0
        );

    }, [filteredBills]);

    // =================================================
    // BELUM LUNAS
    // =================================================
    //
    // unpaid + late = belum lunas
    //
    // Karena normalizeBillStatus() mengubah status
    // kosong/tidak dikenal menjadi unpaid, maka
    // perhitungan summary akan konsisten dengan badge.
    // =================================================

    const unpaidCount = useMemo(() => {

        return filteredBills.filter(
            (bill) => {

                const status =
                    normalizeBillStatus(
                        bill.status
                    );

                return (
                    status === "unpaid" ||
                    status === "late"
                );
            }
        ).length;

    }, [filteredBills]);

    // =================================================
    // SUDAH LUNAS
    // =================================================

    const paidCount = useMemo(() => {

        return filteredBills.filter(
            (bill) =>
                normalizeBillStatus(
                    bill.status
                ) === "paid"
        ).length;

    }, [filteredBills]);

    // =================================================
    // NAMA BULAN
    // =================================================

    const selectedMonthName =
        MONTHS.find(
            (month) =>
                month.value ===
                Number(selectedMonth)
        )?.label || "";

    // =================================================
    // CEK FUTURE PERIOD
    // =================================================

    const isFuturePeriod =
        Number(selectedYear) >
        currentYear ||
        (
            Number(selectedYear) ===
            currentYear &&
            Number(selectedMonth) >
            currentMonth
        );

    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="min-h-full bg-slate-100 px-4 py-6 md:px-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                        Manajemen Tagihan
                    </h1>

                </div>

            </div>

            {/* =================================================
                FILTER
            ================================================= */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                    <Icon>
                        🧾
                    </Icon>

                    <div>

                        <h2 className="font-semibold text-slate-800">
                            Filter Tagihan
                        </h2>

                        <p className="text-sm text-slate-500">
                            Pilih periode tagihan yang ingin ditampilkan
                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* =================================================
                        BULAN
                    ================================================= */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Bulan
                        </label>

                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            {MONTHS.map(
                                (month) => (

                                    <option
                                        key={
                                            month.value
                                        }
                                        value={
                                            month.value
                                        }
                                    >
                                        {
                                            month.label
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* =================================================
                        TAHUN
                    ================================================= */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Tahun
                        </label>

                        <select
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            {years.map(
                                (year) => (

                                    <option
                                        key={year}
                                        value={year}
                                    >
                                        {year}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>

                {/* =================================================
                    INFO PERIOD
                ================================================= */}

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">

                    {isFuturePeriod ? (
                        <>
                            Periode{" "}
                            <strong>
                                {
                                    selectedMonthName
                                }{" "}
                                {
                                    selectedYear
                                }
                            </strong>{" "}
                            belum berjalan. Sistem tetap dapat menyiapkan tagihan berdasarkan kontrak aktif.
                        </>
                    ) : (
                        <>
                            Menampilkan tagihan untuk periode{" "}
                            <strong>
                                {
                                    selectedMonthName
                                }{" "}
                                {
                                    selectedYear
                                }
                            </strong>
                        </>
                    )}

                </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700 md:flex-row md:items-center md:justify-between">

                    <div>

                        <p className="font-semibold">
                            Gagal mengambil data tagihan
                        </p>

                        <p className="mt-1 text-sm">
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            fetchBills(
                                selectedMonth,
                                selectedYear
                            )
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Coba Lagi
                    </button>

                </div>

            )}

            {/* =================================================
                SUMMARY
            ================================================= */}

            {!loading &&
                !error &&
                filteredBills.length > 0 && (

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* TOTAL TAGIHAN */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Total Tagihan
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-800">
                                {formatRupiah(
                                    totalAmount
                                )}
                            </p>

                        </div>

                        {/* BELUM LUNAS */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Belum Lunas
                            </p>

                            <p className="mt-2 text-2xl font-bold text-yellow-600">
                                {unpaidCount}
                            </p>

                        </div>

                        {/* =================================================
                            SUDAH LUNAS

                            Tetap dipertahankan dalam code.
                            ================================================= */}

                        {/*
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Sudah Lunas
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-600">
                                {paidCount}
                            </p>

                        </div>
                        */}

                    </div>

                )}

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {loading ? (

                    <div className="flex min-h-[300px] items-center justify-center">

                        <div className="text-center">

                            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                            <p className="text-sm text-slate-500">
                                Menyiapkan tagihan{" "}
                                {
                                    selectedMonthName
                                }{" "}
                                {
                                    selectedYear
                                }
                                ...
                            </p>

                        </div>

                    </div>

                ) : error ? (

                    <div className="flex min-h-[250px] items-center justify-center px-6">

                        <div className="text-center">

                            <div className="mb-4 text-5xl">
                                ⚠️
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                Data tagihan belum dapat dimuat
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Periksa backend terlebih dahulu.
                            </p>

                        </div>

                    </div>

                ) : filteredBills.length === 0 ? (

                    <div className="flex min-h-[300px] items-center justify-center px-6">

                        <div className="text-center">

                            <div className="mb-4 text-5xl text-slate-300">
                                🧾
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                Tidak ada tagihan aktif
                            </h3>

                            <p className="mt-2 max-w-md text-sm text-slate-500">

                                Tidak ada tagihan untuk periode{" "}

                                <strong>
                                    {
                                        selectedMonthName
                                    }{" "}
                                    {
                                        selectedYear
                                    }
                                </strong>.

                            </p>

                        </div>

                    </div>

                ) : (

                    <>

                        {/* =================================================
                            DESKTOP TABLE
                        ================================================= */}

                        <div className="hidden overflow-x-auto md:block">

                            <table className="w-full">

                                <thead className="border-b border-slate-200 bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                                            Penghuni
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                                            Kamar
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                                            Periode
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                                            Jatuh Tempo
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                                            Jumlah
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {filteredBills.map(
                                        (bill) => (

                                            <tr
                                                key={
                                                    bill.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* PENGHUNI */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                            👤
                                                        </div>

                                                        <div>

                                                            <p className="font-semibold text-slate-800">
                                                                {
                                                                    bill.tenant_name ||
                                                                    "-"
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {
                                                                    bill.tenant_phone ||
                                                                    "-"
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* KAMAR */}

                                                <td className="px-5 py-4 text-sm text-slate-700">

                                                    Kamar{" "}

                                                    <strong>
                                                        {
                                                            bill.room_number ||
                                                            "-"
                                                        }
                                                    </strong>

                                                </td>

                                                {/* PERIODE */}

                                                <td className="px-5 py-4 text-sm text-slate-700">

                                                    {
                                                        MONTHS.find(
                                                            (
                                                                month
                                                            ) =>
                                                                month.value ===
                                                                Number(
                                                                    bill.billing_month
                                                                )
                                                        )
                                                            ?.label
                                                    }{" "}

                                                    {
                                                        bill.billing_year
                                                    }

                                                </td>

                                                {/* DUE DATE */}

                                                <td className="px-5 py-4 text-sm text-slate-600">

                                                    {formatDate(
                                                        bill.due_date
                                                    )}

                                                </td>

                                                {/* JUMLAH */}

                                                <td className="px-5 py-4 font-semibold text-slate-800">

                                                    {formatRupiah(
                                                        bill.amount
                                                    )}

                                                </td>

                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    <StatusBadge
                                                        status={
                                                            bill.status
                                                        }
                                                    />

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* =================================================
                            MOBILE
                        ================================================= */}

                        <div className="divide-y divide-slate-100 md:hidden">

                            {filteredBills.map(
                                (bill) => (

                                    <div
                                        key={
                                            bill.id
                                        }
                                        className="p-5"
                                    >

                                        <div className="mb-4 flex items-start justify-between gap-3">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    👤
                                                </div>

                                                <div>

                                                    <p className="font-semibold text-slate-800">
                                                        {
                                                            bill.tenant_name ||
                                                            "-"
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Kamar{" "}
                                                        {
                                                            bill.room_number ||
                                                            "-"
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <StatusBadge
                                                status={
                                                    bill.status
                                                }
                                            />

                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">

                                            {/* PERIODE */}

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Periode
                                                </p>

                                                <p className="mt-1 font-medium text-slate-700">

                                                    {
                                                        selectedMonthName
                                                    }{" "}

                                                    {
                                                        bill.billing_year
                                                    }

                                                </p>

                                            </div>

                                            {/* JATUH TEMPO */}

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Jatuh Tempo
                                                </p>

                                                <p className="mt-1 font-medium text-slate-700">

                                                    {formatDate(
                                                        bill.due_date
                                                    )}

                                                </p>

                                            </div>

                                            {/* JUMLAH */}

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Jumlah
                                                </p>

                                                <p className="mt-1 font-bold text-slate-800">

                                                    {formatRupiah(
                                                        bill.amount
                                                    )}

                                                </p>

                                            </div>

                                            {/* NO HP */}

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    No. HP
                                                </p>

                                                <p className="mt-1 font-medium text-slate-700">

                                                    {
                                                        bill.tenant_phone ||
                                                        "-"
                                                    }

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </>

                )}

            </div>

            {/* =================================================
                REFRESH
            ================================================= */}

            <div className="mt-4 flex justify-end">

                <button
                    type="button"
                    onClick={() =>
                        fetchBills(
                            selectedMonth,
                            selectedYear
                        )
                    }
                    disabled={refreshing}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    {refreshing
                        ? "Memuat..."
                        : "↻ Refresh"}

                </button>

            </div>

        </div>
    );
}

export default Bills;