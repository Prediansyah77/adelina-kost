import api from "./api";


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

export const login = async (
    username,
    password
) => {

    const response =
        await api.post(
            "/auth/login",
            {
                username,
                password,
            }
        );

    return response.data;
};


// =====================================================
// REGISTER PENGHUNI
// POST /api/auth/register
//
// Menggunakan multipart/form-data
// karena ada upload foto KTP.
// =====================================================

export const register = async ({

    // ==========================================
    // DATA DIRI
    // ==========================================

    name,
    phone,
    gender,
    occupation,
    address,
    identityNumber,
    boardingPurpose,

    // ==========================================
    // FOTO KTP
    // ==========================================

    ktpFile,

    // ==========================================
    // DATA AKUN
    // ==========================================

    username,
    password,
    confirmPassword,

}) => {

    // =================================================
    // VALIDASI FILE KTP
    // =================================================

    if (!ktpFile) {

        throw new Error(
            "Foto KTP wajib diupload."
        );

    }


    // =================================================
    // PASTIKAN YANG DIKIRIM BENAR-BENAR FILE
    // =================================================

    if (!(ktpFile instanceof File)) {

        throw new Error(
            "File KTP tidak valid."
        );

    }


    // =================================================
    // BUAT FORMDATA
    // =================================================

    const formData =
        new FormData();


    // =================================================
    // DATA DIRI
    // =================================================

    formData.append(
        "name",
        name
    );

    formData.append(
        "phone",
        phone
    );

    formData.append(
        "gender",
        gender
    );

    formData.append(
        "occupation",
        occupation
    );

    formData.append(
        "address",
        address
    );

    formData.append(
        "identityNumber",
        identityNumber
    );

    formData.append(
        "boardingPurpose",
        boardingPurpose
    );


    // =================================================
    // DATA AKUN
    // =================================================

    formData.append(
        "username",
        username
    );

    formData.append(
        "password",
        password
    );

    formData.append(
        "confirmPassword",
        confirmPassword
    );


    // =================================================
    // FOTO KTP
    //
    // PENTING:
    //
    // Backend menggunakan:
    //
    // upload.single("ktp")
    //
    // Jadi nama field HARUS:
    //
    // "ktp"
    // =================================================

    formData.append(
        "ktp",
        ktpFile
    );


    // =================================================
    // DEBUG FORMDATA
    // =================================================

    console.log(
        "========================================"
    );

    console.log(
        "DATA FORM REGISTRASI:"
    );

    console.log(
        "========================================"
    );


    for (
        const [key, value]
        of formData.entries()
    ) {

        if (
            value instanceof File
        ) {

            console.log(
                key,
                {
                    name: value.name,
                    type: value.type,
                    size: value.size
                }
            );

        } else {

            console.log(
                key,
                value
            );

        }

    }


    console.log(
        "========================================"
    );

    console.log(
        "FILE KTP:",
        ktpFile.name
    );

    console.log(
        "TYPE:",
        ktpFile.type
    );

    console.log(
        "SIZE:",
        ktpFile.size
    );

    console.log(
        "========================================"
    );


    // =================================================
    // KIRIM KE BACKEND
    //
    // JANGAN SET Content-Type MANUAL
    //
    // Browser/Axios akan membuat:
    //
    // multipart/form-data;
    // boundary=...
    //
    // agar Multer bisa membaca req.file.
    // =================================================

    const response =
        await api.post(
            "/auth/register",
            formData
        );


    // =================================================
    // RETURN RESPONSE
    // =================================================

    return response.data;

};


// =====================================================
// GET ME
// GET /api/auth/me
// =====================================================

export const getMe = async () => {

    const response =
        await api.get(
            "/auth/me"
        );

    return response.data;

};