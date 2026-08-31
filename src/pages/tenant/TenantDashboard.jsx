import {
    Building2,
    LogOut,
    UserRound,
    Home,
    FileText,
    Receipt,
    CreditCard,
    RefreshCw,
    LockKeyhole,
    Eye,
    EyeOff,
    X,
    CheckCircle2,
    WalletCards,
    Send,
    AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { getPublicRooms } from "../../services/roomService";


function TenantDashboard() {

    const navigate = useNavigate();

    const [user, setUser] =
        useState(null);

    const [tenant, setTenant] =
        useState(null);

    const [contract, setContract] =
        useState(null);

    const [isCandidate, setIsCandidate] =
        useState(false);

    const [booking, setBooking] =
        useState(null);

    const [bookingLoading, setBookingLoading] =
        useState(true);

    const [bookingError, setBookingError] =
        useState("");

    const [availableRooms, setAvailableRooms] =
        useState([]);

    const [roomsLoading, setRoomsLoading] =
        useState(false);

    const [roomsError, setRoomsError] =
        useState("");

    const [bills, setBills] =
        useState([]);

    const [billsLoading, setBillsLoading] =
        useState(true);

    const [billsError, setBillsError] =
        useState("");


    // =====================================================
    // STATE GLOBAL
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // STATE GANTI PASSWORD
    // =====================================================

    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [changePasswordLoading, setChangePasswordLoading] =
        useState(false);

    const [changePasswordError, setChangePasswordError] =
        useState("");

    const [changePasswordSuccess, setChangePasswordSuccess] =
        useState("");


    // =====================================================
    // STATE PEMBAYARAN
    // =====================================================

    const [showPaymentModal, setShowPaymentModal] =
        useState(false);

    const [selectedBill, setSelectedBill] =
        useState(null);

    const [paymentForm, setPaymentForm] =
        useState({
            payment_date: "",
            amount: "",
            payment_method: "transfer",
            bank_account_id: "",
            notes: "",
            proof_file: null,
        });

    const [paymentLoading, setPaymentLoading] =
        useState(false);

    const [paymentError, setPaymentError] =
        useState("");

    const [paymentSuccess, setPaymentSuccess] =
        useState("");


    // =====================================================
    // STATE REKENING BANK
    // =====================================================

    const [bankAccounts, setBankAccounts] =
        useState([]);

    const [bankAccountsLoading, setBankAccountsLoading] =
        useState(false);

    const [bankAccountsError, setBankAccountsError] =
        useState("");


    // =====================================================
    // STATE HASIL PEMBAYARAN TERAKHIR
    // =====================================================

    const [lastPayment, setLastPayment] =
        useState(null);


    // =====================================================
    // AMBIL TAGIHAN PENGHUNI
    // =====================================================

    const fetchTenantBills = async () => {

        try {

            setBillsLoading(true);

            setBillsError("");


            const response =
                await api.get(
                    "/bills/my-bills"
                );


            const data =
                response.data?.data;

            console.log(
                "BILL STATUS:",
                data.map((bill) => ({
                    id: bill.id,
                    month: bill.billing_month,
                    year: bill.billing_year,
                    amount: bill.amount,
                    status: bill.bill_status,
                }))
            );


            setBills(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Get Tenant Bills Error:",
                error
            );


            // =============================================
            // TOKEN TIDAK VALID
            // =============================================

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;

            }


            setBillsError(
                error.response?.data?.message ||
                "Gagal mengambil data tagihan"
            );


            setBills([]);


        } finally {

            setBillsLoading(false);

        }

    };

    // =====================================================
    // AMBIL RIWAYAT PEMBAYARAN PENGHUNI
    // =====================================================

    const fetchMyPayments = async () => {

        try {

            const response =
                await api.get(
                    "/payments/my-payments"
                );

            console.log(
                "MY PAYMENTS API RESPONSE:",
                response.data
            );

            const data =
                response.data?.data;

            // Backend mengembalikan array pembayaran
            if (Array.isArray(data) && data.length > 0) {

                // Ambil pembayaran terbaru
                setLastPayment(data[0]);

            } else {

                setLastPayment(null);

            }

        } catch (error) {

            console.error(
                "Get My Payments Error:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;

            }

            // Jangan membuat dashboard error hanya karena
            // riwayat pembayaran gagal dimuat.
            setLastPayment(null);

        }

    };

    // =====================================================
    // AMBIL BOOKING PENGHUNI
    // =====================================================

    const fetchMyBooking = async () => {

        try {

            setBookingLoading(true);
            setBookingError("");

            const response =
                await api.get(
                    "/bookings/my-booking"
                );

            console.log(
                "MY BOOKING API RESPONSE:",
                response.data
            );

            const data =
                response.data?.data;

            if (data?.booking) {

                setBooking(data);

            } else {

                setBooking(null);

            }

        } catch (error) {

            console.error(
                "Get My Booking Error:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;
            }

            if (
                error.response?.status === 404
            ) {

                setBooking(null);
                setBookingError("");

                return;
            }

            setBookingError(
                error.response?.data?.message ||
                error.message ||
                "Gagal mengambil data booking"
            );

            setBooking(null);

        } finally {

            setBookingLoading(false);

        }

    };


    // =====================================================
    // AMBIL DATA TENANT
    // =====================================================

    // =====================================================
    // AMBIL DATA AKUN PENGHUNI
    //
    // Kondisi:
    // 1. Penghuni aktif  -> memiliki tenant
    // 2. Calon penghuni  -> belum memiliki tenant
    //
    // Calon penghuni tetap boleh masuk dashboard.
    // =====================================================

    const fetchTenantData = async () => {

        try {

            setLoading(true);

            setError("");

            setIsCandidate(false);


            // =================================================
            // REQUEST DATA AKUN
            // =================================================

            const response =
                await api.get(
                    "/tenant-accounts/me"
                );


            const data =
                response.data?.data;


            // =================================================
            // DATA TIDAK ADA
            // =================================================

            if (!data) {

                throw new Error(
                    "Data akun penghuni tidak ditemukan"
                );

            }


            // =================================================
            // SIMPAN DATA USER
            // =================================================

            setUser(
                data.user || null
            );


            // =================================================
            // SIMPAN DATA TENANT
            // =================================================

            setTenant(
                data.tenant || null
            );


            // =================================================
            // SIMPAN DATA CONTRACT
            // =================================================

            setContract(
                data.contract || null
            );


            // =================================================
            // TENTUKAN STATUS AKUN
            // =================================================
            //
            // CALON PENGHUNI:
            // tenant ada DAN status tenant = calon
            //
            // PENGHUNI AKTIF:
            // tenant ada DAN status tenant = aktif
            //
            // Akun yang belum memiliki tenant juga
            // dianggap sebagai calon penghuni.
            //

            if (
                !data.tenant ||
                data.tenant.status === "calon"
            ) {

                setIsCandidate(true);

            } else {

                setIsCandidate(false);

            }


            // =================================================
            // UPDATE LOCAL STORAGE
            // =================================================

            if (data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );

            }


        } catch (error) {

            console.error(
                "Get Tenant Dashboard Error:",
                error
            );


            // =================================================
            // TOKEN TIDAK VALID
            // =================================================

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;

            }


            // =================================================
            // CALON PENGHUNI
            //
            // Jika backend masih mengembalikan 403 karena
            // tenant_id belum ada, jangan anggap sebagai
            // error dashboard.
            //
            // Akun tetap boleh masuk sebagai CALON.
            // =================================================

            if (
                error.response?.status === 403 &&
                error.response?.data?.message?.includes(
                    "tenant_id"
                )
            ) {

                const storedUser =
                    localStorage.getItem(
                        "user"
                    );


                if (storedUser) {

                    try {

                        setUser(
                            JSON.parse(
                                storedUser
                            )
                        );

                    } catch (parseError) {

                        console.error(
                            "Parse Local User Error:",
                            parseError
                        );

                    }

                }


                // =============================================
                // CALON PENGHUNI
                // =============================================

                setTenant(null);

                setContract(null);

                setIsCandidate(true);

                setError("");

                return;

            }


            // =================================================
            // FORBIDDEN LAIN
            // =================================================

            if (
                error.response?.status === 403
            ) {

                setError(
                    error.response?.data?.message ||
                    "Anda tidak memiliki akses ke portal penghuni"
                );

                return;

            }


            // =================================================
            // ERROR LAIN
            // =================================================

            setError(
                error.response?.data?.message ||
                error.message ||
                "Gagal mengambil data akun penghuni"
            );


        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // AMBIL KAMAR TERSEDIA
    // =====================================================
    //
    // Dipakai khusus untuk dashboard calon penghuni.
    //
    // Sumber data:
    // GET public rooms
    //
    // Hanya kamar dengan status:
    // available
    //
    // =====================================================

    const fetchAvailableRooms = async () => {

        try {

            setRoomsLoading(true);

            setRoomsError("");


            const response =
                await getPublicRooms();


            // =================================================
            // NORMALIZE RESPONSE
            // =================================================

            const roomData =
                Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];


            // =================================================
            // HANYA KAMAR TERSEDIA
            // =================================================

            const available =
                roomData.filter(
                    (room) =>
                        room.status === "available"
                );


            setAvailableRooms(
                available
            );


        } catch (error) {

            console.error(
                "Get Available Rooms Error:",
                error
            );


            setRoomsError(
                error.message ||
                "Gagal mengambil data kamar tersedia"
            );


            setAvailableRooms([]);

        } finally {

            setRoomsLoading(false);

        }

    };


    // =====================================================
    // AMBIL REKENING BANK AKTIF
    // =====================================================
    //
    // Dipakai hanya untuk pilihan rekening tujuan transfer.
    //
    // Jika endpoint bank-account tidak bisa diakses tenant,
    // dashboard TETAP bisa digunakan untuk cash/other.
    //
    // =====================================================

    const fetchBankAccounts = async () => {

        try {

            setBankAccountsLoading(true);

            setBankAccountsError("");


            const response =
                await api.get(
                    "/bank-accounts"
                );


            const data =
                response.data?.data;


            const accounts =
                Array.isArray(data)
                    ? data
                    : [];


            const activeAccounts =
                accounts.filter(
                    (account) => {

                        const status =
                            String(
                                account.status || ""
                            )
                                .trim()
                                .toLowerCase();


                        return (
                            status === "active" ||
                            status === "aktif" ||
                            Number(
                                account.is_active
                            ) === 1 ||
                            account.is_active === true
                        );

                    }
                );


            setBankAccounts(
                activeAccounts
            );


        } catch (error) {

            console.error(
                "Get Bank Accounts Error:",
                error
            );


            setBankAccountsError(
                error.response?.data?.message ||
                error.message ||
                "Gagal mengambil rekening bank"
            );


            setBankAccounts([]);


        } finally {

            setBankAccountsLoading(false);

        }

    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        fetchTenantData();

        fetchTenantBills();

        fetchBankAccounts();

        fetchMyBooking();

        fetchMyPayments();

    }, []);

    // =====================================================
    // LOAD KAMAR UNTUK CALON PENGHUNI
    // =====================================================

    useEffect(() => {

        if (!isCandidate) {

            return;

        }


        fetchAvailableRooms();

    }, [isCandidate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    // =====================================================
    // BUKA MODAL PASSWORD
    // =====================================================

    const openPasswordModal = () => {

        setCurrentPassword("");

        setNewPassword("");

        setConfirmPassword("");

        setChangePasswordError("");

        setChangePasswordSuccess("");

        setShowCurrentPassword(false);

        setShowNewPassword(false);

        setShowConfirmPassword(false);

        setShowPasswordModal(true);

    };


    // =====================================================
    // TUTUP MODAL PASSWORD
    // =====================================================

    const closePasswordModal = () => {

        if (
            changePasswordLoading
        ) {

            return;

        }


        setShowPasswordModal(false);

        setCurrentPassword("");

        setNewPassword("");

        setConfirmPassword("");

        setChangePasswordError("");

        setChangePasswordSuccess("");

    };


    // =====================================================
    // GANTI PASSWORD
    // =====================================================

    const handleChangePassword = async (
        e
    ) => {

        e.preventDefault();


        setChangePasswordError("");

        setChangePasswordSuccess("");


        // =================================================
        // VALIDASI PASSWORD LAMA
        // =================================================

        if (!currentPassword) {

            setChangePasswordError(
                "Password saat ini wajib diisi"
            );

            return;

        }


        // =================================================
        // VALIDASI PASSWORD BARU
        // =================================================

        if (!newPassword) {

            setChangePasswordError(
                "Password baru wajib diisi"
            );

            return;

        }


        if (
            newPassword.length < 6
        ) {

            setChangePasswordError(
                "Password baru minimal 6 karakter"
            );

            return;

        }


        // =================================================
        // VALIDASI KONFIRMASI
        // =================================================

        if (!confirmPassword) {

            setChangePasswordError(
                "Konfirmasi password wajib diisi"
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            setChangePasswordError(
                "Konfirmasi password tidak cocok"
            );

            return;

        }


        // =================================================
        // CEGAH PASSWORD SAMA
        // =================================================

        if (
            currentPassword ===
            newPassword
        ) {

            setChangePasswordError(
                "Password baru harus berbeda dari password lama"
            );

            return;

        }


        try {

            setChangePasswordLoading(
                true
            );


            const response =
                await api.post(
                    "/tenant-accounts/change-password",
                    {
                        current_password:
                            currentPassword,

                        new_password:
                            newPassword,

                        confirm_password:
                            confirmPassword
                    }
                );


            setChangePasswordSuccess(
                response.data?.message ||
                "Password berhasil diubah"
            );


            setCurrentPassword("");

            setNewPassword("");

            setConfirmPassword("");


            setTimeout(() => {

                closePasswordModal();

            }, 1000);


        } catch (error) {

            console.error(
                "Change Password Error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;

            }


            setChangePasswordError(
                error.response?.data?.message ||
                "Gagal mengubah password"
            );


        } finally {

            setChangePasswordLoading(
                false
            );

        }

    };


    // =====================================================
    // GET TODAY
    // =====================================================

    const getToday = () => {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            `${year}-${month}-${day}`
        );

    };


    // =====================================================
    // FORMAT RUPIAH
    // =====================================================

    const formatRupiah = (
        value
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "-";

        }


        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }
        ).format(
            Number(value)
        );

    };


    // =====================================================
    // FORMAT TANGGAL
    // =====================================================

    const formatDate = (
        value
    ) => {

        if (!value) {

            return "-";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return new Intl.DateTimeFormat(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(date);

    };


    // =====================================================
    // NAMA PENGHUNI
    // =====================================================

    const tenantName =
        tenant?.name ||
        user?.name ||
        "Penghuni";


    // =====================================================
    // USERNAME
    // =====================================================

    const username =
        user?.username ||
        "-";


    // =====================================================
    // ROLE
    // =====================================================

    const role =
        user?.role ||
        "penghuni";


    // =====================================================
    // KAMAR
    // =====================================================

    const roomNumber =
        contract?.room_number ||
        "-";


    // =====================================================
    // STATUS KONTRAK
    // =====================================================

    const contractStatus =
        contract?.status ||
        contract?.contract_status ||
        null;


    const contractStatusText =
        contractStatus === "active"
            ? "Aktif"
            : contractStatus
                ? contractStatus
                : "Belum ada";


    // =====================================================
    // HARGA KONTRAK
    // =====================================================

    const monthlyPrice =
        contract?.monthly_price ||
        null;


    // =====================================================
    // DATA TAGIHAN
    // =====================================================

    const unpaidBills =
        bills.filter(
            (bill) =>
                bill.bill_status === "unpaid" ||
                bill.bill_status === "late"
        );


    const totalOutstanding =
        unpaidBills.reduce(
            (
                total,
                bill
            ) =>
                total +
                Number(
                    bill.amount || 0
                ),
            0
        );


    const latestBill =
        bills.length > 0
            ? bills[0]
            : null;


    // =====================================================
    // PAYMENT STATUS
    // =====================================================

    const paymentPending =
        lastPayment?.status === "pending";


    // =====================================================
    // BILL YANG BISA DIBAYAR
    // =====================================================

    const payableBills =
        bills.filter(
            (bill) =>
                bill.bill_status === "unpaid" ||
                bill.bill_status === "late"
        );


    // =====================================================
    // STATUS TAGIHAN
    // =====================================================

    const getBillStatusText = (
        status
    ) => {

        if (
            status === "paid"
        ) {

            return "Lunas";

        }


        if (
            status === "late"
        ) {

            return "Terlambat";

        }


        return "Belum Dibayar";

    };


    const getBillStatusClass = (
        status
    ) => {

        if (
            status === "paid"
        ) {

            return (
                "bg-green-50 text-green-700"
            );

        }


        if (
            status === "late"
        ) {

            return (
                "bg-red-50 text-red-700"
            );

        }


        return (
            "bg-orange-50 text-orange-700"
        );

    };


    // =====================================================
    // PAYMENT STATUS TEXT
    // =====================================================

    const getPaymentStatusText = (
        status
    ) => {

        if (
            status === "pending"
        ) {

            return "Menunggu Verifikasi";

        }


        if (
            status === "verified"
        ) {

            return "Terverifikasi";

        }


        if (
            status === "rejected"
        ) {

            return "Ditolak";

        }


        return "Belum Ada Pembayaran";

    };


    // =====================================================
    // PAYMENT STATUS CLASS
    // =====================================================

    const getPaymentStatusClass = (
        status
    ) => {

        if (
            status === "pending"
        ) {

            return (
                "bg-yellow-50 text-yellow-700"
            );

        }


        if (
            status === "verified"
        ) {

            return (
                "bg-green-50 text-green-700"
            );

        }


        if (
            status === "rejected"
        ) {

            return (
                "bg-red-50 text-red-700"
            );

        }


        return (
            "bg-slate-100 text-slate-600"
        );

    };


    // =====================================================
    // BUKA MODAL PEMBAYARAN
    // =====================================================

    const openPaymentModal = (
        bill
    ) => {

        setSelectedBill(
            bill
        );


        setPaymentForm({
            payment_date:
                getToday(),

            amount:
                Number(
                    bill.amount || 0
                ),

            payment_method:
                "transfer",

            bank_account_id:
                bankAccounts.length === 1
                    ? String(
                        bankAccounts[0].id
                    )
                    : "",

            notes:
                ""
        });


        setPaymentError("");

        setPaymentSuccess("");

        setShowPaymentModal(
            true
        );

    };


    // =====================================================
    // TUTUP MODAL PEMBAYARAN
    // =====================================================

    const closePaymentModal = () => {

        if (
            paymentLoading
        ) {

            return;

        }


        setShowPaymentModal(
            false
        );


        setSelectedBill(
            null
        );


        setPaymentForm({
            payment_date: "",
            amount: "",
            payment_method: "transfer",
            bank_account_id: "",
            notes: "",
            proof_file: null
        });


        setPaymentError("");

        setPaymentSuccess("");

    };


    // =====================================================
    // HANDLE PAYMENT FORM
    // =====================================================

    const handlePaymentChange = (
        e
    ) => {

        const {
            name,
            value,
            files
        } = e.target;


        // ==================================================
        // INPUT FILE
        // ==================================================

        if (
            name === "proof_file"
        ) {

            setPaymentForm(
                (previous) => ({
                    ...previous,

                    proof_file:
                        files?.[0] || null

                })
            );

            return;

        }


        // ==================================================
        // INPUT BIASA
        // ==================================================

        setPaymentForm(
            (previous) => ({
                ...previous,

                [name]: value

            })
        );


        // ==================================================
        // JIKA METODE BUKAN TRANSFER
        // KOSONGKAN REKENING
        // ==================================================

        if (
            name === "payment_method" &&
            value !== "transfer"
        ) {

            setPaymentForm(
                (previous) => ({
                    ...previous,

                    payment_method: value,

                    bank_account_id: "",

                    proof_file: null

                })
            );

        }

    };


    // =====================================================
    // SUBMIT PEMBAYARAN
    // =====================================================

    const handleSubmitPayment = async (
        e
    ) => {

        e.preventDefault();


        setPaymentError("");

        setPaymentSuccess("");


        // =================================================
        // VALIDASI BILL
        // =================================================

        if (
            !selectedBill?.id
        ) {

            setPaymentError(
                "Tagihan tidak ditemukan."
            );

            return;

        }


        // =================================================
        // VALIDASI TANGGAL
        // =================================================

        if (
            !paymentForm.payment_date
        ) {

            setPaymentError(
                "Tanggal pembayaran wajib diisi."
            );

            return;

        }


        // =================================================
        // VALIDASI JUMLAH
        // =================================================

        const amount =
            Number(
                paymentForm.amount
            );


        const billAmount =
            Number(
                selectedBill.amount || 0
            );


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            setPaymentError(
                "Jumlah pembayaran harus lebih besar dari 0."
            );

            return;

        }


        if (
            amount > billAmount
        ) {

            setPaymentError(
                `Jumlah pembayaran tidak boleh melebihi tagihan ${formatRupiah(
                    billAmount
                )}.`
            );

            return;

        }


        // =================================================
        // VALIDASI METODE
        // =================================================

        if (
            ![
                "cash",
                "transfer",
                "other"
            ].includes(
                paymentForm.payment_method
            )
        ) {

            setPaymentError(
                "Metode pembayaran tidak valid."
            );

            return;

        }


        // =================================================
        // VALIDASI KHUSUS TRANSFER
        // =================================================

        if (
            paymentForm.payment_method ===
            "transfer"
        ) {


            // =================================================
            // WAJIB PILIH REKENING
            // =================================================

            if (
                !paymentForm.bank_account_id
            ) {

                setPaymentError(
                    "Silakan pilih rekening tujuan pembayaran."
                );

                return;

            }


            // =================================================
            // WAJIB UPLOAD BUKTI
            // =================================================

            if (
                !paymentForm.proof_file
            ) {

                setPaymentError(
                    "Bukti transfer wajib diupload."
                );

                return;

            }


            // =================================================
            // VALIDASI UKURAN FILE
            // Maksimal 5 MB
            // =================================================

            if (
                paymentForm.proof_file.size >
                5 * 1024 * 1024
            ) {

                setPaymentError(
                    "Ukuran bukti pembayaran maksimal 5 MB."
                );

                return;

            }


            // =================================================
            // VALIDASI TIPE FILE
            // =================================================

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp"
            ];


            if (
                !allowedTypes.includes(
                    paymentForm.proof_file.type
                )
            ) {

                setPaymentError(
                    "Bukti pembayaran harus berupa JPG, JPEG, PNG, atau WEBP."
                );

                return;

            }

        }


        // =================================================
        // REQUEST
        // =================================================

        try {

            setPaymentLoading(
                true
            );


            // =================================================
            // FORM DATA
            // =================================================

            const formData =
                new FormData();


            formData.append(
                "bill_id",
                Number(
                    selectedBill.id
                )
            );


            formData.append(
                "payment_date",
                paymentForm.payment_date
            );


            formData.append(
                "amount",
                amount
            );


            formData.append(
                "payment_method",
                paymentForm.payment_method
            );


            // =================================================
            // BANK ACCOUNT
            // =================================================

            if (
                paymentForm.payment_method ===
                "transfer"
            ) {

                formData.append(
                    "bank_account_id",
                    Number(
                        paymentForm.bank_account_id
                    )
                );

            }


            // =================================================
            // NOTES
            // =================================================

            formData.append(
                "notes",
                paymentForm.notes?.trim() || ""
            );


            // =================================================
            // BUKTI PEMBAYARAN
            // =================================================

            if (
                paymentForm.proof_file
            ) {

                formData.append(
                    "proof_file",
                    paymentForm.proof_file
                );

            }


            // =================================================
            // KIRIM KE BACKEND
            // =================================================

            console.log(
                "=== DEBUG FORM DATA ==="
            );

            for (
                const [key, value]
                of formData.entries()
            ) {

                console.log(
                    key,
                    value
                );

            }
            const response = await api.post(
                "/payments/tenant",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );


            // =================================================
            // DATA PAYMENT
            // =================================================

            const paymentData =
                response.data?.data ||
                null;


            setLastPayment(
                paymentData
            );


            // =================================================
            // SUCCESS
            // =================================================

            setPaymentSuccess(
                response.data?.message ||
                "Pembayaran berhasil dikirim dan menunggu verifikasi admin."
            );


            // =================================================
            // REFRESH TAGIHAN
            // =================================================

            await fetchTenantBills();


            // =================================================
            // RESET FORM
            // =================================================

            setPaymentForm(
                (previous) => ({
                    ...previous,

                    amount: "",

                    notes: "",

                    proof_file: null

                })
            );


            // =================================================
            // TUTUP MODAL
            // =================================================

            setTimeout(() => {

                closePaymentModal();

            }, 1500);


        } catch (error) {

            console.error(
                "Create Tenant Payment Error:",
                error
            );


            // =================================================
            // TOKEN EXPIRED
            // =================================================

            if (
                error.response?.status ===
                401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;

            }


            // =================================================
            // ERROR BACKEND
            // =================================================

            setPaymentError(
                error.response?.data?.message ||
                error.message ||
                "Gagal mengirim pembayaran."
            );


        } finally {

            setPaymentLoading(
                false
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading
    ) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-slate-100">

                <div className="flex flex-col items-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

                        <RefreshCw
                            size={23}
                            className="animate-spin text-white"
                        />

                    </div>


                    <p className="mt-4 text-sm font-medium text-slate-600">

                        Memuat data penghuni...

                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD CALON PENGHUNI
    // =====================================================

    if (
        isCandidate
    ) {

        return (

            <div className="min-h-screen bg-slate-100">

                {/* =================================================
            HEADER
            ================================================= */}

                <header className="border-b border-slate-200 bg-white">

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                        {/* BRAND */}

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

                                <Building2
                                    size={23}
                                    className="text-white"
                                />

                            </div>


                            <div>

                                <h1 className="text-lg font-bold text-slate-800">

                                    ADELINA KOST

                                </h1>


                                <p className="text-xs text-slate-500">

                                    Portal Calon Penghuni

                                </p>

                            </div>

                        </div>


                        {/* USER */}

                        <div className="flex items-center gap-4">

                            <div className="hidden text-right sm:block">

                                <p className="text-sm font-semibold text-slate-700">

                                    {user?.username ||
                                        "Calon Penghuni"}

                                </p>


                                <p className="text-xs text-slate-400">

                                    Calon Penghuni

                                </p>

                            </div>


                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">

                                {(user?.username || "C")
                                    .charAt(0)
                                    .toUpperCase()
                                }

                            </div>


                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                            >

                                <LogOut size={17} />

                                <span className="hidden sm:inline">

                                    Keluar

                                </span>

                            </button>

                        </div>

                    </div>

                </header>


                {/* =================================================
            CONTENT
            ================================================= */}

                <main className="mx-auto max-w-7xl px-6 py-8">


                    {/* =================================================
                WELCOME
                ================================================= */}

                    <div className="mb-8">

                        <p className="text-sm font-medium text-blue-600">

                            PORTAL CALON PENGHUNI

                        </p>


                        <h2 className="mt-1 text-3xl font-bold text-slate-800">

                            Selamat datang 👋

                        </h2>


                        <p className="mt-2 text-sm text-slate-500">

                            Pilih kamar yang tersedia untuk
                            memulai proses booking ADELINA KOST.

                        </p>

                    </div>


                    {/* =================================================
                STATUS AKUN
                ================================================= */}

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600">

                                <UserRound
                                    size={21}
                                    className="text-white"
                                />

                            </div>


                            <div>

                                <h3 className="font-semibold text-slate-800">

                                    Status Akun: Calon Penghuni

                                </h3>


                                <p className="mt-1 text-sm leading-6 text-slate-600">

                                    Akun Anda sudah aktif.
                                    Silakan pilih kamar yang tersedia
                                    untuk melanjutkan proses booking.

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                SUMMARY
                ================================================= */}

                    <div className="mt-6 grid gap-5 md:grid-cols-3">


                        {/* STATUS */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">

                                Status

                            </p>


                            <p className="mt-2 text-2xl font-bold text-slate-800">

                                Calon Penghuni

                            </p>


                            <p className="mt-3 text-xs text-slate-400">

                                Siap memilih kamar

                            </p>

                        </div>


                        {/* KAMAR TERSEDIA */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">

                                Kamar Tersedia

                            </p>


                            <p className="mt-2 text-2xl font-bold text-blue-600">

                                {roomsLoading
                                    ? "..."
                                    : availableRooms.length
                                }

                            </p>


                            <p className="mt-3 text-xs text-slate-400">

                                Kamar yang dapat dipilih

                            </p>

                        </div>


                        {/* BOOKING */}

                        {/* BOOKING */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">

                                Booking

                            </p>


                            {bookingLoading ? (

                                <>
                                    <p className="mt-2 text-2xl font-bold text-slate-800">

                                        ...

                                    </p>

                                    <p className="mt-3 text-xs text-slate-400">

                                        Memuat status booking...

                                    </p>
                                </>

                            ) : booking ? (

                                <>
                                    <p className="mt-2 text-2xl font-bold text-slate-800">

                                        Kamar{" "}
                                        {booking.room?.room_number || "-"}

                                    </p>


                                    <p className="mt-3">

                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${booking.booking?.status === "pending"
                                                ? "bg-yellow-50 text-yellow-700"
                                                : booking.booking?.status === "approved"
                                                    ? "bg-green-50 text-green-700"
                                                    : booking.booking?.status === "rejected"
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >

                                            {booking.booking?.status === "pending"
                                                ? "Menunggu Verifikasi"
                                                : booking.booking?.status === "approved"
                                                    ? "Disetujui"
                                                    : booking.booking?.status === "rejected"
                                                        ? "Ditolak"
                                                        : "Booking"
                                            }

                                        </span>

                                    </p>


                                    <p className="mt-3 text-xs text-slate-400">

                                        {booking.booking?.status === "pending"
                                            ? "Pengajuan sedang menunggu verifikasi admin"
                                            : booking.booking?.status === "approved"
                                                ? "Booking Anda telah disetujui"
                                                : booking.booking?.status === "rejected"
                                                    ? "Pengajuan booking ditolak"
                                                    : "Booking telah dibuat"
                                        }

                                    </p>
                                </>

                            ) : (

                                <>
                                    <p className="mt-2 text-2xl font-bold text-slate-800">

                                        Belum ada

                                    </p>

                                    <p className="mt-3 text-xs text-slate-400">

                                        Belum mengajukan booking

                                    </p>
                                </>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                KAMAR TERSEDIA
                ================================================= */}

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


                        {/* HEADER */}

                        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h3 className="text-xl font-bold text-slate-800">

                                    Kamar Tersedia

                                </h3>


                                <p className="mt-1 text-sm text-slate-500">

                                    Pilih kamar yang sesuai
                                    dengan kebutuhan Anda.

                                </p>

                            </div>


                            <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600">

                                {roomsLoading
                                    ? "Memuat..."
                                    : `${availableRooms.length} kamar tersedia`
                                }

                            </div>

                        </div>


                        {/* =================================================
                    LOADING
                    ================================================= */}

                        {roomsLoading ? (

                            <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-slate-50">

                                <div className="text-center">

                                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                    <p className="mt-4 text-sm font-medium text-slate-600">

                                        Memuat kamar tersedia...

                                    </p>

                                </div>

                            </div>

                        ) : roomsError ? (

                            /* =================================================
                               ERROR
                               ================================================= */

                            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                                <div className="flex items-start gap-3">

                                    <AlertCircle
                                        size={20}
                                        className="mt-0.5 shrink-0 text-red-600"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-red-700">

                                            Gagal memuat kamar

                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-red-600">

                                            {roomsError}

                                        </p>


                                        <button
                                            type="button"
                                            onClick={fetchAvailableRooms}
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-50"
                                        >

                                            <RefreshCw
                                                size={14}
                                            />

                                            Coba Lagi

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ) : availableRooms.length === 0 ? (

                            /* =================================================
                               EMPTY
                               ================================================= */

                            <div className="rounded-2xl bg-slate-50 px-6 py-12 text-center">

                                <div className="text-5xl">

                                    🏠

                                </div>


                                <h4 className="mt-4 text-base font-semibold text-slate-700">

                                    Belum Ada Kamar Tersedia

                                </h4>


                                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-400">

                                    Saat ini belum ada kamar yang
                                    dapat dipilih. Silakan cek kembali
                                    beberapa saat lagi.

                                </p>

                            </div>

                        ) : (

                            /* =================================================
                               ROOM GRID
                               ================================================= */

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


                                {availableRooms.map(
                                    (room) => (

                                        <div
                                            key={room.id}
                                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                        >


                                            {/* ROOM PREVIEW */}

                                            <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100">

                                                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-100 opacity-60 blur-2xl" />

                                                <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-indigo-100 opacity-60 blur-2xl" />


                                                <div className="relative text-7xl transition duration-300 group-hover:scale-110">

                                                    🛏️

                                                </div>


                                                <div className="absolute right-4 top-4">

                                                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">

                                                        Tersedia

                                                    </span>

                                                </div>

                                            </div>


                                            {/* CONTENT */}

                                            <div className="p-5">


                                                {/* BUILDING */}

                                                <p className="text-sm font-semibold text-blue-600">

                                                    {room.building_name ||
                                                        "ADELINA KOST"}

                                                </p>


                                                {/* ROOM */}

                                                <h4 className="mt-1 text-xl font-bold text-slate-900">

                                                    Kamar {room.room_number}

                                                </h4>


                                                {/* FLOOR */}

                                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                                                    <span>

                                                        📍

                                                    </span>

                                                    <span>

                                                        {room.floor_name ||
                                                            "Informasi lantai belum tersedia"}

                                                    </span>

                                                </div>


                                                {/* PRICE */}

                                                <div className="mt-4 border-t border-slate-100 pt-4">

                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                                        Harga sewa

                                                    </p>


                                                    <div className="mt-1 flex items-baseline gap-1">

                                                        <span className="text-lg font-bold text-slate-900">

                                                            {formatRupiah(
                                                                room.price
                                                            )}

                                                        </span>


                                                        <span className="text-xs text-slate-400">

                                                            / bulan

                                                        </span>

                                                    </div>

                                                </div>


                                                {/* BUTTON */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/kamar/${room.id}`
                                                        )
                                                    }
                                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                                                >

                                                    Pilih Kamar

                                                    <span className="transition group-hover:translate-x-1">

                                                        →

                                                    </span>

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                INFORMATION
                ================================================= */}

                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                        <p className="text-sm font-semibold text-blue-800">

                            Langkah Selanjutnya

                        </p>


                        <p className="mt-1 text-sm leading-6 text-blue-700">

                            Pilih kamar yang tersedia untuk melihat
                            detail kamar dan melanjutkan pengajuan
                            booking.

                        </p>

                    </div>

                </main>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================
    if (
        error
    ) {

        return (

            <div className="min-h-screen bg-slate-100">

                {/* HEADER */}

                <header className="border-b border-slate-200 bg-white">

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

                                <Building2
                                    size={23}
                                    className="text-white"
                                />

                            </div>


                            <div>

                                <h1 className="text-lg font-bold text-slate-800">

                                    ADELINA KOST

                                </h1>


                                <p className="text-xs text-slate-500">

                                    Portal Penghuni

                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                        >

                            <LogOut size={17} />

                            Keluar

                        </button>

                    </div>

                </header>


                {/* ERROR */}

                <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-20">

                    <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-7 text-center shadow-sm">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">

                            !

                        </div>


                        <h2 className="mt-4 text-lg font-bold text-slate-800">

                            Gagal Memuat Data

                        </h2>


                        <p className="mt-2 text-sm leading-6 text-slate-500">

                            {error}

                        </p>


                        <button
                            type="button"
                            onClick={fetchTenantData}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >

                            <RefreshCw size={17} />

                            Coba Lagi

                        </button>

                    </div>

                </main>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-100">


            {/* =================================================
                HEADER
                ================================================= */}

            <header className="border-b border-slate-200 bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


                    {/* BRAND */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

                            <Building2
                                size={23}
                                className="text-white"
                            />

                        </div>


                        <div>

                            <h1 className="text-lg font-bold text-slate-800">

                                ADELINA KOST

                            </h1>


                            <p className="text-xs text-slate-500">

                                Portal Penghuni

                            </p>

                        </div>

                    </div>


                    {/* USER */}

                    <div className="flex items-center gap-4">


                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-semibold text-slate-700">

                                {tenantName}

                            </p>


                            <p className="text-xs text-slate-400">

                                Penghuni

                            </p>

                        </div>


                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">

                            {tenantName
                                .charAt(0)
                                .toUpperCase()
                            }

                        </div>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                        >

                            <LogOut size={17} />

                            <span className="hidden sm:inline">

                                Keluar

                            </span>

                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
                CONTENT
                ================================================= */}

            <main className="mx-auto max-w-7xl px-6 py-8">


                {/* =================================================
                    WELCOME
                    ================================================= */}

                <div className="mb-8">

                    <p className="text-sm font-medium text-blue-600">

                        PORTAL PENGHUNI

                    </p>


                    <h2 className="mt-1 text-3xl font-bold text-slate-800">

                        Selamat datang, {tenantName} 👋

                    </h2>


                    <p className="mt-2 text-sm text-slate-500">

                        Kelola informasi kamar, kontrak,
                        tagihan, dan pembayaran Anda.

                    </p>

                </div>


                {/* =================================================
                    SUMMARY
                    ================================================= */}

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">


                    {/* KAMAR */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-500">

                                    Kamar Saya

                                </p>


                                <p className="mt-2 text-2xl font-bold text-slate-800">

                                    {roomNumber}

                                </p>

                            </div>


                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                                <Home
                                    size={21}
                                    className="text-blue-600"
                                />

                            </div>

                        </div>


                        <p className="mt-3 text-xs text-slate-400">

                            {contract
                                ? "Kamar aktif"
                                : "Belum memiliki kamar aktif"
                            }

                        </p>

                    </div>


                    {/* KONTRAK */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-500">

                                    Kontrak

                                </p>


                                <p className="mt-2 text-2xl font-bold text-slate-800">

                                    {contractStatusText}

                                </p>

                            </div>


                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">

                                <FileText
                                    size={21}
                                    className="text-indigo-600"
                                />

                            </div>

                        </div>


                        <p className="mt-3 text-xs text-slate-400">

                            {monthlyPrice
                                ? `${formatRupiah(monthlyPrice)} / bulan`
                                : "Status kontrak tempat tinggal"
                            }

                        </p>

                    </div>


                    {/* TAGIHAN */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-500">

                                    Tagihan

                                </p>


                                <p className="mt-2 text-2xl font-bold text-slate-800">

                                    {billsLoading
                                        ? "..."
                                        : formatRupiah(
                                            totalOutstanding
                                        )
                                    }

                                </p>

                            </div>


                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">

                                <Receipt
                                    size={21}
                                    className="text-orange-600"
                                />

                            </div>

                        </div>


                        <p className="mt-3 text-xs text-slate-400">

                            {billsLoading
                                ? "Memuat tagihan..."
                                : billsError
                                    ? billsError
                                    : unpaidBills.length > 0
                                        ? `${unpaidBills.length} tagihan belum lunas`
                                        : "Tidak ada tagihan yang belum lunas"
                            }

                        </p>

                    </div>


                    {/* PEMBAYARAN */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-500">
                                    Pembayaran
                                </p>


                                <p className="mt-2 text-2xl font-bold text-slate-800">

                                    {lastPayment
                                        ? formatRupiah(
                                            lastPayment.amount
                                        )
                                        : "-"
                                    }

                                </p>


                                <p className="mt-1 text-sm font-medium text-slate-600">

                                    {lastPayment
                                        ? (() => {

                                            const paidBill =
                                                bills.find(
                                                    (bill) =>
                                                        Number(bill.id) ===
                                                        Number(lastPayment.bill_id)
                                                );

                                            return paidBill
                                                ? `Periode ${paidBill.billing_month}/${paidBill.billing_year}`
                                                : "Periode pembayaran tidak ditemukan";

                                        })()
                                        : "Belum ada pembayaran"
                                    }

                                </p>

                            </div>


                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">

                                <CreditCard
                                    size={21}
                                    className="text-green-600"
                                />

                            </div>

                        </div>


                        <p className="mt-3 text-xs text-slate-400">

                            {lastPayment
                                ? getPaymentStatusText(
                                    lastPayment.status
                                )
                                : "Belum ada pembayaran dikirim"
                            }

                        </p>

                    </div>

                </div>


                {/* =================================================
                    PROFILE CARD
                    ================================================= */}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center justify-between gap-4">


                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                                <UserRound
                                    size={20}
                                    className="text-slate-600"
                                />

                            </div>


                            <div>

                                <h3 className="font-semibold text-slate-800">

                                    Informasi Akun

                                </h3>


                                <p className="text-xs text-slate-400">

                                    Data akun login Anda

                                </p>

                            </div>

                        </div>


                        {/* TOMBOL GANTI PASSWORD */}

                        <button
                            type="button"
                            onClick={
                                openPasswordModal
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >

                            <LockKeyhole
                                size={17}
                            />

                            <span className="hidden sm:inline">

                                Ganti Password

                            </span>

                        </button>

                    </div>


                    <div className="grid gap-5 md:grid-cols-2">


                        {/* NAMA */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                Nama

                            </p>


                            <p className="mt-1 text-sm font-medium text-slate-700">

                                {tenant?.name || "-"}

                            </p>

                        </div>


                        {/* USERNAME */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                Username

                            </p>


                            <p className="mt-1 text-sm font-medium text-slate-700">

                                {username}

                            </p>

                        </div>


                        {/* ROLE */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                Role

                            </p>


                            <p className="mt-1 text-sm font-medium capitalize text-slate-700">

                                {role}

                            </p>

                        </div>


                        {/* STATUS */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                Status Login

                            </p>


                            <div className="mt-1 flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-green-500" />

                                <span className="text-sm font-medium text-green-600">

                                    Aktif

                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DATA KONTRAK
                    ================================================= */}

                {contract && (

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


                        <div className="mb-5 flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">

                                <FileText
                                    size={20}
                                    className="text-indigo-600"
                                />

                            </div>


                            <div>

                                <h3 className="font-semibold text-slate-800">

                                    Informasi Kontrak

                                </h3>


                                <p className="text-xs text-slate-400">

                                    Detail kontrak tempat tinggal Anda

                                </p>

                            </div>

                        </div>


                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


                            {/* KAMAR */}

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                    Kamar

                                </p>


                                <p className="mt-1 text-sm font-semibold text-slate-700">

                                    {contract.room_number || "-"}

                                </p>

                            </div>


                            {/* TANGGAL MULAI */}

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                    Mulai Kontrak

                                </p>


                                <p className="mt-1 text-sm font-semibold text-slate-700">

                                    {formatDate(
                                        contract.start_date
                                    )}

                                </p>

                            </div>


                            {/* TANGGAL SELESAI */}

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                    Selesai Kontrak

                                </p>


                                <p className="mt-1 text-sm font-semibold text-slate-700">

                                    {contract.end_date
                                        ? formatDate(
                                            contract.end_date
                                        )
                                        : "-"
                                    }

                                </p>

                            </div>


                            {/* HARGA */}

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                    Harga / Bulan

                                </p>


                                <p className="mt-1 text-sm font-semibold text-slate-700">

                                    {formatRupiah(
                                        contract.monthly_price
                                    )}

                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    TAGIHAN SAYA
                    ================================================= */}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


                    <div className="mb-5 flex items-center justify-between gap-4">


                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

                                <Receipt
                                    size={20}
                                    className="text-orange-600"
                                />

                            </div>


                            <div>

                                <h3 className="font-semibold text-slate-800">

                                    Tagihan Saya

                                </h3>


                                <p className="text-xs text-slate-400">

                                    Daftar tagihan yang terhubung dengan kontrak Anda

                                </p>

                            </div>

                        </div>


                        {!billsLoading &&
                            bills.length > 0 && (

                                <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">

                                    {bills.length} tagihan

                                </div>

                            )}

                    </div>


                    {billsLoading ? (

                        <div className="flex items-center justify-center rounded-xl bg-slate-50 px-4 py-8">

                            <div className="flex items-center gap-2 text-sm text-slate-500">

                                <RefreshCw
                                    size={17}
                                    className="animate-spin"
                                />

                                Memuat tagihan...

                            </div>

                        </div>

                    ) : billsError ? (

                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">

                            <p className="text-sm font-semibold text-red-700">

                                Gagal memuat tagihan

                            </p>


                            <p className="mt-1 text-xs leading-5 text-red-600">

                                {billsError}

                            </p>


                            <button
                                type="button"
                                onClick={
                                    fetchTenantBills
                                }
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-50"
                            >

                                <RefreshCw
                                    size={14}
                                />

                                Coba Lagi

                            </button>

                        </div>

                    ) : bills.length === 0 ? (

                        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">

                            <Receipt
                                size={28}
                                className="mx-auto text-slate-300"
                            />


                            <p className="mt-3 text-sm font-medium text-slate-600">

                                Belum ada tagihan

                            </p>


                            <p className="mt-1 text-xs text-slate-400">

                                Tagihan Anda akan muncul di sini.

                            </p>

                        </div>

                    ) : (

                        <div className="space-y-3">

                            {bills.map(
                                (
                                    bill
                                ) => (

                                    <div
                                        key={
                                            bill.id
                                        }
                                        className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                                    >

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                                            {/* INFO TAGIHAN */}

                                            <div>

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <p className="text-sm font-semibold text-slate-800">

                                                        Tagihan{" "}
                                                        {bill.billing_month}
                                                        /
                                                        {bill.billing_year}

                                                    </p>


                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getBillStatusClass(
                                                            bill.bill_status
                                                        )}`}
                                                    >

                                                        {getBillStatusText(
                                                            bill.bill_status
                                                        )}

                                                    </span>

                                                </div>


                                                <div className="mt-2 space-y-1 text-xs text-slate-500">

                                                    <p>

                                                        Jatuh tempo:{" "}

                                                        <span className="font-medium text-slate-600">

                                                            {formatDate(
                                                                bill.due_date
                                                            )}

                                                        </span>

                                                    </p>


                                                    {bill.room_number && (

                                                        <p>

                                                            Kamar:{" "}

                                                            <span className="font-medium text-slate-600">

                                                                {
                                                                    bill.room_number
                                                                }

                                                            </span>

                                                        </p>

                                                    )}

                                                </div>

                                            </div>


                                            {/* NOMINAL + ACTION */}

                                            <div className="flex flex-col gap-3 sm:items-end">


                                                <div className="text-left sm:text-right">

                                                    <p className="text-lg font-bold text-slate-800">

                                                        {formatRupiah(
                                                            bill.amount
                                                        )}

                                                    </p>


                                                    <p className="mt-1 text-xs text-slate-400">

                                                        Tagihan bulanan

                                                    </p>

                                                </div>


                                                {/* =================================================
                                                    TOMBOL PEMBAYARAN
                                                    ================================================= */}

                                                {(
                                                    bill.bill_status ===
                                                    "unpaid" ||
                                                    bill.bill_status ===
                                                    "late"
                                                ) && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openPaymentModal(
                                                                    bill
                                                                )
                                                            }
                                                            disabled={
                                                                paymentPending
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                                                        >

                                                            <CreditCard
                                                                size={16}
                                                            />

                                                            {paymentPending
                                                                ? "Menunggu Verifikasi"
                                                                : "Bayar Sekarang"
                                                            }

                                                        </button>

                                                    )}

                                            </div>

                                        </div>


                                        {/* =================================================
                                            INFO PAYMENT TERAKHIR
                                            ================================================= */}

                                        {lastPayment &&
                                            Number(
                                                lastPayment.bill_id
                                            ) ===
                                            Number(
                                                bill.id
                                            ) && (

                                                <div className="mt-4 border-t border-slate-200 pt-4">

                                                    <div className="flex items-start gap-3 rounded-xl bg-white px-4 py-3">

                                                        {lastPayment.status ===
                                                            "pending" ? (

                                                            <WalletCards
                                                                size={18}
                                                                className="mt-0.5 shrink-0 text-yellow-600"
                                                            />

                                                        ) : lastPayment.status ===
                                                            "verified" ? (

                                                            <CheckCircle2
                                                                size={18}
                                                                className="mt-0.5 shrink-0 text-green-600"
                                                            />

                                                        ) : (

                                                            <AlertCircle
                                                                size={18}
                                                                className="mt-0.5 shrink-0 text-red-600"
                                                            />

                                                        )}


                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <p className="text-xs font-semibold text-slate-700">

                                                                    Pembayaran

                                                                </p>


                                                                <span
                                                                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getPaymentStatusClass(
                                                                        lastPayment.status
                                                                    )}`}
                                                                >

                                                                    {getPaymentStatusText(
                                                                        lastPayment.status
                                                                    )}

                                                                </span>

                                                            </div>


                                                            <p className="mt-1 text-xs text-slate-500">

                                                                {formatRupiah(
                                                                    lastPayment.amount
                                                                )}

                                                                {" • "}

                                                                {lastPayment.payment_method ===
                                                                    "transfer"
                                                                    ? "Transfer"
                                                                    : lastPayment.payment_method ===
                                                                        "cash"
                                                                        ? "Cash"
                                                                        : "Lainnya"
                                                                }

                                                            </p>


                                                            {lastPayment.notes && (

                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    Catatan:{" "}

                                                                    {
                                                                        lastPayment.notes
                                                                    }

                                                                </p>

                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    INFORMATION
                    ================================================= */}

                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                    <p className="text-sm font-semibold text-blue-800">

                        Portal Penghuni ADELINA KOST

                    </p>


                    <p className="mt-1 text-sm leading-6 text-blue-700">

                        Data akun, kamar, kontrak, tagihan,
                        dan pembayaran Anda sekarang terhubung
                        dengan sistem ADELINA KOST.

                    </p>

                </div>


            </main>


            {/* =====================================================
                MODAL PEMBAYARAN
                ===================================================== */}

            {showPaymentModal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget &&
                            !paymentLoading
                        ) {

                            closePaymentModal();

                        }

                    }}
                >

                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto overflow-hidden rounded-3xl bg-white shadow-2xl">


                        {/* =================================================
                            HEADER
                            ================================================= */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">

                                    <CreditCard
                                        size={21}
                                        className="text-green-600"
                                    />

                                </div>


                                <div>

                                    <h3 className="font-bold text-slate-800">

                                        Lakukan Pembayaran

                                    </h3>


                                    <p className="text-xs text-slate-400">

                                        Kirim pembayaran untuk diverifikasi admin

                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closePaymentModal
                                }
                                disabled={
                                    paymentLoading
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Tutup"
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>


                        {/* =================================================
                            BODY
                            ================================================= */}

                        <form
                            onSubmit={
                                handleSubmitPayment
                            }
                            className="px-6 py-6"
                        >


                            {/* =================================================
                                DETAIL TAGIHAN
                                ================================================= */}

                            {selectedBill && (

                                <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-xs font-medium text-blue-600">

                                                Tagihan yang dibayar

                                            </p>


                                            <p className="mt-1 text-sm font-bold text-slate-800">

                                                Tagihan{" "}
                                                {
                                                    selectedBill.billing_month
                                                }
                                                /
                                                {
                                                    selectedBill.billing_year
                                                }

                                            </p>


                                            <p className="mt-1 text-xs text-slate-500">

                                                Jatuh tempo:{" "}

                                                {
                                                    formatDate(
                                                        selectedBill.due_date
                                                    )
                                                }

                                            </p>

                                        </div>


                                        <div className="text-right">

                                            <p className="text-lg font-bold text-slate-800">

                                                {formatRupiah(
                                                    selectedBill.amount
                                                )}

                                            </p>


                                            <p className="text-xs text-slate-400">

                                                Total tagihan

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                ERROR
                                ================================================= */}

                            {paymentError && (

                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                    <AlertCircle
                                        size={18}
                                        className="mt-0.5 shrink-0 text-red-600"
                                    />


                                    <div>

                                        <p className="text-sm font-semibold text-red-700">

                                            Gagal mengirim pembayaran

                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-red-600">

                                            {paymentError}

                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                SUCCESS
                                ================================================= */}

                            {paymentSuccess && (

                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                                    <CheckCircle2
                                        size={19}
                                        className="mt-0.5 shrink-0 text-green-600"
                                    />


                                    <div>

                                        <p className="text-sm font-semibold text-green-700">

                                            Pembayaran Terkirim

                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-green-600">

                                            {paymentSuccess}

                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                TANGGAL PEMBAYARAN
                                ================================================= */}

                            <div>

                                <label
                                    htmlFor="payment-date"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Tanggal Pembayaran

                                </label>


                                <input
                                    id="payment-date"
                                    name="payment_date"
                                    type="date"
                                    value={
                                        paymentForm.payment_date
                                    }
                                    onChange={
                                        handlePaymentChange
                                    }
                                    disabled={
                                        paymentLoading
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                            </div>


                            {/* =================================================
                                JUMLAH
                                ================================================= */}

                            <div className="mt-5">

                                <label
                                    htmlFor="payment-amount"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Jumlah Pembayaran

                                </label>


                                <div className="relative">

                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">

                                        Rp

                                    </span>


                                    <input
                                        id="payment-amount"
                                        name="amount"
                                        type="number"
                                        min="1"
                                        max={
                                            selectedBill
                                                ? Number(
                                                    selectedBill.amount
                                                )
                                                : undefined
                                        }
                                        value={
                                            paymentForm.amount
                                        }
                                        onChange={
                                            handlePaymentChange
                                        }
                                        disabled={
                                            paymentLoading
                                        }
                                        placeholder="700000"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                </div>


                                {selectedBill && (

                                    <p className="mt-1 text-xs text-slate-400">

                                        Maksimal{" "}

                                        {formatRupiah(
                                            selectedBill.amount
                                        )}

                                    </p>

                                )}

                            </div>


                            {/* =================================================
                                METODE PEMBAYARAN
                                ================================================= */}

                            <div className="mt-5">

                                <label
                                    htmlFor="payment-method"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Metode Pembayaran

                                </label>


                                <select
                                    id="payment-method"
                                    name="payment_method"
                                    value={
                                        paymentForm.payment_method
                                    }
                                    onChange={
                                        handlePaymentChange
                                    }
                                    disabled={
                                        paymentLoading
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <option value="transfer">

                                        Transfer Bank

                                    </option>


                                    <option value="cash">

                                        Cash

                                    </option>


                                    <option value="other">

                                        Lainnya

                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                REKENING TUJUAN
                                ================================================= */}

                            {paymentForm.payment_method ===
                                "transfer" && (

                                    <div className="mt-5">

                                        <label
                                            htmlFor="bank-account"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >

                                            Rekening Tujuan

                                        </label>


                                        {bankAccountsLoading ? (

                                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3.5 text-sm text-slate-500">

                                                <RefreshCw
                                                    size={16}
                                                    className="animate-spin"
                                                />

                                                Memuat rekening...

                                            </div>

                                        ) : bankAccounts.length ===
                                            0 ? (

                                            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">

                                                <p className="text-xs font-semibold text-yellow-700">

                                                    Rekening belum tersedia

                                                </p>


                                                <p className="mt-1 text-xs leading-5 text-yellow-600">

                                                    Rekening tujuan transfer belum dapat ditampilkan. Hubungi pengelola kos.

                                                </p>

                                            </div>

                                        ) : (

                                            <select
                                                id="bank-account"
                                                name="bank_account_id"
                                                value={
                                                    paymentForm.bank_account_id
                                                }
                                                onChange={
                                                    handlePaymentChange
                                                }
                                                disabled={
                                                    paymentLoading
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                            >

                                                <option value="">

                                                    Pilih rekening tujuan

                                                </option>


                                                {bankAccounts.map(
                                                    (
                                                        account
                                                    ) => (

                                                        <option
                                                            key={
                                                                account.id
                                                            }
                                                            value={
                                                                account.id
                                                            }
                                                        >

                                                            {
                                                                account.bank_name
                                                            }

                                                            {" - "}

                                                            {
                                                                account.account_number
                                                            }

                                                            {" - "}

                                                            {
                                                                account.account_name
                                                            }

                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        )}


                                        {bankAccountsError && (

                                            <p className="mt-1 text-xs text-red-500">

                                                {bankAccountsError}

                                            </p>

                                        )}

                                    </div>

                                )}


                            {/* =================================================
                                CATATAN
                                ================================================= */}

                            <div className="mt-5">

                                <label
                                    htmlFor="payment-notes"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Catatan{" "}

                                    <span className="font-normal text-slate-400">

                                        (opsional)

                                    </span>

                                </label>


                                <textarea
                                    id="payment-notes"
                                    name="notes"
                                    rows="3"
                                    value={
                                        paymentForm.notes
                                    }
                                    onChange={
                                        handlePaymentChange
                                    }
                                    disabled={
                                        paymentLoading
                                    }
                                    placeholder="Contoh: pembayaran sewa bulan Agustus"
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                            </div>

                            {/* ================================================
    BUKTI PEMBAYARAN
================================================ */}

                            {paymentForm.payment_method === "transfer" && (

                                <div className="mt-4">

                                    <label
                                        htmlFor="payment-proof"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Bukti Pembayaran
                                    </label>

                                    <input
                                        id="payment-proof"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        disabled={paymentLoading}
                                        onChange={(e) => {

                                            const file =
                                                e.target.files?.[0] || null;

                                            setPaymentForm((previous) => ({
                                                ...previous,
                                                proof_file: file
                                            }));

                                        }}
                                        className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600"
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Format JPG, JPEG, PNG, atau WEBP. Maksimal 5 MB.
                                    </p>

                                    {paymentForm.proof_file && (

                                        <div className="mt-2 rounded-lg bg-green-50 px-3 py-2">

                                            <p className="text-xs font-medium text-green-700">
                                                File dipilih
                                            </p>

                                            <p className="mt-1 truncate text-xs text-green-600">
                                                {paymentForm.proof_file.name}
                                            </p>

                                        </div>

                                    )}

                                </div>

                            )}


                            {/* =================================================
                                INFO VERIFIKASI
                                ================================================= */}

                            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">

                                <div className="flex items-start gap-3">

                                    <Send
                                        size={17}
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />


                                    <p className="text-xs leading-5 text-slate-500">

                                        Setelah pembayaran dikirim, status akan menjadi{" "}

                                        <span className="font-semibold text-yellow-600">

                                            Menunggu Verifikasi

                                        </span>

                                        . Pembayaran baru dianggap sah setelah diverifikasi oleh admin.

                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                BUTTON
                                ================================================= */}

                            <div className="mt-6 flex gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        closePaymentModal
                                    }
                                    disabled={
                                        paymentLoading
                                    }
                                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    Batal

                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        paymentLoading ||
                                        (
                                            paymentForm.payment_method ===
                                            "transfer" &&
                                            bankAccounts.length ===
                                            0
                                        )
                                    }
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {paymentLoading ? (

                                        <>

                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            Mengirim...

                                        </>

                                    ) : (

                                        <>

                                            <Send
                                                size={17}
                                            />

                                            Kirim Pembayaran

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =====================================================
                MODAL GANTI PASSWORD
                ===================================================== */}

            {showPasswordModal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget &&
                            !changePasswordLoading
                        ) {

                            closePasswordModal();

                        }

                    }}
                >

                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">


                        {/* =================================================
                            MODAL HEADER
                            ================================================= */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">


                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                                    <LockKeyhole
                                        size={21}
                                        className="text-blue-600"
                                    />

                                </div>


                                <div>

                                    <h3 className="font-bold text-slate-800">

                                        Ganti Password

                                    </h3>


                                    <p className="text-xs text-slate-400">

                                        Amankan akun penghuni Anda

                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closePasswordModal
                                }
                                disabled={
                                    changePasswordLoading
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Tutup"
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>


                        {/* =================================================
                            MODAL BODY
                            ================================================= */}

                        <form
                            onSubmit={
                                handleChangePassword
                            }
                            className="px-6 py-6"
                        >


                            {/* ERROR */}

                            {changePasswordError && (

                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                    <p className="text-sm font-semibold text-red-700">

                                        Gagal mengubah password

                                    </p>


                                    <p className="mt-1 text-xs leading-5 text-red-600">

                                        {changePasswordError}

                                    </p>

                                </div>

                            )}


                            {/* SUCCESS */}

                            {changePasswordSuccess && (

                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                                    <CheckCircle2
                                        size={19}
                                        className="mt-0.5 shrink-0 text-green-600"
                                    />


                                    <div>

                                        <p className="text-sm font-semibold text-green-700">

                                            Berhasil

                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-green-600">

                                            {changePasswordSuccess}

                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* PASSWORD LAMA */}

                            <div>

                                <label
                                    htmlFor="current-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Password Saat Ini

                                </label>


                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        id="current-password"
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            currentPassword
                                        }
                                        onChange={(e) =>
                                            setCurrentPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="current-password"
                                        disabled={
                                            changePasswordLoading
                                        }
                                        placeholder="Masukkan password saat ini"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                        disabled={
                                            changePasswordLoading
                                        }
                                        className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                                        aria-label={
                                            showCurrentPassword
                                                ? "Sembunyikan password"
                                                : "Tampilkan password"
                                        }
                                    >

                                        {showCurrentPassword ? (

                                            <EyeOff
                                                size={18}
                                            />

                                        ) : (

                                            <Eye
                                                size={18}
                                            />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* PASSWORD BARU */}

                            <div className="mt-5">

                                <label
                                    htmlFor="new-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Password Baru

                                </label>


                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        id="new-password"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            newPassword
                                        }
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                        disabled={
                                            changePasswordLoading
                                        }
                                        placeholder="Minimal 6 karakter"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                        disabled={
                                            changePasswordLoading
                                        }
                                        className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                                        aria-label={
                                            showNewPassword
                                                ? "Sembunyikan password"
                                                : "Tampilkan password"
                                        }
                                    >

                                        {showNewPassword ? (

                                            <EyeOff
                                                size={18}
                                            />

                                        ) : (

                                            <Eye
                                                size={18}
                                            />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* KONFIRMASI PASSWORD */}

                            <div className="mt-5">

                                <label
                                    htmlFor="confirm-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Konfirmasi Password Baru

                                </label>


                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                        disabled={
                                            changePasswordLoading
                                        }
                                        placeholder="Ulangi password baru"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        disabled={
                                            changePasswordLoading
                                        }
                                        className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Sembunyikan password"
                                                : "Tampilkan password"
                                        }
                                    >

                                        {showConfirmPassword ? (

                                            <EyeOff
                                                size={18}
                                            />

                                        ) : (

                                            <Eye
                                                size={18}
                                            />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* INFO */}

                            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">

                                <p className="text-xs leading-5 text-slate-500">

                                    Password minimal 6 karakter.
                                    Setelah berhasil diubah, gunakan
                                    password baru untuk login berikutnya.

                                </p>

                            </div>


                            {/* BUTTON */}

                            <div className="mt-6 flex gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        closePasswordModal
                                    }
                                    disabled={
                                        changePasswordLoading
                                    }
                                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    Batal

                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        changePasswordLoading
                                    }
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {changePasswordLoading ? (

                                        <>

                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            Menyimpan...

                                        </>

                                    ) : (

                                        <>

                                            <LockKeyhole
                                                size={17}
                                            />

                                            Simpan Password

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


export default TenantDashboard;