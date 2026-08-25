import { useEffect, useState } from 'react'
import {
    Building2,
    Plus,
    MapPin,
    Pencil,
    Power,
    X,
} from 'lucide-react'

import {
    getBuildings,
    createBuilding,
    updateBuilding,
    deactivateBuilding,
} from '../services/buildingService'


function Buildings() {

    // ==========================================
    // STATE
    // ==========================================

    const [buildingList, setBuildingList] = useState([])

    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editingBuilding, setEditingBuilding] = useState(null)

    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
    })


    // ==========================================
    // LOAD BUILDINGS
    // GET /api/buildings
    // ==========================================

    async function loadBuildings() {

        try {

            setLoading(true)

            const response = await getBuildings()

            setBuildingList(response.data || [])

        } catch (error) {

            console.error('Load Buildings Error:', error)

            alert(
                error.message ||
                'Gagal mengambil data bangunan.'
            )

        } finally {

            setLoading(false)

        }

    }


    // ==========================================
    // LOAD SAAT HALAMAN DIBUKA
    // ==========================================

    useEffect(() => {

        loadBuildings()

    }, [])


    // ==========================================
    // BUKA MODAL TAMBAH
    // ==========================================

    function openAddModal() {

        setEditingBuilding(null)

        setFormData({
            name: '',
            address: '',
            description: '',
        })

        setIsModalOpen(true)

    }


    // ==========================================
    // BUKA MODAL EDIT
    // ==========================================

    function openEditModal(building) {

        setEditingBuilding(building)

        setFormData({
            name: building.name || '',
            address: building.address || '',
            description: building.description || '',
        })

        setIsModalOpen(true)

    }


    // ==========================================
    // TUTUP MODAL
    // ==========================================

    function closeModal() {

        if (saving) {
            return
        }

        setIsModalOpen(false)

        setEditingBuilding(null)

        setFormData({
            name: '',
            address: '',
            description: '',
        })

    }


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    function handleChange(event) {

        const {
            name,
            value
        } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))

    }


    // ==========================================
    // SIMPAN DATA
    // CREATE / UPDATE
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault()


        // ========================================
        // VALIDASI
        // ========================================

        if (!formData.name.trim()) {

            alert('Nama bangunan wajib diisi.')

            return

        }


        if (!formData.address.trim()) {

            alert('Alamat bangunan wajib diisi.')

            return

        }


        try {

            setSaving(true)


            // ====================================
            // UPDATE
            // ====================================

            if (editingBuilding) {

                await updateBuilding(
                    editingBuilding.id,
                    {
                        name: formData.name.trim(),
                        address: formData.address.trim(),
                        description:
                            formData.description.trim(),
                        status:
                            editingBuilding.status || 'AKTIF',
                    }
                )

                alert(
                    'Bangunan berhasil diperbarui.'
                )

            }


            // ====================================
            // CREATE
            // ====================================

            else {

                await createBuilding({
                    name: formData.name.trim(),
                    address: formData.address.trim(),
                    description:
                        formData.description.trim(),
                    status: 'AKTIF',
                })

                alert(
                    'Bangunan berhasil ditambahkan.'
                )

            }


            // ====================================
            // AMBIL DATA TERBARU DARI DATABASE
            // ====================================

            await loadBuildings()


            // ====================================
            // RESET
            // ====================================

            setIsModalOpen(false)

            setEditingBuilding(null)

            setFormData({
                name: '',
                address: '',
                description: '',
            })


        } catch (error) {

            console.error(
                'Save Building Error:',
                error
            )

            alert(
                error.message ||
                'Gagal menyimpan bangunan.'
            )

        } finally {

            setSaving(false)

        }

    }


    // ==========================================
    // NONAKTIFKAN BUILDING
    // PATCH /api/buildings/:id/nonaktifkan
    // ==========================================

    async function handleDeactivate(building) {

        const confirmed = window.confirm(
            `Apakah Anda yakin ingin menonaktifkan ${building.name}?`
        )


        if (!confirmed) {
            return
        }


        try {

            await deactivateBuilding(
                building.id
            )


            alert(
                'Bangunan berhasil dinonaktifkan.'
            )


            // Ambil data terbaru

            await loadBuildings()


        } catch (error) {

            console.error(
                'Deactivate Building Error:',
                error
            )

            alert(
                error.message ||
                'Gagal menonaktifkan bangunan.'
            )

        }

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="space-y-6">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Manajemen Bangunan
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Kelola bangunan ADELINA KOST
                    </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                    <Building2
                        size={40}
                        className="mx-auto text-slate-300"
                    />

                    <p className="mt-4 text-sm text-slate-500">
                        Memuat data bangunan...
                    </p>

                </div>

            </div>

        )

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="space-y-6">


            {/* =====================================
                HEADER
            ====================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Manajemen Bangunan
                    </h1>

                    {/* <p className="mt-1 text-sm text-slate-500">
                        Kelola bangunan ADELINA KOST
                    </p> */}

                </div>


                <button
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >

                    <Plus size={18} />

                    Tambah Bangunan

                </button>

            </div>


            {/* =====================================
                BUILDING LIST
            ====================================== */}

            <div className="grid gap-5 md:grid-cols-2">

                {buildingList.map((building) => (

                    <div
                        key={building.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >


                        {/* HEADER CARD */}

                        <div className="flex items-start justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                                    <Building2
                                        size={24}
                                        className="text-blue-600"
                                    />

                                </div>


                                <div>

                                    <h2 className="font-semibold text-slate-800">
                                        {building.name}
                                    </h2>


                                    <span
                                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${building.status === 'AKTIF'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-500'
                                            }`}
                                    >

                                        {building.status}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* DETAIL */}

                        <div className="mt-6">


                            {/* ADDRESS */}

                            <div className="flex items-start gap-2">

                                <MapPin
                                    size={17}
                                    className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <p className="text-sm text-slate-500">
                                    {building.address ||
                                        'Alamat belum tersedia'}
                                </p>

                            </div>


                            {/* DESCRIPTION */}

                            <p className="mt-3 text-sm text-slate-500">

                                {building.description ||
                                    'Tidak ada deskripsi'}

                            </p>

                        </div>


                        {/* ACTION */}

                        <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">


                            {/* EDIT */}

                            <button
                                onClick={() =>
                                    openEditModal(building)
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >

                                <Pencil size={15} />

                                Edit

                            </button>


                            {/* NONAKTIFKAN */}

                            {building.status === 'AKTIF' && (

                                <button
                                    onClick={() =>
                                        handleDeactivate(building)
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >

                                    <Power size={15} />

                                    Nonaktifkan

                                </button>

                            )}

                        </div>

                    </div>

                ))}

            </div>


            {/* =====================================
                EMPTY STATE
            ====================================== */}

            {buildingList.length === 0 && (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                    <Building2
                        size={40}
                        className="mx-auto text-slate-300"
                    />

                    <p className="mt-4 font-medium text-slate-700">
                        Belum ada bangunan
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Tambahkan bangunan pertama Anda.
                    </p>

                </div>

            )}


            {/* =====================================
                MODAL
            ====================================== */}

            {isModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">


                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">


                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-100 p-5">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">

                                    {editingBuilding
                                        ? 'Edit Bangunan'
                                        : 'Tambah Bangunan'}

                                </h2>


                                <p className="mt-1 text-xs text-slate-500">
                                    Lengkapi informasi bangunan
                                </p>

                            </div>


                            <button
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5"
                        >


                            {/* NAMA */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Nama Bangunan
                                </label>


                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Contoh: Bangunan Utama"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                />

                            </div>


                            {/* ALAMAT */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Alamat
                                </label>


                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Jalan Srikandi, Pekanbaru"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                />

                            </div>


                            {/* DESKRIPSI */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Deskripsi
                                </label>


                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={saving}
                                    rows="3"
                                    placeholder="Deskripsi bangunan..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                />

                            </div>


                            {/* BUTTON */}

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">


                                {/* BATAL */}

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    Batal

                                </button>


                                {/* SIMPAN */}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving
                                        ? 'Menyimpan...'
                                        : editingBuilding
                                            ? 'Simpan Perubahan'
                                            : 'Tambah Bangunan'}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    )

}

export default Buildings