import api from './api'


// ======================================================
// GET LAPORAN KEUANGAN
// ======================================================
//
// MODE 1 — BULANAN
//
// getReport(month, year)
//
// Contoh:
// getReport(8, 2026)
//
// Request:
// GET /api/reports?month=8&year=2026
//
// ------------------------------------------------------
//
// MODE 2 — CUSTOM TANGGAL
//
// getReport(
//     null,
//     null,
//     startDate,
//     endDate
// )
//
// Contoh:
// getReport(
//     null,
//     null,
//     '2026-08-01',
//     '2026-08-30'
// )
//
// Request:
// GET /api/reports?startDate=2026-08-01&endDate=2026-08-30
//
// ======================================================

export const getReport = async (
    month = null,
    year = null,
    startDate = null,
    endDate = null
) => {

    try {

        // ==================================================
        // PARAMETER REQUEST
        // ==================================================

        const params = {}


        // ==================================================
        // MODE BULANAN
        // ==================================================

        if (
            month !== null &&
            month !== undefined &&
            year !== null &&
            year !== undefined
        ) {

            params.month =
                month

            params.year =
                year

        }


        // ==================================================
        // MODE CUSTOM TANGGAL
        // ==================================================

        if (
            startDate &&
            endDate
        ) {

            params.startDate =
                startDate

            params.endDate =
                endDate

        }


        // ==================================================
        // REQUEST KE BACKEND
        // ==================================================

        const response =
            await api.get(
                '/reports',
                {
                    params,
                }
            )


        // ==================================================
        // RETURN RESPONSE
        // ==================================================

        return response.data

    } catch (error) {

        console.error(
            'Get Report Error:',
            error
        )


        // ==================================================
        // AMBIL PESAN ERROR DARI BACKEND
        // ==================================================

        throw new Error(
            error.response?.data?.message ||
            'Gagal mengambil laporan keuangan.'
        )

    }

}