// src/services/billService.js

const API_URL = 'http://localhost:5000/api/bills'


// =====================================================
// HELPER REQUEST
// =====================================================

async function request(url, options = {}) {

    try {

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            ...options,
        })


        // Ambil response JSON
        const data = await response.json()


        console.log('BILL API RESPONSE:', data)


        // Jika HTTP error
        if (!response.ok) {

            throw new Error(
                data?.message ||
                'Terjadi kesalahan pada server.'
            )

        }


        return data

    } catch (error) {

        console.error(
            'BILL SERVICE ERROR:',
            error
        )

        throw error

    }

}


// =====================================================
// GET ALL BILLS
// GET /api/bills
// =====================================================

export async function getBills() {

    return await request(
        API_URL,
        {
            method: 'GET',
        }
    )

}


// =====================================================
// GET BILL BY ID
// GET /api/bills/:id
// =====================================================

export async function getBillById(id) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'GET',
        }
    )

}


// =====================================================
// CREATE BILL
// POST /api/bills
// =====================================================

export async function createBill(billData) {

    return await request(
        API_URL,
        {
            method: 'POST',

            body: JSON.stringify(billData),
        }
    )

}


// =====================================================
// UPDATE BILL
// PUT /api/bills/:id
// =====================================================

export async function updateBill(id, billData) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'PUT',

            body: JSON.stringify(billData),
        }
    )

}


// =====================================================
// DELETE BILL
// DELETE /api/bills/:id
// =====================================================

export async function deleteBill(id) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'DELETE',
        }
    )

}