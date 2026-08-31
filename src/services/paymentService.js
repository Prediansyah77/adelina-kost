import api from "./api";


// =====================================================
// GET SEMUA PEMBAYARAN
// =====================================================

export const getPayments = async () => {

    const response =
        await api.get("/payments");

    return response.data;
};


// =====================================================
// GET PEMBAYARAN BERDASARKAN ID
// =====================================================

export const getPaymentById = async (id) => {

    const response =
        await api.get(`/payments/${id}`);

    return response.data;
};


// =====================================================
// CREATE PEMBAYARAN ADMIN
//
// Endpoint:
// POST /api/payments
//
// Dipakai untuk pembayaran yang dicatat langsung
// oleh ADMIN.
// =====================================================

export const createPayment = async (
    paymentData
) => {

    const response =
        await api.post(
            "/payments",
            paymentData
        );

    return response.data;
};


// =====================================================
// CREATE PEMBAYARAN OLEH PENGHUNI
//
// Endpoint:
// POST /api/payments/tenant
//
// Alur:
//
// PENGHUNI
//     ↓
// submit pembayaran + bukti transfer
//     ↓
// status = pending
//     ↓
// ADMIN melihat detail + bukti pembayaran
//     ↓
// ADMIN Verifikasi / Tolak
//
// PENTING:
// Menggunakan FormData karena terdapat upload gambar.
// =====================================================

export const createTenantPayment = async (
    paymentData
) => {

    const formData =
        new FormData();


    // =================================================
    // DATA PEMBAYARAN
    // =================================================

    formData.append(
        "bill_id",
        paymentData.bill_id
    );


    formData.append(
        "payment_date",
        paymentData.payment_date
    );


    formData.append(
        "amount",
        paymentData.amount
    );


    formData.append(
        "payment_method",
        paymentData.payment_method
    );


    // =================================================
    // REKENING BANK
    // =================================================

    if (
        paymentData.bank_account_id !== undefined &&
        paymentData.bank_account_id !== null &&
        paymentData.bank_account_id !== ""
    ) {

        formData.append(
            "bank_account_id",
            paymentData.bank_account_id
        );

    }


    // =================================================
    // CATATAN
    // =================================================

    if (
        paymentData.notes !== undefined &&
        paymentData.notes !== null &&
        paymentData.notes !== ""
    ) {

        formData.append(
            "notes",
            paymentData.notes
        );

    }


    // =================================================
    // BUKTI PEMBAYARAN
    //
    // File:
    // JPG
    // JPEG
    // PNG
    // WEBP
    // =================================================

    if (
        paymentData.proof_file
    ) {

        formData.append(
            "proof_file",
            paymentData.proof_file
        );

    }


    // =================================================
    // KIRIM KE BACKEND
    // =================================================
    //
    // Jangan set Content-Type secara manual.
    // Browser akan otomatis membuat:
    //
    // multipart/form-data
    //
    // beserta boundary yang diperlukan.
    // =================================================

    const response =
        await api.post(
            "/payments/tenant",
            formData
        );


    return response.data;
};


// =====================================================
// UPDATE PEMBAYARAN
// =====================================================

export const updatePayment = async (
    id,
    paymentData
) => {

    const response =
        await api.put(
            `/payments/${id}`,
            paymentData
        );

    return response.data;
};


// =====================================================
// DELETE PEMBAYARAN
// =====================================================

export const deletePayment = async (
    id
) => {

    const response =
        await api.delete(
            `/payments/${id}`
        );

    return response.data;
};


// =====================================================
// GET TAGIHAN
//
// Dipakai untuk memilih tagihan ketika membuat
// pembayaran.
// =====================================================

export const getBillsForPayment = async () => {

    const response =
        await api.get("/bills");

    return response.data;
};


// =====================================================
// VERIFY PEMBAYARAN
//
// Endpoint:
// PATCH /api/payments/:id/verify
//
// Alur:
//
// pending
//    ↓
// verified
//    ↓
// saldo bank bertambah
//    ↓
// status bill diperbarui
//    ↓
// jika lunas → next bill dibuat
// =====================================================

export const verifyPayment = async (
    id
) => {

    const response =
        await api.patch(
            `/payments/${id}/verify`
        );

    return response.data;
};

export const verifyBookingPayment = async (
    id
) => {

    const response =
        await api.patch(
            `/payments/booking/${id}/verify`
        );

    return response.data;
};


// =====================================================
// REJECT PEMBAYARAN
//
// Endpoint:
// PATCH /api/payments/:id/reject
//
// Alur:
//
// pending
//    ↓
// rejected
//
// reason dikirim ke backend sebagai:
// notes
//
// Backend:
// const { notes } = req.body;
// =====================================================

export const rejectPayment = async (
    id,
    reason
) => {

    const response =
        await api.patch(
            `/payments/${id}/reject`,
            {
                notes: reason
            }
        );

    return response.data;
};