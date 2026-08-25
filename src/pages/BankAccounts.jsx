import { useEffect, useState } from "react";
import api from "../services/api";

// =====================================================
// BANK LOGO
// =====================================================

const BankLogo = ({ bankName }) => {
    const bank = String(bankName || "").toLowerCase().trim();

    // =================================================
    // SEABANK
    // =================================================

    if (
        bank.includes("seabank") ||
        bank.includes("sea bank")
    ) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-orange-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="SeaBank"
                >
                    <circle
                        cx="45"
                        cy="28"
                        r="20"
                        fill="#F26B21"
                    />

                    <text
                        x="45"
                        y="36"
                        textAnchor="middle"
                        fontSize="23"
                        fontWeight="700"
                        fill="white"
                        fontFamily="Arial, sans-serif"
                    >
                        S
                    </text>

                    <path
                        d="M25 50 C34 44, 43 44, 52 50"
                        fill="none"
                        stroke="#2774C8"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />

                    <path
                        d="M25 57 C34 51, 43 51, 52 57"
                        fill="none"
                        stroke="#2774C8"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />

                    <text
                        x="72"
                        y="36"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#F26B21"
                        fontFamily="Arial, sans-serif"
                    >
                        SeaBank
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // BCA
    // =================================================

    if (bank === "bca" || bank.includes("bca")) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-blue-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="BCA"
                >
                    {/* Blue mountain */}
                    <path
                        d="M12 43 L31 24 L43 36 L57 16 L78 43 Z"
                        fill="#1683C6"
                    />

                    {/* Red accent */}
                    <path
                        d="M48 35 L59 24 L70 35 L59 46 Z"
                        fill="#E53935"
                    />

                    {/* BCA text */}
                    <text
                        x="50"
                        y="57"
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="700"
                        fill="#1674B8"
                        fontFamily="Arial, sans-serif"
                    >
                        BCA
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // BSI
    // =================================================

    if (
        bank === "bsi" ||
        bank.includes("bank syariah indonesia")
    ) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-green-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="BSI"
                >
                    <circle
                        cx="35"
                        cy="32"
                        r="20"
                        fill="#009B4D"
                    />

                    <path
                        d="M25 32 L31 38 L45 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <text
                        x="69"
                        y="37"
                        textAnchor="middle"
                        fontSize="15"
                        fontWeight="700"
                        fill="#009B4D"
                        fontFamily="Arial, sans-serif"
                    >
                        BSI
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // MANDIRI
    // =================================================

    if (bank.includes("mandiri")) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-blue-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="Bank Mandiri"
                >
                    <rect
                        x="12"
                        y="19"
                        width="26"
                        height="26"
                        rx="5"
                        fill="#003B70"
                    />

                    <path
                        d="M18 34 L25 25 L32 34"
                        fill="none"
                        stroke="#F4B000"
                        strokeWidth="5"
                    />

                    <text
                        x="67"
                        y="31"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#003B70"
                        fontFamily="Arial, sans-serif"
                    >
                        BANK
                    </text>

                    <text
                        x="67"
                        y="42"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#003B70"
                        fontFamily="Arial, sans-serif"
                    >
                        MANDIRI
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // BNI
    // =================================================

    if (bank === "bni" || bank.includes("bni")) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-orange-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="BNI"
                >
                    <path
                        d="M15 25 L42 17 L48 27 L25 34 Z"
                        fill="#F58220"
                    />

                    <path
                        d="M25 37 L51 29 L57 40 L31 47 Z"
                        fill="#F58220"
                    />

                    <text
                        x="72"
                        y="39"
                        textAnchor="middle"
                        fontSize="15"
                        fontWeight="700"
                        fill="#F58220"
                        fontFamily="Arial, sans-serif"
                    >
                        BNI
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // BRI
    // =================================================

    if (bank === "bri" || bank.includes("bri")) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-blue-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="BRI"
                >
                    <rect
                        x="10"
                        y="19"
                        width="32"
                        height="32"
                        rx="6"
                        fill="#0057A8"
                    />

                    <circle
                        cx="26"
                        cy="35"
                        r="9"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                    />

                    <text
                        x="69"
                        y="40"
                        textAnchor="middle"
                        fontSize="17"
                        fontWeight="700"
                        fill="#0057A8"
                        fontFamily="Arial, sans-serif"
                    >
                        BRI
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // CIMB NIAGA
    // =================================================

    if (
        bank.includes("cimb") ||
        bank.includes("niaga")
    ) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-red-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="CIMB Niaga"
                >
                    <circle
                        cx="30"
                        cy="35"
                        r="17"
                        fill="#D71920"
                    />

                    <path
                        d="M22 35 L30 27 L38 35 L30 43 Z"
                        fill="white"
                    />

                    <text
                        x="69"
                        y="33"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#D71920"
                        fontFamily="Arial, sans-serif"
                    >
                        CIMB
                    </text>

                    <text
                        x="69"
                        y="44"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="600"
                        fill="#D71920"
                        fontFamily="Arial, sans-serif"
                    >
                        NIAGA
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // PERMATA
    // =================================================

    if (bank.includes("permata")) {
        return (
            <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-red-100 bg-white">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="PermataBank"
                >
                    <path
                        d="M29 16 L48 35 L29 54 L10 35 Z"
                        fill="#E21E2B"
                    />

                    <path
                        d="M29 24 L40 35 L29 46 L18 35 Z"
                        fill="white"
                    />

                    <text
                        x="69"
                        y="39"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="700"
                        fill="#E21E2B"
                        fontFamily="Arial, sans-serif"
                    >
                        PERMATA
                    </text>
                </svg>
            </div>
        );
    }

    // =================================================
    // DEFAULT / UNKNOWN BANK
    // =================================================

    const initials = String(bankName || "BANK")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
            <div className="text-center">
                <div className="text-xl font-bold text-gray-500">
                    {initials || "BANK"}
                </div>

                <div className="text-[9px] font-medium text-gray-400">
                    BANK
                </div>
            </div>
        </div>
    );
};


