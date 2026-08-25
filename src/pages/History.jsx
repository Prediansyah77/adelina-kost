import { useEffect, useMemo, useState } from 'react'

import {
    History as HistoryIcon,
    Users,
    FileText,
    Search,
    CalendarDays,
    Phone,
    BedDouble,
    RefreshCw,
    Eye,
    X,
    MapPin,
    CreditCard,
    WalletCards,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react'

import api from '../services/api'


// =====================================================
// FORMAT RUPIAH
// =====================================================

const formatRupiah = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return 'Rp 0'
    }

    const numberValue =
        Number(value)

    if (Number.isNaN(numberValue)) {
        return 'Rp 0'
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(numberValue)

}


// =====================================================
// FORMAT TANGGAL
// =====================================================

const formatDate = (value) => {

    if (!value) {
        return '-'
    }


    // -------------------------------------------------
    // YYYY-MM-DD
    // -------------------------------------------------

    if (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {

        const datePart =
            value.slice(0, 10)

        const parts =
            datePart.split('-')

        if (parts.length === 3) {

            return `${parts[2]}-${parts[1]}-${parts[0]}`

        }

    }


    return value

}


// =====================================================
// STATUS LABEL
// =====================================================

const getStatusLabel = (status) => {

    switch (status) {

        case 'completed':
            return 'Selesai'

        case 'cancelled':
            return 'Dibatalkan'

        case 'active':
            return 'Aktif'

        default:
            return status || '-'

    }

}


// =====================================================
// STATUS CLASS
// =====================================================

const getStatusClass = (status) => {

    switch (status) {

        case 'completed':
            return 'bg-green-100 text-green-700 border-green-200'

        case 'cancelled':
            return 'bg-red-100 text-red-700 border-red-200'

        case 'active':
            return 'bg-blue-100 text-blue-700 border-blue-200'

        default:
            return 'bg-slate-100 text-slate-700 border-slate-200'

    }

}


// =====================================================
// NORMALIZE HISTORY DATA
// =====================================================

const normalizeHistoryData = (data) => {

    if (!Array.isArray(data)) {
        return []
    }


    return data.filter((tenant) => {

        // -------------------------------------------------
        // Harus mempunyai kontrak
        // -------------------------------------------------

        if (!tenant.contract_id) {
            return false
        }


        // -------------------------------------------------
        // Kontrak aktif tidak masuk riwayat
        // -------------------------------------------------

        if (
            tenant.contract_status === 'active'
        ) {
            return false
        }


        return true

    })

}


// =====================================================
// HISTORY PAGE
// =====================================================

function History() {

    // =================================================
    // STATE
    // =================================================

    const [tenants, setTenants] =
        useState([])


    const [loading, setLoading] =
        useState(true)


    const [error, setError] =
        useState('')


    const [search, setSearch] =
        useState('')


    // =================================================
    // DETAIL MODAL
    // =================================================

    const [selectedTenant, setSelectedTenant] =
        useState(null)


    const [showDetail, setShowDetail] =
        useState(false)


    // =================================================
    // PAGINATION
    // =================================================

    const [currentPage, setCurrentPage] =
        useState(1)


    const [itemsPerPage, setItemsPerPage] =
        useState(8)


    // =================================================
    // LOAD HISTORY
    // =================================================

    const fetchHistory = async () => {

        try {

            setLoading(true)

            setError('')


            // =================================================
            // REQUEST UTAMA
            // =================================================

            try {

                const response =
                    await api.get(
                        '/tenants/history'
                    )


                if (
                    response.data &&
                    response.data.success
                ) {

                    const historyData =
                        normalizeHistoryData(
                            response.data.data
                        )


                    setTenants(
                        historyData
                    )


                    return

                }


                throw new Error(
                    response.data?.message ||
                    'Response riwayat tidak valid'
                )

            } catch (historyError) {

                console.warn(
                    'History endpoint gagal, mencoba fallback:',
                    historyError
                )


                // =================================================
                // FALLBACK
                // =================================================

                const fallbackResponse =
                    await api.get(
                        '/tenants/all'
                    )


                if (
                    fallbackResponse.data &&
                    fallbackResponse.data.success
                ) {

                    const allTenants =
                        normalizeHistoryData(
                            fallbackResponse.data.data
                        )


                    setTenants(
                        allTenants
                    )


                    return

                }


                throw new Error(
                    fallbackResponse.data?.message ||
                    'Gagal mengambil data riwayat'
                )

            }


        } catch (error) {

            console.error(
                'Get History Error:',
                error
            )


            setTenants([])


            setError(
                error.response?.data?.message ||
                error.message ||
                'Gagal mengambil data riwayat'
            )

        } finally {

            setLoading(false)

        }

    }


    // =================================================
    // LOAD SAAT HALAMAN DIBUKA
    // =================================================

    useEffect(() => {

        fetchHistory()

    }, [])


    // =================================================
    // RESET PAGE KETIKA SEARCH BERUBAH
    // =================================================

    useEffect(() => {

        setCurrentPage(1)

    }, [search])


    // =================================================
    // FILTER SEARCH
    // =================================================

    const filteredTenants =
        useMemo(() => {

            const keyword =
                search
                    .toLowerCase()
                    .trim()


            if (!keyword) {
                return tenants
            }


            return tenants.filter(
                (tenant) => {

                    const name =
                        tenant.name
                            ?.toLowerCase() || ''


                    const phone =
                        String(
                            tenant.phone || ''
                        )
                            .toLowerCase()


                    const room =
                        String(
                            tenant.room_number || ''
                        )
                            .toLowerCase()


                    const identity =
                        String(
                            tenant.identity_number || ''
                        )
                            .toLowerCase()


                    const address =
                        String(
                            tenant.address || ''
                        )
                            .toLowerCase()


                    return (
                        name.includes(keyword) ||
                        phone.includes(keyword) ||
                        room.includes(keyword) ||
                        identity.includes(keyword) ||
                        address.includes(keyword)
                    )

                }
            )

        }, [
            tenants,
            search
        ])


    // =================================================
    // TOTAL DATA
    // =================================================

    const totalItems =
        filteredTenants.length


    // =================================================
    // TOTAL PAGE
    // =================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalItems /
                itemsPerPage
            )
        )


    // =================================================
    // PASTIKAN PAGE VALID
    // =================================================

    useEffect(() => {

        if (
            currentPage >
            totalPages
        ) {

            setCurrentPage(
                totalPages
            )

        }

    }, [
        currentPage,
        totalPages
    ])


    // =================================================
    // PAGINATION DATA
    // =================================================

    const paginatedTenants =
        useMemo(() => {

            const startIndex =
                (
                    currentPage - 1
                ) *
                itemsPerPage


            const endIndex =
                startIndex +
                itemsPerPage


            return filteredTenants.slice(
                startIndex,
                endIndex
            )

        }, [
            filteredTenants,
            currentPage,
            itemsPerPage
        ])


    // =================================================
    // TOTAL KONTRAK
    // =================================================

    const totalContracts =
        filteredTenants.filter(
            (tenant) =>
                Boolean(
                    tenant.contract_id
                )
        ).length


    // =================================================
    // HANDLE ITEMS PER PAGE
    // =================================================

    const handleItemsPerPageChange = (
        e
    ) => {

        const newValue =
            Number(
                e.target.value
            )


        setItemsPerPage(
            newValue
        )


        setCurrentPage(1)

    }


    // =================================================
    // OPEN DETAIL
    // =================================================

    const handleOpenDetail = (
        tenant
    ) => {

        setSelectedTenant(
            tenant
        )

        setShowDetail(
            true
        )

    }


    // =================================================
    // CLOSE DETAIL
    // =================================================

    const handleCloseDetail = () => {

        setShowDetail(
            false
        )

        setSelectedTenant(
            null
        )

    }


    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh = () => {

        fetchHistory()

    }


    // =================================================
    // PAGE BUTTONS
    // =================================================

    const pageNumbers =
        useMemo(() => {

            const pages = []

            const maxVisiblePages = 5


            if (
                totalPages <=
                maxVisiblePages
            ) {

                for (
                    let i = 1;
                    i <= totalPages;
                    i++
                ) {

                    pages.push(i)

                }

                return pages

            }


            let startPage =
                Math.max(
                    1,
                    currentPage - 2
                )


            let endPage =
                Math.min(
                    totalPages,
                    currentPage + 2
                )


            if (
                currentPage <= 3
            ) {

                startPage = 1
                endPage = 5

            }


            if (
                currentPage >=
                totalPages - 2
            ) {

                startPage =
                    totalPages - 4

                endPage =
                    totalPages

            }


            for (
                let i = startPage;
                i <= endPage;
                i++
            ) {

                pages.push(i)

            }


            return pages

        }, [
            currentPage,
            totalPages
        ])


    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


                {/* TITLE */}

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">

                            <HistoryIcon
                                size={21}
                            />

                        </div>


                        <div>

                            <h1 className="text-xl font-bold text-slate-800">
                                Riwayat
                            </h1>

                            <p className="text-sm text-slate-500">
                                Riwayat penghuni dan kontrak yang sudah selesai
                            </p>

                        </div>

                    </div>

                </div>


                {/* ACTION */}

                <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? 'animate-spin'
                                    : ''
                            }
                        />

                        Refresh

                    </button>


                    {/* SEARCH */}

                    <div className="relative w-full sm:w-80">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Cari penghuni atau kamar..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-red-700">
                            {error}
                        </p>


                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >

                            <RefreshCw
                                size={15}
                            />

                            Coba lagi

                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                {/* TOTAL RIWAYAT */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Riwayat Penghuni
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-800">

                                {loading
                                    ? '...'
                                    : filteredTenants.length}

                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">

                            <Users
                                size={22}
                            />

                        </div>

                    </div>

                </div>


                {/* TOTAL KONTRAK */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Riwayat Kontrak
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-800">

                                {loading
                                    ? '...'
                                    : totalContracts}

                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">

                            <FileText
                                size={22}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                TABLE CARD
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <div className="border-b border-slate-200 px-5 py-4">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <h2 className="font-semibold text-slate-800">
                                Riwayat Penghuni
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Penghuni yang sudah tidak memiliki kontrak aktif
                            </p>

                        </div>


                        {!loading && (
                            <div className="text-sm text-slate-500">

                                Menampilkan{' '}

                                <span className="font-semibold text-slate-700">
                                    {totalItems}
                                </span>{' '}

                                data

                            </div>
                        )}

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="flex items-center justify-center px-5 py-14">

                        <div className="text-center">

                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                            <p className="mt-3 text-sm text-slate-500">
                                Memuat riwayat...
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredTenants.length === 0 && (

                        <div className="px-5 py-14 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

                                <HistoryIcon
                                    size={30}
                                    className="text-slate-400"
                                />

                            </div>


                            <h3 className="mt-4 font-semibold text-slate-700">

                                {search
                                    ? 'Data tidak ditemukan'
                                    : 'Belum ada riwayat'}

                            </h3>


                            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">

                                {search
                                    ? 'Coba gunakan kata kunci pencarian yang berbeda.'
                                    : 'Penghuni yang menyelesaikan atau membatalkan kontrak akan muncul di sini.'}

                            </p>

                        </div>

                    )}


                {/* =================================================
                    DATA
                ================================================= */}

                {!loading &&
                    filteredTenants.length > 0 && (

                        <div className="overflow-x-auto">

                            <table className="min-w-full text-sm">


                                {/* HEADER */}

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                                            Penghuni
                                        </th>

                                        <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                                            Kamar
                                        </th>

                                        <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                                            Periode
                                        </th>

                                        <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                                            Harga
                                        </th>

                                        <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                                            Status
                                        </th>

                                        <th className="px-5 py-3.5 text-center font-semibold text-slate-600">
                                            Aksi
                                        </th>

                                    </tr>

                                </thead>


                                {/* BODY */}

                                <tbody className="divide-y divide-slate-100">

                                    {paginatedTenants.map(
                                        (tenant) => (

                                            <tr
                                                key={
                                                    tenant.contract_id ||
                                                    tenant.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >


                                                {/* =================================================
                                                    PENGHUNI
                                                ================================================= */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-start gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">

                                                            <Users
                                                                size={18}
                                                            />

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="font-semibold text-slate-800">

                                                                {
                                                                    tenant.name ||
                                                                    '-'
                                                                }

                                                            </p>


                                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">

                                                                <span className="inline-flex items-center gap-1">

                                                                    <Phone
                                                                        size={12}
                                                                    />

                                                                    {
                                                                        tenant.phone ||
                                                                        '-'
                                                                    }

                                                                </span>


                                                                {tenant.identity_number && (

                                                                    <span>

                                                                        ID:{' '}

                                                                        {
                                                                            tenant.identity_number
                                                                        }

                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    KAMAR
                                                ================================================= */}

                                                <td className="px-5 py-4">

                                                    <div className="inline-flex items-center gap-2">

                                                        <BedDouble
                                                            size={16}
                                                            className="text-slate-400"
                                                        />

                                                        <span className="font-medium text-slate-700">

                                                            {
                                                                tenant.room_number
                                                                    ? `Kamar ${tenant.room_number}`
                                                                    : '-'
                                                            }

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    PERIODE
                                                ================================================= */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2 text-slate-600">

                                                        <CalendarDays
                                                            size={16}
                                                            className="shrink-0 text-slate-400"
                                                        />

                                                        <span className="whitespace-nowrap">

                                                            {
                                                                formatDate(
                                                                    tenant.start_date
                                                                )
                                                            }

                                                            {' - '}

                                                            {
                                                                formatDate(
                                                                    tenant.end_date
                                                                )
                                                            }

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    HARGA
                                                ================================================= */}

                                                <td className="px-5 py-4">

                                                    <span className="font-semibold text-slate-700">

                                                        {
                                                            formatRupiah(
                                                                tenant.monthly_price
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* =================================================
                                                    STATUS
                                                ================================================= */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                            tenant.contract_status
                                                        )}`}
                                                    >

                                                        {
                                                            getStatusLabel(
                                                                tenant.contract_status
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* =================================================
                                                    AKSI
                                                ================================================= */}

                                                <td className="px-5 py-4">

                                                    <div className="flex justify-center">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenDetail(
                                                                    tenant
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                        >

                                                            <Eye
                                                                size={15}
                                                            />

                                                            Detail

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    filteredTenants.length > 0 && (

                        <div className="border-t border-slate-200 px-5 py-4">

                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                                {/* INFO */}

                                <div className="text-sm text-slate-500">

                                    Menampilkan{' '}

                                    <span className="font-semibold text-slate-700">

                                        {
                                            totalItems === 0
                                                ? 0
                                                : (
                                                    (
                                                        currentPage - 1
                                                    ) *
                                                    itemsPerPage
                                                ) + 1
                                        }

                                    </span>

                                    {' - '}

                                    <span className="font-semibold text-slate-700">

                                        {
                                            Math.min(
                                                currentPage *
                                                itemsPerPage,
                                                totalItems
                                            )
                                        }

                                    </span>

                                    {' dari '}

                                    <span className="font-semibold text-slate-700">
                                        {totalItems}
                                    </span>

                                    {' data'}

                                </div>


                                {/* PAGINATION */}

                                <div className="flex flex-wrap items-center gap-2">


                                    {/* ITEMS PER PAGE */}

                                    <div className="mr-2 flex items-center gap-2 text-sm text-slate-500">

                                        <span>
                                            Tampilkan
                                        </span>

                                        <select
                                            value={
                                                itemsPerPage
                                            }
                                            onChange={
                                                handleItemsPerPageChange
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >

                                            <option value={5}>
                                                5
                                            </option>

                                            <option value={8}>
                                                8
                                            </option>

                                            <option value={10}>
                                                10
                                            </option>

                                            <option value={20}>
                                                20
                                            </option>

                                        </select>

                                    </div>


                                    {/* FIRST */}

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage === 1
                                        }
                                        onClick={() =>
                                            setCurrentPage(1)
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >

                                        <ChevronsLeft
                                            size={16}
                                        />

                                    </button>


                                    {/* PREVIOUS */}

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage === 1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (prev) =>
                                                    Math.max(
                                                        1,
                                                        prev - 1
                                                    )
                                            )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >

                                        <ChevronLeft
                                            size={16}
                                        />

                                    </button>


                                    {/* PAGE NUMBERS */}

                                    {pageNumbers.map(
                                        (page) => (

                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() =>
                                                    setCurrentPage(
                                                        page
                                                    )
                                                }
                                                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${currentPage === page
                                                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >

                                                {page}

                                            </button>

                                        )
                                    )}


                                    {/* NEXT */}

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (prev) =>
                                                    Math.min(
                                                        totalPages,
                                                        prev + 1
                                                    )
                                            )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >

                                        <ChevronRight
                                            size={16}
                                        />

                                    </button>


                                    {/* LAST */}

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                totalPages
                                            )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >

                                        <ChevronsRight
                                            size={16}
                                        />

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

            </div>


            {/* =====================================================
                DETAIL MODAL
            ===================================================== */}

            {showDetail &&
                selectedTenant && (

                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                        onMouseDown={(e) => {

                            if (
                                e.target === e.currentTarget
                            ) {

                                handleCloseDetail()

                            }

                        }}
                    >

                        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">


                            {/* =================================================
                                MODAL HEADER
                            ================================================= */}

                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">

                                        <FileText
                                            size={21}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="font-semibold text-slate-800">
                                            Detail Riwayat
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Informasi penghuni dan kontrak
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleCloseDetail
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                >

                                    <X
                                        size={20}
                                    />

                                </button>

                            </div>


                            {/* =================================================
                                MODAL BODY
                            ================================================= */}

                            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">


                                {/* =================================================
                                    PROFILE
                                ================================================= */}

                                <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">

                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">

                                        <Users
                                            size={25}
                                        />

                                    </div>


                                    <div className="min-w-0 flex-1">

                                        <h3 className="text-lg font-bold text-slate-800">

                                            {
                                                selectedTenant.name ||
                                                '-'
                                            }

                                        </h3>


                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">

                                            <span className="inline-flex items-center gap-1.5">

                                                <Phone
                                                    size={14}
                                                />

                                                {
                                                    selectedTenant.phone ||
                                                    '-'
                                                }

                                            </span>


                                            {selectedTenant.identity_number && (

                                                <span className="inline-flex items-center gap-1.5">

                                                    <CreditCard
                                                        size={14}
                                                    />

                                                    {
                                                        selectedTenant.identity_number
                                                    }

                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    <span
                                        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                            selectedTenant.contract_status
                                        )}`}
                                    >

                                        {
                                            getStatusLabel(
                                                selectedTenant.contract_status
                                            )
                                        }

                                    </span>

                                </div>


                                {/* =================================================
                                    DETAIL GRID
                                ================================================= */}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


                                    {/* KAMAR */}

                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">

                                            <BedDouble
                                                size={15}
                                            />

                                            Kamar

                                        </div>


                                        <p className="mt-2 text-base font-semibold text-slate-800">

                                            {
                                                selectedTenant.room_number
                                                    ? `Kamar ${selectedTenant.room_number}`
                                                    : '-'
                                            }

                                        </p>

                                    </div>


                                    {/* HARGA */}

                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">

                                            <WalletCards
                                                size={15}
                                            />

                                            Harga Bulanan

                                        </div>


                                        <p className="mt-2 text-base font-semibold text-slate-800">

                                            {
                                                formatRupiah(
                                                    selectedTenant.monthly_price
                                                )
                                            }

                                        </p>

                                    </div>


                                    {/* TANGGAL MULAI */}

                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">

                                            <CalendarDays
                                                size={15}
                                            />

                                            Tanggal Mulai

                                        </div>


                                        <p className="mt-2 text-base font-semibold text-slate-800">

                                            {
                                                formatDate(
                                                    selectedTenant.start_date
                                                )
                                            }

                                        </p>

                                    </div>


                                    {/* TANGGAL SELESAI */}

                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">

                                            <CalendarDays
                                                size={15}
                                            />

                                            Tanggal Selesai

                                        </div>


                                        <p className="mt-2 text-base font-semibold text-slate-800">

                                            {
                                                formatDate(
                                                    selectedTenant.end_date
                                                )
                                            }

                                        </p>

                                    </div>


                                    {/* ID KONTRAK */}

                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">

                                            <FileText
                                                size={15}
                                            />

                                            ID Kontrak

                                        </div>


                                        <p className="mt-2 text-base font-semibold text-slate-800">

                                            #
                                            {
                                                selectedTenant.contract_id ||
                                                '-'
                                            }

                                        </p>

                                    </div>


                                    {/* ID PENGHUNI */}

                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">

                                            <Users
                                                size={15}
                                            />

                                            ID Penghuni

                                        </div>


                                        <p className="mt-2 text-base font-semibold text-slate-800">

                                            #
                                            {
                                                selectedTenant.id ||
                                                '-'
                                            }

                                        </p>

                                    </div>

                                </div>


                                {/* =================================================
                                    ALAMAT
                                ================================================= */}

                                {selectedTenant.address && (

                                    <div className="mt-4 rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">

                                            <MapPin
                                                size={15}
                                            />

                                            Alamat

                                        </div>


                                        <p className="mt-2 text-sm leading-6 text-slate-700">

                                            {
                                                selectedTenant.address
                                            }

                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                MODAL FOOTER
                            ================================================= */}

                            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseDetail
                                    }
                                    className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                                >

                                    Tutup

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>

    )

}


export default History