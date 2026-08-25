import { useState } from 'react'
import {
    Layers3,
    Plus,
    Building2,
    Pencil,
    Power,
    X,
} from 'lucide-react'

import { floors } from '../data/floorData'
import { buildings } from '../data/buildingData'

function Floors() {
    const [floorList, setFloorList] = useState(floors)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editingFloor, setEditingFloor] = useState(null)

    const [formData, setFormData] = useState({
        buildingId: '',
        name: '',
        floorNumber: '',
    })

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
            buildingId: floor.buildingId,
            name: floor.name,
            floorNumber: floor.floorNumber,
        })

        setIsModalOpen(true)
    }

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    // ==========================================
    // SIMPAN
    // ==========================================

    function handleSubmit(event) {
        event.preventDefault()

        if (!formData.buildingId) {
            alert('Silakan pilih bangunan.')
            return
        }

        if (!formData.name.trim()) {
            alert('Nama lantai wajib diisi.')
            return
        }

        if (!formData.floorNumber) {
            alert('Nomor lantai wajib diisi.')
            return
        }

        // ========================================
        // EDIT
        // ========================================

        if (editingFloor) {
            setFloorList((previous) =>
                previous.map((floor) =>
                    floor.id === editingFloor.id
                        ? {
                            ...floor,
                            buildingId: Number(formData.buildingId),
                            name: formData.name,
                            floorNumber: Number(formData.floorNumber),
                            updated_at: new Date().toISOString(),
                        }
                        : floor
                )
            )
        }

        // ========================================
        // TAMBAH
        // ========================================

        else {
            const newFloor = {
                id: Date.now(),
                buildingId: Number(formData.buildingId),
                name: formData.name,
                floorNumber: Number(formData.floorNumber),
                status: 'AKTIF',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            setFloorList((previous) => [
                ...previous,
                newFloor,
            ])
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
    // NONAKTIFKAN
    // ==========================================

    function handleDeactivate(floor) {
        const confirmed = window.confirm(
            `Apakah Anda yakin ingin menonaktifkan ${floor.name}?`
        )

        if (!confirmed) {
            return
        }

        setFloorList((previous) =>
            previous.map((item) =>
                item.id === floor.id
                    ? {
                        ...item,
                        status: 'NONAKTIF',
                        updated_at: new Date().toISOString(),
                    }
                    : item
            )
        )
    }

    // ==========================================
    // CARI NAMA BANGUNAN
    // ==========================================

    function getBuildingName(buildingId) {
        const building = buildings.find(
            (item) => item.id === Number(buildingId)
        )

        return building?.name || '-'
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Manajemen Lantai
                    </h1>

                    {/* <p className="mt-1 text-sm text-slate-500">
                        Kelola lantai setiap bangunan
                    </p> */}

                </div>

                <button
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >

                    <Plus size={18} />

                    Tambah Lantai

                </button>

            </div>


            {/* FLOOR LIST */}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {floorList.map((floor) => (

                    <div
                        key={floor.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >

                        {/* HEADER CARD */}

                        <div className="flex items-start justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">

                                    <Layers3
                                        size={24}
                                        className="text-purple-600"
                                    />

                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-800">
                                        {floor.name}
                                    </h2>

                                    <span
                                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${floor.status === 'AKTIF'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-500'
                                            }`}
                                    >
                                        {floor.status}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* DETAIL */}

                        <div className="mt-6 space-y-3">

                            <div className="flex items-center gap-2 text-sm text-slate-500">

                                <Building2 size={17} />

                                <span>
                                    {getBuildingName(floor.buildingId)}
                                </span>

                            </div>

                            <div className="text-sm text-slate-500">

                                Nomor lantai:

                                <span className="ml-1 font-medium text-slate-700">
                                    {floor.floorNumber}
                                </span>

                            </div>

                        </div>


                        {/* ACTION */}

                        <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">

                            <button
                                onClick={() => openEditModal(floor)}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >

                                <Pencil size={15} />

                                Edit

                            </button>

                            {floor.status === 'AKTIF' && (
                                <button
                                    onClick={() =>
                                        handleDeactivate(floor)
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


            {/* EMPTY STATE */}

            {floorList.length === 0 && (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                    <Layers3
                        size={40}
                        className="mx-auto text-slate-300"
                    />

                    <p className="mt-4 font-medium text-slate-700">
                        Belum ada lantai
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Tambahkan lantai pertama.
                    </p>

                </div>

            )}


            {/* MODAL */}

            {isModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-100 p-5">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">

                                    {editingFloor
                                        ? 'Edit Lantai'
                                        : 'Tambah Lantai'}

                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Tentukan bangunan dan informasi lantai
                                </p>

                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5"
                        >

                            {/* BANGUNAN */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Bangunan
                                </label>

                                <select
                                    name="buildingId"
                                    value={formData.buildingId}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value="">
                                        Pilih Bangunan
                                    </option>

                                    {buildings
                                        .filter(
                                            (building) =>
                                                building.status === 'AKTIF'
                                        )
                                        .map((building) => (

                                            <option
                                                key={building.id}
                                                value={building.id}
                                            >
                                                {building.name}
                                            </option>

                                        ))}

                                </select>

                            </div>


                            {/* NAMA LANTAI */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Nama Lantai
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Contoh: Lantai 1"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* NOMOR LANTAI */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Nomor Lantai
                                </label>

                                <input
                                    type="number"
                                    name="floorNumber"
                                    value={formData.floorNumber}
                                    onChange={handleChange}
                                    placeholder="Contoh: 1"
                                    min="1"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* BUTTON */}

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsModalOpen(false)
                                    }
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >

                                    {editingFloor
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