import { useEffect, useState } from 'react'

import {
    BarChart3,
    CalendarDays,
    Wallet,
    TrendingUp,
    TrendingDown,
    Receipt,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
} from 'lucide-react'

import { getReport } from '../services/reportService'


function Reports() {

    // =====================================================
    // NAMA BULAN
    // =====================================================

    const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ]


    // =====================================================
    // TANGGAL SEKARANG
    // =====================================================

    const today = new Date()

    const currentYear =
        today.getFullYear()

    const currentMonth =
        today.getMonth() + 1


    // =====================================================
    // STATE FILTER
    // =====================================================

    const [selectedMonth, setSelectedMonth] =
        useState(currentMonth)

    const [selectedYear, setSelectedYear] =
        useState(currentYear)


    // =====================================================
    // STATE DATA
    // =====================================================

    const [report, setReport] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')


    // =====================================================
    // LOAD REPORT
    // =====================================================

    async function loadReport() {

        try {

            setLoading(true)

            setError('')


            const response =
                await getReport(
                    selectedMonth,
                    selectedYear
                )


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    'Gagal mengambil laporan.'
                )

            }


            setReport(
                response.data
            )


        } catch (error) {

            console.error(
                'Load Report Error:',
                error
            )


            setError(
                error.message ||
                'Gagal mengambil laporan keuangan.'
            )


            setReport(null)

        } finally {

            setLoading(false)

        }

    }


    // =====================================================
    // LOAD SAAT FILTER BERUBAH
    // =====================================================

    useEffect(() => {

        loadReport()

    }, [
        selectedMonth,
        selectedYear,
    ])


    // =====================================================
    // FORMAT RUPIAH
    // =====================================================

    function formatRupiah(value) {

        return new Intl.NumberFormat(
            'id-ID',
            {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }
        ).format(
            Number(value) || 0
        )

    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(date) {

        if (!date) {

            return '-'

        }


        const parsedDate =
            new Date(date)


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return '-'

        }


        return parsedDate.toLocaleDateString(
            'id-ID',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )

    }


    // =====================================================
    // FORMAT PAYMENT METHOD
    // =====================================================

    function formatPaymentMethod(method) {

        if (!method) {

            return '-'

        }


        const value =
            String(method)
                .replace(/_/g, ' ')


        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        )

    }


    // =====================================================
    // DATA DEFAULT
    // =====================================================

    const summary =
        report?.summary || {}


    const income =
        Array.isArray(report?.income)
            ? report.income
            : []


    const expenses =
        Array.isArray(report?.expenses)
            ? report.expenses
            : []


    const expenseCategories =
        Array.isArray(
            report?.expense_categories
        )
            ? report.expense_categories
            : []


    const totalIncome =
        Number(
            summary.total_income
        ) || 0


    const totalExpense =
        Number(
            summary.total_expense
        ) || 0


    const netIncome =
        Number(
            summary.net_income
        ) || 0


    const paymentCount =
        Number(
            summary.payment_count
        ) || 0


    const expenseCount =
        Number(
            summary.expense_count
        ) || 0


    // =====================================================
    // TAHUN OPTIONS
    //
    // TIDAK LAGI:
    // currentYear - 5
    //
    // Sekarang:
    // tahun sekarang
    // + 1 tahun ke depan
    //
    // Contoh 2026:
    // 2026
    // 2027
    //
    // Tahun berikutnya akan otomatis berubah.
    // =====================================================

    const years = [
        currentYear,
        currentYear + 1,
    ]


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                            <BarChart3
                                size={22}
                                className="text-blue-600"
                            />

                        </div>


                        <div>

                            <h1 className="text-2xl font-bold text-slate-800">

                                Laporan Keuangan

                            </h1>


                            <p className="mt-1 text-sm text-slate-500">

                                Ringkasan keuangan ADELINA KOST

                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FILTER
                ================================================= */}

                <div className="flex flex-col gap-2 sm:flex-row">


                    {/* BULAN */}

                    <div className="relative">

                        <CalendarDays
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />


                        <select
                            value={selectedMonth}
                            onChange={(event) =>
                                setSelectedMonth(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-44"
                        >

                            {monthNames.map(
                                (
                                    month,
                                    index
                                ) => (

                                    <option
                                        key={month}
                                        value={index + 1}
                                    >

                                        {month}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* TAHUN */}

                    <div className="relative">

                        <select
                            value={selectedYear}
                            onChange={(event) =>
                                setSelectedYear(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-32"
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


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={loadReport}
                        disabled={loading}
                        title="Refresh laporan"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? 'animate-spin'
                                    : ''
                            }
                        />

                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm font-medium text-red-700">

                        {error}

                    </p>

                </div>

            )}


            {/* =================================================
                PERIODE
            ================================================= */}

            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                <CalendarDays
                    size={17}
                    className="text-blue-600"
                />


                <p className="text-sm text-blue-700">

                    Laporan periode:

                    <span className="ml-1 font-semibold">

                        {monthNames[
                            selectedMonth - 1
                        ]}

                        {' '}

                        {selectedYear}

                    </span>

                </p>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="text-center">

                        <RefreshCw
                            size={30}
                            className="mx-auto animate-spin text-blue-600"
                        />

                        <p className="mt-3 text-sm text-slate-500">

                            Memuat laporan...

                        </p>

                    </div>

                </div>

            ) : (

                <>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">


                        {/* TOTAL PEMASUKAN */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Total Pemasukan

                                    </p>


                                    <p className="mt-2 text-2xl font-bold text-slate-800">

                                        {formatRupiah(
                                            totalIncome
                                        )}

                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">

                                    <TrendingUp
                                        size={21}
                                        className="text-green-600"
                                    />

                                </div>

                            </div>


                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                                <ArrowUpCircle
                                    size={14}
                                    className="text-green-500"
                                />

                                <span>

                                    {paymentCount} transaksi pembayaran

                                </span>

                            </div>

                        </div>


                        {/* TOTAL PENGELUARAN */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Total Pengeluaran

                                    </p>


                                    <p className="mt-2 text-2xl font-bold text-slate-800">

                                        {formatRupiah(
                                            totalExpense
                                        )}

                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                                    <TrendingDown
                                        size={21}
                                        className="text-red-600"
                                    />

                                </div>

                            </div>


                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                                <ArrowDownCircle
                                    size={14}
                                    className="text-red-500"
                                />

                                <span>

                                    {expenseCount} transaksi pengeluaran

                                </span>

                            </div>

                        </div>


                        {/* LABA BERSIH */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Laba Bersih

                                    </p>


                                    <p
                                        className={`mt-2 text-2xl font-bold ${netIncome >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}
                                    >

                                        {formatRupiah(
                                            netIncome
                                        )}

                                    </p>

                                </div>


                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${netIncome >= 0
                                        ? 'bg-green-50'
                                        : 'bg-red-50'
                                        }`}
                                >

                                    <Wallet
                                        size={21}
                                        className={
                                            netIncome >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }
                                    />

                                </div>

                            </div>


                            <p className="mt-4 text-xs text-slate-500">

                                Pemasukan dikurangi pengeluaran

                            </p>

                        </div>


                        {/* TRANSAKSI */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Total Transaksi

                                    </p>


                                    <p className="mt-2 text-2xl font-bold text-slate-800">

                                        {paymentCount +
                                            expenseCount}

                                    </p>

                                </div>


                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                                    <Receipt
                                        size={21}
                                        className="text-blue-600"
                                    />

                                </div>

                            </div>


                            <div className="mt-4 flex gap-4 text-xs text-slate-500">

                                <span>

                                    Pemasukan:
                                    {' '}

                                    <strong className="text-slate-700">

                                        {paymentCount}

                                    </strong>

                                </span>


                                <span>

                                    Pengeluaran:
                                    {' '}

                                    <strong className="text-slate-700">

                                        {expenseCount}

                                    </strong>

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        DETAIL PEMASUKAN + PENGELUARAN
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


                        {/* PEMASUKAN */}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                                <div>

                                    <h2 className="font-semibold text-slate-800">

                                        Pemasukan

                                    </h2>


                                    <p className="mt-1 text-xs text-slate-500">

                                        Pembayaran yang diterima pada periode ini

                                    </p>

                                </div>


                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">

                                    <TrendingUp
                                        size={17}
                                        className="text-green-600"
                                    />

                                </div>

                            </div>


                            {income.length === 0 ? (

                                <div className="p-8 text-center">

                                    <ArrowUpCircle
                                        size={34}
                                        className="mx-auto text-slate-300"
                                    />


                                    <p className="mt-3 text-sm font-medium text-slate-600">

                                        Belum ada pemasukan

                                    </p>


                                    <p className="mt-1 text-xs text-slate-400">

                                        Tidak ada pembayaran pada periode ini.

                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full text-sm">

                                        <thead className="border-b border-slate-100 bg-slate-50">

                                            <tr>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">

                                                    Tanggal

                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">

                                                    Penghuni

                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">

                                                    Metode

                                                </th>

                                                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">

                                                    Jumlah

                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-slate-100">

                                            {income.map(
                                                (item) => (

                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                        className="hover:bg-slate-50"
                                                    >

                                                        <td className="px-5 py-4 text-slate-600">

                                                            {formatDate(
                                                                item.payment_date
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <div>

                                                                <p className="font-medium text-slate-700">

                                                                    {item.tenant_name ||
                                                                        '-'}

                                                                </p>


                                                                <p className="text-xs text-slate-400">

                                                                    {item.room_number
                                                                        ? `Kamar ${item.room_number}`
                                                                        : '-'}

                                                                </p>

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-4 text-slate-600">

                                                            {formatPaymentMethod(
                                                                item.payment_method
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4 text-right">

                                                            <span className="font-semibold text-green-600">

                                                                {formatRupiah(
                                                                    item.amount
                                                                )}

                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>


                        {/* PENGELUARAN */}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                                <div>

                                    <h2 className="font-semibold text-slate-800">

                                        Pengeluaran

                                    </h2>


                                    <p className="mt-1 text-xs text-slate-500">

                                        Pengeluaran pada periode ini

                                    </p>

                                </div>


                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">

                                    <TrendingDown
                                        size={17}
                                        className="text-red-600"
                                    />

                                </div>

                            </div>


                            {expenses.length === 0 ? (

                                <div className="p-8 text-center">

                                    <ArrowDownCircle
                                        size={34}
                                        className="mx-auto text-slate-300"
                                    />


                                    <p className="mt-3 text-sm font-medium text-slate-600">

                                        Belum ada pengeluaran

                                    </p>


                                    <p className="mt-1 text-xs text-slate-400">

                                        Tidak ada pengeluaran pada periode ini.

                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full text-sm">

                                        <thead className="border-b border-slate-100 bg-slate-50">

                                            <tr>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">

                                                    Tanggal

                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">

                                                    Kategori

                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">

                                                    Keterangan

                                                </th>

                                                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">

                                                    Jumlah

                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-slate-100">

                                            {expenses.map(
                                                (item) => (

                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                        className="hover:bg-slate-50"
                                                    >

                                                        <td className="px-5 py-4 text-slate-600">

                                                            {formatDate(
                                                                item.expense_date
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">

                                                                {item.category ||
                                                                    '-'}

                                                            </span>

                                                        </td>


                                                        <td className="max-w-[180px] px-5 py-4 text-slate-600">

                                                            <p className="truncate">

                                                                {item.description ||
                                                                    '-'}

                                                            </p>

                                                        </td>


                                                        <td className="px-5 py-4 text-right">

                                                            <span className="font-semibold text-red-600">

                                                                {formatRupiah(
                                                                    item.amount
                                                                )}

                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        KATEGORI PENGELUARAN
                    ================================================= */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-5 py-4">

                            <h2 className="font-semibold text-slate-800">

                                Ringkasan Pengeluaran Berdasarkan Kategori

                            </h2>


                            <p className="mt-1 text-xs text-slate-500">

                                Total pengeluaran dikelompokkan berdasarkan kategori

                            </p>

                        </div>


                        {expenseCategories.length === 0 ? (

                            <div className="p-8 text-center">

                                <Receipt
                                    size={34}
                                    className="mx-auto text-slate-300"
                                />


                                <p className="mt-3 text-sm font-medium text-slate-600">

                                    Belum ada data kategori

                                </p>


                                <p className="mt-1 text-xs text-slate-400">

                                    Data akan muncul setelah ada pengeluaran.

                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full text-sm">

                                    <thead className="border-b border-slate-100 bg-slate-50">

                                        <tr>

                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">

                                                Kategori

                                            </th>

                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500">

                                                Transaksi

                                            </th>

                                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">

                                                Total

                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {expenseCategories.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <tr
                                                    key={`${item.category}-${index}`}
                                                    className="hover:bg-slate-50"
                                                >

                                                    <td className="px-5 py-4">

                                                        <span className="font-medium text-slate-700">

                                                            {item.category ||
                                                                '-'}

                                                        </span>

                                                    </td>


                                                    <td className="px-5 py-4 text-center text-slate-600">

                                                        {Number(
                                                            item.transaction_count
                                                        ) || 0}

                                                    </td>


                                                    <td className="px-5 py-4 text-right">

                                                        <span className="font-semibold text-red-600">

                                                            {formatRupiah(
                                                                item.total_amount
                                                            )}

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        EMPTY REPORT
                    ================================================= */}

                    {!income.length &&
                        !expenses.length &&
                        !expenseCategories.length && (

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">

                                <p className="text-sm text-slate-500">

                                    Tidak ada transaksi keuangan pada periode{' '}

                                    <span className="font-medium text-slate-700">

                                        {monthNames[
                                            selectedMonth - 1
                                        ]}

                                        {' '}

                                        {selectedYear}

                                    </span>

                                </p>

                            </div>

                        )}

                </>

            )}

        </div>

    )

}


export default Reports