// =====================================================
// MAIN COMPONENT
// =====================================================

const BankAccounts = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const [form, setForm] = useState({
        bank_name: "",
        account_name: "",
        account_number: "",
        account_type: "bank",
        current_balance: "",
        is_active: true,
        notes: "",
    });


    // =====================================================
    // GET ALL BANK ACCOUNTS
    // =====================================================

    const fetchAccounts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/bank-accounts");

            console.log(
                "Bank Accounts Response:",
                response.data
            );

            setAccounts(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "Get Bank Accounts Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Gagal mengambil data rekening bank"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchAccounts();

    }, []);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setForm({
            bank_name: "",
            account_name: "",
            account_number: "",
            account_type: "bank",
            current_balance: "",
            is_active: true,
            notes: "",
        });

        setEditingAccount(null);
    };


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const handleAdd = () => {

        resetForm();

        setError("");
        setSuccess("");

        setShowModal(true);
    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleEdit = (account) => {

        setEditingAccount(account);

        setForm({

            bank_name:
                account.bank_name || "",

            account_name:
                account.account_name || "",

            account_number:
                account.account_number || "",

            account_type:
                account.account_type || "bank",

            current_balance:
                account.current_balance !== null &&
                    account.current_balance !== undefined
                    ? account.current_balance
                    : "",

            is_active:
                account.is_active === true ||
                account.is_active === 1,

            notes:
                account.notes || "",
        });

        setError("");
        setSuccess("");

        setShowModal(true);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        resetForm();

        setError("");
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            setError("");
            setSuccess("");


            // =================================================
            // VALIDASI
            // =================================================

            if (!form.bank_name.trim()) {

                setError(
                    "Nama bank wajib diisi."
                );

                setSaving(false);

                return;
            }


            if (!form.account_name.trim()) {

                setError(
                    "Nama pemilik rekening wajib diisi."
                );

                setSaving(false);

                return;
            }


            if (!form.account_number.trim()) {

                setError(
                    "Nomor rekening wajib diisi."
                );

                setSaving(false);

                return;
            }


            // =================================================
            // VALIDASI SALDO
            // =================================================

            const balance = Number(
                form.current_balance || 0
            );

            if (
                Number.isNaN(balance) ||
                balance < 0
            ) {

                setError(
                    "Saldo harus berupa angka dan tidak boleh negatif."
                );

                setSaving(false);

                return;
            }


            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                bank_name:
                    form.bank_name.trim(),

                account_name:
                    form.account_name.trim(),

                account_number:
                    form.account_number.trim(),

                account_type:
                    form.account_type || "bank",

                current_balance:
                    balance,

                is_active:
                    Boolean(form.is_active),

                notes:
                    form.notes.trim() || null,
            };


            console.log(
                "Bank Account Payload:",
                payload
            );


            // =================================================
            // CREATE
            // =================================================

            if (!editingAccount) {

                const response =
                    await api.post(
                        "/bank-accounts",
                        payload
                    );

                setSuccess(
                    response.data?.message ||
                    "Rekening bank berhasil ditambahkan"
                );
            }


            // =================================================
            // UPDATE
            // =================================================

            else {

                const response =
                    await api.put(
                        `/bank-accounts/${editingAccount.id}`,
                        payload
                    );

                setSuccess(
                    response.data?.message ||
                    "Rekening bank berhasil diperbarui"
                );
            }


            // =================================================
            // REFRESH DATA
            // =================================================

            await fetchAccounts();

            setShowModal(false);

            resetForm();

        } catch (error) {

            console.error(
                "Save Bank Account Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Gagal menyimpan rekening bank"
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // NONAKTIFKAN REKENING
    // =====================================================

    const handleDeactivate = async (account) => {

        const confirmed =
            window.confirm(
                `Apakah Anda yakin ingin menonaktifkan rekening ${account.bank_name} - ${account.account_number}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");

            const response =
                await api.delete(
                    `/bank-accounts/${account.id}`
                );

            setSuccess(
                response.data?.message ||
                "Rekening bank berhasil dinonaktifkan"
            );

            await fetchAccounts();

        } catch (error) {

            console.error(
                "Deactivate Bank Account Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Gagal menonaktifkan rekening bank"
            );
        }
    };


    // =====================================================
    // AKTIFKAN KEMBALI
    // =====================================================

    const handleActivate = async (account) => {

        const confirmed =
            window.confirm(
                `Aktifkan kembali rekening ${account.bank_name} - ${account.account_number}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");


            const payload = {

                bank_name:
                    account.bank_name,

                account_name:
                    account.account_name,

                account_number:
                    account.account_number,

                account_type:
                    account.account_type || "bank",

                current_balance:
                    Number(
                        account.current_balance || 0
                    ),

                is_active: true,

                notes:
                    account.notes || null,
            };


            const response =
                await api.put(
                    `/bank-accounts/${account.id}`,
                    payload
                );


            setSuccess(
                response.data?.message ||
                "Rekening berhasil diaktifkan kembali"
            );


            await fetchAccounts();

        } catch (error) {

            console.error(
                "Activate Bank Account Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Gagal mengaktifkan rekening bank"
            );
        }
    };


    // =====================================================
    // FORMAT ACCOUNT TYPE
    // =====================================================

    const formatAccountType = (type) => {

        const types = {

            bank: "Bank",

            cash: "Kas",

            e_wallet: "E-Wallet",
        };

        return (
            types[type] ||
            "Bank"
        );
    };


    // =====================================================
    // FORMAT RUPIAH
    // =====================================================

    const formatRupiah = (value) => {

        const number =
            Number(value || 0);

        return `Rp ${number.toLocaleString(
            "id-ID"
        )}`;
    };


    // =====================================================
    // FORMAT NOMOR REKENING
    // =====================================================

    const formatAccountNumber = (number) => {

        if (!number) {
            return "-";
        }

        return String(number);
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Rekening Bank
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Kelola rekening keuangan ADELINA KOST
                    </p>

                </div>


                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                    + Tambah Rekening
                </button>

            </div>


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">

                    {success}

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && !showModal && (

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

                    {error}

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="rounded-xl border bg-white p-8 text-center text-gray-500">

                    Memuat data rekening...

                </div>

            ) : accounts.length === 0 ? (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="rounded-xl border bg-white p-8 text-center">

                    <h2 className="text-lg font-semibold text-gray-700">
                        Belum ada rekening
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Tambahkan rekening bank ADELINA KOST.
                    </p>

                    <button
                        onClick={handleAdd}
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Tambah Rekening
                    </button>

                </div>

            ) : (

                /* =================================================
                   ACCOUNT LIST
                ================================================= */

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {accounts.map((account) => {

                        const isActive =
                            account.is_active === true ||
                            account.is_active === 1;


                        return (

                            <div
                                key={account.id}
                                className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${!isActive
                                    ? "opacity-75"
                                    : ""
                                    }`}
                            >

                                {/* =================================
                                    CARD HEADER
                                ================================= */}

                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex min-w-0 items-center gap-3">

                                        {/* =================================
                                            BANK LOGO
                                        ================================= */}

                                        <BankLogo
                                            bankName={
                                                account.bank_name
                                            }
                                        />


                                        {/* =================================
                                            BANK INFO
                                        ================================= */}

                                        <div className="min-w-0">

                                            <h2 className="text-lg font-bold text-gray-800">
                                                {account.bank_name}
                                            </h2>

                                            <p className="mt-1 truncate text-sm text-gray-500">
                                                {account.account_name}
                                            </p>

                                        </div>

                                    </div>


                                    {/* =================================
                                        STATUS
                                    ================================= */}

                                    <span
                                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {isActive
                                            ? "AKTIF"
                                            : "NONAKTIF"}
                                    </span>

                                </div>


                                {/* =================================
                                    NOMOR REKENING
                                ================================= */}

                                <div className="mt-5">

                                    <p className="text-sm text-gray-500">
                                        Nomor Rekening
                                    </p>

                                    <p className="mt-1 font-semibold tracking-wide text-gray-800">
                                        {formatAccountNumber(
                                            account.account_number
                                        )}
                                    </p>

                                </div>


                                {/* =================================
                                    JENIS REKENING
                                ================================= */}

                                <div className="mt-4">

                                    <p className="text-sm text-gray-500">
                                        Jenis Rekening
                                    </p>

                                    <p className="mt-1 font-medium text-gray-800">
                                        {formatAccountType(
                                            account.account_type
                                        )}
                                    </p>

                                </div>


                                {/* =================================
                                    SALDO
                                ================================= */}

                                <div className="mt-4 rounded-lg bg-green-50 p-3">

                                    <p className="text-sm text-gray-500">
                                        Saldo
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-green-600">

                                        {formatRupiah(
                                            account.current_balance
                                        )}

                                    </p>

                                </div>


                                {/* =================================
                                    CATATAN
                                ================================= */}

                                {account.notes && (

                                    <div className="mt-4">

                                        <p className="text-sm text-gray-500">
                                            Catatan
                                        </p>

                                        <p className="mt-1 text-sm text-gray-700">
                                            {account.notes}
                                        </p>

                                    </div>

                                )}


                                {/* =================================
                                    ACTION
                                ================================= */}

                                <div className="mt-5 flex gap-2">

                                    <button
                                        onClick={() =>
                                            handleEdit(account)
                                        }
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Edit
                                    </button>


                                    {isActive ? (

                                        <button
                                            onClick={() =>
                                                handleDeactivate(
                                                    account
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            Nonaktifkan
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                handleActivate(
                                                    account
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
                                        >
                                            Aktifkan
                                        </button>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}


            {/* =================================================
                MODAL
            ================================================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

                        {/* =========================================
                            MODAL HEADER
                        ========================================= */}

                        <div className="flex items-center justify-between border-b px-6 py-4">

                            <div>

                                <h2 className="text-lg font-bold text-gray-800">

                                    {editingAccount
                                        ? "Edit Rekening"
                                        : "Tambah Rekening"}

                                </h2>

                                <p className="text-sm text-gray-500">
                                    Data rekening ADELINA KOST
                                </p>

                            </div>


                            <button
                                onClick={handleCloseModal}
                                disabled={saving}
                                className="text-2xl text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
                            >
                                ×
                            </button>

                        </div>


                        {/* =========================================
                            FORM
                        ========================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 p-6"
                        >

                            {/* =====================================
                                NAMA BANK
                            ===================================== */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nama Bank
                                </label>

                                <input
                                    type="text"
                                    name="bank_name"
                                    value={form.bank_name}
                                    onChange={handleChange}
                                    placeholder="Contoh: BCA"
                                    required
                                    disabled={saving}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Logo akan otomatis mengikuti nama bank.
                                </p>

                            </div>


                            {/* =====================================
                                NAMA PEMILIK
                            ===================================== */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nama Pemilik Rekening
                                </label>

                                <input
                                    type="text"
                                    name="account_name"
                                    value={form.account_name}
                                    onChange={handleChange}
                                    placeholder="Contoh: Adelina Kost"
                                    required
                                    disabled={saving}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                />

                            </div>


                            {/* =====================================
                                NOMOR REKENING
                            ===================================== */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nomor Rekening
                                </label>

                                <input
                                    type="text"
                                    name="account_number"
                                    value={form.account_number}
                                    onChange={handleChange}
                                    placeholder="Masukkan nomor rekening"
                                    required
                                    disabled={saving}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                />

                            </div>


                            {/* =====================================
                                JENIS REKENING
                            ===================================== */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Jenis Rekening
                                </label>

                                <select
                                    name="account_type"
                                    value={form.account_type}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                >

                                    <option value="bank">
                                        Bank
                                    </option>

                                    <option value="cash">
                                        Kas
                                    </option>

                                    <option value="e_wallet">
                                        E-Wallet
                                    </option>

                                </select>

                            </div>


                            {/* =====================================
                                SALDO
                            ===================================== */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Saldo
                                </label>

                                <div className="relative">

                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                        Rp
                                    </span>

                                    <input
                                        type="number"
                                        name="current_balance"
                                        value={form.current_balance}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        disabled={saving}
                                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                    />

                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Masukkan saldo rekening saat ini.
                                </p>

                            </div>


                            {/* =====================================
                                STATUS
                            ===================================== */}

                            <div className="rounded-lg bg-gray-50 p-3">

                                <label className="flex cursor-pointer items-center gap-3">

                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={form.is_active}
                                        onChange={handleChange}
                                        disabled={saving}
                                        className="h-4 w-4"
                                    />

                                    <div>

                                        <p className="text-sm font-medium text-gray-700">
                                            Rekening aktif
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Rekening aktif dapat digunakan untuk transaksi.
                                        </p>

                                    </div>

                                </label>

                            </div>


                            {/* =====================================
                                CATATAN
                            ===================================== */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Catatan
                                </label>

                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Catatan tambahan (opsional)"
                                    rows="3"
                                    disabled={saving}
                                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                />

                            </div>


                            {/* =====================================
                                ERROR MODAL
                            ===================================== */}

                            {error && (

                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {error}
                                </div>

                            )}


                            {/* =====================================
                                BUTTON
                            ===================================== */}

                            <div className="flex justify-end gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Batal
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {saving
                                        ? "Menyimpan..."
                                        : editingAccount
                                            ? "Simpan Perubahan"
                                            : "Tambah Rekening"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
};

export default BankAccounts;