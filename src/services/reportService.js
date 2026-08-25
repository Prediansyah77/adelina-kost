import api from './api'


// ======================================================
// GET LAPORAN KEUANGAN
// ======================================================
// GET /api/reports?month=8&year=2026
// ======================================================

export const getReport = async (month, year) => {

    try {

        const response = await api.get(
            '/reports',
            {
                params: {
                    month,
                    year,
                },
            }
        )


        return response.data

    } catch (error) {

        console.error(
            'Get Report Error:',
            error
        )


        throw new Error(
            error.response?.data?.message ||
            'Gagal mengambil laporan keuangan.'
        )

    }

}