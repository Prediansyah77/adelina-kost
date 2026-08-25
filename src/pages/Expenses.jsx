import { useEffect, useMemo, useState } from 'react'

import {
    Receipt,
    Plus,
    Search,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    TrendingDown,
    Wallet,
    CalendarDays,
    Tag,
} from 'lucide-react'

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from '../services/expenseService'


function Expenses() {

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

    const now = new Date()

    const currentYear =
        now.getFullYear()

    const currentMonth =
        now.getMonth() + 1


    // =====================================================
    // STATE DATA
    // =====================================================

    const [expenses, setExpenses] =
        useState([])

    const [bankAccounts, setBankAccounts] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')


    // =====================================================
    // STATE FILTER
    // =====================================================

    const [selectedMonth, setSelectedMonth] =
        useState(currentMonth)

    const [selectedYear, setSelectedYear] =
        useState(currentYear)

    const [search, setSearch] =
        useState('')


    // =====================================================
    // STATE MODAL
    // =====================================================

    const [showModal, setShowModal] =
        useState(false)

    const [editingId, setEditingId] =
        useState(null)

    const [saving, setSaving] =
        useState(false)

    const [deletingId, setDeletingId] =
        useState(null)


    // =====================================================
    // FORM
    // =====================================================

    const emptyForm = {
        expense_date: '',
        category: '',
        description: '',
        amount: '',
        bank_account_id: '',
    }


    const [form, setForm] =
        useState(emptyForm)


    // =====================================================
    // LOAD EXPENSES
    // =====================================================

    async function loadExpenses() {

        try {

            setLoading(true)
            setError('')

            const response =
                await getExpenses()


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    'Gagal mengambil data pengeluaran.'
                )

            }


            setExpenses(
                Array.isArray(response.data)
                    ? response.data
                    : []
            )


        } catch (error) {

            console.error(
                'Load Expenses Error:',
                error
            )

            setError(
                error.message ||
                'Gagal mengambil data pengeluaran.'
            )

        } finally {

            setLoading(false)

        }

    }


    // =====================================================
    // LOAD BANK ACCOUNTS
    // =====================================================

    async function loadBankAccounts() {

        try {

            const response =
                await fetch(
                    'http://localhost:5000/api/bank-accounts'
                )


            const result =
                await response.json()


            if (!result?.success) {

                throw new Error(
                    result?.message ||
                    'Gagal mengambil data rekening.'
                )

            }


            const activeAccounts =
                Array.isArray(result.data)
                    ? result.data.filter(
                        (account) =>
                            Number(
                                account.is_active
                            ) === 1
                    )
                    : []


            setBankAccounts(
                activeAccounts
            )


        } catch (error) {

            console.error(
                'Load Bank Accounts Error:',
                error
            )

            setError(
                error.message ||
                'Gagal mengambil data rekening.'
            )

        }

    }


    // =====================================================
    // LOAD AWAL
    // =====================================================

    useEffect(() => {

        loadExpenses()
        loadBankAccounts()

    }, [])


    // =====================================================
    // TAHUN YANG TERSEDIA
    // =====================================================

    const years = useMemo(() => {

        const yearSet =
            new Set()


        // Tahun sekarang

        yearSet.add(
            currentYear
        )


        // Tahun mendatang

        for (
            let year = currentYear;
            year <= currentYear + 5;
            year++
        ) {

            yearSet.add(year)

        }


        // Tahun yang memang sudah ada

        expenses.forEach(
            (expense) => {

                if (
                    !expense.expense_date
                ) {

                    return

                }


                const date =
                    new Date(
                        expense.expense_date
                    )


                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    yearSet.add(
                        date.getFullYear()
                    )

                }

            }
        )


        return Array.from(
            yearSet
        ).sort(
            (a, b) => b - a
        )

    }, [
        expenses,
        currentYear,
    ])


    // =====================================================
    // FILTER DATA
    // =====================================================

    const filteredExpenses =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase()


            return expenses.filter(
                (expense) => {

                    if (
                        !expense.expense_date
                    ) {

                        return false

                    }


                    const date =
                        new Date(
                            expense.expense_date
                        )


                    if (
                        Number.isNaN(
                            date.getTime()
                        )
                    ) {

                        return false

                    }


                    const expenseMonth =
                        date.getMonth() + 1

                    const expenseYear =
                        date.getFullYear()


                    // Filter bulan

                    if (
                        expenseMonth !==
                        selectedMonth
                    ) {

                        return false

                    }


                    // Filter tahun

                    if (
                        expenseYear !==
                        selectedYear
                    ) {

                        return false

                    }


                    // Search

                    if (!keyword) {

                        return true

                    }


                    const category =
                        String(
                            expense.category || ''
                        ).toLowerCase()


                    const description =
                        String(
                            expense.description || ''
                        ).toLowerCase()


                    return (
                        category.includes(
                            keyword
                        ) ||
                        description.includes(
                            keyword
                        )
                    )

                }
            )

        }, [
            expenses,
            selectedMonth,
            selectedYear,
            search,
        ])


    // =====================================================
    // TOTAL PENGELUARAN
    // =====================================================

    const totalExpense =
        filteredExpenses.reduce(
            (
                total,
                expense
            ) => {

                return (
                    total +
                    (
                        Number(
                            expense.amount
                        ) || 0
                    )
                )

            },
            0
        )


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
    // FORMAT TANGGAL
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
    // FORMAT ANGKA INPUT
    // =====================================================

    function formatInputNumber(value) {

        const number =
            Number(value)


        if (
            !Number.isFinite(number)
        ) {

            return ''

        }


        return new Intl.NumberFormat(
            'id-ID'
        ).format(number)

    }


    // =====================================================
    // HANDLE FORM CHANGE
    // =====================================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target


        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        )

    }


    // =====================================================
    // OPEN CREATE
    // =====================================================

    function openCreateModal() {

        const today =
            new Date()


        const year =
            today.getFullYear()


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, '0')


        const day =
            String(
                today.getDate()
            ).padStart(2, '0')


        setEditingId(null)


        setForm({

            expense_date:
                `${year}-${month}-${day}`,

            category: '',

            description: '',

            amount: '',

            bank_account_id: '',

        })


        setShowModal(true)

    }


    // =====================================================
    // OPEN EDIT
    // =====================================================

    function openEditModal(expense) {

        let expenseDate =
            ''


        if (
            expense.expense_date
        ) {

            const date =
                new Date(
                    expense.expense_date
                )


            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {

                const year =
                    date.getFullYear()


                const month =
                    String(
                        date.getMonth() + 1
                    ).padStart(2, '0')


                const day =
                    String(
                        date.getDate()
                    ).padStart(2, '0')


                expenseDate =
                    `${year}-${month}-${day}`

            }

        }


        setEditingId(
            expense.id
        )


        setForm({

            expense_date:
                expenseDate,

            category:
                expense.category || '',

            description:
                expense.description || '',

            amount:
                expense.amount
                    ? String(
                        Number(
                            expense.amount
                        )
                    )
                    : '',

            bank_account_id:
                expense.bank_account_id
                    ? String(
                        expense.bank_account_id
                    )
                    : '',

        })


        setShowModal(true)

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeModal() {

        if (saving) {

            return

        }


        setShowModal(false)

        setEditingId(null)

        setForm(
            emptyForm
        )

    }


    // =====================================================
    // SUBMIT FORM
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault()


        try {

            setSaving(true)

            setError('')


            // ============================
            // VALIDASI FRONTEND
            // ============================

            if (
                !form.expense_date ||
                !form.category ||
                !form.amount ||
                !form.bank_account_id
            ) {

                throw new Error(
                    'Tanggal, kategori, jumlah pengeluaran, dan rekening wajib diisi.'
                )

            }


            const amount =
                Number(
                    String(
                        form.amount
                    ).replace(
                        /\./g,
                        ''
                    )
                )


            if (
                !Number.isFinite(
                    amount
                ) ||
                amount <= 0
            ) {

                throw new Error(
                    'Jumlah pengeluaran harus lebih dari 0.'
                )

            }


            // ============================
            // PAYLOAD
            // ============================

            const payload = {

                expense_date:
                    form.expense_date,

                category:
                    form.category.trim(),

                description:
                    form.description.trim(),

                amount,

                bank_account_id:
                    Number(
                        form.bank_account_id
                    ),

            }


            let response


            // ============================
            // EDIT
            // ============================

            if (editingId) {

                response =
                    await updateExpense(
                        editingId,
                        payload
                    )

            }


            // ============================
            // CREATE
            // ============================

            else {

                response =
                    await createExpense(
                        payload
                    )

            }


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    'Gagal menyimpan pengeluaran.'
                )

            }


            closeModal()

            await loadExpenses()


        } catch (error) {

            console.error(
                'Save Expense Error:',
                error
            )


            setError(
                error.message ||
                'Gagal menyimpan pengeluaran.'
            )

        } finally {

            setSaving(false)

        }

    }


    // =====================================================
    // DELETE
    // =====================================================

    async function handleDelete(expense) {

        const confirmed =
            window.confirm(
                `Hapus pengeluaran "${expense.category}" sebesar ${formatRupiah(expense.amount)}?`
            )


        if (!confirmed) {

            return

        }


        try {

            setDeletingId(
                expense.id
            )

            setError('')


            const response =
                await deleteExpense(
                    expense.id
                )


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    'Gagal menghapus pengeluaran.'
                )

            }


            await loadExpenses()


        } catch (error) {

            console.error(
                'Delete Expense Error:',
                error
            )


            setError(
                error.message ||
                'Gagal menghapus pengeluaran.'
            )

        } finally {

            setDeletingId(null)

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

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                            <TrendingDown
                                size={22}
                                className="text-red-600"
                            />

                        </div>


                        <div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Pengeluaran
                            </h1>


                            <p className="mt-1 text-sm text-slate-500">
                                Kelola seluruh pengeluaran ADELINA KOST
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={
                        openCreateModal
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >

                    <Plus
                        size={18}
                    />

                    Tambah Pengeluaran

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm font-medium text-red-700">
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            setError('')
                        }
                        className="text-red-500 hover:text-red-700"
                    >

                        <X
                            size={18}
                        />

                    </button>

                </div>

            )}


            {/* =================================================
                FILTER
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                    {/* BULAN */}

                    <div className="relative">

                        <CalendarDays
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />


                        <select
                            value={
                                selectedMonth
                            }
                            onChange={(event) =>
                                setSelectedMonth(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            {monthNames.map(
                                (
                                    month,
                                    index
                                ) => (

                                    <option
                                        key={month}
                                        value={
                                            index + 1
                                        }
                                    >
                                        {month}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* TAHUN */}

                    <div>

                        <select
                            value={
                                selectedYear
                            }
                            onChange={(event) =>
                                setSelectedYear(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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


                    {/* SEARCH */}

                    <div className="relative">

                        <Search
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Cari kategori atau keterangan..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* TOTAL */}

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

                            <Wallet
                                size={21}
                                className="text-red-600"
                            />

                        </div>

                    </div>


                    <p className="mt-4 text-xs text-slate-500">

                        {monthNames[
                            selectedMonth - 1
                        ]}{' '}

                        {selectedYear}

                    </p>

                </div>


                {/* TRANSAKSI */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Jumlah Transaksi
                            </p>


                            <p className="mt-2 text-2xl font-bold text-slate-800">

                                {filteredExpenses.length}

                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                            <Receipt
                                size={21}
                                className="text-blue-600"
                            />

                        </div>

                    </div>


                    <p className="mt-4 text-xs text-slate-500">
                        Transaksi pengeluaran pada periode ini
                    </p>

                </div>


                {/* KATEGORI */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Kategori
                            </p>


                            <p className="mt-2 text-2xl font-bold text-slate-800">

                                {
                                    new Set(
                                        filteredExpenses.map(
                                            (item) =>
                                                item.category
                                        )
                                    ).size
                                }

                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">

                            <Tag
                                size={21}
                                className="text-purple-600"
                            />

                        </div>

                    </div>


                    <p className="mt-4 text-xs text-slate-500">
                        Kategori pengeluaran digunakan
                    </p>

                </div>

            </div>


            {/* =================================================
                PERIODE
            ================================================= */}

            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                <CalendarDays
                    size={17}
                    className="text-blue-600"
                />


                <p className="text-sm text-blue-700">

                    Pengeluaran periode:

                    <span className="ml-1 font-semibold">

                        {monthNames[
                            selectedMonth - 1
                        ]}{' '}

                        {selectedYear}

                    </span>

                </p>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                    <div>

                        <h2 className="font-semibold text-slate-800">
                            Daftar Pengeluaran
                        </h2>


                        <p className="mt-1 text-xs text-slate-500">
                            Semua pengeluaran pada periode yang dipilih
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            loadExpenses
                        }
                        disabled={
                            loading
                        }
                        title="Refresh"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
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


                {loading ? (

                    <div className="flex min-h-[300px] items-center justify-center">

                        <div className="text-center">

                            <RefreshCw
                                size={30}
                                className="mx-auto animate-spin text-blue-600"
                            />


                            <p className="mt-3 text-sm text-slate-500">
                                Memuat pengeluaran...
                            </p>

                        </div>

                    </div>

                ) : filteredExpenses.length === 0 ? (

                    <div className="p-10 text-center">

                        <Receipt
                            size={40}
                            className="mx-auto text-slate-300"
                        />


                        <p className="mt-3 text-sm font-medium text-slate-600">
                            Belum ada pengeluaran
                        </p>


                        <p className="mt-1 text-xs text-slate-400">

                            Tidak ada pengeluaran pada{' '}

                            {monthNames[
                                selectedMonth - 1
                            ]}{' '}

                            {selectedYear}.

                        </p>


                        <button
                            type="button"
                            onClick={
                                openCreateModal
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >

                            <Plus
                                size={17}
                            />

                            Tambah Pengeluaran

                        </button>

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


                                    <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500">
                                        Aksi
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {filteredExpenses.map(
                                    (expense) => (

                                        <tr
                                            key={
                                                expense.id
                                            }
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">

                                                {formatDate(
                                                    expense.expense_date
                                                )}

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">

                                                    {expense.category ||
                                                        '-'}

                                                </span>

                                            </td>


                                            <td className="max-w-[300px] px-5 py-4 text-slate-600">

                                                <p className="truncate">

                                                    {expense.description ||
                                                        '-'}

                                                </p>

                                            </td>


                                            <td className="whitespace-nowrap px-5 py-4 text-right">

                                                <span className="font-semibold text-red-600">

                                                    {formatRupiah(
                                                        expense.amount
                                                    )}

                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-center gap-2">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                expense
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            expense.id
                                                        }
                                                        title="Edit"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
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
                                                                expense
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            expense.id
                                                        }
                                                        title="Hapus"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >

                                                        {deletingId ===
                                                            expense.id ? (

                                                            <RefreshCw
                                                                size={16}
                                                                className="animate-spin"
                                                            />

                                                        ) : (

                                                            <Trash2
                                                                size={16}
                                                            />

                                                        )}

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

            </div>


            {/* =================================================
                MODAL CREATE / EDIT
            ================================================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">

                                    {editingId
                                        ? 'Edit Pengeluaran'
                                        : 'Tambah Pengeluaran'}

                                </h2>


                                <p className="mt-1 text-xs text-slate-500">
                                    Isi data pengeluaran ADELINA KOST
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="space-y-4 p-5">

                                {/* TANGGAL */}

                                <div>

                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                        Tanggal

                                        <span className="text-red-500">
                                            {' '}*
                                        </span>

                                    </label>


                                    <input
                                        type="date"
                                        name="expense_date"
                                        value={
                                            form.expense_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>


                                {/* KATEGORI */}

                                <div>

                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                        Kategori

                                        <span className="text-red-500">
                                            {' '}*
                                        </span>

                                    </label>


                                    <select
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >

                                        <option value="">
                                            Pilih kategori
                                        </option>


                                        <option value="WiFi">
                                            WiFi
                                        </option>


                                        <option value="Air">
                                            Air
                                        </option>


                                        <option value="Listrik">
                                            Listrik
                                        </option>


                                        <option value="Kebersihan">
                                            Kebersihan
                                        </option>


                                        <option value="Perbaikan">
                                            Perbaikan
                                        </option>


                                        <option value="Perabotan">
                                            Perabotan
                                        </option>


                                        <option value="CCTV">
                                            CCTV
                                        </option>


                                        <option value="Renovasi">
                                            Renovasi
                                        </option>


                                        <option value="Lainnya">
                                            Lainnya
                                        </option>

                                    </select>

                                </div>


                                {/* =================================================
                                    REKENING
                                ================================================= */}

                                <div>

                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                        Rekening

                                        <span className="text-red-500">
                                            {' '}*
                                        </span>

                                    </label>


                                    <select
                                        name="bank_account_id"
                                        value={
                                            form.bank_account_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >

                                        <option value="">
                                            Pilih rekening
                                        </option>


                                        {bankAccounts.map(
                                            (account) => (

                                                <option
                                                    key={
                                                        account.id
                                                    }
                                                    value={
                                                        account.id
                                                    }
                                                >

                                                    {account.bank_name}

                                                    {' - '}

                                                    {account.account_number}

                                                </option>

                                            )
                                        )}

                                    </select>


                                    {bankAccounts.length === 0 && (

                                        <p className="mt-1.5 text-xs text-red-500">

                                            Belum ada rekening aktif.

                                        </p>

                                    )}

                                </div>


                                {/* KETERANGAN */}

                                <div>

                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                        Keterangan

                                    </label>


                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="3"
                                        placeholder="Contoh: Pembayaran WiFi bulan Agustus"
                                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>


                                {/* JUMLAH */}

                                <div>

                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                        Jumlah Pengeluaran

                                        <span className="text-red-500">
                                            {' '}*
                                        </span>

                                    </label>


                                    <div className="relative">

                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                                            Rp
                                        </span>


                                        <input
                                            type="number"
                                            name="amount"
                                            value={
                                                form.amount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="1"
                                            step="1"
                                            required
                                            placeholder="0"
                                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>


                                    {form.amount && (

                                        <p className="mt-1.5 text-xs text-slate-400">

                                            {formatInputNumber(
                                                form.amount
                                            )}

                                        </p>

                                    )}

                                </div>

                            </div>


                            {/* MODAL FOOTER */}

                            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">

                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >

                                    Batal

                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        bankAccounts.length === 0
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {saving ? (

                                        <>

                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />

                                            Menyimpan...

                                        </>

                                    ) : (

                                        editingId
                                            ? 'Simpan Perubahan'
                                            : 'Simpan Pengeluaran'

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    )

}


export default Expenses