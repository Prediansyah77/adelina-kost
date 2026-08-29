import { useEffect, useMemo, useState } from 'react'
import api from "../services/api";

import {
    Search,
    Plus,
    Pencil,
    UserRound,
    Phone,
    X,
    Eye,
    CreditCard,
    CalendarDays,
    DoorOpen,
    LogOut,
    BriefcaseBusiness,
    Users,
    MapPin,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'

import {
    getTenants,
    createTenant,
    updateTenant,
    deleteTenant,
} from '../services/tenantService'

import {
    getKtp,
    uploadKtp,
    deleteKtp
} from "../services/tenantDocumentService";

import { getRooms } from '../services/roomService'
import { getContracts } from '../services/contractService'


// =========================================================
// TENANTS
// =========================================================

function Tenants() {

    // =====================================================
    // STATE
    // =====================================================

    const [tenantList, setTenantList] =
        useState([])

    const [roomList, setRoomList] =
        useState([])

    const [contractList, setContractList] =
        useState([])

    const [selectedTenant, setSelectedTenant] =
        useState(null)

    const [isDetailOpen, setIsDetailOpen] =
        useState(false)

    const [ktpDocument, setKtpDocument] =
        useState(null)

    const [isKtpPreviewOpen, setIsKtpPreviewOpen] =
        useState(false)

    const [isKtpLoading, setIsKtpLoading] =
        useState(false)

    const [isMoveOutOpen, setIsMoveOutOpen] =
        useState(false)

    const [isModalOpen, setIsModalOpen] =
        useState(false)

    const [editingTenant, setEditingTenant] =
        useState(null)

    const [search, setSearch] =
        useState('')

    const [filter, setFilter] =
        useState('SEMUA')

    const [loading, setLoading] =
        useState(true)

    const [saving, setSaving] =
        useState(false)

    const [error, setError] =
        useState('')


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState(1)

    const itemsPerPage = 8


    // =====================================================
    // FORM TAMBAH / EDIT
    // =====================================================

    const emptyForm = {
        name: '',
        phone: '',
        address: '',
        identityNumber: '',
    }


    const [formData, setFormData] =
        useState(emptyForm)


    // =====================================================
    // FORM PENGHUNI KELUAR
    // =====================================================

    const emptyMoveOutForm = {
        moveOutDate: '',
        moveOutReason: '',
        roomCondition: '',
        depositStatus: '',
        depositReturned: '',
        depositDeduction: '',
        depositDeductionReason: '',
        moveOutNotes: '',
    }


    const [moveOutForm, setMoveOutForm] =
        useState(emptyMoveOutForm)


    // =====================================================
    // NORMALIZE ARRAY RESPONSE
    //
    // Supaya frontend tidak bergantung pada satu bentuk
    // response saja.
    // =====================================================

    function extractArray(response) {

        if (Array.isArray(response)) {
            return response
        }

        if (
            response &&
            Array.isArray(response.data)
        ) {
            return response.data
        }

        if (
            response?.data &&
            Array.isArray(response.data.data)
        ) {
            return response.data.data
        }

        if (
            response?.result &&
            Array.isArray(response.result)
        ) {
            return response.result
        }

        return []

    }

    // =====================================================
    // KTP
    // =====================================================

    const [ktpData, setKtpData] =
        useState(null)

    const [ktpLoading, setKtpLoading] =
        useState(false)

    const [ktpUploading, setKtpUploading] =
        useState(false)

    const [ktpFile, setKtpFile] =
        useState(null)


    // =====================================================
    // EXTRACT CREATED TENANT
    // =====================================================

    function extractCreatedTenant(response) {

        if (!response) {
            return null
        }

        if (
            response.data &&
            !Array.isArray(response.data) &&
            typeof response.data === 'object'
        ) {
            if (response.data.id) {
                return response.data
            }

            if (
                response.data.data &&
                response.data.data.id
            ) {
                return response.data.data
            }
        }

        if (
            response.tenant &&
            response.tenant.id
        ) {
            return response.tenant
        }

        if (response.id) {
            return response
        }

        return null

    }


    // =====================================================
    // LOAD SEMUA DATA
    // =====================================================

    useEffect(() => {

        loadData()

    }, [])


    async function loadData() {

        try {

            setLoading(true)

            setError('')


            const [
                tenantResponse,
                roomResponse,
                contractResponse,
            ] = await Promise.all([

                getTenants(),

                getRooms(),

                getContracts(),

            ])


            console.log(
                'TENANTS RESPONSE:',
                tenantResponse
            )

            console.log(
                'ROOMS RESPONSE:',
                roomResponse
            )

            console.log(
                'CONTRACTS RESPONSE:',
                contractResponse
            )


            const tenants =
                extractArray(
                    tenantResponse
                )

            const rooms =
                extractArray(
                    roomResponse
                )

            const contracts =
                extractArray(
                    contractResponse
                )


            setTenantList(
                tenants
            )

            setRoomList(
                rooms
            )

            setContractList(
                contracts
            )


            // =================================================
            // JAGA PAGINATION
            // =================================================

            setCurrentPage(
                (previousPage) => {

                    const totalPages =
                        Math.max(
                            1,
                            Math.ceil(
                                tenants.length /
                                itemsPerPage
                            )
                        )

                    return Math.min(
                        previousPage,
                        totalPages
                    )

                }
            )


            return {
                tenants,
                rooms,
                contracts,
            }


        } catch (error) {

            console.error(
                'LOAD TENANTS DATA ERROR:',
                error
            )


            setError(
                error.message ||
                'Gagal mengambil data penghuni.'
            )


            return {
                tenants: [],
                rooms: [],
                contracts: [],
            }


        } finally {

            setLoading(false)

        }

    }


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
            Number(value || 0)
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
    // GET ACTIVE CONTRACT
    // =====================================================

    function getActiveContract(
        tenantId
    ) {

        return contractList.find(
            (contract) =>
                Number(
                    contract.tenant_id
                ) ===
                Number(tenantId) &&
                contract.status === 'active'
        )

    }


    // =====================================================
    // GET CONTRACT TENANT
    // =====================================================

    function getTenantContract(
        tenantId
    ) {

        return contractList.find(
            (contract) =>
                Number(
                    contract.tenant_id
                ) ===
                Number(tenantId)
        )

    }


    // =====================================================
    // GET ROOM
    // =====================================================

    function getRoom(roomId) {

        return roomList.find(
            (room) =>
                Number(room.id) ===
                Number(roomId)
        )

    }


    // =====================================================
    // GET TENANT STATUS
    // =====================================================

    function getTenantStatus(
        tenant
    ) {

        const activeContract =
            getActiveContract(
                tenant.id
            )


        if (activeContract) {
            return 'AKTIF'
        }


        return 'NONAKTIF'

    }


    // =====================================================
    // FILTER + SORT TENANTS
    // =====================================================

    const filteredTenants =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase()


            const result =
                tenantList.filter(
                    (tenant) => {

                        const activeContract =
                            getActiveContract(
                                tenant.id
                            )


                        const room =
                            activeContract
                                ? getRoom(
                                    activeContract.room_id
                                )
                                : null


                        const tenantStatus =
                            getTenantStatus(
                                tenant
                            )


                        const name =
                            String(
                                tenant.name || ''
                            )
                                .toLowerCase()


                        const phone =
                            String(
                                tenant.phone || ''
                            )
                                .toLowerCase()


                        const identity =
                            String(
                                tenant.identity_number || ''
                            )
                                .toLowerCase()


                        const roomNumber =
                            String(
                                room?.room_number || ''
                            )
                                .toLowerCase()


                        const matchesSearch =
                            !keyword ||
                            name.includes(
                                keyword
                            ) ||
                            phone.includes(
                                keyword
                            ) ||
                            identity.includes(
                                keyword
                            ) ||
                            roomNumber.includes(
                                keyword
                            )


                        const matchesFilter =
                            filter === 'SEMUA' ||
                            tenantStatus === filter


                        return (
                            matchesSearch &&
                            matchesFilter
                        )

                    }
                )


            // =================================================
            // SORT NOMOR KAMAR
            //
            // Kamar 1 → 2 → 3 → dst.
            // Penghuni tanpa kamar paling bawah.
            // =================================================

            result.sort(
                (a, b) => {

                    const contractA =
                        getActiveContract(
                            a.id
                        )

                    const contractB =
                        getActiveContract(
                            b.id
                        )


                    const roomA =
                        contractA
                            ? getRoom(
                                contractA.room_id
                            )
                            : null


                    const roomB =
                        contractB
                            ? getRoom(
                                contractB.room_id
                            )
                            : null


                    const numberA =
                        Number.parseInt(
                            String(
                                roomA?.room_number ?? ''
                            ).replace(
                                /\D/g,
                                ''
                            ),
                            10
                        )


                    const numberB =
                        Number.parseInt(
                            String(
                                roomB?.room_number ?? ''
                            ).replace(
                                /\D/g,
                                ''
                            ),
                            10
                        )


                    const hasRoomA =
                        Number.isFinite(
                            numberA
                        )


                    const hasRoomB =
                        Number.isFinite(
                            numberB
                        )


                    if (
                        !hasRoomA &&
                        !hasRoomB
                    ) {

                        return String(
                            a.name || ''
                        ).localeCompare(
                            String(
                                b.name || ''
                            ),
                            'id',
                            {
                                sensitivity:
                                    'base',
                            }
                        )

                    }


                    if (!hasRoomA) {
                        return 1
                    }


                    if (!hasRoomB) {
                        return -1
                    }


                    if (
                        numberA !==
                        numberB
                    ) {
                        return (
                            numberA -
                            numberB
                        )
                    }


                    return String(
                        a.name || ''
                    ).localeCompare(
                        String(
                            b.name || ''
                        ),
                        'id',
                        {
                            sensitivity:
                                'base',
                        }
                    )

                }
            )


            return result

        }, [
            tenantList,
            roomList,
            contractList,
            search,
            filter,
        ])


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredTenants.length /
                itemsPerPage
            )
        )


    const paginatedTenants =
        filteredTenants.slice(
            (currentPage - 1) *
            itemsPerPage,

            currentPage *
            itemsPerPage
        )


    const paginationStart =
        filteredTenants.length === 0
            ? 0
            : (
                (currentPage - 1) *
                itemsPerPage
            ) + 1


    const paginationEnd =
        Math.min(
            currentPage *
            itemsPerPage,

            filteredTenants.length
        )


    function goToPage(page) {

        setCurrentPage(
            Math.min(
                Math.max(
                    page,
                    1
                ),
                totalPages
            )
        )

    }


    // =====================================================
    // RESET PAGE SAAT SEARCH / FILTER
    // =====================================================

    useEffect(() => {

        setCurrentPage(1)

    }, [
        search,
        filter,
    ])


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    function openAddModal() {

        setEditingTenant(null)

        setFormData({
            ...emptyForm,
        })

        setIsModalOpen(true)

    }


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    function openEditModal(
        tenant
    ) {

        setEditingTenant(
            tenant
        )

        setFormData({

            name:
                tenant.name || '',

            phone:
                tenant.phone || '',

            address:
                tenant.address || '',

            identityNumber:
                tenant.identity_number ||
                '',

        })


        setIsModalOpen(true)

    }


    // =====================================================
    // CLOSE FORM MODAL
    // =====================================================

    function closeModal() {

        setIsModalOpen(false)

        setEditingTenant(null)

        setFormData({
            ...emptyForm,
        })

    }

    const fetchKtp = async (tenantId) => {

        try {

            setIsKtpLoading(true);

            const response = await api.get(
                `/tenant-documents/${tenantId}/ktp`
            );

            if (response.data.success) {

                setKtpDocument(
                    response.data.data
                );

            }

        } catch (error) {

            if (
                error.response?.status === 404
            ) {

                setKtpDocument(null);

            } else {

                console.error(
                    "Gagal mengambil KTP:",
                    error
                );

                setKtpDocument(null);

            }

        } finally {

            setIsKtpLoading(false);

        }

    };


    // =====================================================
    // OPEN DETAIL
    // =====================================================

    async function openDetailModal(tenant) {

        setSelectedTenant(tenant)

        setIsDetailOpen(true)

        // Reset KTP sebelumnya
        setKtpDocument(null)

        setIsKtpLoading(true)

        try {

            const response =
                await getKtp(tenant.id)

            if (
                response?.success
            ) {

                setKtpDocument(
                    response.data
                )

            }

        } catch (error) {

            // 404 = penghuni belum punya KTP
            if (
                error?.response?.status === 404
            ) {

                setKtpDocument(null)

            } else {

                console.error(
                    "GET KTP ERROR:",
                    error
                )

            }

        } finally {

            setIsKtpLoading(false)

        }

    }


    // ============================================================
    // UPLOAD / GANTI KTP
    // ============================================================

    async function handleKtpUpload(event) {

        const file =
            event.target.files?.[0]

        // Tidak ada file
        if (!file) {
            return
        }

        // Pastikan tenant sedang dipilih
        if (!selectedTenant?.id) {

            alert(
                "Penghuni tidak ditemukan."
            )

            return
        }


        // ========================================================
        // VALIDASI FORMAT
        // ========================================================

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ]

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Format KTP harus JPG, PNG, atau WEBP."
            )

            event.target.value = ""

            return
        }


        // ========================================================
        // VALIDASI UKURAN
        // Maksimal 5 MB
        // ========================================================

        if (
            file.size > 5 * 1024 * 1024
        ) {

            alert(
                "Ukuran file KTP maksimal 5 MB."
            )

            event.target.value = ""

            return
        }


        try {

            setKtpUploading(true)


            // ====================================================
            // UPLOAD
            // ====================================================

            const response =
                await uploadKtp(
                    selectedTenant.id,
                    file
                )


            if (
                response?.success === false
            ) {

                throw new Error(
                    response?.message ||
                    "Gagal mengupload KTP."
                )

            }


            // ====================================================
            // AMBIL DATA KTP TERBARU
            // ====================================================

            await fetchKtp(
                selectedTenant.id
            )


            alert(
                response?.message ||
                "KTP berhasil diupload."
            )


        } catch (error) {

            console.error(
                "UPLOAD KTP ERROR:",
                error
            )


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Gagal mengupload KTP."
            )


        } finally {

            setKtpUploading(false)

            // Reset input supaya file yang sama
            // bisa dipilih kembali
            event.target.value = ""

        }

    }


    // ============================================================
    // HAPUS KTP
    // ============================================================

    async function handleDeleteKtp() {

        if (!selectedTenant?.id) {

            alert(
                "Penghuni tidak ditemukan."
            )

            return
        }


        const confirmed =
            window.confirm(
                "Yakin ingin menghapus KTP penghuni ini?"
            )


        if (!confirmed) {
            return
        }


        try {

            setIsKtpLoading(true)


            const response =
                await deleteKtp(
                    selectedTenant.id
                )


            if (
                response?.success === false
            ) {

                throw new Error(
                    response?.message ||
                    "Gagal menghapus KTP."
                )

            }


            setKtpDocument(null)


            alert(
                response?.message ||
                "KTP berhasil dihapus."
            )


        } catch (error) {

            console.error(
                "DELETE KTP ERROR:",
                error
            )


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Gagal menghapus KTP."
            )


        } finally {

            setIsKtpLoading(false)

        }

    }

    // =====================================================
    // CLOSE DETAIL
    // =====================================================

    function closeDetailModal() {

        setSelectedTenant(null)

        setIsDetailOpen(false)

    }


    // =====================================================
    // OPEN MOVE OUT
    // =====================================================

    function openMoveOutModal(
        tenant
    ) {

        setSelectedTenant(
            tenant
        )

        setMoveOutForm({
            ...emptyMoveOutForm,
        })

        setIsMoveOutOpen(true)

    }


    // =====================================================
    // CLOSE MOVE OUT
    // =====================================================

    function closeMoveOutModal() {

        setSelectedTenant(null)

        setMoveOutForm({
            ...emptyMoveOutForm,
        })

        setIsMoveOutOpen(false)

    }


    // =====================================================
    // HANDLE FORM
    // =====================================================

    function handleChange(
        event
    ) {

        const {
            name,
            value,
        } = event.target


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        )

    }


    // =====================================================
    // HANDLE MOVE OUT
    // =====================================================

    function handleMoveOutChange(
        event
    ) {

        const {
            name,
            value,
        } = event.target


        setMoveOutForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        )

    }


    // =====================================================
    // SUBMIT TENANT
    // =====================================================

    async function handleSubmit(
        event
    ) {

        event.preventDefault()


        // -------------------------------------------------
        // VALIDASI
        // -------------------------------------------------

        if (
            !formData.name.trim()
        ) {

            alert(
                'Nama penghuni wajib diisi.'
            )

            return

        }


        if (
            !formData.phone.trim()
        ) {

            alert(
                'Nomor HP wajib diisi.'
            )

            return

        }


        try {

            setSaving(true)


            // -------------------------------------------------
            // PAYLOAD
            // -------------------------------------------------

            const payload = {

                name:
                    formData.name.trim(),

                phone:
                    formData.phone.trim(),

                address:
                    formData.address.trim() ||
                    null,

                identity_number:
                    formData.identityNumber.trim() ||
                    null,

            }


            // =================================================
            // CREATE
            // =================================================

            if (!editingTenant) {

                const response =
                    await createTenant(
                        payload
                    )


                console.log(
                    'CREATE TENANT RESPONSE:',
                    response
                )


                if (
                    response?.success === false
                ) {

                    throw new Error(
                        response?.message ||
                        'Gagal menambahkan penghuni.'
                    )

                }


                // ---------------------------------------------
                // AMBIL DATA TENANT BARU JIKA DIKIRIM BACKEND
                // ---------------------------------------------

                const createdTenant =
                    extractCreatedTenant(
                        response
                    )


                alert(
                    'Penghuni berhasil ditambahkan.'
                )


                closeModal()


                // ---------------------------------------------
                // LOAD ULANG SEMUA DATA
                // ---------------------------------------------

                const refreshed =
                    await loadData()


                // ---------------------------------------------
                // FALLBACK
                //
                // Kalau endpoint GET belum mengembalikan
                // tenant baru, tambahkan langsung ke state.
                // ---------------------------------------------

                if (
                    createdTenant?.id
                ) {

                    const exists =
                        refreshed.tenants.some(
                            (tenant) =>
                                Number(
                                    tenant.id
                                ) ===
                                Number(
                                    createdTenant.id
                                )
                        )


                    if (!exists) {

                        setTenantList(
                            (previous) => {

                                const alreadyExists =
                                    previous.some(
                                        (tenant) =>
                                            Number(
                                                tenant.id
                                            ) ===
                                            Number(
                                                createdTenant.id
                                            )
                                    )


                                if (
                                    alreadyExists
                                ) {
                                    return previous
                                }


                                return [
                                    ...previous,
                                    createdTenant,
                                ]

                            }
                        )

                    }

                }


                // ---------------------------------------------
                // SET KE HALAMAN 1
                // ---------------------------------------------

                setCurrentPage(1)

                return

            }


            // =================================================
            // UPDATE
            // =================================================

            const response =
                await updateTenant(
                    editingTenant.id,
                    payload
                )


            if (
                response?.success === false
            ) {

                throw new Error(
                    response?.message ||
                    'Gagal memperbarui penghuni.'
                )

            }


            alert(
                'Data penghuni berhasil diperbarui.'
            )


            closeModal()


            await loadData()


            setCurrentPage(1)


        } catch (error) {

            console.error(
                'SAVE TENANT ERROR:',
                error
            )


            alert(
                error.message ||
                'Gagal menyimpan data penghuni.'
            )

        } finally {

            setSaving(false)

        }

    }


    // =====================================================
    // DELETE TENANT
    // =====================================================

    async function handleDeleteTenant(
        tenant
    ) {

        const confirmed =
            window.confirm(
                `Apakah Anda yakin ingin menghapus penghuni ${tenant.name}?`
            )


        if (!confirmed) {
            return
        }


        try {

            setSaving(true)


            const response =
                await deleteTenant(
                    tenant.id
                )


            if (
                response?.success === false
            ) {

                throw new Error(
                    response?.message ||
                    'Gagal menghapus penghuni.'
                )

            }


            alert(
                'Penghuni berhasil dihapus.'
            )


            await loadData()


            setCurrentPage(
                1
            )


        } catch (error) {

            console.error(
                'DELETE TENANT ERROR:',
                error
            )


            alert(
                error.message ||
                'Gagal menghapus penghuni.'
            )

        } finally {

            setSaving(false)

        }

    }


    // =====================================================
    // MOVE OUT
    // =====================================================

    async function handleMoveOutSubmit(
        event
    ) {

        event.preventDefault()


        if (!selectedTenant) {
            return
        }


        if (
            !moveOutForm.moveOutDate
        ) {

            alert(
                'Tanggal keluar wajib diisi.'
            )

            return

        }


        if (
            !moveOutForm.moveOutReason
        ) {

            alert(
                'Alasan keluar wajib diisi.'
            )

            return

        }


        if (
            !moveOutForm.roomCondition
        ) {

            alert(
                'Kondisi kamar wajib diisi.'
            )

            return

        }


        const activeContract =
            getActiveContract(
                selectedTenant.id
            )


        if (!activeContract) {

            alert(
                'Penghuni ini tidak memiliki kontrak aktif.'
            )

            return

        }


        const confirmed =
            window.confirm(
                `Proses ${selectedTenant.name} sebagai penghuni keluar?`
            )


        if (!confirmed) {
            return
        }


        // =================================================
        // UNTUK SEKARANG MASIH SESUAI IMPLEMENTASI LAMA
        // =================================================

        alert(
            'Fitur penghuni keluar akan kita hubungkan ke modul Kontrak pada tahap berikutnya.'
        )

    }


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalTenants =
        tenantList.length


    const activeTenants =
        tenantList.filter(
            (tenant) =>
                getTenantStatus(
                    tenant
                ) === 'AKTIF'
        ).length


    const inactiveTenants =
        tenantList.filter(
            (tenant) =>
                getTenantStatus(
                    tenant
                ) === 'NONAKTIF'
        ).length


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                        Memuat data penghuni...
                    </p>

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

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">

                        <Users
                            size={21}
                        />

                    </div>


                    <div>

                        <h1 className="text-xl font-bold text-slate-800">
                            Penghuni
                        </h1>

                        <p className="text-sm text-slate-500">
                            Kelola data penghuni ADELINA KOST
                        </p>

                    </div>

                </div>


                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={loadData}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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


                    {/* TAMBAH */}

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >

                        <Plus
                            size={18}
                        />

                        Tambah Penghuni

                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

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

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <SummaryCard
                    title="Total Penghuni"
                    value={totalTenants}
                    icon={
                        <Users
                            size={21}
                        />
                    }
                />


                <SummaryCard
                    title="Penghuni Aktif"
                    value={activeTenants}
                    valueClass="text-green-600"
                    icon={
                        <UserRound
                            size={21}
                        />
                    }
                    iconClass="bg-green-50 text-green-600"
                />


                <SummaryCard
                    title="Penghuni Nonaktif"
                    value={inactiveTenants}
                    valueClass="text-slate-500"
                    icon={
                        <DoorOpen
                            size={21}
                        />
                    }
                    iconClass="bg-slate-100 text-slate-500"
                />

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 md:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={18}
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
                            placeholder="Cari nama, nomor HP, identitas, atau kamar..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    <select
                        value={filter}
                        onChange={(event) =>
                            setFilter(
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >

                        <option value="SEMUA">
                            Semua Status
                        </option>

                        <option value="AKTIF">
                            Aktif
                        </option>

                        <option value="NONAKTIF">
                            Nonaktif
                        </option>

                    </select>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">


                {/* TABLE HEADER */}

                <div className="border-b border-slate-200 px-5 py-4">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="font-semibold text-slate-800">
                                Daftar Penghuni
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Informasi penghuni, kamar, dan kontrak aktif
                            </p>

                        </div>


                        {!loading && (

                            <div className="text-sm text-slate-500">

                                Menampilkan{' '}

                                <span className="font-semibold text-slate-700">
                                    {paginationStart}-{paginationEnd}
                                </span>{' '}

                                dari{' '}

                                <span className="font-semibold text-slate-700">
                                    {filteredTenants.length}
                                </span>{' '}

                                data

                            </div>

                        )}

                    </div>

                </div>


                {/* EMPTY */}

                {filteredTenants.length === 0 ? (

                    <div className="px-5 py-14 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">

                            <UserRound
                                size={28}
                            />

                        </div>


                        <h3 className="mt-4 font-semibold text-slate-700">
                            Penghuni tidak ditemukan
                        </h3>


                        <p className="mt-1 text-sm text-slate-500">
                            Coba ubah kata pencarian atau filter status.
                        </p>

                    </div>

                ) : (

                    <>


                        {/* TABLE */}

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

                                    {paginatedTenants.map(
                                        (tenant) => {

                                            const activeContract =
                                                getActiveContract(
                                                    tenant.id
                                                )


                                            const room =
                                                activeContract
                                                    ? getRoom(
                                                        activeContract.room_id
                                                    )
                                                    : null


                                            const tenantStatus =
                                                getTenantStatus(
                                                    tenant
                                                )


                                            return (

                                                <tr
                                                    key={
                                                        tenant.id
                                                    }
                                                    className="transition hover:bg-slate-50"
                                                >


                                                    {/* PENGHUNI */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex min-w-[240px] items-start gap-3">

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">

                                                                <UserRound
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


                                                    {/* KAMAR */}

                                                    <td className="px-5 py-4">

                                                        <div className="inline-flex items-center gap-2 text-slate-700">

                                                            <DoorOpen
                                                                size={16}
                                                                className="text-slate-400"
                                                            />

                                                            <span className="whitespace-nowrap font-medium">

                                                                {room
                                                                    ? `Kamar ${room.room_number}`
                                                                    : 'Belum ada kamar'}

                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* PERIODE */}

                                                    <td className="px-5 py-4">

                                                        {activeContract ? (

                                                            <div className="flex items-center gap-2 text-slate-600">

                                                                <CalendarDays
                                                                    size={16}
                                                                    className="shrink-0 text-slate-400"
                                                                />

                                                                <div className="whitespace-nowrap">

                                                                    <p>
                                                                        {
                                                                            formatDate(
                                                                                activeContract.start_date
                                                                            )
                                                                        }
                                                                    </p>

                                                                    <p className="text-xs text-slate-400">

                                                                        s/d{' '}

                                                                        {
                                                                            formatDate(
                                                                                activeContract.end_date
                                                                            )
                                                                        }

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        ) : (

                                                            <span className="text-slate-400">
                                                                -
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* HARGA */}

                                                    <td className="px-5 py-4">

                                                        <span className="whitespace-nowrap font-semibold text-slate-700">

                                                            {activeContract
                                                                ? formatRupiah(
                                                                    activeContract.monthly_price
                                                                )
                                                                : '-'}

                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tenantStatus ===
                                                                'AKTIF'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                        >

                                                            {tenantStatus ===
                                                                'AKTIF'
                                                                ? 'Aktif'
                                                                : 'Nonaktif'}

                                                        </span>

                                                    </td>


                                                    {/* AKSI */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex justify-end gap-2">


                                                            {/* DETAIL */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openDetailModal(
                                                                        tenant
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                                                title="Lihat detail"
                                                            >

                                                                <Eye
                                                                    size={15}
                                                                />

                                                                Detail

                                                            </button>


                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        tenant
                                                                    )
                                                                }
                                                                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                                                                title="Edit"
                                                            >

                                                                <Pencil
                                                                    size={16}
                                                                />

                                                            </button>


                                                            {/* KELUAR */}

                                                            {tenantStatus ===
                                                                'AKTIF' && (

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openMoveOutModal(
                                                                                tenant
                                                                            )
                                                                        }
                                                                        className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                                                                        title="Proses penghuni keluar"
                                                                    >

                                                                        <LogOut
                                                                            size={16}
                                                                        />

                                                                    </button>

                                                                )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            )

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm text-slate-500">

                                Halaman{' '}

                                <span className="font-semibold text-slate-700">
                                    {currentPage}
                                </span>{' '}

                                dari{' '}

                                <span className="font-semibold text-slate-700">
                                    {totalPages}
                                </span>

                            </p>


                            <div className="flex items-center gap-1">


                                {/* PREVIOUS */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            currentPage - 1
                                        )
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft
                                        size={17}
                                    />

                                </button>


                                {/* PAGE NUMBERS */}

                                {Array.from(
                                    {
                                        length:
                                            totalPages,
                                    },
                                    (
                                        _,
                                        index
                                    ) =>
                                        index + 1
                                )
                                    .filter(
                                        (page) =>
                                            page === 1 ||
                                            page ===
                                            totalPages ||
                                            Math.abs(
                                                page -
                                                currentPage
                                            ) <= 1
                                    )
                                    .map(
                                        (
                                            page,
                                            index,
                                            pages
                                        ) => {

                                            const previousPage =
                                                pages[
                                                index -
                                                1
                                                ]


                                            const showDots =
                                                previousPage &&
                                                page -
                                                previousPage >
                                                1


                                            return (

                                                <div
                                                    key={
                                                        page
                                                    }
                                                    className="flex items-center gap-1"
                                                >

                                                    {showDots && (

                                                        <span className="px-1 text-slate-400">
                                                            ...
                                                        </span>

                                                    )}


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            goToPage(
                                                                page
                                                            )
                                                        }
                                                        className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${currentPage ===
                                                            page
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >

                                                        {
                                                            page
                                                        }

                                                    </button>

                                                </div>

                                            )

                                        }
                                    )}


                                {/* NEXT */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            currentPage + 1
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {isModalOpen && (

                <ModalOverlay>

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

                        <ModalHeader
                            title={
                                editingTenant
                                    ? 'Edit Penghuni'
                                    : 'Tambah Penghuni'
                            }
                            subtitle="Lengkapi informasi penghuni ADELINA KOST"
                            onClose={
                                closeModal
                            }
                        />


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-5 p-5"
                        >


                            <FormInput
                                label="Nama Lengkap"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Contoh: Andi Saputra"
                            />


                            <FormInput
                                label="Nomor HP"
                                name="phone"
                                type="tel"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="08xxxxxxxxxx"
                            />


                            <FormInput
                                label="Nomor Identitas"
                                name="identityNumber"
                                value={
                                    formData.identityNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Nomor KTP / identitas"
                            />


                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Alamat
                                </label>


                                <textarea
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="3"
                                    placeholder="Alamat lengkap penghuni..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                                <div className="flex items-start gap-3">

                                    <DoorOpen
                                        size={20}
                                        className="mt-0.5 text-blue-600"
                                    />


                                    <div>

                                        <p className="font-medium text-blue-800">
                                            Penempatan kamar dilakukan melalui Kontrak
                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-blue-600">

                                            Setelah penghuni dibuat,
                                            buka menu{' '}

                                            <strong>
                                                Kontrak
                                            </strong>{' '}

                                            untuk memilih kamar,
                                            menentukan harga,
                                            dan periode sewa.

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <ModalFooter
                                onCancel={
                                    closeModal
                                }
                                submitText={
                                    saving
                                        ? 'Menyimpan...'
                                        : editingTenant
                                            ? 'Simpan Perubahan'
                                            : 'Tambah Penghuni'
                                }
                                disabled={
                                    saving
                                }
                            />

                        </form>

                    </div>

                </ModalOverlay>

            )}


            {/* =================================================
                DETAIL MODAL
            ================================================= */}

            {isDetailOpen &&
                selectedTenant && (

                    <ModalOverlay>

                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            <ModalHeader
                                title="Detail Penghuni"
                                subtitle="Informasi lengkap penghuni ADELINA KOST"
                                onClose={
                                    closeDetailModal
                                }
                            />


                            <div className="space-y-5 p-5">

                                {(() => {

                                    const detailContract =
                                        getActiveContract(
                                            selectedTenant.id
                                        )


                                    const detailRoom =
                                        detailContract
                                            ? getRoom(
                                                detailContract.room_id
                                            )
                                            : null


                                    const detailStatus =
                                        getTenantStatus(
                                            selectedTenant
                                        )


                                    return (

                                        <>


                                            {/* PROFILE */}

                                            <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">

                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

                                                    <UserRound
                                                        size={27}
                                                    />

                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    <h3 className="text-lg font-bold text-slate-800">

                                                        {
                                                            selectedTenant.name
                                                        }

                                                    </h3>


                                                    <p className="mt-1 text-sm text-slate-500">

                                                        {detailRoom
                                                            ? `Kamar ${detailRoom.room_number}`
                                                            : 'Belum memiliki kamar'}

                                                    </p>

                                                </div>


                                                <span
                                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${detailStatus ===
                                                        'AKTIF'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-200 text-slate-600'
                                                        }`}
                                                >

                                                    {detailStatus ===
                                                        'AKTIF'
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}

                                                </span>

                                            </div>


                                            {/* PERSONAL */}

                                            <div className="grid gap-4 sm:grid-cols-2">

                                                <DetailItem
                                                    icon={
                                                        <Phone
                                                            size={17}
                                                        />
                                                    }
                                                    label="Nomor HP"
                                                    value={
                                                        selectedTenant.phone ||
                                                        '-'
                                                    }
                                                />


                                                <DetailItem
                                                    icon={
                                                        <CreditCard
                                                            size={17}
                                                        />
                                                    }
                                                    label="Nomor Identitas"
                                                    value={
                                                        selectedTenant.identity_number ||
                                                        '-'
                                                    }
                                                />


                                                <DetailItem
                                                    icon={
                                                        <DoorOpen
                                                            size={17}
                                                        />
                                                    }
                                                    label="Kamar"
                                                    value={
                                                        detailRoom
                                                            ? `Kamar ${detailRoom.room_number}`
                                                            : 'Belum memiliki kamar'
                                                    }
                                                />


                                                <DetailItem
                                                    icon={
                                                        <CalendarDays
                                                            size={17}
                                                        />
                                                    }
                                                    label="Tanggal Mulai"
                                                    value={
                                                        detailContract
                                                            ? formatDate(
                                                                detailContract.start_date
                                                            )
                                                            : '-'
                                                    }
                                                />


                                                <DetailItem
                                                    icon={
                                                        <CalendarDays
                                                            size={17}
                                                        />
                                                    }
                                                    label="Tanggal Selesai"
                                                    value={
                                                        detailContract
                                                            ? formatDate(
                                                                detailContract.end_date
                                                            )
                                                            : '-'
                                                    }
                                                />


                                                <DetailItem
                                                    icon={
                                                        <MapPin
                                                            size={17}
                                                        />
                                                    }
                                                    label="Alamat"
                                                    value={
                                                        selectedTenant.address ||
                                                        '-'
                                                    }
                                                />

                                            </div>

                                            {/* KTP */}

                                            <div className="rounded-2xl border border-slate-200 bg-white p-4">

                                                <div className="flex items-center justify-between">

                                                    <div>

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            Dokumen KTP
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Kartu Tanda Penduduk penghuni
                                                        </p>

                                                    </div>

                                                    <CreditCard
                                                        size={20}
                                                        className="text-blue-500"
                                                    />

                                                </div>


                                                {/* ================================
        INPUT FILE KTP
    ================================= */}

                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    id="ktp-upload"
                                                    className="hidden"
                                                    onChange={handleKtpUpload}
                                                />


                                                {isKtpLoading ? (

                                                    <div className="mt-4 text-sm text-slate-500">
                                                        Memuat dokumen KTP...
                                                    </div>

                                                ) : ktpDocument ? (

                                                    <div className="mt-4">

                                                        <button
                                                            type="button"
                                                            onClick={() => setIsKtpPreviewOpen(true)}
                                                            className="mt-4 block w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                                                        >
                                                            <img
                                                                src={`http://localhost:5000/${String(
                                                                    ktpDocument.file_path
                                                                ).replace(/^\/+/, '')}`}
                                                                alt="KTP Penghuni"
                                                                className="max-h-72 w-full object-contain transition hover:scale-[1.02]"
                                                            />
                                                        </button>


                                                        <div className="mt-3 flex gap-2">

                                                            <label
                                                                htmlFor="ktp-upload"
                                                                className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                                            >
                                                                Ganti KTP
                                                            </label>


                                                            <button
                                                                type="button"
                                                                onClick={handleDeleteKtp}
                                                                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                            >
                                                                Hapus KTP
                                                            </button>

                                                        </div>


                                                        <p className="mt-2 text-xs text-slate-400">

                                                        </p>

                                                    </div>

                                                ) : (

                                                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center">

                                                        <p className="text-sm text-slate-500">
                                                            KTP belum diupload
                                                        </p>


                                                        <label
                                                            htmlFor="ktp-upload"
                                                            className="mt-3 inline-block cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                                        >
                                                            Upload KTP
                                                        </label>

                                                    </div>

                                                )}

                                            </div>


                                            {/* CONTRACT */}

                                            {detailContract && (

                                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

                                                    <p className="text-sm font-medium text-blue-600">
                                                        Kontrak Aktif
                                                    </p>


                                                    <p className="mt-1 text-2xl font-bold text-blue-700">

                                                        {
                                                            formatRupiah(
                                                                detailContract.monthly_price
                                                            )
                                                        }

                                                    </p>


                                                    <p className="mt-1 text-xs text-blue-500">
                                                        Harga sewa per bulan
                                                    </p>


                                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                                                        <InfoBox
                                                            label="Mulai"
                                                            value={
                                                                formatDate(
                                                                    detailContract.start_date
                                                                )
                                                            }
                                                        />


                                                        <InfoBox
                                                            label="Selesai"
                                                            value={
                                                                formatDate(
                                                                    detailContract.end_date
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                </div>

                                            )}


                                            {/* CLOSE */}

                                            <div className="flex justify-end border-t border-slate-100 pt-4">

                                                <button
                                                    type="button"
                                                    onClick={
                                                        closeDetailModal
                                                    }
                                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Tutup
                                                </button>

                                            </div>

                                        </>

                                    )

                                })()}

                            </div>

                        </div>

                    </ModalOverlay>

                )}
            {isKtpPreviewOpen && ktpDocument && (

                <ModalOverlay>

                    <div
                        className="
                relative
                flex
                h-[92vh]
                w-[95vw]
                max-w-6xl
                flex-col
                overflow-hidden
                rounded-2xl
                bg-slate-950
                shadow-2xl
            "
                    >

                        {/* ================================================= */}
                        {/* HEADER */}
                        {/* ================================================= */}

                        <div
                            className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-white/10
                    bg-slate-900/95
                    px-5
                    py-4
                    backdrop-blur
                "
                        >

                            <div className="min-w-0">

                                <p
                                    className="
                            text-sm
                            font-semibold
                            text-white
                        "
                                >
                                    Dokumen KTP
                                </p>

                                <p
                                    className="
                            mt-0.5
                            truncate
                            text-xs
                            text-slate-400
                        "
                                >
                                    {selectedTenant?.name ||
                                        "Dokumen identitas penghuni"}
                                </p>

                            </div>


                            {/* CLOSE */}

                            <button
                                type="button"
                                onClick={() =>
                                    setIsKtpPreviewOpen(false)
                                }
                                aria-label="Tutup preview KTP"
                                className="
                        ml-4
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-400
                        transition
                        hover:bg-white/10
                        hover:text-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-white/20
                    "
                            >

                                <X size={22} />

                            </button>

                        </div>


                        {/* ================================================= */}
                        {/* PREVIEW AREA */}
                        {/* ================================================= */}

                        <div
                            className="
                    relative
                    flex
                    min-h-0
                    flex-1
                    items-center
                    justify-center
                    overflow-auto
                    bg-slate-950
                    p-5
                    sm:p-8
                "
                            onClick={() =>
                                setIsKtpPreviewOpen(false)
                            }
                        >

                            {/* Background decoration */}

                            <div
                                className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-30
                    "
                            >

                                <div
                                    className="
                            absolute
                            left-1/2
                            top-1/2
                            h-96
                            w-96
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-blue-500/10
                            blur-3xl
                        "
                                />

                            </div>


                            {/* DOCUMENT */}

                            <div
                                className="
                        relative
                        flex
                        max-h-full
                        max-w-full
                        items-center
                        justify-center
                    "
                            >

                                <img
                                    src={`http://localhost:5000/${String(
                                        ktpDocument.file_path
                                    ).replace(/^\/+/, '')}`}
                                    alt="Preview KTP Penghuni"
                                    className="
                            max-h-[72vh]
                            max-w-full
                            rounded-xl
                            object-contain
                            shadow-2xl
                            ring-1
                            ring-white/10
                            transition-transform
                            duration-200
                            hover:scale-[1.01]
                        "
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
                                />

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* FOOTER */}
                        {/* ================================================= */}

                        <div
                            className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    gap-4
                    border-t
                    border-white/10
                    bg-slate-900/95
                    px-5
                    py-3
                    backdrop-blur
                "
                        >

                            <div
                                className="
                        hidden
                        items-center
                        gap-2
                        text-xs
                        text-slate-400
                        sm:flex
                    "
                            >

                                <span
                                    className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/5
                        "
                                >
                                    <CreditCard size={13} />
                                </span>

                                <span>
                                    Dokumen identitas penghuni
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setIsKtpPreviewOpen(false)
                                }
                                className="
                        ml-auto
                        rounded-xl
                        bg-white
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-800
                        shadow-sm
                        transition
                        hover:bg-slate-100
                        focus:outline-none
                        focus:ring-2
                        focus:ring-white/30
                    "
                            >
                                Tutup
                            </button>

                        </div>

                    </div>

                </ModalOverlay>

            )}


            {/* =================================================
                MOVE OUT MODAL
            ================================================= */}

            {isMoveOutOpen &&
                selectedTenant && (

                    <ModalOverlay>

                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            <ModalHeader
                                title="Proses Penghuni Keluar"
                                subtitle={`Memproses ${selectedTenant.name}`}
                                onClose={
                                    closeMoveOutModal
                                }
                            />


                            <form
                                onSubmit={
                                    handleMoveOutSubmit
                                }
                                className="space-y-5 p-5"
                            >

                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                                    <p className="text-sm font-semibold text-amber-800">
                                        Perhatian
                                    </p>


                                    <p className="mt-1 text-sm leading-6 text-amber-700">

                                        Data penghuni tidak akan dihapus.
                                        Histori kontrak tetap disimpan.

                                    </p>

                                </div>


                                <FormInput
                                    label="Tanggal Keluar"
                                    name="moveOutDate"
                                    type="date"
                                    value={
                                        moveOutForm.moveOutDate
                                    }
                                    onChange={
                                        handleMoveOutChange
                                    }
                                />


                                <SelectInput
                                    label="Alasan Keluar"
                                    name="moveOutReason"
                                    value={
                                        moveOutForm.moveOutReason
                                    }
                                    onChange={
                                        handleMoveOutChange
                                    }
                                >

                                    <option value="">
                                        Pilih alasan
                                    </option>

                                    <option value="Kontrak selesai">
                                        Kontrak selesai
                                    </option>

                                    <option value="Pindah kerja">
                                        Pindah kerja
                                    </option>

                                    <option value="Pindah tempat tinggal">
                                        Pindah tempat tinggal
                                    </option>

                                    <option value="Tidak melanjutkan sewa">
                                        Tidak melanjutkan sewa
                                    </option>

                                    <option value="Lainnya">
                                        Lainnya
                                    </option>

                                </SelectInput>


                                <SelectInput
                                    label="Kondisi Kamar"
                                    name="roomCondition"
                                    value={
                                        moveOutForm.roomCondition
                                    }
                                    onChange={
                                        handleMoveOutChange
                                    }
                                >

                                    <option value="">
                                        Pilih kondisi kamar
                                    </option>

                                    <option value="Baik">
                                        Baik
                                    </option>

                                    <option value="Ada kerusakan ringan">
                                        Ada kerusakan ringan
                                    </option>

                                    <option value="Ada kerusakan berat">
                                        Ada kerusakan berat
                                    </option>

                                </SelectInput>


                                <SelectInput
                                    label="Status Deposit"
                                    name="depositStatus"
                                    value={
                                        moveOutForm.depositStatus
                                    }
                                    onChange={
                                        handleMoveOutChange
                                    }
                                >

                                    <option value="">
                                        Pilih status deposit
                                    </option>

                                    <option value="Tidak ada deposit">
                                        Tidak ada deposit
                                    </option>

                                    <option value="Dikembalikan penuh">
                                        Dikembalikan penuh
                                    </option>

                                    <option value="Dikembalikan sebagian">
                                        Dikembalikan sebagian
                                    </option>

                                    <option value="Tidak dikembalikan">
                                        Tidak dikembalikan
                                    </option>

                                </SelectInput>


                                <div className="grid gap-4 md:grid-cols-2">

                                    <FormInput
                                        label="Deposit Dikembalikan"
                                        name="depositReturned"
                                        type="number"
                                        min="0"
                                        value={
                                            moveOutForm.depositReturned
                                        }
                                        onChange={
                                            handleMoveOutChange
                                        }
                                    />


                                    <FormInput
                                        label="Potongan Deposit"
                                        name="depositDeduction"
                                        type="number"
                                        min="0"
                                        value={
                                            moveOutForm.depositDeduction
                                        }
                                        onChange={
                                            handleMoveOutChange
                                        }
                                    />

                                </div>


                                <TextAreaInput
                                    label="Alasan Potongan Deposit"
                                    name="depositDeductionReason"
                                    value={
                                        moveOutForm.depositDeductionReason
                                    }
                                    onChange={
                                        handleMoveOutChange
                                    }
                                    placeholder="Contoh: Perbaikan pintu kamar..."
                                />


                                <TextAreaInput
                                    label="Catatan Penghuni Keluar"
                                    name="moveOutNotes"
                                    value={
                                        moveOutForm.moveOutNotes
                                    }
                                    onChange={
                                        handleMoveOutChange
                                    }
                                    placeholder="Catatan tambahan..."
                                />


                                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">

                                    <button
                                        type="button"
                                        onClick={
                                            closeMoveOutModal
                                        }
                                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>


                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                    >

                                        <LogOut
                                            size={17}
                                        />

                                        Proses Penghuni Keluar

                                    </button>

                                </div>

                            </form>

                        </div>

                    </ModalOverlay>

                )}

        </div>

    )

}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
    title,
    value,
    valueClass = 'text-slate-800',
    icon = <Users size={21} />,
    iconClass = 'bg-slate-100 text-slate-600',
}) {

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between gap-4">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>


                    <p
                        className={`mt-1 text-2xl font-bold ${valueClass}`}
                    >
                        {value}
                    </p>

                </div>


                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    {icon}
                </div>

            </div>

        </div>

    )

}


// =========================================================
// INFO BOX
// =========================================================

function InfoBox({
    label,
    value,
}) {

    return (

        <div className="rounded-xl bg-white/70 p-3">

            <p className="text-xs text-slate-400">
                {label}
            </p>


            <p className="mt-1 text-sm font-medium text-slate-700">
                {value}
            </p>

        </div>

    )

}


// =========================================================
// DETAIL ITEM
// =========================================================

function DetailItem({
    icon,
    label,
    value,
}) {

    return (

        <div className="flex gap-3">

            <div className="mt-0.5 text-slate-400">
                {icon}
            </div>


            <div className="min-w-0">

                <p className="text-xs text-slate-400">
                    {label}
                </p>


                <p className="mt-1 break-words text-sm font-medium text-slate-700">
                    {value}
                </p>

            </div>

        </div>

    )

}


// =========================================================
// FORM INPUT
// =========================================================

function FormInput({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    min,
    max,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>


            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
                max={max}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

        </div>

    )

}


// =========================================================
// SELECT INPUT
// =========================================================

function SelectInput({
    label,
    name,
    value,
    onChange,
    children,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>


            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

                {children}

            </select>

        </div>

    )

}


// =========================================================
// TEXTAREA
// =========================================================

function TextAreaInput({
    label,
    name,
    value,
    onChange,
    placeholder,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>


            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows="3"
                placeholder={placeholder}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

        </div>

    )

}


// =========================================================
// MODAL OVERLAY
// =========================================================

function ModalOverlay({
    children,
}) {

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">

            {children}

        </div>

    )

}


// =========================================================
// MODAL HEADER
// =========================================================

function ModalHeader({
    title,
    subtitle,
    onClose,
}) {

    return (

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">

            <div>

                <h2 className="text-lg font-semibold text-slate-800">
                    {title}
                </h2>


                <p className="mt-1 text-xs text-slate-500">
                    {subtitle}
                </p>

            </div>


            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >

                <X
                    size={20}
                />

            </button>

        </div>

    )

}


// =========================================================
// MODAL FOOTER
// =========================================================

function ModalFooter({
    onCancel,
    submitText,
    disabled = false,
}) {

    return (

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">

            <button
                type="button"
                onClick={onCancel}
                disabled={disabled}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Batal
            </button>


            <button
                type="submit"
                disabled={disabled}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

                {submitText}

            </button>

        </div>

    )

}


export default Tenants