import { useEffect, useMemo, useState } from 'react'

import {
    BedDouble,
    Search,
    Plus,
    Pencil,
    Power,
    X,
    Building2,
    Layers3,
    Users,
    CheckCircle2,
    Ban,
    MapPin,
    Wallet,
    FileText,
} from 'lucide-react'

import RoomCard from '../components/RoomCard'

import { buildings } from '../data/buildingData'
import { floors } from '../data/floorData'

import {
    getRooms,
    createRoom,
    updateRoom,
} from '../services/roomService'


// =====================================================
// ROOMS PAGE
// =====================================================

function Rooms() {

    // =====================================================
    // STATE
    // =====================================================

    const [roomList, setRoomList] = useState([])

    const [search, setSearch] = useState('')

    const [filter, setFilter] = useState('SEMUA')

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editingRoom, setEditingRoom] = useState(null)

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)


    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] = useState({
        roomNumber: '',
        buildingId: '',
        floorId: '',
        rentPrice: '700000',
        status: 'TERSEDIA',
        notes: '',
    })


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadRooms()

    }, [])


    // =====================================================
    // NORMALIZE TENANT
    // =====================================================

    function getTenantName(room) {

        if (!room) {
            return null
        }


        if (
            typeof room.tenant_name === 'string' &&
            room.tenant_name.trim()
        ) {
            return room.tenant_name.trim()
        }


        if (
            typeof room.tenantName === 'string' &&
            room.tenantName.trim()
        ) {
            return room.tenantName.trim()
        }


        if (
            typeof room.occupant_name === 'string' &&
            room.occupant_name.trim()
        ) {
            return room.occupant_name.trim()
        }


        if (
            typeof room.occupantName === 'string' &&
            room.occupantName.trim()
        ) {
            return room.occupantName.trim()
        }


        if (
            typeof room.tenant === 'string' &&
            room.tenant.trim()
        ) {
            return room.tenant.trim()
        }


        if (
            room.tenant &&
            typeof room.tenant === 'object'
        ) {

            return (
                room.tenant.name ||
                room.tenant.full_name ||
                room.tenant.fullName ||
                room.tenant.tenant_name ||
                room.tenant.tenantName ||
                null
            )

        }


        if (
            room.tenant_data &&
            typeof room.tenant_data === 'object'
        ) {

            return (
                room.tenant_data.name ||
                room.tenant_data.full_name ||
                room.tenant_data.fullName ||
                null
            )

        }


        if (
            room.current_tenant &&
            typeof room.current_tenant === 'object'
        ) {

            return (
                room.current_tenant.name ||
                room.current_tenant.full_name ||
                room.current_tenant.fullName ||
                null
            )

        }


        if (
            Array.isArray(room.tenants) &&
            room.tenants.length > 0
        ) {

            const tenant =
                room.tenants[0]

            if (tenant) {

                return (
                    tenant.name ||
                    tenant.full_name ||
                    tenant.fullName ||
                    null
                )

            }

        }


        return null

    }


    // =====================================================
    // BACKEND STATUS → FRONTEND
    // =====================================================

    function convertStatusFromBackend(status) {

        switch (status) {

            case 'available':
                return 'TERSEDIA'

            case 'occupied':
                return 'TERISI'

            case 'inactive':
                return 'NONAKTIF'

            case 'TERSEDIA':
                return 'TERSEDIA'

            case 'TERISI':
                return 'TERISI'

            case 'NONAKTIF':
                return 'NONAKTIF'

            default:
                return 'TERSEDIA'

        }

    }


    // =====================================================
    // FRONTEND STATUS → BACKEND
    // =====================================================

    function convertStatusToBackend(status) {

        switch (status) {

            case 'TERSEDIA':
                return 'available'

            case 'TERISI':
                return 'occupied'

            case 'NONAKTIF':
                return 'inactive'

            default:
                return 'available'

        }

    }


    // =====================================================
    // GET ROOMS
    // =====================================================

    async function loadRooms() {

        try {

            setLoading(true)

            const response =
                await getRooms()


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    'Gagal mengambil data kamar.'
                )

            }


            const rooms =
                Array.isArray(response.data)
                    ? response.data
                    : []


            const formattedRooms =
                rooms.map((room) => {

                    const tenantName =
                        getTenantName(room)


                    return {

                        id:
                            room.id,

                        roomNumber:
                            room.room_number ??
                            room.roomNumber ??
                            '',

                        buildingId:
                            room.building_id ??
                            room.buildingId ??
                            null,

                        buildingName:
                            room.building_name ??
                            room.buildingName ??
                            '',

                        floorId:
                            room.floor_id ??
                            room.floorId ??
                            null,

                        floorName:
                            room.floor_name ??
                            room.floorName ??
                            '',

                        rentPrice:
                            Number(
                                room.price ??
                                room.rent_price ??
                                room.rentPrice ??
                                0
                            ),

                        status:
                            convertStatusFromBackend(
                                room.status
                            ),

                        tenant:
                            tenantName,

                        tenantName:
                            tenantName,

                        notes:
                            room.notes ??
                            '',

                        created_at:
                            room.created_at ??
                            room.createdAt ??
                            null,

                        updated_at:
                            room.updated_at ??
                            room.updatedAt ??
                            null,

                    }

                })


            setRoomList(
                formattedRooms
            )


        } catch (error) {

            console.error(
                'LOAD ROOMS ERROR:',
                error
            )

            alert(
                error?.message ||
                'Gagal mengambil data kamar.'
            )

        } finally {

            setLoading(false)

        }

    }


    // =====================================================
    // FILTER
    // =====================================================

    const filteredRooms =
        useMemo(() => {

            const searchText =
                search
                    .toLowerCase()
                    .trim()


            return roomList.filter(
                (room) => {

                    const roomNumber =
                        String(
                            room.roomNumber ?? ''
                        )
                            .toLowerCase()


                    const tenantName =
                        String(
                            room.tenant ?? ''
                        )
                            .toLowerCase()


                    const matchesSearch =
                        roomNumber.includes(
                            searchText
                        ) ||
                        tenantName.includes(
                            searchText
                        )


                    const matchesFilter =
                        filter === 'SEMUA' ||
                        room.status === filter


                    return (
                        matchesSearch &&
                        matchesFilter
                    )

                }
            )

        }, [
            roomList,
            search,
            filter,
        ])


    // =====================================================
    // GET BUILDING NAME
    // =====================================================

    function getBuildingName(room) {

        if (room?.buildingName) {
            return room.buildingName
        }


        if (!room?.buildingId) {
            return '-'
        }


        const building =
            buildings.find(
                (item) =>
                    Number(item.id) ===
                    Number(room.buildingId)
            )


        return (
            building?.name ||
            '-'
        )

    }


    // =====================================================
    // GET FLOOR NAME
    // =====================================================

    function getFloorName(room) {

        if (room?.floorName) {
            return room.floorName
        }


        if (!room?.floorId) {
            return null
        }


        const floor =
            floors.find(
                (item) =>
                    Number(item.id) ===
                    Number(room.floorId)
            )


        return (
            floor?.name ||
            '-'
        )

    }


    // =====================================================
    // RESET FORM
    // =====================================================

    function resetForm() {

        setFormData({

            roomNumber: '',

            buildingId: '',

            floorId: '',

            rentPrice: '700000',

            status: 'TERSEDIA',

            notes: '',

        })

    }


    // =====================================================
    // OPEN ADD
    // =====================================================

    function openAddModal() {

        setEditingRoom(null)

        resetForm()

        setIsModalOpen(true)

    }


    // =====================================================
    // OPEN EDIT
    // =====================================================

    function openEditModal(room) {

        setEditingRoom(room)


        setFormData({

            roomNumber:
                room.roomNumber ?? '',

            buildingId:
                room.buildingId ?? '',

            floorId:
                room.floorId ?? '',

            rentPrice:
                room.rentPrice ?? '',

            status:
                room.status ?? 'TERSEDIA',

            notes:
                room.notes ?? '',

        })


        setIsModalOpen(true)

    }


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target


        if (name === 'buildingId') {

            setFormData(
                (previous) => ({

                    ...previous,

                    buildingId:
                        value,

                    floorId:
                        '',

                })
            )

            return

        }


        setFormData(
            (previous) => ({

                ...previous,

                [name]:
                    value,

            })
        )

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeModal() {

        if (saving) {
            return
        }


        setIsModalOpen(false)

        setEditingRoom(null)

        resetForm()

    }


    // =====================================================
    // SUBMIT
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault()


        if (
            !formData.roomNumber ||
            !formData.roomNumber.trim()
        ) {

            alert(
                'Nomor kamar wajib diisi.'
            )

            return

        }


        if (!formData.buildingId) {

            alert(
                'Silakan pilih bangunan.'
            )

            return

        }


        if (
            !formData.rentPrice ||
            Number(formData.rentPrice) <= 0
        ) {

            alert(
                'Harga sewa wajib diisi.'
            )

            return

        }


        if (
            editingRoom &&
            editingRoom.status === 'TERISI'
        ) {

            if (
                formData.status !== 'TERISI'
            ) {

                alert(
                    'Kamar sedang terisi. Selesaikan kontrak penghuni terlebih dahulu.'
                )

                return

            }

        }


        const duplicateRoom =
            roomList.find(
                (room) => {

                    const sameNumber =
                        String(
                            room.roomNumber ?? ''
                        )
                            .trim()
                            .toLowerCase() ===
                        String(
                            formData.roomNumber ?? ''
                        )
                            .trim()
                            .toLowerCase()


                    const sameBuilding =
                        Number(
                            room.buildingId
                        ) ===
                        Number(
                            formData.buildingId
                        )


                    const differentRoom =
                        Number(
                            room.id
                        ) !==
                        Number(
                            editingRoom?.id
                        )


                    return (
                        sameNumber &&
                        sameBuilding &&
                        differentRoom
                    )

                }
            )


        if (duplicateRoom) {

            alert(
                `Kamar ${formData.roomNumber} sudah digunakan pada bangunan tersebut.`
            )

            return

        }


        const payload = {

            room_number:
                formData.roomNumber.trim(),

            price:
                Number(
                    formData.rentPrice
                ),

            status:
                convertStatusToBackend(
                    formData.status
                ),

            building_id:
                Number(
                    formData.buildingId
                ),

            floor_id:
                formData.floorId
                    ? Number(
                        formData.floorId
                    )
                    : null,

            notes:
                formData.notes?.trim() ||
                '',

        }


        try {

            setSaving(true)


            if (editingRoom) {

                const response =
                    await updateRoom(
                        editingRoom.id,
                        payload
                    )


                if (!response?.success) {

                    alert(
                        response?.message ||
                        'Gagal mengubah kamar.'
                    )

                    return

                }


                alert(
                    'Kamar berhasil diperbarui.'
                )

            } else {

                const response =
                    await createRoom(
                        payload
                    )


                if (!response?.success) {

                    alert(
                        response?.message ||
                        'Gagal menambahkan kamar.'
                    )

                    return

                }


                alert(
                    'Kamar berhasil ditambahkan.'
                )

            }


            await loadRooms()

            closeModal()


        } catch (error) {

            console.error(
                'SAVE ROOM ERROR:',
                error
            )


            alert(
                error?.message ||
                'Terjadi kesalahan saat menyimpan kamar.'
            )

        } finally {

            setSaving(false)

        }

    }


    // =====================================================
    // DEACTIVATE
    // =====================================================

    async function handleDeactivate(room) {

        if (
            room.status === 'TERISI'
        ) {

            alert(
                'Kamar sedang terisi. Selesaikan kontrak penghuni terlebih dahulu.'
            )

            return

        }


        const confirmed =
            window.confirm(
                `Apakah Anda yakin ingin menonaktifkan kamar ${room.roomNumber}?`
            )


        if (!confirmed) {
            return
        }


        try {

            setSaving(true)


            const payload = {

                room_number:
                    room.roomNumber,

                price:
                    Number(
                        room.rentPrice
                    ),

                status:
                    'inactive',

                building_id:
                    room.buildingId
                        ? Number(
                            room.buildingId
                        )
                        : null,

                floor_id:
                    room.floorId
                        ? Number(
                            room.floorId
                        )
                        : null,

                notes:
                    room.notes ||
                    '',

            }


            const response =
                await updateRoom(
                    room.id,
                    payload
                )


            if (!response?.success) {

                alert(
                    response?.message ||
                    'Gagal menonaktifkan kamar.'
                )

                return

            }


            alert(
                `Kamar ${room.roomNumber} berhasil dinonaktifkan.`
            )


            await loadRooms()


        } catch (error) {

            console.error(
                'DEACTIVATE ROOM ERROR:',
                error
            )


            alert(
                error?.message ||
                'Terjadi kesalahan saat menonaktifkan kamar.'
            )

        } finally {

            setSaving(false)

        }

    }


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalRooms =
        roomList.length


    const occupiedRooms =
        roomList.filter(
            (room) =>
                room.status === 'TERISI'
        ).length


    const availableRooms =
        roomList.filter(
            (room) =>
                room.status === 'TERSEDIA'
        ).length


    const inactiveRooms =
        roomList.filter(
            (room) =>
                room.status === 'NONAKTIF'
        ).length


    // =====================================================
    // STATUS BADGE
    // =====================================================

    function getStatusBadge(status) {

        if (status === 'TERSEDIA') {

            return {
                className:
                    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
                icon:
                    <CheckCircle2 size={13} />,
                label:
                    'Tersedia',
            }

        }


        if (status === 'TERISI') {

            return {
                className:
                    'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
                icon:
                    <Users size={13} />,
                label:
                    'Terisi',
            }

        }


        return {
            className:
                'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
            icon:
                <Ban size={13} />,
            label:
                'Nonaktif',
        }

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">

                            <BedDouble size={20} />

                        </div>


                        <div>

                            <h1 className="text-xl font-bold text-slate-800">

                                Kamar

                            </h1>


                            <p className="text-sm text-slate-500">

                                Kelola kamar, status, harga, dan penghuni ADELINA KOST

                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={openAddModal}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <Plus size={18} />

                    Tambah Kamar

                </button>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


                {/* TOTAL */}

                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Kamar
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-800">
                                {loading ? '...' : totalRooms}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Seluruh kamar terdaftar
                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-800 group-hover:text-white">

                            <BedDouble size={21} />

                        </div>

                    </div>

                </div>


                {/* TERISI */}

                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Kamar Terisi
                            </p>

                            <p className="mt-1 text-2xl font-bold text-blue-600">
                                {loading ? '...' : occupiedRooms}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Sedang dihuni
                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                            <Users size={21} />

                        </div>

                    </div>

                </div>


                {/* TERSEDIA */}

                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Kamar Tersedia
                            </p>

                            <p className="mt-1 text-2xl font-bold text-emerald-600">
                                {loading ? '...' : availableRooms}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Siap disewakan
                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">

                            <CheckCircle2 size={21} />

                        </div>

                    </div>

                </div>


                {/* NONAKTIF */}

                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Kamar Nonaktif
                            </p>

                            <p className="mt-1 text-2xl font-bold text-red-600">
                                {loading ? '...' : inactiveRooms}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Tidak tersedia
                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">

                            <Ban size={21} />

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                SEARCH & FILTER
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">


                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />


                        <input
                            type="text"
                            placeholder="Cari nomor kamar atau nama penghuni..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />

                    </div>


                    <div className="flex flex-col gap-2 sm:flex-row">

                        <select
                            value={filter}
                            onChange={(event) =>
                                setFilter(
                                    event.target.value
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        >

                            <option value="SEMUA">
                                Semua Status
                            </option>

                            <option value="TERSEDIA">
                                Tersedia
                            </option>

                            <option value="TERISI">
                                Terisi
                            </option>

                            <option value="NONAKTIF">
                                Nonaktif
                            </option>

                        </select>


                        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">

                            Menampilkan{' '}

                            <span className="ml-1 font-semibold text-slate-700">
                                {filteredRooms.length}
                            </span>

                            <span className="ml-1">
                                kamar
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ROOM LIST
            ================================================= */}

            {loading ? (

                <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">

                    <div className="text-center">

                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm font-medium text-slate-600">
                            Memuat data kamar...
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Mohon tunggu sebentar
                        </p>

                    </div>

                </div>

            ) : filteredRooms.length > 0 ? (

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

                    {filteredRooms.map(
                        (room) => {

                            const status =
                                getStatusBadge(
                                    room.status
                                )


                            return (

                                <div
                                    key={room.id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                >

                                    {/* CARD TOP */}

                                    <div className="border-b border-slate-100 p-4">

                                        <div className="mb-3 flex items-start justify-between gap-3">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">

                                                    <BedDouble size={21} />

                                                </div>


                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Kamar
                                                    </p>

                                                    <p className="text-lg font-bold text-slate-800">
                                                        {room.roomNumber || '-'}
                                                    </p>

                                                </div>

                                            </div>


                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                            >

                                                {status.icon}

                                                {status.label}

                                            </span>

                                        </div>


                                        {/* ROOM CARD ASLI */}

                                        <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">

                                            <RoomCard
                                                room={room}
                                                buildingName={
                                                    getBuildingName(
                                                        room
                                                    )
                                                }
                                                floorName={
                                                    getFloorName(
                                                        room
                                                    )
                                                }
                                                tenant={
                                                    room.tenant
                                                }
                                                tenantName={
                                                    room.tenantName
                                                }
                                            />

                                        </div>

                                    </div>


                                    {/* EXTRA INFORMATION */}

                                    <div className="space-y-2.5 px-4 py-3">

                                        <div className="flex items-center gap-2 text-xs text-slate-500">

                                            <Building2
                                                size={14}
                                                className="shrink-0 text-slate-400"
                                            />

                                            <span className="truncate">
                                                {getBuildingName(room)}
                                            </span>

                                        </div>


                                        <div className="flex items-center gap-2 text-xs text-slate-500">

                                            <Layers3
                                                size={14}
                                                className="shrink-0 text-slate-400"
                                            />

                                            <span className="truncate">

                                                {getFloorName(room) || 'Tidak ada lantai'}

                                            </span>

                                        </div>


                                        <div className="flex items-center gap-2 text-xs text-slate-500">

                                            <Wallet
                                                size={14}
                                                className="shrink-0 text-slate-400"
                                            />

                                            <span className="font-medium text-slate-700">

                                                Rp {Number(
                                                    room.rentPrice || 0
                                                ).toLocaleString('id-ID')}

                                                <span className="font-normal text-slate-400">
                                                    {' '}/ bulan
                                                </span>

                                            </span>

                                        </div>


                                        {room.notes && (

                                            <div className="flex items-start gap-2 text-xs text-slate-500">

                                                <FileText
                                                    size={14}
                                                    className="mt-0.5 shrink-0 text-slate-400"
                                                />

                                                <span className="line-clamp-2">
                                                    {room.notes}
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    {/* ACTION */}

                                    <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-3">

                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() =>
                                                openEditModal(
                                                    room
                                                )
                                            }
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            <Pencil size={15} />

                                            Edit

                                        </button>


                                        {room.status !==
                                            'NONAKTIF' && (

                                                <button
                                                    type="button"
                                                    disabled={
                                                        saving ||
                                                        room.status ===
                                                        'TERISI'
                                                    }
                                                    onClick={() =>
                                                        handleDeactivate(
                                                            room
                                                        )
                                                    }
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >

                                                    <Power size={15} />

                                                    Nonaktifkan

                                                </button>

                                            )}

                                    </div>

                                </div>

                            )

                        }
                    )}

                </div>

            ) : (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">

                        <BedDouble size={32} />

                    </div>


                    <h3 className="mt-4 text-base font-semibold text-slate-700">

                        Kamar tidak ditemukan

                    </h3>


                    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">

                        {search
                            ? 'Tidak ada kamar yang sesuai dengan pencarian Anda.'
                            : 'Belum ada data kamar yang tersedia.'}

                    </p>

                </div>

            )}


            {/* =================================================
                MODAL
            ================================================= */}

            {isModalOpen && (

                <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm">

                    {/* MODAL WRAPPER */}
                    <div className="flex h-full w-full items-start justify-center overflow-y-auto px-4 py-8 sm:py-10">

                        {/* MODAL */}
                        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            {/* =================================================
                    MODAL HEADER
                ================================================= */}

                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                        {editingRoom
                                            ? <Pencil size={19} />
                                            : <Plus size={20} />
                                        }

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-slate-800">

                                            {editingRoom
                                                ? 'Edit Kamar'
                                                : 'Tambah Kamar'
                                            }

                                        </h2>

                                        <p className="mt-0.5 text-xs text-slate-500">

                                            {editingRoom
                                                ? 'Perbarui informasi kamar'
                                                : 'Tambahkan kamar baru ke ADELINA KOST'
                                            }

                                        </p>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            {/* =================================================
                    MODAL CONTENT
                ================================================= */}

                            <div className="max-h-[calc(100vh-150px)] overflow-y-auto">

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5 p-6"
                                >


                                    {/* =================================================
                            NOMOR KAMAR
                        ================================================= */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">

                                            Nomor Kamar

                                        </label>

                                        <div className="relative">

                                            <BedDouble
                                                size={17}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="text"
                                                name="roomNumber"
                                                value={
                                                    formData.roomNumber
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Contoh: 1"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                            />

                                        </div>

                                    </div>


                                    {/* =================================================
                            BUILDING
                        ================================================= */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">

                                            Bangunan

                                        </label>

                                        <div className="relative">

                                            <Building2
                                                size={17}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <select
                                                name="buildingId"
                                                value={
                                                    formData.buildingId
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                            >

                                                <option value="">
                                                    Pilih Bangunan
                                                </option>

                                                {buildings
                                                    .filter(
                                                        (building) =>
                                                            building.status ===
                                                            'AKTIF'
                                                    )
                                                    .map(
                                                        (building) => (

                                                            <option
                                                                key={
                                                                    building.id
                                                                }
                                                                value={
                                                                    building.id
                                                                }
                                                            >

                                                                {
                                                                    building.name
                                                                }

                                                            </option>

                                                        )
                                                    )}

                                            </select>

                                        </div>

                                    </div>


                                    {/* =================================================
                            FLOOR
                        ================================================= */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">

                                            Lantai

                                        </label>

                                        <div className="relative">

                                            <Layers3
                                                size={17}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <select
                                                name="floorId"
                                                value={
                                                    formData.floorId
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                            >

                                                <option value="">
                                                    Tidak menggunakan lantai
                                                </option>

                                                {floors
                                                    .filter(
                                                        (floor) =>

                                                            floor.status ===
                                                            'AKTIF' &&

                                                            (
                                                                !formData.buildingId ||

                                                                Number(
                                                                    floor.buildingId
                                                                ) ===
                                                                Number(
                                                                    formData.buildingId
                                                                )
                                                            )
                                                    )
                                                    .map(
                                                        (floor) => (

                                                            <option
                                                                key={
                                                                    floor.id
                                                                }
                                                                value={
                                                                    floor.id
                                                                }
                                                            >

                                                                {
                                                                    floor.name
                                                                }

                                                            </option>

                                                        )
                                                    )}

                                            </select>

                                        </div>

                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">

                                            <MapPin size={12} />

                                            Lantai akan menyesuaikan bangunan.

                                        </p>

                                    </div>


                                    {/* =================================================
                            PRICE
                        ================================================= */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">

                                            Harga Sewa / Bulan

                                        </label>

                                        <div className="relative">

                                            <Wallet
                                                size={17}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="number"
                                                name="rentPrice"
                                                value={
                                                    formData.rentPrice
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                min="1"
                                                placeholder="700000"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                            />

                                        </div>

                                    </div>


                                    {/* =================================================
                            STATUS
                        ================================================= */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">

                                            Status

                                        </label>


                                        {editingRoom?.status ===
                                            'TERISI' ? (

                                            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">

                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600">

                                                    <Users size={17} />

                                                </div>

                                                <div>

                                                    <p className="text-sm font-semibold text-blue-700">

                                                        Kamar Terisi

                                                    </p>

                                                    <p className="text-xs text-blue-600/70">

                                                        Status dikelola melalui kontrak penghuni.

                                                    </p>

                                                </div>

                                            </div>

                                        ) : (

                                            <div className="relative">

                                                <CheckCircle2
                                                    size={17}
                                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                />

                                                <select
                                                    name="status"
                                                    value={
                                                        formData.status
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                                >

                                                    <option value="TERSEDIA">
                                                        TERSEDIA
                                                    </option>

                                                    <option value="NONAKTIF">
                                                        NONAKTIF
                                                    </option>

                                                </select>

                                            </div>

                                        )}

                                    </div>


                                    {/* =================================================
                            NOTES
                        ================================================= */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">

                                            Catatan

                                        </label>

                                        <div className="relative">

                                            <FileText
                                                size={17}
                                                className="absolute left-3.5 top-3.5 text-slate-400"
                                            />

                                            <textarea
                                                name="notes"
                                                value={
                                                    formData.notes
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                rows="3"
                                                placeholder="Tambahkan catatan kamar jika diperlukan..."
                                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                            />

                                        </div>

                                    </div>


                                    {/* =================================================
                            BUTTON
                        ================================================= */}

                                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            disabled={saving}
                                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            Batal

                                        </button>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {saving ? (

                                                <>

                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                                    Menyimpan...

                                                </>

                                            ) : (

                                                <>

                                                    {editingRoom
                                                        ? <Pencil size={16} />
                                                        : <Plus size={16} />
                                                    }

                                                    {editingRoom
                                                        ? 'Simpan Perubahan'
                                                        : 'Tambah Kamar'
                                                    }

                                                </>

                                            )}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            )}
        </div>

    )

}


export default Rooms