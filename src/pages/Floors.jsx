import { useEffect, useState } from 'react'
import {
    Layers3,
    Plus,
    Building2,
    Pencil,
    Power,
    X,
} from 'lucide-react'

import {
    getFloors,
    createFloor,
    updateFloor,
    deactivateFloor,
} from '../services/floorService'

import {
    getBuildings,
} from '../services/buildingService'


function Floors() {

    // ==========================================
    // STATE
    // ==========================================

    const [floorList, setFloorList] = useState([])

    const [buildingList, setBuildingList] = useState([])

    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editingFloor, setEditingFloor] = useState(null)

    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        buildingId: '',
        name: '',
        floorNumber: '',
    })


    // ==========================================
    // LOAD FLOORS
    // ==========================================

    async function loadFloors() {

        try {

            const response = await getFloors()

            setFloorList(
                response?.data || []
            )

        } catch (error) {

            console.error(
                'Load Floors Error:',
                error
            )

            alert(
                error.message ||
                'Gagal mengambil data lantai.'
            )

        }

    }


    // ==========================================
    // LOAD BUILDINGS
    // ==========================================

    async function loadBuildings() {

        try {

            const response = await getBuildings()

            setBuildingList(
                response?.data || []
            )

        } catch (error) {

            console.error(
                'Load Buildings Error:',
                error
            )

            alert(
                error.message ||
                'Gagal mengambil data bangunan.'
            )

        }

    }


    // ==========================================
    // LOAD DATA
    // ==========================================

    async function loadData() {

        try {

            setLoading(true)

            await Promise.all([
                loadFloors(),
                loadBuildings(),
            ])

        } catch (error) {

            console.error(
                'Load Floor Data Error:',
                error
            )

        } finally {

            setLoading(false)

        }

    }


    // ==========================================
    // LOAD SAAT HALAMAN DIBUKA
    // ==========================================

    useEffect(() => {

        loadData()

    }, [])


    // ==========================================
    // BUKA MODAL TAMBAH
    // ==========================================

    function openAddModal() {

        setEditingFloor(null)

        setFormData({
            buildingId: '',
            name: '',
            floorNumber: '',
        })

        setIsModalOpen(true)

    }


    // ==========================================
    // BUKA MODAL EDIT
    // ==========================================

    function openEditModal(floor) {

        setEditingFloor(floor)

        setFormData({
            buildingId:
                floor.building_id ??
                '',
            name:
                floor.name ??
                '',
            floorNumber:
                floor.floor_number ??
                '',
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

        setEditingFloor(null)

        setFormData({
            buildingId: '',
            name: '',
            floorNumber: '',
        })

    }


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    function handleChange(event) {

        const {
            name,
            value,
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
        // VALIDASI BANGUNAN
        // ========================================

        if (!formData.buildingId) {

            alert(
                'Silakan pilih bangunan.'
            )

            return

        }


        // ========================================
        // VALIDASI NAMA
        // ========================================

        if (!formData.name.trim()) {

            alert(
                'Nama lantai wajib diisi.'
            )

            return

        }


        // ========================================
        // VALIDASI NOMOR
        // ========================================

        if (
            !formData.floorNumber ||
            Number(formData.floorNumber) < 1
        ) {

            alert(
                'Nomor lantai wajib diisi.'
            )

            return

        }


        try {

            setSaving(true)


            const floorData = {
                building_id:
                    Number(formData.buildingId),

                name:
                    formData.name.trim(),

                floor_number:
                    Number(formData.floorNumber),
            }


            // ====================================
            // UPDATE
            // ====================================

            if (editingFloor) {

                await updateFloor(
                    editingFloor.id,
                    {
                        ...floorData,
                        status:
                            editingFloor.status ||
                            'AKTIF',
                    }
                )

                alert(
                    'Lantai berhasil diperbarui.'
                )

            }


            // ====================================
            // CREATE
            // ====================================

            else {

                await createFloor({
                    ...floorData,
                    status: 'AKTIF',
                })

                alert(
                    'Lantai berhasil ditambahkan.'
                )

            }


            // ====================================
            // AMBIL DATA TERBARU
            // ====================================

            await loadFloors()


            // ====================================
            // RESET
            // ====================================

            setIsModalOpen(false)

            setEditingFloor(null)

            setFormData({
                buildingId: '',
                name: '',
                floorNumber: '',
            })

        } catch (error) {

            console.error(
                'Save Floor Error:',
                error
            )

            alert(
                error.message ||
                'Gagal menyimpan lantai.'
            )

        } finally {

            setSaving(false)

        }

    }


    // ==========================================
    // NONAKTIFKAN
    // ==========================================

    async function handleDeactivate(floor) {

        const confirmed =
            window.confirm(
                `Apakah Anda yakin ingin menonaktifkan ${floor.name}?`
            )


        if (!confirmed) {
            return
        }


        try {

            await deactivateFloor(
                floor.id
            )


            alert(
                'Lantai berhasil dinonaktifkan.'
            )


            // Ambil data terbaru

            await loadFloors()

        } catch (error) {

            console.error(
                'Deactivate Floor Error:',
                error
            )

            alert(
                error.message ||
                'Gagal menonaktifkan lantai.'
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
                        Manajemen Lantai
                    </h1>

                </div>


                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-12
                        text-center
                        shadow-sm
                    "
                >

                    <Layers3
                        size={40}
                        className="
                            mx-auto
                            text-slate-300
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            text-slate-500
                        "
                    >
                        Memuat data lantai...
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

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Manajemen Lantai
                    </h1>

                </div>


                <button
                    onClick={openAddModal}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                >

                    <Plus size={18} />

                    Tambah Lantai

                </button>

            </div>


            {/* =====================================
                FLOOR LIST
            ====================================== */}

            <div
                className="
                    grid
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-3
                "
            >

                {floorList.map((floor) => (

                    <div
                        key={floor.id}
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                        "
                    >


                        {/* HEADER CARD */}

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
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
                                        bg-purple-50
                                    "
                                >

                                    <Layers3
                                        size={24}
                                        className="
                                            text-purple-600
                                        "
                                    />

                                </div>


                                <div>

                                    <h2
                                        className="
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        {floor.name}
                                    </h2>


                                    <span
                                        className={`
                                            mt-1
                                            inline-block
                                            rounded-full
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            ${floor.status === 'AKTIF'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-500'
                                            }
                                        `}
                                    >
                                        {floor.status}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* DETAIL */}

                        <div
                            className="
                                mt-6
                                space-y-3
                            "
                        >


                            {/* BUILDING */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-slate-500
                                "
                            >

                                <Building2 size={17} />

                                <span>
                                    {floor.building_name ||
                                        'Bangunan tidak ditemukan'}
                                </span>

                            </div>


                            {/* FLOOR NUMBER */}

                            <div
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >

                                Nomor lantai:

                                <span
                                    className="
                                        ml-1
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    {floor.floor_number}
                                </span>

                            </div>

                        </div>


                        {/* ACTION */}

                        <div
                            className="
                                mt-6
                                flex
                                gap-2
                                border-t
                                border-slate-100
                                pt-4
                            "
                        >


                            {/* EDIT */}

                            <button
                                onClick={() =>
                                    openEditModal(floor)
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                "
                            >

                                <Pencil size={15} />

                                Edit

                            </button>


                            {/* NONAKTIFKAN */}

                            {floor.status === 'AKTIF' && (

                                <button
                                    onClick={() =>
                                        handleDeactivate(floor)
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-red-200
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        text-red-600
                                        transition
                                        hover:bg-red-50
                                    "
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

            {floorList.length === 0 && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        p-12
                        text-center
                    "
                >

                    <Layers3
                        size={40}
                        className="
                            mx-auto
                            text-slate-300
                        "
                    />

                    <p
                        className="
                            mt-4
                            font-medium
                            text-slate-700
                        "
                    >
                        Belum ada lantai
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Tambahkan lantai pertama.
                    </p>

                </div>

            )}


            {/* =====================================
                MODAL
            ====================================== */}

            {isModalOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        p-4
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-lg
                            rounded-2xl
                            bg-white
                            shadow-xl
                        "
                    >


                        {/* MODAL HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-slate-100
                                p-5
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-slate-800
                                    "
                                >

                                    {editingFloor
                                        ? 'Edit Lantai'
                                        : 'Tambah Lantai'}

                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Tentukan bangunan dan
                                    informasi lantai
                                </p>

                            </div>


                            <button
                                onClick={closeModal}
                                disabled={saving}
                                className="
                                    rounded-lg
                                    p-2
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                space-y-5
                                p-5
                            "
                        >


                            {/* BANGUNAN */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Bangunan
                                </label>


                                <select
                                    name="buildingId"
                                    value={formData.buildingId}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:bg-slate-50
                                    "
                                >

                                    <option value="">
                                        Pilih Bangunan
                                    </option>


                                    {buildingList
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
                                                    {building.name}
                                                </option>

                                            )
                                        )}

                                </select>

                            </div>


                            {/* NAMA LANTAI */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Nama Lantai
                                </label>


                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Contoh: Lantai 1"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:bg-slate-50
                                    "
                                />

                            </div>


                            {/* NOMOR LANTAI */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Nomor Lantai
                                </label>


                                <input
                                    type="number"
                                    name="floorNumber"
                                    value={formData.floorNumber}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Contoh: 1"
                                    min="1"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:bg-slate-50
                                    "
                                />

                            </div>


                            {/* BUTTON */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                    border-t
                                    border-slate-100
                                    pt-4
                                "
                            >

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Batal
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        rounded-xl
                                        bg-blue-600
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        hover:bg-blue-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {saving
                                        ? 'Menyimpan...'
                                        : editingFloor
                                            ? 'Simpan Perubahan'
                                            : 'Tambah Lantai'}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    )
}


export default Floors