import { useEffect, useMemo, useState } from 'react'

import {
    FileText,
    Plus,
    Pencil,
    Trash2,
    X,
    CalendarDays,
    User,
    BedDouble,
    Phone,
    Search,
    RefreshCw,
    Eye,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock3,
    Ban,
    Wallet,
} from 'lucide-react'

import {
    getContracts,
    createContract,
    updateContract,
    deleteContract,
} from '../services/contractService'

import { getTenants } from '../services/tenantService'
import { getRooms } from '../services/roomService'


// =====================================================
// FORMAT RUPIAH
// =====================================================

function formatRupiah(value) {

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return 'Rp 0'
    }

    const numberValue = Number(value)

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
// FORMAT DATE
// =====================================================

function formatDate(date) {

    if (!date) {
        return '-'
    }

    if (
        typeof date === 'string' &&
        /^\d{4}-\d{2}-\d{2}/.test(date)
    ) {

        const datePart = date.substring(0, 10)

        const [
            year,
            month,
            day,
        ] = datePart.split('-')

        return `${day}-${month}-${year}`

    }

    try {

        return new Date(date).toLocaleDateString(
            'id-ID',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }
        )

    } catch {

        return date

    }

}


// =====================================================
// FORMAT DATE SHORT
// =====================================================

function formatDateShort(date) {

    if (!date) {
        return '-'
    }

    if (
        typeof date === 'string' &&
        /^\d{4}-\d{2}-\d{2}/.test(date)
    ) {

        const datePart = date.substring(0, 10)

        const [
            year,
            month,
            day,
        ] = datePart.split('-')

        return `${day}/${month}/${year}`

    }

    return formatDate(date)

}


// =====================================================
// STATUS LABEL
// =====================================================

