// src/services/roomService.js

const API_URL = 'http://localhost:5000/api/rooms'


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


        console.log('ROOM API RESPONSE:', data)


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
            'ROOM SERVICE ERROR:',
            error
        )

        throw error

    }

}


// =====================================================
// GET ALL ROOMS
// GET /api/rooms
// =====================================================

export async function getRooms() {

    return await request(
        API_URL,
        {
            method: 'GET',
        }
    )

}


// =====================================================
// GET ROOM BY ID
// GET /api/rooms/:id
// =====================================================

export async function getRoomById(id) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'GET',
        }
    )

}


// =====================================================
// CREATE ROOM
// POST /api/rooms
// =====================================================

export async function createRoom(roomData) {

    return await request(
        API_URL,
        {
            method: 'POST',

            body: JSON.stringify(roomData),
        }
    )

}


// =====================================================
// UPDATE ROOM
// PUT /api/rooms/:id
// =====================================================

export async function updateRoom(id, roomData) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'PUT',

            body: JSON.stringify(roomData),
        }
    )

}


// =====================================================
// DELETE ROOM
// DELETE /api/rooms/:id
// =====================================================

export async function deleteRoom(id) {

    return await request(
        `${API_URL}/${id}`,
        {
            method: 'DELETE',
        }
    )

}