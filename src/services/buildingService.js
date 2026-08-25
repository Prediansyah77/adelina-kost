// src/services/buildingService.js

const API_URL = 'http://localhost:5000/api/buildings'


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


        console.log('BUILDING API RESPONSE:', data)


        if (!response.ok) {

            throw new Error(
                data?.message ||
                'Terjadi kesalahan pada server.'
            )

        }


        return data

    } catch (error) {

        console.error(
            'BUILDING SERVICE ERROR:',
            error
        )

        throw error

    }

}


// =====================================================
// GET ALL BUILDINGS
// GET /api/buildings
// =====================================================

export async function getBuildings() {

    return await request(
        API_URL,
        {
            method: 'GET',
        }
    )

}


// =====================================================
// CREATE BUILDING
// POST /api/buildings
// =====================================================

export async function createBuilding(buildingData) {

    return await request(
        API_URL,
        {
            method: 'POST',

            body: JSON.stringify(buildingData),
        }
    )

}


// =====================================================
// UPDATE BUILDING
// PUT /api/buildings/:id
// =====================================================

export async function updateBuilding(
    id,
    buildingData
) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'PUT',

            body: JSON.stringify(buildingData),
        }
    )

}


// =====================================================
// DEACTIVATE BUILDING
// PATCH /api/buildings/:id/nonaktifkan
// =====================================================

export async function deactivateBuilding(id) {

    return await request(
        `${API_URL}/${id}/nonaktifkan`,
        {
            method: 'PATCH',
        }
    )

}