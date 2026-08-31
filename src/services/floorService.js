// src/services/floorService.js


const API_URL = 'http://localhost:5000/api/floors'


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


        const data = await response.json()


        console.log(
            'FLOOR API RESPONSE:',
            data
        )


        if (!response.ok) {

            throw new Error(
                data?.message ||
                'Terjadi kesalahan pada server.'
            )

        }


        return data

    } catch (error) {

        console.error(
            'FLOOR SERVICE ERROR:',
            error
        )

        throw error

    }

}


// =====================================================
// GET ALL FLOORS
// GET /api/floors
// =====================================================

export async function getFloors() {

    return await request(
        API_URL,
        {
            method: 'GET',
        }
    )

}


// =====================================================
// GET FLOOR BY ID
// GET /api/floors/:id
// =====================================================

export async function getFloorById(id) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'GET',
        }
    )

}


// =====================================================
// CREATE FLOOR
// POST /api/floors
// =====================================================

export async function createFloor(floorData) {

    return await request(
        API_URL,
        {
            method: 'POST',

            body: JSON.stringify(
                floorData
            ),
        }
    )

}


// =====================================================
// UPDATE FLOOR
// PUT /api/floors/:id
// =====================================================

export async function updateFloor(
    id,
    floorData
) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'PUT',

            body: JSON.stringify(
                floorData
            ),
        }
    )

}


// =====================================================
// DEACTIVATE FLOOR
// PATCH /api/floors/:id/nonaktifkan
// =====================================================

export async function deactivateFloor(id) {

    return await request(
        `${API_URL}/${id}/nonaktifkan`,
        {
            method: 'PATCH',
        }
    )

}