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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white shadow-sm">
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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white shadow-sm">
                <svg
                    viewBox="0 0 100 70"
                    className="h-14 w-16"
                    aria-label="BCA"
                >
                    <path
                        d="M12 43 L31 24 L43 36 L57 16 L78 43 Z"
                        fill="#1683C6"
                    />

                    <path
                        d="M48 35 L59 24 L70 35 L59 46 Z"
                        fill="#E53935"
                    />

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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-green-100 bg-white shadow-sm">
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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white shadow-sm">
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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white shadow-sm">
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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white shadow-sm">
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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white shadow-sm">
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
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white shadow-sm">
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
        <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
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
    // STATE REKENING
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
    // STATE MUTASI
    // =====================================================

    const [showMutationModal, setShowMutationModal] = useState(false);

    const [selectedAccount, setSelectedAccount] = useState(null);

    const [mutations, setMutations] = useState([]);

    const [mutationSummary, setMutationSummary] = useState({
        total_transactions: 0,
        total_masuk: 0,
        total_keluar: 0,
    });

    const [mutationLoading, setMutationLoading] = useState(false);

    const [mutationError, setMutationError] = useState("");


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
    // LIHAT MUTASI
    // =====================================================

    const handleViewMutations = async (account) => {

        setSelectedAccount(account);

        setMutations([]);

        setMutationSummary({
            total_transactions: 0,
            total_masuk: 0,
            total_keluar: 0,
        });

        setMutationError("");

        setShowMutationModal(true);

        try {

            setMutationLoading(true);

            const response =
                await api.get(
                    `/bank-accounts/${account.id}/mutations`
                );

            console.log(
                "Bank Mutations Response:",
                response.data
            );

            setMutations(
                response.data?.data?.mutations || []
            );

            setMutationSummary(
                response.data?.data?.summary || {
                    total_transactions: 0,
                    total_masuk: 0,
                    total_keluar: 0,
                }
            );

        } catch (error) {

            console.error(
                "Get Bank Mutations Error:",
                error
            );

            setMutationError(
                error.response?.data?.message ||
                "Gagal mengambil mutasi rekening"
            );

        } finally {

            setMutationLoading(false);

        }
    };


    // =====================================================
    // CLOSE MUTATION MODAL
    // =====================================================

    const handleCloseMutationModal = () => {

        if (mutationLoading) {
            return;
        }

        setShowMutationModal(false);

        setSelectedAccount(null);

        setMutations([]);

        setMutationSummary({
            total_transactions: 0,
            total_masuk: 0,
            total_keluar: 0,
        });

        setMutationError("");
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
    // FORMAT TANGGAL
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // FORMAT MUTATION TYPE
    // =====================================================

    const getMutationType = (mutation) => {

        const type = String(
            mutation.type ||
            mutation.transaction_type ||
            mutation.mutation_type ||
            ""
        ).toLowerCase();

        if (
            type.includes("masuk") ||
            type.includes("income") ||
            type.includes("credit") ||
            type.includes("kredit")
        ) {
            return "masuk";
        }

        if (
            type.includes("keluar") ||
            type.includes("expense") ||
            type.includes("debit") ||
            type.includes("debet")
        ) {
            return "keluar";
        }

        return mutation.direction === "in"
            ? "masuk"
            : mutation.direction === "out"
                ? "keluar"
                : "";
    };


    // =====================================================
    // GET MUTATION DESCRIPTION
    // =====================================================

    const getMutationDescription = (mutation) => {

        return (
            mutation.description ||
                mutation.notes ||
                mutation.category ||
                mutation.reference ||
                mutation.payment_id
                ? (
                    mutation.description ||
                    mutation.notes ||
                    mutation.category ||
                    mutation.reference ||
                    `Pembayaran #${mutation.payment_id}`
                )
                : "Transaksi"
        );
    };


    // =====================================================
    // GET MUTATION DATE
    // =====================================================

    const getMutationDate = (mutation) => {

        return (
            mutation.date ||
            mutation.transaction_date ||
            mutation.mutation_date ||
            mutation.payment_date ||
            mutation.expense_date ||
            mutation.created_at
        );
    };


    // =====================================================
    // GET MUTATION AMOUNT
    // =====================================================

    const getMutationAmount = (mutation) => {

        return Number(
            mutation.amount ||
            mutation.nominal ||
            mutation.value ||
            0
        );
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
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                    + Tambah Rekening
                </button>

            </div>


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
                        ✓
                    </span>

                    <span>
                        {success}
                    </span>

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && !showModal && (

                <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                        !
                    </span>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                    <p className="text-sm text-gray-500">
                        Memuat data rekening...
                    </p>

                </div>

            ) : accounts.length === 0 ? (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                        🏦
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-gray-800">
                        Belum ada rekening
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        Tambahkan rekening bank atau rekening keuangan
                        yang digunakan untuk operasional ADELINA KOST.
                    </p>

                    <button
                        onClick={handleAdd}
                        className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
                                className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${!isActive
                                    ? "opacity-75"
                                    : ""
                                    }`}
                            >

                                {/* =================================
                                    CARD CONTENT
                                ================================= */}

                                <div className="p-5">

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex min-w-0 items-center gap-3">

                                            <BankLogo
                                                bankName={
                                                    account.bank_name
                                                }
                                            />

                                            <div className="min-w-0">

                                                <h2 className="truncate text-lg font-bold text-gray-800">
                                                    {account.bank_name}
                                                </h2>

                                                <p className="mt-1 truncate text-sm text-gray-500">
                                                    {account.account_name}
                                                </p>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${isActive
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
                                        ACCOUNT NUMBER
                                    ================================= */}

                                    <div className="mt-6">

                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Nomor Rekening
                                        </p>

                                        <p className="mt-1.5 text-base font-semibold tracking-wider text-gray-800">
                                            {formatAccountNumber(
                                                account.account_number
                                            )}
                                        </p>

                                    </div>


                                    {/* =================================
                                        ACCOUNT TYPE
                                    ================================= */}

                                    <div className="mt-4">

                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Jenis Rekening
                                        </p>

                                        <p className="mt-1.5 text-sm font-semibold text-gray-800">
                                            {formatAccountType(
                                                account.account_type
                                            )}
                                        </p>

                                    </div>


                                    {/* =================================
                                        BALANCE
                                    ================================= */}

                                    <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">

                                        <p className="text-xs font-medium uppercase tracking-wide text-green-700/70">
                                            Saldo Saat Ini
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-green-700">
                                            {formatRupiah(
                                                account.current_balance
                                            )}
                                        </p>

                                    </div>


                                    {/* =================================
                                        NOTES
                                    ================================= */}

                                    {account.notes && (

                                        <div className="mt-4 rounded-lg bg-gray-50 p-3">

                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Catatan
                                            </p>

                                            <p className="mt-1 text-sm leading-relaxed text-gray-600">
                                                {account.notes}
                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* =================================
                                    ACTION
                                ================================= */}

                                <div className="border-t border-gray-100 bg-gray-50/70 p-4">

                                    {/* MUTASI */}

                                    <button
                                        onClick={() =>
                                            handleViewMutations(
                                                account
                                            )
                                        }
                                        className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                                    >
                                        <span>
                                            ↗
                                        </span>

                                        Lihat Mutasi
                                    </button>


                                    <div className="flex gap-2">

                                        <button
                                            onClick={() =>
                                                handleEdit(account)
                                            }
                                            className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
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
                                                className="flex-1 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
                                                className="flex-1 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-50"
                                            >
                                                Aktifkan
                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}


            {/* =====================================================
                MODAL TAMBAH / EDIT REKENING
            ===================================================== */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-[2px] sm:p-5">

                    <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="shrink-0 border-b border-gray-100 bg-white px-5 py-4 sm:px-6">

                            <div className="flex items-start justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                        🏦
                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                                            {editingAccount
                                                ? "Edit Rekening"
                                                : "Tambah Rekening"}
                                        </h2>

                                        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                                            Kelola informasi rekening
                                            keuangan ADELINA KOST
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                    aria-label="Tutup"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ×
                                </button>

                            </div>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="flex min-h-0 flex-1 flex-col"
                        >

                            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">

                                <div className="space-y-5">

                                    {/* INFORMASI REKENING */}

                                    <div>

                                        <div className="mb-4">

                                            <h3 className="text-sm font-bold text-gray-900">
                                                Informasi Rekening
                                            </h3>

                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Masukkan informasi utama
                                                rekening.
                                            </p>

                                        </div>


                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                            {/* NAMA BANK */}

                                            <div className="sm:col-span-2">

                                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                                    Nama Bank
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    name="bank_name"
                                                    value={form.bank_name}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: BCA"
                                                    required
                                                    disabled={saving}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                />

                                                <p className="mt-1.5 text-xs text-gray-400">
                                                    Logo akan otomatis
                                                    mengikuti nama bank.
                                                </p>

                                            </div>


                                            {/* NAMA PEMILIK */}

                                            <div>

                                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                                    Nama Pemilik
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    name="account_name"
                                                    value={form.account_name}
                                                    onChange={handleChange}
                                                    placeholder="Adelina Kost"
                                                    required
                                                    disabled={saving}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                />

                                            </div>


                                            {/* NOMOR REKENING */}

                                            <div>

                                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                                    Nomor Rekening
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    name="account_number"
                                                    value={form.account_number}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nomor rekening"
                                                    required
                                                    disabled={saving}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm tracking-wide text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                />

                                            </div>


                                            {/* JENIS REKENING */}

                                            <div>

                                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                                    Jenis Rekening
                                                </label>

                                                <select
                                                    name="account_type"
                                                    value={form.account_type}
                                                    onChange={handleChange}
                                                    disabled={saving}
                                                    className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
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


                                            {/* SALDO */}

                                            <div>

                                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                                    Saldo Saat Ini
                                                </label>

                                                <div className="relative">

                                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
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
                                                        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                    />

                                                </div>

                                                <p className="mt-1.5 text-xs text-gray-400">
                                                    Saldo awal rekening saat
                                                    ini.
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                                        <label className="flex cursor-pointer items-start gap-3">

                                            <input
                                                type="checkbox"
                                                name="is_active"
                                                checked={form.is_active}
                                                onChange={handleChange}
                                                disabled={saving}
                                                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />

                                            <div>

                                                <p className="text-sm font-semibold text-gray-800">
                                                    Rekening aktif
                                                </p>

                                                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                                                    Rekening aktif dapat
                                                    digunakan untuk transaksi
                                                    pembayaran dan pengeluaran.
                                                </p>

                                            </div>

                                        </label>

                                    </div>


                                    {/* CATATAN */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                            Catatan
                                        </label>

                                        <textarea
                                            name="notes"
                                            value={form.notes}
                                            onChange={handleChange}
                                            placeholder="Catatan tambahan (opsional)"
                                            rows="3"
                                            disabled={saving}
                                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                                        />

                                    </div>


                                    {/* ERROR */}

                                    {error && (

                                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">

                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                                                !
                                            </div>

                                            <p className="leading-relaxed">
                                                {error}
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 sm:px-6">

                                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={saving}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        Batal
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >

                                        {saving
                                            ? "Menyimpan..."
                                            : editingAccount
                                                ? "Simpan Perubahan"
                                                : "Tambah Rekening"}

                                    </button>

                                </div>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =====================================================
                MODAL MUTASI REKENING
            ===================================================== */}

            {showMutationModal && (

                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[2px] sm:p-5">

                    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* =========================================
                            MUTATION HEADER
                        ========================================= */}

                        <div className="shrink-0 border-b border-gray-100 bg-white px-5 py-4 sm:px-6">

                            <div className="flex items-start justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    {selectedAccount && (
                                        <BankLogo
                                            bankName={
                                                selectedAccount.bank_name
                                            }
                                        />
                                    )}

                                    <div>

                                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                                            Mutasi Rekening
                                        </h2>

                                        {selectedAccount && (

                                            <p className="mt-1 text-sm text-gray-500">

                                                {selectedAccount.bank_name}
                                                {" • "}
                                                {formatAccountNumber(
                                                    selectedAccount.account_number
                                                )}

                                            </p>

                                        )}

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleCloseMutationModal
                                    }
                                    disabled={mutationLoading}
                                    aria-label="Tutup"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ×
                                </button>

                            </div>

                        </div>


                        {/* =========================================
                            MUTATION CONTENT
                        ========================================= */}

                        <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50/60 px-5 py-5 sm:px-6">

                            {/* ERROR */}

                            {mutationError && (

                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                                        !
                                    </div>

                                    <p>
                                        {mutationError}
                                    </p>

                                </div>

                            )}


                            {/* SUMMARY */}

                            {!mutationError && (

                                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">

                                    {/* TOTAL TRANSAKSI */}

                                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Total Transaksi
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-gray-800">
                                            {Number(
                                                mutationSummary.total_transactions ||
                                                0
                                            ).toLocaleString(
                                                "id-ID"
                                            )}
                                        </p>

                                    </div>


                                    {/* TOTAL MASUK */}

                                    <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">

                                        <div className="flex items-center justify-between">

                                            <p className="text-xs font-semibold uppercase tracking-wide text-green-700/70">
                                                Total Masuk
                                            </p>

                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                                                ↓
                                            </span>

                                        </div>

                                        <p className="mt-2 text-xl font-bold text-green-700">
                                            {formatRupiah(
                                                mutationSummary.total_masuk
                                            )}
                                        </p>

                                    </div>


                                    {/* TOTAL KELUAR */}

                                    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">

                                        <div className="flex items-center justify-between">

                                            <p className="text-xs font-semibold uppercase tracking-wide text-red-700/70">
                                                Total Keluar
                                            </p>

                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
                                                ↑
                                            </span>

                                        </div>

                                        <p className="mt-2 text-xl font-bold text-red-700">
                                            {formatRupiah(
                                                mutationSummary.total_keluar
                                            )}
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* LOADING */}

                            {mutationLoading ? (

                                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

                                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                                    <p className="text-sm font-medium text-gray-600">
                                        Memuat mutasi rekening...
                                    </p>

                                </div>

                            ) : mutationError ? (

                                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

                                    <p className="text-sm text-gray-500">
                                        Data mutasi tidak dapat dimuat.
                                    </p>

                                </div>

                            ) : mutations.length === 0 ? (

                                /* =====================================
                                    EMPTY MUTATION
                                ===================================== */

                                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                                        📄
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold text-gray-800">
                                        Belum Ada Mutasi
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                        Belum ada transaksi masuk atau keluar
                                        yang tercatat pada rekening ini.
                                    </p>

                                </div>

                            ) : (

                                /* =====================================
                                    MUTATION TABLE
                                ===================================== */

                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                    <div className="border-b border-gray-100 px-5 py-4">

                                        <h3 className="text-sm font-bold text-gray-900">
                                            Riwayat Transaksi
                                        </h3>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            Daftar transaksi rekening
                                            ADELINA KOST.
                                        </p>

                                    </div>


                                    <div className="overflow-x-auto">

                                        <table className="min-w-full">

                                            <thead className="bg-gray-50">

                                                <tr>

                                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                        Tanggal
                                                    </th>

                                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                        Keterangan
                                                    </th>

                                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                        Jenis
                                                    </th>

                                                    <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                        Nominal
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody className="divide-y divide-gray-100">

                                                {mutations.map(
                                                    (mutation, index) => {

                                                        const type =
                                                            getMutationType(
                                                                mutation
                                                            );

                                                        const amount =
                                                            getMutationAmount(
                                                                mutation
                                                            );

                                                        return (

                                                            <tr
                                                                key={
                                                                    mutation.id ||
                                                                    mutation.payment_id ||
                                                                    mutation.expense_id ||
                                                                    index
                                                                }
                                                                className="transition hover:bg-gray-50"
                                                            >

                                                                {/* TANGGAL */}

                                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">

                                                                    {formatDate(
                                                                        getMutationDate(
                                                                            mutation
                                                                        )
                                                                    )}

                                                                </td>


                                                                {/* KETERANGAN */}

                                                                <td className="px-5 py-4">

                                                                    <div className="max-w-sm">

                                                                        <p className="text-sm font-semibold text-gray-800">
                                                                            {getMutationDescription(
                                                                                mutation
                                                                            )}
                                                                        </p>

                                                                        {mutation.reference && (

                                                                            <p className="mt-1 text-xs text-gray-400">
                                                                                Ref:{" "}
                                                                                {
                                                                                    mutation.reference
                                                                                }
                                                                            </p>

                                                                        )}

                                                                    </div>

                                                                </td>


                                                                {/* JENIS */}

                                                                <td className="whitespace-nowrap px-5 py-4">

                                                                    {type ===
                                                                        "masuk" ? (

                                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                                                                            ↓
                                                                            Masuk
                                                                        </span>

                                                                    ) : type ===
                                                                        "keluar" ? (

                                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                                                                            ↑
                                                                            Keluar
                                                                        </span>

                                                                    ) : (

                                                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                                                                            Transaksi
                                                                        </span>

                                                                    )}

                                                                </td>


                                                                {/* NOMINAL */}

                                                                <td className="whitespace-nowrap px-5 py-4 text-right">

                                                                    <p
                                                                        className={`text-sm font-bold ${type ===
                                                                            "masuk"
                                                                            ? "text-green-700"
                                                                            : type ===
                                                                                "keluar"
                                                                                ? "text-red-700"
                                                                                : "text-gray-800"
                                                                            }`}
                                                                    >

                                                                        {type ===
                                                                            "masuk"
                                                                            ? "+"
                                                                            : type ===
                                                                                "keluar"
                                                                                ? "-"
                                                                                : ""}

                                                                        {formatRupiah(
                                                                            amount
                                                                        )}

                                                                    </p>

                                                                </td>

                                                            </tr>

                                                        );

                                                    }
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =========================================
                            MUTATION FOOTER
                        ========================================= */}

                        <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 sm:px-6">

                            <div className="flex items-center justify-between gap-4">

                                <div className="text-xs text-gray-400">

                                    Saldo saat ini:{" "}

                                    <span className="font-bold text-gray-700">

                                        {selectedAccount
                                            ? formatRupiah(
                                                selectedAccount.current_balance
                                            )
                                            : "Rp 0"}

                                    </span>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleCloseMutationModal
                                    }
                                    disabled={mutationLoading}
                                    className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Tutup
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
};

export default BankAccounts;