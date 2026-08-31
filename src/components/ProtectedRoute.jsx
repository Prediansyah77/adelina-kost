import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute() {

    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );


    useEffect(() => {

        const checkAuthentication = () => {

            const token =
                localStorage.getItem("token");

            const user =
                localStorage.getItem("user");


            if (!token || !user) {

                setIsAuthenticated(false);

                // Paksa keluar dari halaman yang tersimpan
                window.location.replace("/login");

                return;

            }


            setIsAuthenticated(true);

        };


        // Cek saat component aktif
        checkAuthentication();


        // =================================================
        // PENTING:
        // Dipanggil ketika browser mengembalikan halaman
        // dari tombol BACK / FORWARD / bfcache
        // =================================================

        window.addEventListener(
            "pageshow",
            checkAuthentication
        );


        return () => {

            window.removeEventListener(
                "pageshow",
                checkAuthentication
            );

        };

    }, []);


    // =====================================================
    // BELUM LOGIN
    // =====================================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return <Outlet />;

}

export default ProtectedRoute;