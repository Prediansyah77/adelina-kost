import { useEffect, useMemo, useState } from 'react'

import {
    BedDouble,
    Users,
    Wallet,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Receipt,
    RefreshCw,
    ArrowDownRight,
    CircleDollarSign,
    Home,
} from 'lucide-react'

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts'

import api from '../services/api'


// =====================================================
// FORMAT RUPIAH
// =====================================================

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0))
}


// =====================================================
// FORMAT ANGKA
// =====================================================

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(
        Number(value || 0)
    )
}


// =====================================================
// FORMAT TANGGAL
// =====================================================

function formatDate(date) {

    if (!date) {
        return '-'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
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
// BULAN
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


const monthShortNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
]


// =====================================================
// NORMALIZE BILL STATUS
// =====================================================

function normalizeBillStatus(status) {

    const normalized =
        String(status || '')
            .trim()
            .toLowerCase()

    if (normalized === 'paid') {
        return 'paid'
    }

    if (normalized === 'late') {
        return 'late'
    }

    return 'unpaid'
}


// =====================================================
// STATUS LABEL
// =====================================================

function getBillStatusLabel(status) {

    const normalized =
        normalizeBillStatus(status)

    if (normalized === 'paid') {
        return 'LUNAS'
    }

    if (normalized === 'late') {
        return 'TERLAMBAT'
    }

    return 'BELUM BAYAR'
}


// =====================================================
// STATUS CLASS
// =====================================================

function getBillStatusClass(status) {

    const normalized =
        normalizeBillStatus(status)

    if (normalized === 'paid') {
        return 'bg-emerald-50 text-emerald-700'
    }

    if (normalized === 'late') {
        return 'bg-red-50 text-red-700'
    }

    return 'bg-amber-50 text-amber-700'
}


// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({
    icon: Icon,
    title,
    description,
}) {

    return (
        <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">

                <Icon
                    size={22}
                    className="text-slate-400"
                />

            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
                {title}
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                {description}
            </p>

        </div>
    )
}


// =====================================================
// STAT CARD
// =====================================================

function DashboardCard({
    title,
    value,
    description,
    icon: Icon,
    iconClass = 'bg-slate-100 text-slate-600',
}) {

    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>

                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >

                    <Icon size={20} />

                </div>

            </div>

        </div>
    )
}


// =====================================================
// TOOLTIP
// =====================================================

