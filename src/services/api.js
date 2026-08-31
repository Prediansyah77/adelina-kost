import axios from "axios";


// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});


// ======================================================
// JWT + REQUEST CONFIG
// ======================================================

api.interceptors.request.use(
    (config) => {

        // ==================================================
        // JWT
        // ==================================================

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        // ==================================================
        // FORM DATA
        //
        // Jika request menggunakan FormData,
        // JANGAN paksa Content-Type application/json.
        //
        // Browser/Axios akan otomatis membuat:
        //
        // multipart/form-data; boundary=...
        //
        // sehingga Multer bisa membaca req.file.
        // ==================================================

        if (
            config.data instanceof FormData
        ) {

            delete config.headers["Content-Type"];

        }


        return config;

    },

    (error) => {

        return Promise.reject(
            error
        );

    }
);


export default api;