function getStatusLabel(status) {

    switch (status) {

        case 'active':
            return 'Aktif'

        case 'completed':
            return 'Selesai'

        case 'cancelled':
            return 'Dibatalkan'

        default:
            return status || '-'

    }

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(status) {

    switch (status) {

        case 'active':
            return 'bg-green-100 text-green-700 border border-green-200'

        case 'completed':
            return 'bg-blue-100 text-blue-700 border border-blue-200'

        case 'cancelled':
            return 'bg-red-100 text-red-700 border border-red-200'

        default:
            return 'bg-slate-100 text-slate-700 border border-slate-200'

    }

}


// =====================================================
// STATUS ICON
// =====================================================

function StatusIcon({ status, size = 16 }) {

    if (status === 'active') {
        return <CheckCircle2 size={size} />
    }

    if (status === 'completed') {
        return <CheckCircle2 size={size} />
    }

    if (status === 'cancelled') {
        return <Ban size={size} />
    }

    return <Clock3 size={size} />

}


// =====================================================
// CONTRACTS
// =====================================================

function Contracts() {

    // =====================================================
    // STATE
    // =====================================================

    const [contracts, setContracts] = useState([])

    const [tenants, setTenants] = useState([])

    const [rooms, setRooms] = useState([])

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)

    const [error, setError] = useState('')

    const [search, setSearch] = useState('')

    const [statusFilter, setStatusFilter] = useState('all')

    const [currentPage, setCurrentPage] = useState(1)

    const [itemsPerPage, setItemsPerPage] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const [editingContract, setEditingContract] = useState(null)

    const [selectedContract, setSelectedContract] = useState(null)


    const [formData, setFormData] = useState({
        tenant_id: '',
        room_id: '',
        start_date: '',
        end_date: '',
        monthly_price: '',
        status: 'active',
    })


    // =====================================================
    // LOAD DATA
    // =====================================================

    async function loadData() {

        try {

            setLoading(true)

            setError('')

            const [
                contractResponse,
                tenantResponse,
                roomResponse,
            ] = await Promise.all([
                getContracts(),
                getTenants(),
                getRooms(),
            ])


            setContracts(
                contractResponse?.data || []
            )

            setTenants(
                tenantResponse?.data || []
            )

            setRooms(
                roomResponse?.data || []
            )

        } catch (error) {

            console.error(error)

            setError(
                error.message ||
                'Gagal mengambil data kontrak.'
            )

        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        loadData()

    }, [])


    // =====================================================
    // =====================================================
    // TENANT YANG BOLEH DIBUATKAN KONTRAK BARU
    //
    // Penghuni yang sudah pernah keluar tetap ada di database
    // dan tetap boleh dibuatkan kontrak baru di masa depan.
    // Yang TIDAK boleh dipilih adalah penghuni yang masih
    // mempunyai kontrak ACTIVE.
    // =====================================================

    const availableTenants = useMemo(() => {
        return tenants.filter((tenant) => {
            return !contracts.some(
                (contract) =>
                    Number(contract.tenant_id) === Number(tenant.id) &&
                    contract.status === 'active'
            )
        })
    }, [tenants, contracts])


    // Saat EDIT kontrak, penghuni yang sedang diedit tetap
    // ditampilkan walaupun kontraknya ACTIVE karena select
    // dalam mode edit memang disabled.
    const tenantOptions = useMemo(() => {
        if (!editingContract) {
            return availableTenants
        }

        return tenants.filter((tenant) => {
            const isCurrentTenant =
                Number(tenant.id) === Number(formData.tenant_id)

            const hasActiveContract = contracts.some(
                (contract) =>
                    Number(contract.tenant_id) === Number(tenant.id) &&
                    contract.status === 'active'
            )

            return isCurrentTenant || !hasActiveContract
        })
    }, [
        tenants,
        contracts,
        availableTenants,
        editingContract,
        formData.tenant_id,
    ])


    // =====================================================
    // KAMAR TERPILIH
    // =====================================================

    const selectedRoom = useMemo(() => {

        return rooms.find(
            (room) =>
                Number(room.id) ===
                Number(formData.room_id)
        ) || null

    }, [
        rooms,
        formData.room_id,
    ])


    // =====================================================
    // HARGA KAMAR
    //
    // Harga kamar berasal dari field `price` pada tabel rooms.
    // Saat tambah kontrak, harga otomatis disalin ke
    // monthly_price sebagai harga historis kontrak.
    // =====================================================

    function getRoomPrice(room) {

        if (!room) {
            return ''
        }

        const price = Number(
            room.price ??
            room.rent_price ??
            room.rentPrice ??
            0
        )

        return price > 0 ? String(price) : ''

    }


    // =====================================================
    // =====================================================

    const sortedContracts = useMemo(() => {

        return [...contracts].sort((a, b) => {

            const roomA = Number(
                String(a.room_number || '')
                    .replace(/\D/g, '') || 999999
            )

            const roomB = Number(
                String(b.room_number || '')
                    .replace(/\D/g, '') || 999999
            )

            return roomA - roomB

        })

    }, [contracts])


    // =====================================================
    // FILTER CONTRACT
    // =====================================================

    const filteredContracts = useMemo(() => {

        const keyword = search
            .toLowerCase()
            .trim()

        return sortedContracts.filter((contract) => {

            const matchesSearch =
                !keyword ||
                String(contract.tenant_name || '')
                    .toLowerCase()
                    .includes(keyword) ||
                String(contract.tenant_phone || '')
                    .toLowerCase()
                    .includes(keyword) ||
                String(contract.room_number || '')
                    .toLowerCase()
                    .includes(keyword) ||
                String(contract.status || '')
                    .toLowerCase()
                    .includes(keyword)

            const matchesStatus =
                statusFilter === 'all' ||
                contract.status === statusFilter

            return (
                matchesSearch &&
                matchesStatus
            )

        })

    }, [
        sortedContracts,
        search,
        statusFilter,
    ])


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalContracts =
        contracts.length

    const activeContracts =
        contracts.filter(
            (contract) =>
                contract.status === 'active'
        ).length

    const completedContracts =
        contracts.filter(
            (contract) =>
                contract.status === 'completed'
        ).length

    const cancelledContracts =
        contracts.filter(
            (contract) =>
                contract.status === 'cancelled'
        ).length


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredContracts.length /
            itemsPerPage
        )
    )


    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        )


    const startIndex =
        (safeCurrentPage - 1) *
        itemsPerPage


    const endIndex =
        startIndex +
        itemsPerPage


    const paginatedContracts =
        filteredContracts.slice(
            startIndex,
            endIndex
        )


    useEffect(() => {

        setCurrentPage(1)

    }, [
        search,
        statusFilter,
        itemsPerPage,
    ])


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    function openAddModal() {

        setEditingContract(null)

        setFormData({
            tenant_id: '',
            room_id: '',
            start_date: '',
            end_date: '',
            monthly_price: '',
            status: 'active',
        })

        setIsModalOpen(true)

    }


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    function openEditModal(contract) {

        setEditingContract(contract)

        setFormData({
            tenant_id: contract.tenant_id,
            room_id: contract.room_id,
            start_date: contract.start_date
                ? contract.start_date.substring(0, 10)
                : '',
            end_date: contract.end_date
                ? contract.end_date.substring(0, 10)
                : '',
            monthly_price: contract.monthly_price,
            status: contract.status,
        })

        setIsDetailOpen(false)

        setIsModalOpen(true)

    }


    // =====================================================
    // OPEN DETAIL
    // =====================================================

    function openDetail(contract) {

        setSelectedContract(contract)

        setIsDetailOpen(true)

    }


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target


        // =================================================
        // PILIH KAMAR
        // =================================================
        //
        // Saat membuat kontrak baru, harga otomatis
        // mengikuti harga sewa kamar dari database.
        //
        // Saat edit kontrak, harga lama tetap dipertahankan
        // agar harga historis kontrak tidak berubah hanya
        // karena data kamar berubah.
        // =================================================

        if (
            name === 'room_id' &&
            !editingContract
        ) {

            const selectedRoom =
                rooms.find(
                    (room) =>
                        Number(room.id) ===
                        Number(value)
                )

            const roomPrice =
                getRoomPrice(selectedRoom)

            setFormData((previous) => ({
                ...previous,
                room_id: value,
                monthly_price: roomPrice,
            }))

            return
        }


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))

    }


    // =====================================================
    // SUBMIT
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault()

        if (!formData.tenant_id) {

            alert('Penghuni wajib dipilih.')

            return

        }


        // Pengaman tambahan: kontrak baru tidak boleh dibuat
        // untuk penghuni yang masih mempunyai kontrak ACTIVE.
        if (!editingContract) {

            const tenantAlreadyActive = contracts.some(
                (contract) =>
                    Number(contract.tenant_id) === Number(formData.tenant_id) &&
                    contract.status === 'active'
            )

            if (tenantAlreadyActive) {
                alert(
                    'Penghuni tersebut masih memiliki kontrak aktif. Selesaikan kontrak lama terlebih dahulu.'
                )
                return
            }
        }


        if (!formData.room_id) {

            alert('Kamar wajib dipilih.')

            return

        }


        if (!formData.start_date) {

            alert('Tanggal mulai wajib diisi.')

            return

        }


        // =================================================
        // HARGA OTOMATIS DARI KAMAR
        // =================================================
        //
        // Untuk kontrak baru, harga selalu diambil dari
        // harga kamar yang dipilih. Ini mencegah nilai harga
        // yang tertinggal/stale di form.
        // =================================================

        let monthlyPrice =
            Number(formData.monthly_price)


        if (!editingContract) {

            const selectedRoomForSubmit =
                rooms.find(
                    (room) =>
                        Number(room.id) ===
                        Number(formData.room_id)
                )

            monthlyPrice =
                Number(
                    getRoomPrice(
                        selectedRoomForSubmit
                    )
                )

            if (
                !monthlyPrice ||
                monthlyPrice <= 0
            ) {

                alert(
                    'Harga kamar belum tersedia. Periksa harga sewa pada data kamar terlebih dahulu.'
                )

                return
            }

        }


        if (
            !monthlyPrice ||
            monthlyPrice <= 0
        ) {

            alert('Harga bulanan wajib diisi.')

            return

        }


        if (
            formData.end_date &&
            formData.start_date >
            formData.end_date
        ) {

            alert(
                'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.'
            )

            return

        }


        try {

            setSaving(true)


            const payload = {
                tenant_id: Number(
                    formData.tenant_id
                ),

                room_id: Number(
                    formData.room_id
                ),

                start_date:
                    formData.start_date,

                end_date:
                    formData.end_date || null,

                monthly_price:
                    monthlyPrice,

                status:
                    formData.status,
            }


            if (editingContract) {

                await updateContract(
                    editingContract.id,
                    {
                        start_date:
                            payload.start_date,

                        end_date:
                            payload.end_date,

                        monthly_price:
                            payload.monthly_price,

                        status:
                            payload.status,
                    }
                )

                alert(
                    'Kontrak berhasil diperbarui.'
                )

            } else {

                await createContract(
                    payload
                )

                alert(
                    'Kontrak berhasil dibuat.'
                )

            }


            setIsModalOpen(false)

            setEditingContract(null)

            await loadData()

        } catch (error) {

            console.error(error)

            alert(
                error.message ||
                'Gagal menyimpan kontrak.'
            )

        } finally {

            setSaving(false)

        }

    }


    // =====================================================
    // DELETE
    // =====================================================

    async function handleDelete(contract) {

        const confirmed =
            window.confirm(
                `Apakah Anda yakin ingin menghapus kontrak ${contract.tenant_name}?`
            )


        if (!confirmed) {
            return
        }


        try {

            await deleteContract(
                contract.id
            )

            alert(
                'Kontrak berhasil dihapus.'
            )

            setIsDetailOpen(false)

            setSelectedContract(null)

            await loadData()

        } catch (error) {

            console.error(error)

            alert(
                error.message ||
                'Gagal menghapus kontrak.'
            )

        }

    }


    // =====================================================
    // PAGE NAVIGATION
    // =====================================================

    function goToPage(page) {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return
        }

        setCurrentPage(page)

    }


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    function getPageNumbers() {

        const pages = []

        const maxVisible = 5

        let start =
            Math.max(
                1,
                safeCurrentPage -
                Math.floor(maxVisible / 2)
            )

        let end =
            Math.min(
                totalPages,
                start + maxVisible - 1
            )

        if (
            end - start + 1 <
            maxVisible
        ) {

            start =
                Math.max(
                    1,
                    end - maxVisible + 1
                )

        }

        for (
            let i = start;
            i <= end;
            i++
        ) {

            pages.push(i)

        }

        return pages

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="space-y-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white">

                        <FileText
                            size={20}
                        />

                    </div>

                    <div>

                        <h1 className="text-xl font-bold text-slate-800">
                            Manajemen Kontrak
                        </h1>

                        <p className="text-sm text-slate-500">
                            Kelola kontrak penghuni ADELINA KOST
                        </p>

                    </div>

                </div>


                <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-white">

                    <div className="text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-3 text-sm text-slate-500">
                            Memuat data kontrak...
                        </p>

                    </div>

                </div>

            </div>

        )

    }


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

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white">

                            <FileText
                                size={20}
                            />

                        </div>


                        <div>

                            <h1 className="text-xl font-bold text-slate-800">
                                Manajemen Kontrak
                            </h1>

                            <p className="text-sm text-slate-500">
                                Kelola kontrak penghuni ADELINA KOST
                            </p>

                        </div>

                    </div>

                </div>


                <div className="flex flex-col gap-2 sm:flex-row">

                    <button
                        type="button"
                        onClick={loadData}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
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


                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                    >

                        <Plus
                            size={18}
                        />

                        Tambah Kontrak

                    </button>

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
                            onClick={loadData}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


                {/* TOTAL */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Kontrak
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-800">
                                {totalContracts}
                            </p>

                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">

                            <FileText
                                size={22}
                            />

                        </div>

                    </div>

                </div>


                {/* AKTIF */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Kontrak Aktif
                            </p>

                            <p className="mt-1 text-2xl font-bold text-green-600">
                                {activeContracts}
                            </p>

                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">

                            <CheckCircle2
                                size={22}
                            />

                        </div>

                    </div>

                </div>


                {/* SELESAI */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Kontrak Selesai
                            </p>

                            <p className="mt-1 text-2xl font-bold text-blue-600">
                                {completedContracts}
                            </p>

                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                            <CheckCircle2
                                size={22}
                            />

                        </div>

                    </div>

                </div>


                {/* BATAL */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Dibatalkan
                            </p>

                            <p className="mt-1 text-2xl font-bold text-red-600">
                                {cancelledContracts}
                            </p>

                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">

                            <Ban
                                size={22}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                TABLE CARD
            ================================================= */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">


                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <div className="border-b border-slate-200 px-5 py-4">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                        <div>

                            <h2 className="font-semibold text-slate-800">
                                Daftar Kontrak
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Semua kontrak penghuni ADELINA KOST
                            </p>

                        </div>


                        <div className="flex flex-col gap-2 sm:flex-row">

                            {/* SEARCH */}

                            <div className="relative">

                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Cari penghuni, HP, kamar..."
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                                />

                            </div>


                            {/* STATUS */}

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    Semua Status
                                </option>

                                <option value="active">
                                    Aktif
                                </option>

                                <option value="completed">
                                    Selesai
                                </option>

                                <option value="cancelled">
                                    Dibatalkan
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    EMPTY
                ================================================= */}

                {filteredContracts.length === 0 ? (

                    <div className="px-5 py-14 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

                            <FileText
                                size={28}
                                className="text-slate-400"
                            />

                        </div>

                        <h3 className="mt-4 font-semibold text-slate-700">

                            {search ||
                                statusFilter !== 'all'
                                ? 'Data tidak ditemukan'
                                : 'Belum ada kontrak'}

                        </h3>

                        <p className="mt-1 text-sm text-slate-500">

                            {search ||
                                statusFilter !== 'all'
                                ? 'Coba gunakan kata kunci atau filter yang berbeda.'
                                : 'Tambahkan kontrak penghuni terlebih dahulu.'}

                        </p>

                        {!search &&
                            statusFilter === 'all' && (

                                <button
                                    type="button"
                                    onClick={openAddModal}
                                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >

                                    <Plus
                                        size={17}
                                    />

                                    Tambah Kontrak

                                </button>

                            )}

                    </div>

                ) : (

                    <>
                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="overflow-x-auto">

                            <table className="min-w-full text-sm">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                            Penghuni
                                        </th>

                                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                            Kamar
                                        </th>

                                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                            Periode
                                        </th>

                                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                            Harga
                                        </th>

                                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-right font-semibold text-slate-600">
                                            Aksi
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {paginatedContracts.map(
                                        (contract) => (

                                            <tr
                                                key={
                                                    contract.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >


                                                {/* PENGHUNI */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-start gap-3">

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">

                                                            <User
                                                                size={17}
                                                            />

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="font-medium text-slate-800">

                                                                {
                                                                    contract.tenant_name ||
                                                                    '-'
                                                                }

                                                            </p>

                                                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                                                                <Phone
                                                                    size={12}
                                                                />

                                                                {
                                                                    contract.tenant_phone ||
                                                                    '-'
                                                                }

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* KAMAR */}

                                                <td className="px-5 py-4">

                                                    <div className="inline-flex items-center gap-2">

                                                        <BedDouble
                                                            size={16}
                                                            className="text-slate-400"
                                                        />

                                                        <span className="font-medium text-slate-700">

                                                            {contract.room_number
                                                                ? `Kamar ${contract.room_number}`
                                                                : '-'}

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* PERIODE */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <CalendarDays
                                                            size={16}
                                                            className="shrink-0 text-slate-400"
                                                        />

                                                        <div>

                                                            <p className="text-slate-700">

                                                                {formatDateShort(
                                                                    contract.start_date
                                                                )}

                                                            </p>

                                                            <p className="text-xs text-slate-400">

                                                                s/d{' '}

                                                                {formatDateShort(
                                                                    contract.end_date
                                                                )}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* HARGA */}

                                                <td className="px-5 py-4">

                                                    <span className="font-medium text-slate-700">

                                                        {formatRupiah(
                                                            contract.monthly_price
                                                        )}

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                            contract.status
                                                        )}`}
                                                    >

                                                        <StatusIcon
                                                            status={
                                                                contract.status
                                                            }
                                                            size={13}
                                                        />

                                                        {
                                                            getStatusLabel(
                                                                contract.status
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* AKSI */}

                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        {/* DETAIL */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDetail(
                                                                    contract
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                            title="Lihat Detail"
                                                        >

                                                            <Eye
                                                                size={16}
                                                            />

                                                        </button>


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    contract
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
                                                            title="Edit"
                                                        >

                                                            <Pencil
                                                                size={16}
                                                            />

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    contract
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50"
                                                            title="Hapus"
                                                        >

                                                            <Trash2
                                                                size={16}
                                                            />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">

                                <span>

                                    Menampilkan{' '}

                                    <span className="font-semibold text-slate-700">

                                        {filteredContracts.length === 0
                                            ? 0
                                            : startIndex + 1}

                                    </span>

                                    {' - '}

                                    <span className="font-semibold text-slate-700">

                                        {Math.min(
                                            endIndex,
                                            filteredContracts.length
                                        )}

                                    </span>

                                    {' dari '}

                                    <span className="font-semibold text-slate-700">

                                        {filteredContracts.length}

                                    </span>

                                    {' data'}

                                </span>


                                <select
                                    value={itemsPerPage}
                                    onChange={(event) =>
                                        setItemsPerPage(
                                            Number(
                                                event.target.value
                                            )
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-blue-500"
                                >

                                    <option value={5}>
                                        5 / halaman
                                    </option>

                                    <option value={10}>
                                        10 / halaman
                                    </option>

                                    <option value={15}>
                                        15 / halaman
                                    </option>

                                    <option value={20}>
                                        20 / halaman
                                    </option>

                                </select>

                            </div>


                            <div className="flex items-center gap-1">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            safeCurrentPage - 1
                                        )
                                    }
                                    disabled={
                                        safeCurrentPage === 1
                                    }
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft
                                        size={17}
                                    />

                                </button>


                                {getPageNumbers().map(
                                    (page) => (

                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    page
                                                )
                                            }
                                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${page ===
                                                safeCurrentPage
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >

                                            {page}

                                        </button>

                                    )
                                )}


                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            safeCurrentPage + 1
                                        )
                                    }
                                    disabled={
                                        safeCurrentPage ===
                                        totalPages
                                    }
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronRight
                                        size={17}
                                    />

                                </button>

                            </div>

                        </div>

                    </>

                )}

            </div>


            {/* =========================================================
                DETAIL MODAL
            ========================================================= */}

            {isDetailOpen &&
                selectedContract && (

                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                        onMouseDown={(event) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                setIsDetailOpen(false)
                            }

                        }}
                    >

                        <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">


                            {/* DETAIL HEADER */}

                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                        <FileText
                                            size={22}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-lg font-bold text-slate-800">
                                            Detail Kontrak
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Informasi lengkap kontrak penghuni
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsDetailOpen(false)
                                    }
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                >

                                    <X
                                        size={20}
                                    />

                                </button>

                            </div>


                            {/* DETAIL BODY */}

                            <div className="max-h-[calc(90vh-150px)] overflow-y-auto p-6">

                                {/* TENANT CARD */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">

                                                <User
                                                    size={26}
                                                />

                                            </div>


                                            <div>

                                                <p className="text-lg font-bold text-slate-800">

                                                    {
                                                        selectedContract.tenant_name ||
                                                        '-'
                                                    }

                                                </p>

                                                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">

                                                    <Phone
                                                        size={14}
                                                    />

                                                    {
                                                        selectedContract.tenant_phone ||
                                                        '-'
                                                    }

                                                </div>

                                            </div>

                                        </div>


                                        <span
                                            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                                selectedContract.status
                                            )}`}
                                        >

                                            <StatusIcon
                                                status={
                                                    selectedContract.status
                                                }
                                                size={14}
                                            />

                                            {
                                                getStatusLabel(
                                                    selectedContract.status
                                                )
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* DETAIL GRID */}

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">


                                    {/* KAMAR */}

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

                                                <BedDouble
                                                    size={19}
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Kamar
                                                </p>

                                                <p className="mt-0.5 font-semibold text-slate-800">

                                                    {selectedContract.room_number
                                                        ? `Kamar ${selectedContract.room_number}`
                                                        : '-'}

                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* HARGA */}

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">

                                                <Wallet
                                                    size={19}
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Harga Bulanan
                                                </p>

                                                <p className="mt-0.5 font-semibold text-slate-800">

                                                    {formatRupiah(
                                                        selectedContract.monthly_price
                                                    )}

                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* MULAI */}

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                                                <CalendarDays
                                                    size={19}
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Tanggal Mulai
                                                </p>

                                                <p className="mt-0.5 font-semibold text-slate-800">

                                                    {formatDate(
                                                        selectedContract.start_date
                                                    )}

                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* SELESAI */}

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">

                                                <CalendarDays
                                                    size={19}
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Tanggal Selesai
                                                </p>

                                                <p className="mt-0.5 font-semibold text-slate-800">

                                                    {formatDate(
                                                        selectedContract.end_date
                                                    )}

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* CONTRACT INFO */}

                                <div className="mt-5 rounded-xl border border-slate-200 bg-white">

                                    <div className="border-b border-slate-100 px-5 py-4">

                                        <h3 className="font-semibold text-slate-800">
                                            Informasi Kontrak
                                        </h3>

                                    </div>


                                    <div className="divide-y divide-slate-100">

                                        <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                            <span className="text-sm text-slate-500">
                                                ID Kontrak
                                            </span>

                                            <span className="text-sm font-medium text-slate-700">

                                                #{selectedContract.id}

                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                            <span className="text-sm text-slate-500">
                                                Penghuni
                                            </span>

                                            <span className="text-right text-sm font-medium text-slate-700">

                                                {
                                                    selectedContract.tenant_name ||
                                                    '-'
                                                }

                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                            <span className="text-sm text-slate-500">
                                                Periode
                                            </span>

                                            <span className="text-right text-sm font-medium text-slate-700">

                                                {formatDate(
                                                    selectedContract.start_date
                                                )}

                                                {' - '}

                                                {formatDate(
                                                    selectedContract.end_date
                                                )}

                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                            <span className="text-sm text-slate-500">
                                                Status
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                    selectedContract.status
                                                )}`}
                                            >

                                                <StatusIcon
                                                    status={
                                                        selectedContract.status
                                                    }
                                                    size={13}
                                                />

                                                {
                                                    getStatusLabel(
                                                        selectedContract.status
                                                    )
                                                }

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* DETAIL FOOTER */}

                            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            selectedContract
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >

                                    <Trash2
                                        size={16}
                                    />

                                    Hapus

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        openEditModal(
                                            selectedContract
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                >

                                    <Pencil
                                        size={16}
                                    />

                                    Edit Kontrak

                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {/* =========================================================
                ADD / EDIT MODAL
            ========================================================= */}

            {isModalOpen && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setIsModalOpen(false)
                        }

                    }}
                >

                    <div className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">


                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                                    {editingContract
                                        ? <Pencil size={19} />
                                        : <Plus size={20} />}

                                </div>


                                <div>

                                    <h2 className="text-lg font-bold text-slate-800">

                                        {editingContract
                                            ? 'Edit Kontrak'
                                            : 'Tambah Kontrak'}

                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Lengkapi informasi kontrak penghuni
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setIsModalOpen(false)
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="max-h-[calc(90vh-150px)] overflow-y-auto"
                        >

                            <div className="space-y-5 p-6">


                                {/* TENANT */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Penghuni
                                    </label>

                                    <div className="relative">

                                        <User
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <select
                                            name="tenant_id"
                                            value={
                                                formData.tenant_id
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !!editingContract
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                        >

                                            <option value="">
                                                Pilih penghuni
                                            </option>

                                            {tenantOptions.map(
                                                (tenant) => (

                                                    <option
                                                        key={
                                                            tenant.id
                                                        }
                                                        value={
                                                            tenant.id
                                                        }
                                                    >
                                                        {
                                                            tenant.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>


                                {/* ROOM */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Kamar
                                    </label>

                                    <div className="relative">

                                        <BedDouble
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <select
                                            name="room_id"
                                            value={
                                                formData.room_id
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !!editingContract
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                        >

                                            <option value="">
                                                Pilih kamar
                                            </option>

                                            {rooms
                                                .filter(
                                                    (room) =>
                                                        room.status ===
                                                        'available' ||
                                                        room.id ===
                                                        formData.room_id
                                                )
                                                .sort(
                                                    (a, b) =>
                                                        Number(
                                                            String(
                                                                a.room_number ||
                                                                ''
                                                            ).replace(
                                                                /\D/g,
                                                                ''
                                                            ) ||
                                                            999999
                                                        ) -
                                                        Number(
                                                            String(
                                                                b.room_number ||
                                                                ''
                                                            ).replace(
                                                                /\D/g,
                                                                ''
                                                            ) ||
                                                            999999
                                                        )
                                                )
                                                .map(
                                                    (room) => (

                                                        <option
                                                            key={
                                                                room.id
                                                            }
                                                            value={
                                                                room.id
                                                            }
                                                        >
                                                            Kamar{' '}
                                                            {
                                                                room.room_number
                                                            }
                                                        </option>

                                                    )
                                                )}

                                        </select>

                                    </div>

                                </div>


                                {/* DATE GRID */}

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                                    {/* START */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Tanggal Mulai
                                        </label>

                                        <input
                                            type="date"
                                            name="start_date"
                                            value={
                                                formData.start_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>


                                    {/* END */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Tanggal Selesai
                                        </label>

                                        <input
                                            type="date"
                                            name="end_date"
                                            value={
                                                formData.end_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>


                                <p className="-mt-2 text-xs text-slate-400">
                                    Tanggal selesai boleh dikosongkan jika kontrak tidak memiliki batas akhir.
                                </p>


                                {/* PRICE */}

                                <div>

                                    <div className="mb-2 flex items-center justify-between gap-3">

                                        <label className="block text-sm font-medium text-slate-700">
                                            Harga Bulanan
                                        </label>

                                        {!editingContract && (
                                            <span className="text-xs font-medium text-blue-600">
                                                Otomatis dari kamar
                                            </span>
                                        )}

                                    </div>

                                    <div className="relative">

                                        <Wallet
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="number"
                                            name="monthly_price"
                                            value={
                                                formData.monthly_price
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={
                                                editingContract
                                                    ? 'Masukkan harga bulanan'
                                                    : 'Pilih kamar terlebih dahulu'
                                            }
                                            min="0"
                                            readOnly={
                                                !editingContract
                                            }
                                            className={`w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${!editingContract
                                                ? 'cursor-not-allowed bg-slate-50 text-slate-600'
                                                : 'bg-white'
                                                }`}
                                        />

                                    </div>


                                    {/* INFO HARGA KAMAR */}

                                    {!editingContract && (

                                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5">

                                            <Wallet
                                                size={14}
                                                className="mt-0.5 shrink-0 text-blue-600"
                                            />

                                            <p className="text-xs leading-5 text-blue-700">

                                                {selectedRoom
                                                    ? getRoomPrice(selectedRoom)
                                                        ? (
                                                            <>
                                                                Harga otomatis mengikuti harga sewa{' '}
                                                                <span className="font-semibold">
                                                                    Kamar {selectedRoom.room_number}
                                                                </span>
                                                                {' '}yaitu{' '}
                                                                <span className="font-semibold">
                                                                    {formatRupiah(
                                                                        getRoomPrice(
                                                                            selectedRoom
                                                                        )
                                                                    )}
                                                                </span>
                                                                {' '}per bulan.
                                                            </>
                                                        )
                                                        : 'Kamar yang dipilih belum memiliki harga sewa.'
                                                    : 'Pilih kamar untuk mengisi harga bulanan secara otomatis.'
                                                }

                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* STATUS */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status Kontrak
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >

                                        <option value="active">
                                            Aktif
                                        </option>

                                        <option value="completed">
                                            Selesai
                                        </option>

                                        <option value="cancelled">
                                            Dibatalkan
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* FORM FOOTER */}

                            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsModalOpen(false)
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >

                                    Batal

                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving
                                        ? 'Menyimpan...'
                                        : editingContract
                                            ? 'Simpan Perubahan'
                                            : 'Tambah Kontrak'}
                                    np
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    )

}


export default Contracts