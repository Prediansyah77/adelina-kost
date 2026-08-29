import { useEffect, useMemo, useState } from 'react'

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
    Download,
    FileText,
    FileSpreadsheet,
    FileDown,
    Check,
    X,
} from 'lucide-react'

import { getReport } from '../services/reportService'

import * as XLSX from 'xlsx'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


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
    // STATE MODE LAPORAN
    // =====================================================

    const [reportMode, setReportMode] =
        useState('monthly')


    // =====================================================
    // STATE BULANAN
    // =====================================================

    const [selectedMonth, setSelectedMonth] =
        useState(currentMonth)

    const [selectedYear, setSelectedYear] =
        useState(currentYear)


    // =====================================================
    // STATE CUSTOM TANGGAL
    // =====================================================

    const [startDate, setStartDate] =
        useState(
            `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
        )

    const [endDate, setEndDate] =
        useState(
            `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(
                today.getDate()
            ).padStart(2, '0')}`
        )


    // =====================================================
    // STATE DATA
    // =====================================================

    const [report, setReport] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    const [exporting, setExporting] =
        useState(false)

    const [exportMessage, setExportMessage] =
        useState('')


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
    // =====================================================

    const years = [
        currentYear,
        currentYear + 1,
    ]


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
    // FORMAT DATE CUSTOM
    // =====================================================

    function formatInputDate(date) {

        if (!date) {
            return '-'
        }


        const parsedDate =
            new Date(`${date}T00:00:00`)


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date
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
    // LOAD REPORT
    // =====================================================

    async function loadReport() {

        try {

            setLoading(true)

            setError('')


            let response


            // =================================================
            // BULANAN
            // =================================================

            if (
                reportMode === 'monthly'
            ) {

                response =
                    await getReport(
                        selectedMonth,
                        selectedYear
                    )

            }


            // =================================================
            // CUSTOM
            // =================================================

            else {

                if (
                    !startDate ||
                    !endDate
                ) {

                    throw new Error(
                        'Tanggal mulai dan tanggal akhir wajib diisi.'
                    )

                }


                if (
                    startDate > endDate
                ) {

                    throw new Error(
                        'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
                    )

                }


                response =
                    await getReport(
                        null,
                        null,
                        startDate,
                        endDate
                    )

            }


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
    // LOAD SAAT MODE / FILTER BERUBAH
    // =====================================================

    useEffect(() => {

        if (
            reportMode === 'monthly'
        ) {

            loadReport()

        }

    }, [
        selectedMonth,
        selectedYear,
        reportMode,
    ])


    // =====================================================
    // TERAPKAN CUSTOM DATE
    // =====================================================

    function handleApplyCustomDate() {

        if (
            !startDate ||
            !endDate
        ) {

            setError(
                'Tanggal mulai dan tanggal akhir wajib diisi.'
            )

            return

        }


        if (
            startDate > endDate
        ) {

            setError(
                'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
            )

            return

        }


        loadReport()

    }


    // =====================================================
    // GANTI MODE
    // =====================================================

    function handleChangeMode(mode) {

        setError('')

        setExportMessage('')

        setReportMode(mode)

    }


    // =====================================================
    // JUDUL PERIODE
    // =====================================================

    const periodLabel =
        useMemo(() => {

            if (
                reportMode === 'monthly'
            ) {

                return `${monthNames[selectedMonth - 1]} ${selectedYear}`

            }


            return `${formatInputDate(startDate)} – ${formatInputDate(endDate)}`

        }, [
            reportMode,
            selectedMonth,
            selectedYear,
            startDate,
            endDate,
        ])


    // =====================================================
    // NAMA FILE PERIODE
    // =====================================================

    const filePeriod =
        useMemo(() => {

            if (
                reportMode === 'monthly'
            ) {

                return `${selectedYear}-${String(
                    selectedMonth
                ).padStart(2, '0')}`

            }


            return `${startDate}_sampai_${endDate}`

        }, [
            reportMode,
            selectedMonth,
            selectedYear,
            startDate,
            endDate,
        ])


    // =====================================================
    // CEK DATA
    // =====================================================

    const hasData =
        income.length > 0 ||
        expenses.length > 0 ||
        expenseCategories.length > 0


    // =====================================================
    // CSV ESCAPE
    // =====================================================

    function escapeCsvValue(value) {

        const stringValue =
            String(
                value ?? ''
            )


        return `"${stringValue.replace(
            /"/g,
            '""'
        )}"`

    }


    // =====================================================
    // EXPORT CSV
    // =====================================================

    function exportCSV() {

        try {

            setExporting(true)

            setExportMessage('')


            const rows = []


            // =================================================
            // HEADER
            // =================================================

            rows.push([
                'ADELINA KOST',
            ])

            rows.push([
                'Laporan Keuangan',
            ])

            rows.push([
                'Periode',
                periodLabel,
            ])

            rows.push([])


            // =================================================
            // RINGKASAN
            // =================================================

            rows.push([
                'RINGKASAN',
            ])

            rows.push([
                'Total Pemasukan',
                totalIncome,
            ])

            rows.push([
                'Total Pengeluaran',
                totalExpense,
            ])

            rows.push([
                'Laba Bersih',
                netIncome,
            ])

            rows.push([
                'Jumlah Pembayaran',
                paymentCount,
            ])

            rows.push([
                'Jumlah Pengeluaran',
                expenseCount,
            ])

            rows.push([])


            // =================================================
            // PEMASUKAN
            // =================================================

            rows.push([
                'PEMASUKAN',
            ])

            rows.push([
                'Tanggal',
                'Penghuni',
                'Kamar',
                'Metode',
                'Jumlah',
                'Bulan Tagihan',
                'Tahun Tagihan',
                'Catatan',
            ])


            income.forEach(
                (item) => {

                    rows.push([
                        formatDate(
                            item.payment_date
                        ),
                        item.tenant_name || '-',
                        item.room_number
                            ? `Kamar ${item.room_number}`
                            : '-',
                        formatPaymentMethod(
                            item.payment_method
                        ),
                        Number(
                            item.amount
                        ) || 0,
                        item.billing_month || '-',
                        item.billing_year || '-',
                        item.notes || '-',
                    ])

                }
            )


            rows.push([])


            // =================================================
            // PENGELUARAN
            // =================================================

            rows.push([
                'PENGELUARAN',
            ])

            rows.push([
                'Tanggal',
                'Kategori',
                'Keterangan',
                'Jumlah',
            ])


            expenses.forEach(
                (item) => {

                    rows.push([
                        formatDate(
                            item.expense_date
                        ),
                        item.category || '-',
                        item.description || '-',
                        Number(
                            item.amount
                        ) || 0,
                    ])

                }
            )


            rows.push([])


            // =================================================
            // KATEGORI
            // =================================================

            rows.push([
                'REKAP PENGELUARAN PER KATEGORI',
            ])

            rows.push([
                'Kategori',
                'Jumlah Transaksi',
                'Total',
            ])


            expenseCategories.forEach(
                (item) => {

                    rows.push([
                        item.category || '-',
                        Number(
                            item.transaction_count
                        ) || 0,
                        Number(
                            item.total_amount
                        ) || 0,
                    ])

                }
            )


            const csvContent =
                rows
                    .map(
                        (row) =>
                            row
                                .map(
                                    escapeCsvValue
                                )
                                .join(',')
                    )
                    .join('\n')


            const blob =
                new Blob(
                    [
                        '\uFEFF' +
                        csvContent
                    ],
                    {
                        type:
                            'text/csv;charset=utf-8;',
                    }
                )


            const url =
                URL.createObjectURL(
                    blob
                )


            const link =
                document.createElement(
                    'a'
                )


            link.href = url

            link.download =
                `laporan-keuangan-${filePeriod}.csv`

            document.body.appendChild(
                link
            )

            link.click()

            document.body.removeChild(
                link
            )

            URL.revokeObjectURL(
                url
            )


            setExportMessage(
                'CSV berhasil dibuat.'
            )


        } catch (error) {

            console.error(
                'Export CSV Error:',
                error
            )


            setError(
                'Gagal membuat file CSV.'
            )

        } finally {

            setExporting(false)

        }

    }


    // =====================================================
    // EXPORT EXCEL
    // =====================================================

    function exportExcel() {

        try {

            setExporting(true)

            setExportMessage('')


            const workbook =
                XLSX.utils.book_new()


            // =================================================
            // SHEET RINGKASAN
            // =================================================

            const summaryData = [

                ['ADELINA KOST'],

                ['Laporan Keuangan'],

                ['Periode', periodLabel],

                [],

                ['RINGKASAN KEUANGAN'],

                [
                    'Total Pemasukan',
                    totalIncome,
                ],

                [
                    'Total Pengeluaran',
                    totalExpense,
                ],

                [
                    'Laba Bersih',
                    netIncome,
                ],

                [
                    'Jumlah Pembayaran',
                    paymentCount,
                ],

                [
                    'Jumlah Pengeluaran',
                    expenseCount,
                ],

            ]


            const summarySheet =
                XLSX.utils.aoa_to_sheet(
                    summaryData
                )


            summarySheet['!cols'] = [
                { wch: 28 },
                { wch: 22 },
            ]


            XLSX.utils.book_append_sheet(
                workbook,
                summarySheet,
                'Ringkasan'
            )


            // =================================================
            // SHEET PEMASUKAN
            // =================================================

            const incomeData =
                income.map(
                    (item) => ({

                        Tanggal:
                            formatDate(
                                item.payment_date
                            ),

                        Penghuni:
                            item.tenant_name || '-',

                        Kamar:
                            item.room_number
                                ? `Kamar ${item.room_number}`
                                : '-',

                        Metode:
                            formatPaymentMethod(
                                item.payment_method
                            ),

                        Jumlah:
                            Number(
                                item.amount
                            ) || 0,

                        'Bulan Tagihan':
                            item.billing_month || '-',

                        'Tahun Tagihan':
                            item.billing_year || '-',

                        Catatan:
                            item.notes || '-',

                    })
                )


            const incomeSheet =
                XLSX.utils.json_to_sheet(
                    incomeData
                )


            incomeSheet['!cols'] = [
                { wch: 16 },
                { wch: 25 },
                { wch: 15 },
                { wch: 15 },
                { wch: 18 },
                { wch: 16 },
                { wch: 16 },
                { wch: 30 },
            ]


            XLSX.utils.book_append_sheet(
                workbook,
                incomeSheet,
                'Pemasukan'
            )


            // =================================================
            // SHEET PENGELUARAN
            // =================================================

            const expenseData =
                expenses.map(
                    (item) => ({

                        Tanggal:
                            formatDate(
                                item.expense_date
                            ),

                        Kategori:
                            item.category || '-',

                        Keterangan:
                            item.description || '-',

                        Jumlah:
                            Number(
                                item.amount
                            ) || 0,

                    })
                )


            const expenseSheet =
                XLSX.utils.json_to_sheet(
                    expenseData
                )


            expenseSheet['!cols'] = [
                { wch: 16 },
                { wch: 20 },
                { wch: 40 },
                { wch: 18 },
            ]


            XLSX.utils.book_append_sheet(
                workbook,
                expenseSheet,
                'Pengeluaran'
            )


            // =================================================
            // SHEET KATEGORI
            // =================================================

            const categoryData =
                expenseCategories.map(
                    (item) => ({

                        Kategori:
                            item.category || '-',

                        'Jumlah Transaksi':
                            Number(
                                item.transaction_count
                            ) || 0,

                        Total:
                            Number(
                                item.total_amount
                            ) || 0,

                    })
                )


            const categorySheet =
                XLSX.utils.json_to_sheet(
                    categoryData
                )


            categorySheet['!cols'] = [
                { wch: 25 },
                { wch: 22 },
                { wch: 20 },
            ]


            XLSX.utils.book_append_sheet(
                workbook,
                categorySheet,
                'Kategori'
            )


            // =================================================
            // DOWNLOAD
            // =================================================

            XLSX.writeFile(
                workbook,
                `laporan-keuangan-${filePeriod}.xlsx`
            )


            setExportMessage(
                'Excel berhasil dibuat.'
            )


        } catch (error) {

            console.error(
                'Export Excel Error:',
                error
            )


            setError(
                'Gagal membuat file Excel.'
            )

        } finally {

            setExporting(false)

        }

    }


    // =====================================================
    // EXPORT PDF
    // =====================================================

    function exportPDF() {

        try {

            setExporting(true)

            setExportMessage('')


            const doc =
                new jsPDF(
                    'p',
                    'mm',
                    'a4'
                )


            const pageWidth =
                doc.internal.pageSize.getWidth()


            // =================================================
            // HEADER
            // =================================================

            doc.setFontSize(
                18
            )

            doc.setFont(
                'helvetica',
                'bold'
            )

            doc.text(
                'ADELINA KOST',
                14,
                18
            )


            doc.setFontSize(
                14
            )

            doc.text(
                'Laporan Keuangan',
                14,
                27
            )


            doc.setFontSize(
                9
            )

            doc.setFont(
                'helvetica',
                'normal'
            )

            doc.text(
                `Periode: ${periodLabel}`,
                14,
                34
            )


            doc.text(
                `Dicetak: ${formatDate(new Date())}`,
                pageWidth - 14,
                34,
                {
                    align: 'right',
                }
            )


            // =================================================
            // GARIS
            // =================================================

            doc.setDrawColor(
                220,
                225,
                232
            )

            doc.line(
                14,
                39,
                pageWidth - 14,
                39
            )


            // =================================================
            // RINGKASAN
            // =================================================

            doc.setFontSize(
                11
            )

            doc.setFont(
                'helvetica',
                'bold'
            )

            doc.text(
                'Ringkasan Keuangan',
                14,
                48
            )


            autoTable(
                doc,
                {
                    startY: 53,

                    head: [
                        [
                            'Keterangan',
                            'Nilai',
                        ],
                    ],

                    body: [

                        [
                            'Total Pemasukan',
                            formatRupiah(
                                totalIncome
                            ),
                        ],

                        [
                            'Total Pengeluaran',
                            formatRupiah(
                                totalExpense
                            ),
                        ],

                        [
                            'Laba Bersih',
                            formatRupiah(
                                netIncome
                            ),
                        ],

                        [
                            'Jumlah Pembayaran',
                            String(
                                paymentCount
                            ),
                        ],

                        [
                            'Jumlah Pengeluaran',
                            String(
                                expenseCount
                            ),
                        ],

                    ],

                    theme:
                        'grid',

                    styles: {
                        fontSize: 9,
                        cellPadding: 3,
                    },

                    headStyles: {
                        fontStyle:
                            'bold',
                    },

                    columnStyles: {
                        0: {
                            cellWidth: 80,
                        },

                        1: {
                            cellWidth: 55,
                        },
                    },

                }
            )


            // =================================================
            // PEMASUKAN
            // =================================================

            let nextY =
                doc.lastAutoTable.finalY + 12


            doc.setFontSize(
                11
            )

            doc.setFont(
                'helvetica',
                'bold'
            )

            doc.text(
                'Detail Pemasukan',
                14,
                nextY
            )


            autoTable(
                doc,
                {
                    startY:
                        nextY + 5,

                    head: [
                        [
                            'Tanggal',
                            'Penghuni',
                            'Kamar',
                            'Metode',
                            'Jumlah',
                        ],
                    ],

                    body:
                        income.map(
                            (item) => [

                                formatDate(
                                    item.payment_date
                                ),

                                item.tenant_name ||
                                '-',

                                item.room_number
                                    ? `Kamar ${item.room_number}`
                                    : '-',

                                formatPaymentMethod(
                                    item.payment_method
                                ),

                                formatRupiah(
                                    item.amount
                                ),

                            ]
                        ),

                    theme:
                        'grid',

                    styles: {
                        fontSize: 8,
                        cellPadding: 2.5,
                    },

                    headStyles: {
                        fontStyle:
                            'bold',
                    },

                    columnStyles: {

                        0: {
                            cellWidth: 25,
                        },

                        1: {
                            cellWidth: 42,
                        },

                        2: {
                            cellWidth: 25,
                        },

                        3: {
                            cellWidth: 25,
                        },

                        4: {
                            cellWidth: 35,
                            halign:
                                'right',
                        },

                    },

                }
            )


            // =================================================
            // PENGELUARAN
            // =================================================

            nextY =
                doc.lastAutoTable.finalY + 12


            // Jika terlalu dekat dengan bawah halaman,
            // pindahkan ke halaman baru.

            if (
                nextY > 260
            ) {

                doc.addPage()

                nextY = 20

            }


            doc.setFontSize(
                11
            )

            doc.setFont(
                'helvetica',
                'bold'
            )

            doc.text(
                'Detail Pengeluaran',
                14,
                nextY
            )


            autoTable(
                doc,
                {
                    startY:
                        nextY + 5,

                    head: [
                        [
                            'Tanggal',
                            'Kategori',
                            'Keterangan',
                            'Jumlah',
                        ],
                    ],

                    body:
                        expenses.map(
                            (item) => [

                                formatDate(
                                    item.expense_date
                                ),

                                item.category ||
                                '-',

                                item.description ||
                                '-',

                                formatRupiah(
                                    item.amount
                                ),

                            ]
                        ),

                    theme:
                        'grid',

                    styles: {
                        fontSize: 8,
                        cellPadding: 2.5,
                    },

                    headStyles: {
                        fontStyle:
                            'bold',
                    },

                    columnStyles: {

                        0: {
                            cellWidth: 28,
                        },

                        1: {
                            cellWidth: 35,
                        },

                        2: {
                            cellWidth: 70,
                        },

                        3: {
                            cellWidth: 35,
                            halign:
                                'right',
                        },

                    },

                }
            )


            // =================================================
            // KATEGORI
            // =================================================

            nextY =
                doc.lastAutoTable.finalY + 12


            if (
                nextY > 260
            ) {

                doc.addPage()

                nextY = 20

            }


            doc.setFontSize(
                11
            )

            doc.setFont(
                'helvetica',
                'bold'
            )

            doc.text(
                'Rekap Pengeluaran per Kategori',
                14,
                nextY
            )


            autoTable(
                doc,
                {
                    startY:
                        nextY + 5,

                    head: [
                        [
                            'Kategori',
                            'Transaksi',
                            'Total',
                        ],
                    ],

                    body:
                        expenseCategories.map(
                            (item) => [

                                item.category ||
                                '-',

                                String(
                                    Number(
                                        item.transaction_count
                                    ) || 0
                                ),

                                formatRupiah(
                                    item.total_amount
                                ),

                            ]
                        ),

                    theme:
                        'grid',

                    styles: {
                        fontSize: 8,
                        cellPadding: 2.5,
                    },

                    headStyles: {
                        fontStyle:
                            'bold',
                    },

                    columnStyles: {

                        0: {
                            cellWidth: 80,
                        },

                        1: {
                            cellWidth: 35,
                            halign:
                                'center',
                        },

                        2: {
                            cellWidth: 45,
                            halign:
                                'right',
                        },

                    },

                }
            )


            // =================================================
            // FOOTER SETIAP HALAMAN
            // =================================================

            const pageCount =
                doc.internal.getNumberOfPages()


            for (
                let page = 1;
                page <= pageCount;
                page++
            ) {

                doc.setPage(
                    page
                )


                doc.setFontSize(
                    8
                )

                doc.setFont(
                    'helvetica',
                    'normal'
                )


                doc.text(
                    `ADELINA KOST • Laporan Keuangan • Halaman ${page} dari ${pageCount}`,
                    pageWidth / 2,
                    290,
                    {
                        align: 'center',
                    }
                )

            }


            // =================================================
            // DOWNLOAD
            // =================================================

            doc.save(
                `laporan-keuangan-${filePeriod}.pdf`
            )


            setExportMessage(
                'PDF berhasil dibuat.'
            )


        } catch (error) {

            console.error(
                'Export PDF Error:',
                error
            )


            setError(
                'Gagal membuat file PDF.'
            )

        } finally {

            setExporting(false)

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

            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

                <div>

                    <div className="flex items-start gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">

                            <BarChart3
                                size={23}
                                className="text-blue-600"
                            />

                        </div>


                        <div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">

                                Laporan Keuangan

                            </h1>


                            <p className="mt-1 text-sm text-slate-500">

                                Ringkasan keuangan ADELINA KOST

                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FILTER + EXPORT
                ================================================= */}

                <div className="flex flex-col gap-3">

                    {/* MODE */}

                    <div className="flex flex-wrap items-center justify-end gap-2">

                        <button
                            type="button"
                            onClick={() =>
                                handleChangeMode(
                                    'monthly'
                                )
                            }
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${reportMode === 'monthly'
                                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                        >

                            <CalendarDays
                                size={16}
                            />

                            Bulanan

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleChangeMode(
                                    'custom'
                                )
                            }
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${reportMode === 'custom'
                                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                        >

                            <CalendarDays
                                size={16}
                            />

                            Custom Tanggal

                        </button>

                    </div>


                    {/* FILTER */}

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">

                        {reportMode === 'monthly' ? (

                            <>

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
                                        onChange={(
                                            event
                                        ) =>
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
                                                    key={
                                                        month
                                                    }
                                                    value={
                                                        index +
                                                        1
                                                    }
                                                >

                                                    {month}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* TAHUN */}

                                <select
                                    value={
                                        selectedYear
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSelectedYear(
                                            Number(
                                                event.target.value
                                            )
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-32"
                                >

                                    {years.map(
                                        (
                                            year
                                        ) => (

                                            <option
                                                key={
                                                    year
                                                }
                                                value={
                                                    year
                                                }
                                            >

                                                {year}

                                            </option>

                                        )
                                    )}

                                </select>

                            </>

                        ) : (

                            <>

                                {/* START DATE */}

                                <div className="relative">

                                    <CalendarDays
                                        size={17}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        type="date"
                                        value={
                                            startDate
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setStartDate(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-48"
                                    />

                                </div>


                                <span className="hidden text-sm font-medium text-slate-400 sm:inline">

                                    sampai

                                </span>


                                {/* END DATE */}

                                <div className="relative">

                                    <CalendarDays
                                        size={17}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        type="date"
                                        value={
                                            endDate
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEndDate(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-48"
                                    />

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleApplyCustomDate
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    <Check
                                        size={17}
                                    />

                                    Terapkan

                                </button>

                            </>

                        )}


                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={
                                loadReport
                            }
                            disabled={
                                loading
                            }
                            title="Refresh laporan"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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


                    {/* EXPORT */}

                    <div className="flex flex-wrap justify-end gap-2">

                        <button
                            type="button"
                            onClick={
                                exportPDF
                            }
                            disabled={
                                exporting ||
                                loading ||
                                !report
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <FileText
                                size={16}
                            />

                            PDF

                        </button>


                        <button
                            type="button"
                            onClick={
                                exportExcel
                            }
                            disabled={
                                exporting ||
                                loading ||
                                !report
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <FileSpreadsheet
                                size={16}
                            />

                            Excel

                        </button>


                        <button
                            type="button"
                            onClick={
                                exportCSV
                            }
                            disabled={
                                exporting ||
                                loading ||
                                !report
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <FileDown
                                size={16}
                            />

                            CSV

                        </button>

                    </div>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <X
                        size={18}
                        className="mt-0.5 shrink-0 text-red-500"
                    />

                    <p className="text-sm font-medium text-red-700">

                        {error}

                    </p>

                </div>

            )}


            {/* =================================================
                EXPORT SUCCESS
            ================================================= */}

            {exportMessage && (

                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                    <Check
                        size={18}
                        className="text-green-600"
                    />

                    <p className="text-sm font-medium text-green-700">

                        {exportMessage}

                    </p>

                </div>

            )}


            {/* =================================================
                PERIODE
            ================================================= */}

            <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3.5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">

                    <CalendarDays
                        size={17}
                        className="text-blue-600"
                    />

                </div>


                <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">

                        Periode Laporan

                    </p>


                    <p className="mt-0.5 text-sm font-semibold text-blue-800">

                        {periodLabel}

                    </p>

                </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="text-center">

                        <RefreshCw
                            size={30}
                            className="mx-auto animate-spin text-blue-600"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-600">

                            Memuat laporan...

                        </p>


                        <p className="mt-1 text-xs text-slate-400">

                            Mengambil data keuangan ADELINA KOST

                        </p>

                    </div>

                </div>

            ) : (

                <>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">


                        {/* PEMASUKAN */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Total Pemasukan

                                    </p>


                                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">

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


                        {/* PENGELUARAN */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Total Pengeluaran

                                    </p>


                                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">

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


                        {/* LABA */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Laba Bersih

                                    </p>


                                    <p
                                        className={`mt-2 text-2xl font-bold tracking-tight ${netIncome >= 0
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

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        Total Transaksi

                                    </p>


                                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">

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
                        DETAIL
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

                                <div className="p-10 text-center">

                                    <ArrowUpCircle
                                        size={36}
                                        className="mx-auto text-slate-300"
                                    />


                                    <p className="mt-3 text-sm font-semibold text-slate-600">

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
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        <td className="px-5 py-4 text-slate-600">

                                                            {formatDate(
                                                                item.payment_date
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <p className="font-medium text-slate-700">

                                                                {item.tenant_name ||
                                                                    '-'}

                                                            </p>


                                                            <p className="mt-0.5 text-xs text-slate-400">

                                                                {item.room_number
                                                                    ? `Kamar ${item.room_number}`
                                                                    : '-'}

                                                            </p>

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

                                <div className="p-10 text-center">

                                    <ArrowDownCircle
                                        size={36}
                                        className="mx-auto text-slate-300"
                                    />


                                    <p className="mt-3 text-sm font-semibold text-slate-600">

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
                                                        className="transition hover:bg-slate-50"
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
                        KATEGORI
                    ================================================= */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                            <div>

                                <h2 className="font-semibold text-slate-800">

                                    Ringkasan Pengeluaran Berdasarkan Kategori

                                </h2>


                                <p className="mt-1 text-xs text-slate-500">



                                </p>

                            </div>


                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

                                <Receipt
                                    size={17}
                                    className="text-slate-600"
                                />

                            </div>

                        </div>


                        {expenseCategories.length === 0 ? (

                            <div className="p-10 text-center">

                                <Receipt
                                    size={36}
                                    className="mx-auto text-slate-300"
                                />


                                <p className="mt-3 text-sm font-semibold text-slate-600">

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
                                                    className="transition hover:bg-slate-50"
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
                        EMPTY
                    ================================================= */}

                    {!hasData && (

                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

                                <Receipt
                                    size={22}
                                    className="text-slate-400"
                                />

                            </div>


                            <p className="mt-4 text-sm font-semibold text-slate-700">

                                Tidak ada transaksi keuangan

                            </p>


                            <p className="mt-1 text-xs text-slate-400">

                                Tidak ditemukan transaksi pada periode{' '}

                                <span className="font-medium text-slate-600">

                                    {periodLabel}

                                </span>

                            </p>

                        </div>

                    )}


                    {/* =================================================
                        EXPORT INFO
                    ================================================= */}

                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-semibold text-slate-700">

                                Export laporan

                            </p>


                            <p className="mt-1 text-xs text-slate-500">

                                File akan dibuat berdasarkan periode laporan yang sedang aktif.

                            </p>

                        </div>


                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <Download
                                size={15}
                            />

                            PDF • Excel • CSV

                        </div>

                    </div>

                </>

            )}

        </div>

    )

}


export default Reports