function FinancialTooltip({
    active,
    payload,
    label,
}) {

    if (
        !active ||
        !payload ||
        !payload.length
    ) {
        return null
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl">

            <p className="mb-3 text-sm font-semibold text-slate-800">
                {label}
            </p>

            <div className="space-y-2">

                {payload.map((item) => (

                    <div
                        key={item.dataKey}
                        className="flex items-center justify-between gap-6 text-sm"
                    >

                        <span className="text-slate-500">
                            {item.name}
                        </span>

                        <span className="font-semibold text-slate-800">
                            {formatRupiah(item.value)}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    )
}


// =====================================================
// DASHBOARD
// =====================================================

function AdminDashboard() {

    // =================================================
    // STATE
    // =================================================

    const [loading, setLoading] =
        useState(true)

    const [refreshing, setRefreshing] =
        useState(false)

    const [error, setError] =
        useState('')

    const [rooms, setRooms] =
        useState([])

    const [payments, setPayments] =
        useState([])

    const [expenses, setExpenses] =
        useState([])

    const [bills, setBills] =
        useState([])

    const [dashboardSummary, setDashboardSummary] =
        useState(null)

    const [lastUpdated, setLastUpdated] =
        useState(null)


    // =================================================
    // CURRENT PERIOD
    // =================================================

    const currentPeriod =
        useMemo(() => {

            const now = new Date()

            return {
                month:
                    now.getMonth() + 1,

                year:
                    now.getFullYear(),

                label:
                    `${monthNames[now.getMonth()]} ${now.getFullYear()}`,
            }

        }, [])


    // =================================================
    // LOAD DASHBOARD
    // =================================================

    const loadDashboard = async ({
        showLoading = true,
    } = {}) => {

        try {

            if (showLoading) {
                setLoading(true)
            } else {
                setRefreshing(true)
            }

            setError('')


            // =============================================
            // REQUEST DATA
            // =============================================

            const results =
                await Promise.allSettled([

                    // SUMMARY
                    api.get(
                        '/dashboard/summary'
                    ),

                    // ROOMS
                    api.get(
                        '/rooms'
                    ),

                    // PAYMENTS
                    api.get(
                        '/payments'
                    ),

                    // EXPENSES
                    api.get(
                        '/expenses'
                    ),

                    // BILLS PERIODE BERJALAN
                    api.get(
                        '/bills',
                        {
                            params: {
                                month:
                                    currentPeriod.month,

                                year:
                                    currentPeriod.year,
                            },
                        }
                    ),

                ])


            // =================================================
            // DASHBOARD SUMMARY
            // =================================================

            const summaryResponse =
                results[0]

            if (
                summaryResponse.status ===
                'fulfilled' &&
                summaryResponse.value?.data?.success
            ) {

                setDashboardSummary(
                    summaryResponse
                        .value
                        .data
                        .data
                )

            } else {

                console.error(
                    'Dashboard Summary Error:',
                    summaryResponse
                )

                setDashboardSummary(null)
            }


            // =================================================
            // ROOMS
            // =================================================

            const roomsResponse =
                results[1]

            if (
                roomsResponse.status ===
                'fulfilled' &&
                roomsResponse.value?.data?.success
            ) {

                const roomData =
                    roomsResponse
                        .value
                        .data
                        .data

                setRooms(
                    Array.isArray(roomData)
                        ? roomData
                        : []
                )

            } else {

                console.error(
                    'Dashboard Rooms Error:',
                    roomsResponse
                )

                setRooms([])
            }


            // =================================================
            // PAYMENTS
            // =================================================

            const paymentsResponse =
                results[2]

            if (
                paymentsResponse.status ===
                'fulfilled' &&
                paymentsResponse.value?.data?.success
            ) {

                const paymentData =
                    paymentsResponse
                        .value
                        .data
                        .data

                setPayments(
                    Array.isArray(paymentData)
                        ? paymentData
                        : []
                )

            } else {

                console.error(
                    'Dashboard Payments Error:',
                    paymentsResponse
                )

                setPayments([])
            }


            // =================================================
            // EXPENSES
            // =================================================

            const expensesResponse =
                results[3]

            if (
                expensesResponse.status ===
                'fulfilled' &&
                expensesResponse.value?.data?.success
            ) {

                const expenseData =
                    expensesResponse
                        .value
                        .data
                        .data

                setExpenses(
                    Array.isArray(expenseData)
                        ? expenseData
                        : []
                )

            } else {

                console.error(
                    'Dashboard Expenses Error:',
                    expensesResponse
                )

                setExpenses([])
            }


            // =================================================
            // BILLS
            // =================================================

            const billsResponse =
                results[4]

            if (
                billsResponse.status ===
                'fulfilled' &&
                billsResponse.value?.data?.success
            ) {

                const billData =
                    billsResponse
                        .value
                        .data
                        .data

                const normalizedBills =
                    (
                        Array.isArray(
                            billData
                        )
                            ? billData
                            : []
                    ).map(
                        bill => ({
                            ...bill,

                            status:
                                normalizeBillStatus(
                                    bill.status
                                ),
                        })
                    )

                setBills(
                    normalizedBills
                )

            } else {

                console.error(
                    'Dashboard Bills Error:',
                    billsResponse
                )

                setBills([])
            }


            setLastUpdated(
                new Date()
            )

        } catch (error) {

            console.error(
                'Dashboard Load Error:',
                error
            )

            setError(
                error.response?.data?.message ||
                error.message ||
                'Gagal mengambil data dashboard'
            )

        } finally {

            setLoading(false)
            setRefreshing(false)

        }
    }


    // =================================================
    // INITIAL LOAD
    // =================================================

    useEffect(() => {

        loadDashboard({
            showLoading: true,
        })

    }, [])


    // =================================================
    // AUTO REFRESH
    // =================================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                loadDashboard({
                    showLoading: false,
                })

            }, 60000)


        return () => {

            clearInterval(interval)

        }

    }, [])


    // =================================================
    // REFRESH BUTTON
    // =================================================

    const handleRefresh = () => {

        loadDashboard({
            showLoading: false,
        })

    }


    // =================================================
    // ROOM SUMMARY
    // =================================================

    const roomSummary =
        useMemo(() => {

            if (
                dashboardSummary?.rooms
            ) {

                return {

                    totalRooms:
                        Number(
                            dashboardSummary
                                .rooms
                                .total
                        ) || 0,

                    occupiedRooms:
                        Number(
                            dashboardSummary
                                .rooms
                                .occupied
                        ) || 0,

                    availableRooms:
                        Number(
                            dashboardSummary
                                .rooms
                                .available
                        ) || 0,

                    occupancyRate:
                        Number(
                            dashboardSummary
                                .rooms
                                .occupancy_rate
                        ) || 0,

                }
            }


            const totalRooms =
                rooms.length


            const occupiedRooms =
                rooms.filter(
                    room =>
                        room.status ===
                        'occupied'
                ).length


            const availableRooms =
                rooms.filter(
                    room =>
                        room.status ===
                        'available'
                ).length


            const occupancyRate =
                totalRooms > 0
                    ? (
                        occupiedRooms /
                        totalRooms
                    ) * 100
                    : 0


            return {

                totalRooms,

                occupiedRooms,

                availableRooms,

                occupancyRate:
                    Number(
                        occupancyRate.toFixed(1)
                    ),

            }

        }, [
            dashboardSummary,
            rooms,
        ])


    // =================================================
    // MONTHLY PAYMENTS
    // =================================================

    // =====================================================
    // MONTHLY VERIFIED PAYMENTS
    // =====================================================
    // Hanya pembayaran yang SUDAH DIVERIFIKASI admin
    // yang dianggap sebagai uang masuk.
    //
    // pending  -> belum menjadi pendapatan
    // rejected -> bukan pendapatan
    // verified -> pendapatan
    // =====================================================

    const monthlyPayments =
        useMemo(() => {

            return payments.filter(
                payment => {

                    // Hanya pembayaran verified
                    if (
                        String(
                            payment.status || ''
                        ).toLowerCase() !== 'verified'
                    ) {
                        return false
                    }

                    if (
                        !payment.payment_date
                    ) {
                        return false
                    }

                    const date =
                        new Date(
                            payment.payment_date
                        )

                    return (
                        date.getMonth() + 1 ===
                        currentPeriod.month &&
                        date.getFullYear() ===
                        currentPeriod.year
                    )

                }
            )

        }, [
            payments,
            currentPeriod,
        ])


    // =================================================
    // MONTHLY INCOME
    // =================================================

    const monthlyIncome =
        useMemo(() => {

            return monthlyPayments.reduce(
                (
                    total,
                    payment
                ) => {

                    return (
                        total +
                        Number(
                            payment.amount || 0
                        )
                    )

                },
                0
            )

        }, [
            monthlyPayments,
        ])


    // =================================================
    // MONTHLY EXPENSES
    // =================================================

    const monthlyExpenses =
        useMemo(() => {

            return expenses.filter(
                expense => {

                    if (
                        !expense.expense_date
                    ) {
                        return false
                    }


                    const date =
                        new Date(
                            expense.expense_date
                        )


                    return (
                        date.getMonth() + 1 ===
                        currentPeriod.month &&
                        date.getFullYear() ===
                        currentPeriod.year
                    )

                }
            )

        }, [
            expenses,
            currentPeriod,
        ])


    // =================================================
    // MONTHLY EXPENSE
    // =================================================

    const monthlyExpense =
        useMemo(() => {

            return monthlyExpenses.reduce(
                (
                    total,
                    expense
                ) => {

                    return (
                        total +
                        Number(
                            expense.amount || 0
                        )
                    )

                },
                0
            )

        }, [
            monthlyExpenses,
        ])


    // =================================================
    // MONTHLY PROFIT
    // =================================================

    const monthlyProfit =
        monthlyIncome -
        monthlyExpense


    // =================================================
    // PAYMENT BILL ID
    // =================================================

    const getPaymentBillId =
        (payment) => {

            return (
                payment?.bill_id ??
                payment?.bill?.id ??
                null
            )

        }


    // =================================================
    // PAYMENT TENANT ID
    // =================================================

    const getPaymentTenantId =
        (payment) => {

            return (
                payment?.tenant_id ??
                payment?.tenant?.id ??
                null
            )

        }


    // =================================================
    // TOTAL PAID PER BILL
    // =================================================

    // =====================================================
    // TOTAL VERIFIED PAID PER BILL
    // =====================================================

    const getTotalPaidForBill =
        (billId) => {

            if (
                billId === null ||
                billId === undefined ||
                billId === ''
            ) {
                return 0
            }

            return payments.reduce(
                (
                    total,
                    payment
                ) => {

                    // Pending dan rejected tidak dihitung
                    if (
                        String(
                            payment.status || ''
                        ).toLowerCase() !== 'verified'
                    ) {
                        return total
                    }

                    const paymentBillId =
                        getPaymentBillId(
                            payment
                        )

                    if (
                        paymentBillId === null ||
                        paymentBillId === undefined ||
                        Number(
                            paymentBillId
                        ) !== Number(
                            billId
                        )
                    ) {
                        return total
                    }

                    return (
                        total +
                        Number(
                            payment.amount || 0
                        )
                    )

                },
                0
            )

        }


    // =================================================
    // SINKRONISASI BILL + PAYMENT
    // =================================================
    //
    // INI BAGIAN UTAMA PERBAIKAN.
    //
    // Endpoint /bills hanya mengembalikan kontrak
    // yang statusnya masih active.
    //
    // Kalau sebuah pembayaran sudah ada tetapi bill
    // tidak ikut dikembalikan endpoint karena kondisi
    // kontrak, pembayaran tersebut tetap harus dianggap
    // sebagai pembayaran untuk periode berjalan.
    //
    // Jadi:
    //
    // BILL ADA
    //     -> gunakan bill asli
    //
    // BILL TIDAK ADA
    //     -> cari payment dengan bill_id
    //     -> buat virtual bill untuk dashboard
    //
    // Fitur database TIDAK diubah.
    // Hanya sinkronisasi tampilan dashboard.
    // =================================================

    const dashboardBills =
        useMemo(() => {

            const result = [
                ...bills
            ]


            const existingBillIds =
                new Set(
                    bills
                        .map(
                            bill =>
                                Number(
                                    bill.id
                                )
                        )
                        .filter(
                            id =>
                                Number.isFinite(
                                    id
                                )
                        )
                )


            // =============================================
            // CARI PAYMENT BULAN BERJALAN
            // =============================================

            const currentPayments =
                monthlyPayments


            // =============================================
            // TAMBAHKAN BILL YANG HILANG
            // =============================================

            currentPayments.forEach(
                payment => {

                    const paymentBillId =
                        getPaymentBillId(
                            payment
                        )


                    // Tanpa bill_id tidak bisa
                    // dipastikan tagihan mana.
                    if (
                        paymentBillId === null ||
                        paymentBillId === undefined ||
                        paymentBillId === ''
                    ) {
                        return
                    }


                    const numericBillId =
                        Number(
                            paymentBillId
                        )


                    // Bill sudah ada
                    if (
                        existingBillIds.has(
                            numericBillId
                        )
                    ) {
                        return
                    }


                    // =========================================
                    // BUAT VIRTUAL BILL
                    // =========================================

                    result.push({

                        id:
                            paymentBillId,

                        bill_id:
                            paymentBillId,

                        contract_id:
                            payment.contract_id ??
                            payment.bill?.contract_id ??
                            null,

                        tenant_id:
                            getPaymentTenantId(
                                payment
                            ),

                        room_id:
                            payment.room_id ??
                            payment.room?.id ??
                            null,

                        tenant_name:
                            payment.tenant_name ??
                            payment.tenant?.name ??
                            'Penghuni',

                        room_number:
                            payment.room_number ??
                            payment.room?.room_number ??
                            '-',

                        billing_month:
                            currentPeriod.month,

                        billing_year:
                            currentPeriod.year,

                        amount:
                            Number(
                                payment.amount || 0
                            ),

                        due_date:
                            payment.due_date ??
                            payment.bill?.due_date ??
                            payment.payment_date,

                        status:
                            'paid',

                        is_virtual:
                            true,

                    })


                    existingBillIds.add(
                        numericBillId
                    )

                }
            )


            return result

        }, [
            bills,
            monthlyPayments,
            currentPeriod,
        ])


    // =================================================
    // EFFECTIVE BILL STATUS
    // =================================================
    //
    // Prioritas:
    //
    // 1. status paid
    // 2. total pembayaran >= nominal tagihan
    // 3. late
    // 4. unpaid
    //
    // =================================================

    const getEffectiveBillStatus =
        (bill) => {

            if (!bill) {
                return 'unpaid'
            }


            const databaseStatus =
                normalizeBillStatus(
                    bill.status
                )


            const billAmount =
                Number(
                    bill.amount || 0
                )


            const totalPaid =
                getTotalPaidForBill(
                    bill.id
                )


            // =============================================
            // STATUS PAID DARI DATABASE
            // =============================================

            if (
                databaseStatus ===
                'paid'
            ) {

                return 'paid'

            }


            // =============================================
            // PEMBAYARAN SUDAH MENUTUP TAGIHAN
            // =============================================

            if (
                billAmount > 0 &&
                totalPaid >= billAmount
            ) {

                return 'paid'

            }


            // =============================================
            // LATE
            // =============================================

            if (
                databaseStatus ===
                'late'
            ) {

                return 'late'

            }


            // =============================================
            // DEFAULT
            // =============================================

            return 'unpaid'

        }


    // =================================================
    // BILL STATUS SUMMARY
    // =================================================

    const billStatusSummary =
        useMemo(() => {

            const summary = {

                paid: 0,

                unpaid: 0,

                late: 0,

            }


            dashboardBills.forEach(
                bill => {

                    const status =
                        getEffectiveBillStatus(
                            bill
                        )


                    if (
                        status ===
                        'paid'
                    ) {

                        summary.paid += 1

                    } else if (
                        status ===
                        'late'
                    ) {

                        summary.late += 1

                    } else {

                        summary.unpaid += 1

                    }

                }
            )


            return summary

        }, [
            dashboardBills,
            payments,
        ])


    const paidInvoices =
        billStatusSummary.paid


    const unpaidInvoices =
        billStatusSummary.unpaid


    const lateInvoices =
        billStatusSummary.late


    // =================================================
    // MONTHLY FINANCIAL CHART
    // =================================================

    const monthlyFinancialData =
        useMemo(() => {

            const now =
                new Date()

            const result = []


            for (
                let offset = 5;
                offset >= 0;
                offset--
            ) {

                const date =
                    new Date(
                        now.getFullYear(),
                        now.getMonth() -
                        offset,
                        1
                    )


                const month =
                    date.getMonth() + 1


                const year =
                    date.getFullYear()


                // =========================================
                // INCOME
                // =========================================

                // =========================================
                // INCOME
                // =========================================
                // Hanya pembayaran verified yang menjadi
                // pendapatan aktual.
                // =========================================

                const income =
                    payments
                        .filter(
                            payment => {

                                if (
                                    String(
                                        payment.status || ''
                                    ).toLowerCase() !== 'verified'
                                ) {
                                    return false
                                }

                                if (
                                    !payment.payment_date
                                ) {
                                    return false
                                }

                                const paymentDate =
                                    new Date(
                                        payment.payment_date
                                    )

                                return (
                                    paymentDate.getMonth() + 1 ===
                                    month &&
                                    paymentDate.getFullYear() ===
                                    year
                                )

                            }
                        )
                        .reduce(
                            (
                                total,
                                payment
                            ) => {

                                return (
                                    total +
                                    Number(
                                        payment.amount || 0
                                    )
                                )

                            },
                            0
                        )


                // =========================================
                // EXPENSE
                // =========================================

                const expense =
                    expenses
                        .filter(
                            item => {

                                if (
                                    !item.expense_date
                                ) {
                                    return false
                                }


                                const expenseDate =
                                    new Date(
                                        item.expense_date
                                    )


                                return (
                                    expenseDate.getMonth() + 1 ===
                                    month &&
                                    expenseDate.getFullYear() ===
                                    year
                                )

                            }
                        )
                        .reduce(
                            (
                                total,
                                item
                            ) => {

                                return (
                                    total +
                                    Number(
                                        item.amount ||
                                        0
                                    )
                                )

                            },
                            0
                        )


                result.push({

                    month:
                        monthShortNames[
                        month - 1
                        ],

                    income,

                    expense,

                    profit:
                        income -
                        expense,

                })

            }


            return result

        }, [
            payments,
            expenses,
        ])


    // =================================================
    // ROOM OCCUPANCY
    // =================================================

    const roomOccupancyData =
        useMemo(() => {

            return [

                {
                    name: 'Terisi',

                    value:
                        roomSummary
                            .occupiedRooms,
                },

                {
                    name: 'Kosong',

                    value:
                        roomSummary
                            .availableRooms,
                },

            ]

        }, [
            roomSummary,
        ])


    // =================================================
    // RECENT PAYMENTS
    // =================================================

    const recentPayments =
        useMemo(() => {

            return [
                ...payments
            ]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.payment_date
                        ) -
                        new Date(
                            a.payment_date
                        )
                )
                .slice(
                    0,
                    5
                )

        }, [
            payments,
        ])


    // =================================================
    // ACTIVE TENANTS
    // =================================================

    const activeTenants =
        useMemo(() => {

            // ============================================================
            // PENGHUNI AKTIF
            // ============================================================
            // Penghuni aktif ditentukan berdasarkan jumlah KONTRAK ACTIVE.
            //
            // Jangan menggunakan:
            // dashboardSummary.tenants.total
            //
            // Karena tenants.total menghitung seluruh data penghuni,
            // termasuk penghuni yang sudah tidak memiliki kontrak aktif.
            // ============================================================

            if (
                dashboardSummary?.contracts
            ) {

                return Number(
                    dashboardSummary
                        .contracts
                        .active
                ) || 0;

            }


            // ============================================================
            // FALLBACK
            // ============================================================
            // Jika dashboardSummary belum tersedia,
            // gunakan jumlah kamar yang sedang occupied.
            //
            // Ini hanya fallback agar tampilan tidak error
            // ketika data dashboard belum selesai dimuat.
            // ============================================================

            return rooms.filter(
                room =>
                    room.status === "occupied"
            ).length;

        }, [
            dashboardSummary,
            rooms,
        ]);


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <div className="space-y-6">

                <div className="flex items-center justify-between">

                    <div>

                        <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />

                        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />

                    </div>

                </div>


                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {Array.from({
                        length: 8,
                    }).map(
                        (_, index) => (

                            <div
                                key={index}
                                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
                            />

                        )
                    )}

                </div>


                <div className="grid gap-6 xl:grid-cols-3">

                    <div className="h-96 animate-pulse rounded-2xl bg-white xl:col-span-2" />

                    <div className="h-96 animate-pulse rounded-2xl bg-white" />

                </div>

            </div>

        )
    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="space-y-6 pb-8">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Dashboard
                        </h1>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {currentPeriod.label}
                        </span>

                    </div>


                    <p className="mt-1 text-sm text-slate-500">
                        Ringkasan operasional dan keuangan ADELINA KOST
                    </p>


                    {lastUpdated && (

                        <p className="mt-2 text-xs text-slate-400">

                            Data diperbarui{' '}

                            {lastUpdated.toLocaleTimeString(
                                'id-ID',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}

                        </p>

                    )}

                </div>


                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? 'animate-spin'
                                : ''
                        }
                    />

                    {refreshing
                        ? 'Memperbarui...'
                        : 'Refresh Data'}

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div>

                            <p className="font-semibold text-red-800">
                                Gagal memuat sebagian data
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                ROOM OVERVIEW
            ================================================= */}

            <div>

                <div className="mb-3">

                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Operasional
                    </h2>

                </div>


                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <DashboardCard
                        title="Total Kamar"
                        value={formatNumber(
                            roomSummary.totalRooms
                        )}
                        description="Seluruh kamar terdaftar"
                        icon={BedDouble}
                        iconClass="bg-blue-50 text-blue-600"
                    />


                    <DashboardCard
                        title="Kamar Terisi"
                        value={formatNumber(
                            roomSummary.occupiedRooms
                        )}
                        description="Sedang ditempati"
                        icon={Users}
                        iconClass="bg-emerald-50 text-emerald-600"
                    />


                    <DashboardCard
                        title="Kamar Kosong"
                        value={formatNumber(
                            roomSummary.availableRooms
                        )}
                        description="Siap disewakan"
                        icon={Home}
                        iconClass="bg-slate-100 text-slate-600"
                    />


                    <DashboardCard
                        title="Occupancy Rate"
                        value={`${roomSummary.occupancyRate}%`}
                        description="Tingkat hunian saat ini"
                        icon={TrendingUp}
                        iconClass="bg-violet-50 text-violet-600"
                    />

                </div>

            </div>


            {/* =================================================
                FINANCIAL OVERVIEW
            ================================================= */}

            <div>

                <div className="mb-3">

                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Keuangan Bulan Ini
                    </h2>

                </div>


                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <DashboardCard
                        title="Pendapatan"
                        value={formatRupiah(
                            monthlyIncome
                        )}
                        description={`${monthlyPayments.length} transaksi pembayaran`}
                        icon={Wallet}
                        iconClass="bg-emerald-50 text-emerald-600"
                    />


                    <DashboardCard
                        title="Pengeluaran"
                        value={formatRupiah(
                            monthlyExpense
                        )}
                        description={`${monthlyExpenses.length} transaksi pengeluaran`}
                        icon={Receipt}
                        iconClass="bg-rose-50 text-rose-600"
                    />


                    <DashboardCard
                        title="Laba Operasional"
                        value={formatRupiah(
                            monthlyProfit
                        )}
                        description="Pendapatan dikurangi pengeluaran"
                        icon={
                            monthlyProfit >= 0
                                ? TrendingUp
                                : TrendingDown
                        }
                        iconClass={
                            monthlyProfit >= 0
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-red-50 text-red-600'
                        }
                    />


                    <DashboardCard
                        title="Tagihan Belum Bayar"
                        value={formatNumber(
                            unpaidInvoices
                        )}
                        description={
                            unpaidInvoices > 0
                                ? `${unpaidInvoices} penghuni belum melunasi`
                                : 'Semua tagihan telah lunas'
                        }
                        icon={AlertCircle}
                        iconClass={
                            unpaidInvoices > 0
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-emerald-50 text-emerald-600'
                        }
                    />

                </div>

            </div>


            {/* =================================================
                QUICK SUMMARY
            ================================================= */}

            <div className="grid gap-4 md:grid-cols-2">


                {/* PEMBAYARAN */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-semibold text-slate-800">
                                Pembayaran Bulan Ini
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Transaksi yang sudah masuk
                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">

                            <CircleDollarSign
                                size={20}
                                className="text-emerald-600"
                            />

                        </div>

                    </div>


                    <div className="mt-5 flex items-end justify-between">

                        <div>

                            <p className="text-3xl font-bold text-slate-900">
                                {formatNumber(
                                    monthlyPayments.length
                                )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                transaksi
                            </p>

                        </div>


                        <p className="text-sm font-bold text-emerald-600">
                            {formatRupiah(
                                monthlyIncome
                            )}
                        </p>

                    </div>

                </div>


                {/* TAGIHAN */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-semibold text-slate-800">
                                Tagihan Periode Berjalan
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {currentPeriod.label}
                            </p>

                        </div>


                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">

                            <Receipt
                                size={20}
                                className="text-amber-600"
                            />

                        </div>

                    </div>


                    <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-emerald-50 p-3">

                            <p className="text-xs font-medium text-emerald-600">
                                Lunas
                            </p>

                            <p className="mt-1 text-xl font-bold text-emerald-700">
                                {formatNumber(
                                    paidInvoices
                                )}
                            </p>

                        </div>


                        <div className="rounded-xl bg-amber-50 p-3">

                            <p className="text-xs font-medium text-amber-600">
                                Belum Bayar
                            </p>

                            <p className="mt-1 text-xl font-bold text-amber-700">
                                {formatNumber(
                                    unpaidInvoices
                                )}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                CHART
            ================================================= */}

            <div className="grid gap-6 xl:grid-cols-3">


                {/* FINANCIAL CHART */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Pendapatan & Pengeluaran
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Perkembangan keuangan 6 bulan terakhir
                            </p>

                        </div>


                        <div className="rounded-xl bg-slate-50 px-4 py-2">

                            <p className="text-xs text-slate-500">
                                Laba bulan ini
                            </p>

                            <p
                                className={`mt-0.5 text-sm font-bold ${monthlyProfit >= 0
                                    ? 'text-emerald-600'
                                    : 'text-red-600'
                                    }`}
                            >
                                {formatRupiah(
                                    monthlyProfit
                                )}
                            </p>

                        </div>

                    </div>


                    <div className="mt-6 h-80">

                        {monthlyFinancialData.length === 0 ? (

                            <EmptyState
                                icon={TrendingUp}
                                title="Belum ada data keuangan"
                                description="Data grafik akan muncul setelah terdapat transaksi."
                            />

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={
                                        monthlyFinancialData
                                    }
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 10,
                                        bottom: 0,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                        vertical={false}
                                    />


                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: '#64748b',
                                            fontSize: 12,
                                        }}
                                    />


                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: '#64748b',
                                            fontSize: 12,
                                        }}
                                        tickFormatter={(value) => {

                                            if (
                                                value >=
                                                1000000
                                            ) {

                                                return `${(
                                                    value /
                                                    1000000
                                                ).toFixed(0)}jt`

                                            }


                                            if (
                                                value >=
                                                1000
                                            ) {

                                                return `${(
                                                    value /
                                                    1000
                                                ).toFixed(0)}rb`

                                            }


                                            return value

                                        }}
                                    />


                                    <Tooltip
                                        content={
                                            <FinancialTooltip />
                                        }
                                    />


                                    <Legend />


                                    <Line
                                        type="monotone"
                                        dataKey="income"
                                        name="Pendapatan"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />


                                    <Line
                                        type="monotone"
                                        dataKey="expense"
                                        name="Pengeluaran"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />


                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        name="Laba"
                                        stroke="#16a34a"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        )}

                    </div>

                </div>


                {/* OCCUPANCY CHART */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Hunian Kamar
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Kondisi kamar saat ini
                        </p>

                    </div>


                    <div className="mt-4 h-72">

                        {roomSummary.totalRooms === 0 ? (

                            <EmptyState
                                icon={BedDouble}
                                title="Belum ada kamar"
                                description="Tambahkan kamar untuk melihat statistik hunian."
                            />

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>

                                    <Pie
                                        data={
                                            roomOccupancyData
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        outerRadius={90}
                                        innerRadius={58}
                                        paddingAngle={3}
                                        label={({
                                            name,
                                            value,
                                        }) =>
                                            `${name}: ${value}`
                                        }
                                    >

                                        <Cell
                                            fill="#2563eb"
                                        />

                                        <Cell
                                            fill="#cbd5e1"
                                        />

                                    </Pie>


                                    <Tooltip
                                        formatter={(
                                            value
                                        ) =>
                                            `${value} kamar`
                                        }
                                    />


                                    <Legend
                                        verticalAlign="bottom"
                                    />

                                </PieChart>

                            </ResponsiveContainer>

                        )}

                    </div>


                    <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-blue-50 p-3 text-center">

                            <p className="text-xs text-blue-600">
                                Terisi
                            </p>

                            <p className="mt-1 text-lg font-bold text-blue-800">
                                {roomSummary.occupiedRooms}
                            </p>

                        </div>


                        <div className="rounded-xl bg-slate-50 p-3 text-center">

                            <p className="text-xs text-slate-500">
                                Kosong
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-800">
                                {roomSummary.availableRooms}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                RECENT PAYMENTS
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-200 p-5">

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Pembayaran Terbaru
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Transaksi pembayaran terakhir
                        </p>

                    </div>


                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                        <ArrowDownRight
                            size={20}
                            className="text-emerald-600"
                        />

                    </div>

                </div>


                {recentPayments.length === 0 ? (

                    <EmptyState
                        icon={Wallet}
                        title="Belum ada pembayaran"
                        description="Belum terdapat transaksi pembayaran pada sistem."
                    />

                ) : (

                    <div className="divide-y divide-slate-100">

                        {recentPayments.map(
                            payment => (

                                <div
                                    key={
                                        payment.id
                                    }
                                    className="flex items-center justify-between gap-4 p-5 transition hover:bg-slate-50"
                                >

                                    <div className="min-w-0">

                                        <p className="truncate font-semibold text-slate-800">

                                            {
                                                payment.tenant_name ||
                                                payment.tenant?.name ||
                                                'Penghuni'
                                            }

                                        </p>


                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                                            <span>
                                                Kamar{' '}
                                                {
                                                    payment.room_number ||
                                                    payment.room?.room_number ||
                                                    '-'
                                                }
                                            </span>


                                            <span>
                                                •
                                            </span>


                                            <span>

                                                {
                                                    formatDate(
                                                        payment.payment_date
                                                    )
                                                }

                                            </span>

                                        </div>

                                    </div>


                                    <div className="shrink-0 text-right">

                                        <p className="font-semibold text-emerald-600">

                                            +

                                            {formatRupiah(
                                                payment.amount
                                            )}

                                        </p>


                                        <span
                                            className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${payment.status === "pending"
                                                ? "bg-yellow-50 text-yellow-700"
                                                : payment.status === "verified"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : payment.status === "rejected"
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {payment.status === "pending"
                                                ? "Menunggu Verifikasi"
                                                : payment.status === "verified"
                                                    ? "Diterima"
                                                    : payment.status === "rejected"
                                                        ? "Ditolak"
                                                        : payment.status}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* =================================================
                BILL SUMMARY
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Tagihan Periode Berjalan
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Ringkasan tagihan {currentPeriod.label}
                        </p>

                    </div>


                    <div className="flex gap-3">


                        {/* LUNAS */}

                        <div className="rounded-xl bg-emerald-50 px-4 py-2 text-center">

                            <p className="text-xs text-emerald-600">
                                Lunas
                            </p>

                            <p className="mt-0.5 font-bold text-emerald-700">
                                {formatNumber(
                                    paidInvoices
                                )}
                            </p>

                        </div>


                        {/* BELUM BAYAR */}

                        <div className="rounded-xl bg-amber-50 px-4 py-2 text-center">

                            <p className="text-xs text-amber-600">
                                Belum Bayar
                            </p>

                            <p className="mt-0.5 font-bold text-amber-700">
                                {formatNumber(
                                    unpaidInvoices
                                )}
                            </p>

                        </div>


                        {/* TERLAMBAT */}

                        {lateInvoices > 0 && (

                            <div className="rounded-xl bg-red-50 px-4 py-2 text-center">

                                <p className="text-xs text-red-600">
                                    Terlambat
                                </p>

                                <p className="mt-0.5 font-bold text-red-700">
                                    {formatNumber(
                                        lateInvoices
                                    )}
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {dashboardBills.length === 0 ? (

                    <EmptyState
                        icon={Receipt}
                        title="Tidak ada tagihan"
                        description="Belum terdapat tagihan pada periode berjalan."
                    />

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Penghuni
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Kamar
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Tagihan
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Jatuh Tempo
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {dashboardBills
                                    .slice(
                                        0,
                                        8
                                    )
                                    .map(
                                        bill => {

                                            const effectiveStatus =
                                                getEffectiveBillStatus(
                                                    bill
                                                )


                                            return (

                                                <tr
                                                    key={
                                                        `${bill.id}-${bill.is_virtual ? 'virtual' : 'real'}`
                                                    }
                                                    className="border-t border-slate-100 transition hover:bg-slate-50"
                                                >

                                                    <td className="px-5 py-4 font-semibold text-slate-800">

                                                        {
                                                            bill.tenant_name ||
                                                            '-'
                                                        }

                                                    </td>


                                                    <td className="px-5 py-4 text-slate-500">

                                                        {
                                                            bill.room_number ||
                                                            '-'
                                                        }

                                                    </td>


                                                    <td className="px-5 py-4 font-semibold text-slate-800">

                                                        {formatRupiah(
                                                            bill.amount
                                                        )}

                                                    </td>


                                                    <td className="px-5 py-4 text-slate-500">

                                                        {formatDate(
                                                            bill.due_date
                                                        )}

                                                    </td>


                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getBillStatusClass(
                                                                effectiveStatus
                                                            )}`}
                                                        >

                                                            {
                                                                getBillStatusLabel(
                                                                    effectiveStatus
                                                                )
                                                            }

                                                        </span>

                                                    </td>

                                                </tr>

                                            )

                                        }
                                    )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                        <Home
                            size={19}
                            className="text-blue-600"
                        />

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-slate-800">
                            ADELINA KOST
                        </p>

                        <p className="text-xs text-slate-500">

                            {activeTenants} penghuni aktif dari {roomSummary.totalRooms} kamar

                        </p>

                    </div>

                </div>


                <div className="text-xs text-slate-400">
                    Dashboard diperbarui otomatis setiap 60 detik
                </div>

            </div>

        </div>

    )
}


export default AdminDashboard