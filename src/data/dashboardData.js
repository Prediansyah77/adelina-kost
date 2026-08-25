export const dashboardSummary = {
    totalRooms: 14,
    occupiedRooms: 10,
    emptyRooms: 4,
    occupancyRate: 71.4,
    totalTenants: 10,
    monthlyIncome: 7500000,
    monthlyExpense: 1200000,
    monthlyProfit: 6300000,
    unpaidInvoices: 2,
    pendingPayments: 1,
    overdueInvoices: 1,
    damageReports: 2,
}

export const monthlyFinancialData = [
    {
        month: 'Jan',
        income: 6500000,
        expense: 900000,
        profit: 5600000,
    },
    {
        month: 'Feb',
        income: 7000000,
        expense: 1000000,
        profit: 6000000,
    },
    {
        month: 'Mar',
        income: 7200000,
        expense: 850000,
        profit: 6350000,
    },
    {
        month: 'Apr',
        income: 6800000,
        expense: 1100000,
        profit: 5700000,
    },
    {
        month: 'May',
        income: 7500000,
        expense: 1200000,
        profit: 6300000,
    },
    {
        month: 'Jun',
        income: 7500000,
        expense: 950000,
        profit: 6550000,
    },
    {
        month: 'Jul',
        income: 7200000,
        expense: 1050000,
        profit: 6150000,
    },
    {
        month: 'Aug',
        income: 7500000,
        expense: 1200000,
        profit: 6300000,
    },
]

export const roomOccupancyData = [
    {
        name: 'Terisi',
        value: 10,
    },
    {
        name: 'Kosong',
        value: 4,
    },
]

export const pendingPayments = [
    {
        id: 1,
        tenant: 'Andi Saputra',
        room: 'Kamar 6',
        period: 'Agustus 2026',
        amount: 750000,
    },
]

export const damageReports = [
    {
        id: 1,
        tenant: 'Budi Santoso',
        room: 'Kamar 8',
        category: 'Lampu',
        description: 'Lampu kamar mati',
        status: 'DILAPORKAN',
    },
    {
        id: 2,
        tenant: 'Rizky Pratama',
        room: 'Kamar 11',
        category: 'Keran',
        description: 'Keran kamar mandi bocor',
        status: 'DIPROSES',
    },
]