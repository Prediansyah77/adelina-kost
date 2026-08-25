const API_URL = 'http://localhost:5000/api/contracts'

// =====================================================
// HELPER REQUEST
// =====================================================

async function request(url, options = {}) {
    try {
        const token = localStorage.getItem('token')

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',

                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),

                ...(options.headers || {}),
            },
            ...options,
        })

        const data = await response.json()

        console.log('CONTRACT API RESPONSE:', data)

        if (!response.ok) {
            throw new Error(
                data?.message ||
                'Terjadi kesalahan pada server.'
            )
        }

        return data

    } catch (error) {
        console.error(
            'CONTRACT SERVICE ERROR:',
            error
        )

        throw error
    }
}


// =====================================================
// GET ALL CONTRACTS
// GET /api/contracts
// =====================================================

export async function getContracts() {
    return await request(API_URL, {
        method: 'GET',
    })
}


// =====================================================
// GET CONTRACT BY ID
// GET /api/contracts/:id
// =====================================================

export async function getContractById(id) {
    return await request(
        `${API_URL}/${id}`,
        {
            method: 'GET',
        }
    )
}


// =====================================================
// CREATE CONTRACT
// POST /api/contracts
// =====================================================

export async function createContract(contractData) {
    return await request(API_URL, {
        method: 'POST',
        body: JSON.stringify(contractData),
    })
}


// =====================================================
// UPDATE CONTRACT
// PUT /api/contracts/:id
// =====================================================

export async function updateContract(
    id,
    contractData
) {
    return await request(
        `${API_URL}/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(contractData),
        }
    )
}


// =====================================================
// DELETE CONTRACT
// DELETE /api/contracts/:id
// =====================================================

export async function deleteContract(id) {
    return await request(
        `${API_URL}/${id}`,
        {
            method: 'DELETE',
        }
    )
}