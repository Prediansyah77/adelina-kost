import api from "./api";


// =====================================================
// GET SEMUA PEMBAYARAN
// =====================================================

export const getPayments = async () => {

    const response = await api.get("/payments");

    return response.data;
};


// =====================================================
// GET PEMBAYARAN BERDASARKAN ID
// =====================================================

export const getPaymentById = async (id) => {

    const response = await api.get(`/payments/${id}`);

    return response.data;
};


// =====================================================
// CREATE PEMBAYARAN
// =====================================================

export const createPayment = async (paymentData) => {

    const response = await api.post(
        "/payments",
        paymentData
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

    const response = await api.put(
        `/payments/${id}`,
        paymentData
    );

    return response.data;
};


// =====================================================
// DELETE PEMBAYARAN
// =====================================================

export const deletePayment = async (id) => {

    const response = await api.delete(
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

    const response = await api.get("/bills");

    return response.data;
};