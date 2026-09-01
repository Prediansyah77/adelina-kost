import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute() {

    // =====================================================
    // AUTH STATE
    // =====================================================

    const [isAuthenticated, setIsAuthenticated] =
        useState(null);


    // =====================================================
    // CHECK AUTHENTICATION
    // =====================================================

    useEffect(() => {

        const checkAuthentication = () => {

            const token =
                localStorage.getItem("token");

            const user =
                localStorage.getItem("user");


            // =================================================
            // BELUM LOGIN
            // =================================================

            if (!token || !user) {

                setIsAuthenticated(false);

                return;

            }


            // =================================================
            // VALIDASI USER JSON
            // =================================================

            try {

                JSON.parse(user);

                setIsAuthenticated(true);

            } catch (error) {

                console.error(
                    "User localStorage tidak valid:",
                    error
                );

                localStorage.removeItem("user");

                setIsAuthenticated(false);

            }

        };


        // =================================================
        // CEK PERTAMA KALI
        // =================================================

        checkAuthentication();


        // =================================================
        // STORAGE CHANGE
        // =================================================
        //
        // Dipakai jika token/user berubah dari tab lain.
        //
        // =================================================

        window.addEventListener(
            "storage",
            checkAuthentication
        );


        // =================================================
        // PAGE SHOW
        // =================================================
        //
        // Tidak melakukan redirect paksa.
        // Hanya mengecek ulang authentication.
        //
        // =================================================

        window.addEventListener(
            "pageshow",
            checkAuthentication
        );


        return () => {

            window.removeEventListener(
                "storage",
                checkAuthentication
            );

            window.removeEventListener(
                "pageshow",
                checkAuthentication
            );

        };

    }, []);


    // =====================================================
    // MASIH CEK AUTH
    // =====================================================

    if (isAuthenticated === null) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">

                <div className="text-center">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">

                        Memeriksa sesi...

                    </p>

                </div>

            </div>
        );

    }


    // =====================================================
    // TIDAK LOGIN
    // =====================================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // =====================================================
    // LOGIN
    // =====================================================

    return <Outlet />;

}

export default ProtectedRoute;