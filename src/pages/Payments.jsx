import { useEffect, useMemo, useState } from "react";

import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    getBillsForPayment,
    verifyPayment,
    rejectPayment,
    verifyBookingPayment,
    verifyFullPayment
} from "../services/paymentService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const Payments = () => {

    // =====================================================
    // DATA
    // =====================================================

    const [payments, setPayments] = useState([]);

    const [bills, setBills] = useState([]);

    // REKENING BANK
    const [bankAccounts, setBankAccounts] = useState([]);


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    // =====================================================
    // VERIFIKASI PEMBAYARAN
    // =====================================================

    const [verifyingId, setVerifyingId] =
        useState(null);

    const [rejectingId, setRejectingId] =
        useState(null);


    // =====================================================
    // MODAL REJECT
    // =====================================================

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [rejectReason, setRejectReason] =
        useState("");

    const [paymentToReject, setPaymentToReject] =
        useState(null);


    // =====================================================
    // MODAL
    // =====================================================

    const [showModal, setShowModal] = useState(false);

    const [showDetailModal, setShowDetailModal] =
        useState(false);

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [showReceiptModal, setShowReceiptModal] =
        useState(false);

    const [showRecap, setShowRecap] =
        useState(true);


    // =====================================================
    // DETAIL
    // =====================================================

    const [selectedPayment, setSelectedPayment] =
        useState(null);


    // =====================================================
    // FORM TAMBAH
    // =====================================================

    const [form, setForm] = useState({
        bill_id: "",
        payment_date: "",
        amount: "",
        payment_method: "cash",
        bank_account_id: "",
        notes: ""
    });


    // =====================================================
    // FORM EDIT
    // =====================================================

    const [editForm, setEditForm] = useState({
        bill_id: "",
        payment_date: "",
        amount: "",
        payment_method: "cash",
        bank_account_id: "",
        notes: ""
    });


    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] = useState("");


    // =====================================================
    // FILTER PERIODE DEFAULT = BULAN + TAHUN REAL-TIME
    // =====================================================

    const now = new Date();

    const currentMonth = String(
        now.getMonth() + 1
    );

    const currentYear = String(
        now.getFullYear()
    );

    const [filterMonth, setFilterMonth] =
        useState(currentMonth);

    const [filterYear, setFilterYear] =
        useState(currentYear);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const itemsPerPage = 10;


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchData();

    }, []);


    // =====================================================
    // FETCH DATA
    // =====================================================

    const fetchData = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                paymentsResponse,
                billsResponse,
                bankAccountsResponse
            ] = await Promise.all([
                getPayments(),
                getBillsForPayment(),
                fetch("http://localhost:5000/api/bank-accounts")
                    .then(async (response) => {
                        const data = await response.json();
                        if (!response.ok) {
                            throw new Error(
                                data.message ||
                                "Gagal mengambil rekening bank"
                            );
                        }
                        return data;
                    })
            ]);


            if (paymentsResponse.success) {

                setPayments(
                    paymentsResponse.data || []
                );

            }


            if (billsResponse.success) {

                setBills(
                    billsResponse.data || []
                );

            }

            if (bankAccountsResponse.success) {

                setBankAccounts(
                    (bankAccountsResponse.data || []).filter(
                        (account) => {
                            const status = String(account.status || "").toLowerCase();
                            return (
                                status === "active" ||
                                status === "aktif" ||
                                account.is_active === 1 ||
                                account.is_active === true
                            );
                        }
                    )
                );

            }

        } catch (err) {

            console.error(
                "Fetch Payments Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Gagal mengambil data pembayaran"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FORMAT RUPIAH
    // =====================================================

    const formatRupiah = (value) => {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }
        ).format(
            Number(value || 0)
        );

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) return "-";


        const parsedDate =
            new Date(date);


        if (Number.isNaN(parsedDate.getTime())) {

            return date;

        }


        return parsedDate.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

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
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    };


    // =====================================================
    // FORMAT DATE UNTUK INPUT
    // =====================================================

    const formatDateForInput = (date) => {

        if (!date) return "";


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return String(date).substring(
                0,
                10
            );

        }


        const year =
            parsedDate.getFullYear();


        const month =
            String(
                parsedDate.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                parsedDate.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    };


    // =====================================================
    // OPEN TAMBAH
    // =====================================================

    const openModal = () => {

        setForm({
            bill_id: "",
            payment_date: getToday(),
            amount: "",
            payment_method: "cash",
            bank_account_id: "",
            notes: ""
        });


        setError("");

        setShowModal(true);

    };


    // =====================================================
    // CLOSE TAMBAH
    // =====================================================

    const closeModal = () => {

        if (saving) return;

        setShowModal(false);

        setError("");

    };


    // =====================================================
    // HANDLE FORM
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            previous => ({
                ...previous,
                [name]: value,
                ...(name === "payment_method" && value === "cash"
                    ? { bank_account_id: "" }
                    : {})
            })
        );

    };


    // =====================================================
    // HANDLE EDIT FORM
    // =====================================================

    const handleEditChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setEditForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );

    };


    // =====================================================
    // TOTAL PEMBAYARAN BILL
    // =====================================================

    const getTotalPaid = (billId) => {

        // HANYA pembayaran VERIFIED yang dianggap
        // sudah membayar tagihan.
        // pending = menunggu verifikasi
        // rejected = ditolak
        // verified = dihitung sebagai pembayaran
        return payments
            .filter(
                payment =>
                    Number(payment.bill_id) ===
                    Number(billId) &&
                    String(payment.status || "").toLowerCase() ===
                    "verified"
            )
            .reduce(
                (total, payment) =>
                    total +
                    Number(
                        payment.amount || 0
                    ),
                0
            );

    };


    // =====================================================
    // SISA TAGIHAN
    // =====================================================

    const getRemainingAmount = (bill) => {

        if (!bill) return 0;


        const totalPaid =
            getTotalPaid(bill.id);


        return Math.max(
            Number(
                bill.amount || 0
            ) - totalPaid,
            0
        );

    };


    // =====================================================
    // TAGIHAN TERPILIH
    // =====================================================

    const selectedBill =
        bills.find(
            bill =>
                Number(bill.id) ===
                Number(form.bill_id)
        );


    // =====================================================
    // HANDLE PILIH TAGIHAN
    // =====================================================

    const handleBillChange = (e) => {

        const billId =
            e.target.value;


        const bill =
            bills.find(
                item =>
                    Number(item.id) ===
                    Number(billId)
            );


        if (bill) {

            const remaining =
                getRemainingAmount(
                    bill
                );


            setForm(
                previous => ({
                    ...previous,

                    bill_id: billId,

                    amount:
                        remaining > 0
                            ? remaining
                            : ""
                })
            );

        } else {

            setForm(
                previous => ({
                    ...previous,

                    bill_id: "",

                    amount: ""
                })
            );

        }

    };


    // =====================================================
    // SUBMIT TAMBAH
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.bill_id) {

            setError(
                "Silakan pilih tagihan terlebih dahulu."
            );

            return;

        }


        if (!form.payment_date) {

            setError(
                "Tanggal pembayaran wajib diisi."
            );

            return;

        }


        if (
            !form.amount ||
            Number(form.amount) <= 0
        ) {

            setError(
                "Jumlah pembayaran harus lebih besar dari 0."
            );

            return;

        }


        if (!selectedBill) {

            setError(
                "Tagihan tidak ditemukan."
            );

            return;

        }


        const remaining =
            getRemainingAmount(
                selectedBill
            );


        if (
            Number(form.amount) >
            remaining
        ) {

            setError(
                `Jumlah pembayaran melebihi sisa tagihan. Sisa: ${formatRupiah(remaining)}`
            );

            return;

        }


        if (
            form.payment_method === "transfer" &&
            !form.bank_account_id
        ) {

            setError(
                "Silakan pilih rekening tujuan untuk pembayaran transfer."
            );

            return;

        }


        try {

            setSaving(true);

            setError("");


            const response =
                await createPayment({

                    bill_id:
                        Number(
                            form.bill_id
                        ),

                    payment_date:
                        form.payment_date,

                    amount:
                        Number(
                            form.amount
                        ),

                    payment_method:
                        form.payment_method,

                    bank_account_id:
                        form.payment_method === "transfer"
                            ? Number(form.bank_account_id)
                            : null,

                    notes:
                        form.notes || null

                });


            if (!response.success) {

                setError(
                    response.message ||
                    "Gagal mencatat pembayaran"
                );

                return;

            }


            setShowModal(false);


            await fetchData();


        } catch (err) {

            console.error(
                "Create Payment Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Gagal mencatat pembayaran"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // DETAIL PEMBAYARAN
    // =====================================================

    const openDetail = async (payment) => {

        try {

            setError("");


            const response =
                await getPaymentById(
                    payment.id
                );


            if (response.success) {

                setSelectedPayment(
                    response.data
                );

                setShowDetailModal(true);

            }

        } catch (err) {

            console.error(
                "Get Payment Detail Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Gagal mengambil detail pembayaran"
            );

        }

    };


    // =====================================================
    // EDIT PEMBAYARAN
    // =====================================================

    const openEdit = async (payment) => {

        try {

            setError("");


            const response =
                await getPaymentById(
                    payment.id
                );


            if (!response.success) {

                setError(
                    response.message ||
                    "Gagal mengambil data pembayaran"
                );

                return;

            }


            const data =
                response.data;


            setSelectedPayment(
                data
            );


            setEditForm({

                bill_id:
                    data.bill_id || "",

                payment_date:
                    formatDateForInput(
                        data.payment_date
                    ),

                amount:
                    data.amount || "",

                payment_method:
                    data.payment_method ||
                    "cash",

                bank_account_id:
                    data.bank_account_id || "",

                notes:
                    data.notes || ""

            });


            setShowEditModal(true);


        } catch (err) {

            console.error(
                "Open Edit Payment Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Gagal membuka edit pembayaran"
            );

        }

    };


    // =====================================================
    // UPDATE PEMBAYARAN
    // =====================================================

    const handleUpdate = async (e) => {

        e.preventDefault();


        if (!selectedPayment) {

            setError(
                "Data pembayaran tidak ditemukan."
            );

            return;

        }


        if (!editForm.bill_id) {

            setError(
                "Tagihan wajib dipilih."
            );

            return;

        }


        if (!editForm.payment_date) {

            setError(
                "Tanggal pembayaran wajib diisi."
            );

            return;

        }


        if (
            !editForm.amount ||
            Number(editForm.amount) <= 0
        ) {

            setError(
                "Jumlah pembayaran harus lebih besar dari 0."
            );

            return;

        }


        if (
            editForm.payment_method === "transfer" &&
            !editForm.bank_account_id
        ) {

            setError(
                "Silakan pilih rekening tujuan untuk pembayaran transfer."
            );

            return;

        }


        try {

            setSaving(true);

            setError("");


            const response =
                await updatePayment(
                    selectedPayment.id,
                    {

                        bill_id:
                            Number(
                                editForm.bill_id
                            ),

                        payment_date:
                            editForm.payment_date,

                        amount:
                            Number(
                                editForm.amount
                            ),

                        payment_method:
                            editForm.payment_method,

                        bank_account_id:
                            editForm.payment_method === "transfer"
                                ? Number(editForm.bank_account_id)
                                : null,

                        notes:
                            editForm.notes ||
                            null

                    }
                );


            if (!response.success) {

                setError(
                    response.message ||
                    "Gagal memperbarui pembayaran"
                );

                return;

            }


            setShowEditModal(false);


            setSelectedPayment(null);


            await fetchData();


        } catch (err) {

            console.error(
                "Update Payment Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Gagal memperbarui pembayaran"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // OPEN DELETE
    // =====================================================

    const openDelete = (payment) => {

        setSelectedPayment(
            payment
        );

        setShowDeleteModal(true);

        setError("");

    };


    // =====================================================
    // DELETE PEMBAYARAN
    // =====================================================

    const handleDelete = async () => {

        if (!selectedPayment) return;


        try {

            setDeleting(true);

            setError("");


            const response =
                await deletePayment(
                    selectedPayment.id
                );


            if (!response.success) {

                setError(
                    response.message ||
                    "Gagal menghapus pembayaran"
                );

                return;

            }


            setShowDeleteModal(false);


            setSelectedPayment(null);


            await fetchData();


        } catch (err) {

            console.error(
                "Delete Payment Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Gagal menghapus pembayaran"
            );

        } finally {

            setDeleting(false);

        }

    };


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredPayments =
        useMemo(() => {

            return payments.filter(
                payment => {

                    const keyword =
                        search
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        !keyword ||
                        String(
                            payment.tenant_name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            payment.room_number ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            payment.billing_month ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            payment.billing_year ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            payment.payment_method ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword);


                    // FILTER BULAN + TAHUN BERDASARKAN
                    // TANGGAL PEMBAYARAN, BUKAN PERIODE TAGIHAN.
                    // Contoh: pembayaran tanggal 30/08/2026
                    // tetap muncul saat filter Agustus 2026
                    // walaupun billing_month pada tagihannya berbeda.
                    const paymentDate =
                        payment.payment_date
                            ? new Date(payment.payment_date)
                            : null;

                    const paymentDateIsValid =
                        paymentDate &&
                        !Number.isNaN(
                            paymentDate.getTime()
                        );

                    const matchesMonth =
                        !filterMonth ||
                        (paymentDateIsValid &&
                            paymentDate.getMonth() + 1 ===
                            Number(filterMonth));


                    const matchesYear =
                        !filterYear ||
                        (paymentDateIsValid &&
                            paymentDate.getFullYear() ===
                            Number(filterYear));


                    return (
                        matchesSearch &&
                        matchesMonth &&
                        matchesYear
                    );

                }
            );

        }, [
            payments,
            search,
            filterMonth,
            filterYear
        ]);

    // =====================================================
    // VERIFY PEMBAYARAN
    // =====================================================

    const handleVerify = async (payment) => {

        if (!payment) {
            return;
        }


        // =====================================================
        // CEK JENIS PEMBAYARAN
        // =====================================================
        //
        // booking_id ada
        //     → pembayaran booking
        //
        // booking_id NULL
        //     → pembayaran tagihan biasa
        //
        // =====================================================

        const hasBooking =
            payment.booking_id !== null &&
            payment.booking_id !== undefined &&
            payment.booking_id !== "";

        const hasBill =
            payment.bill_id !== null &&
            payment.bill_id !== undefined &&
            payment.bill_id !== "";

        const bookingDays =
            Number(payment.booking_days || 0);

        const isFullPayment =
            hasBooking &&
            !hasBill &&
            bookingDays === 30;

        const isBookingPayment =
            hasBooking &&
            !hasBill &&
            bookingDays >= 1 &&
            bookingDays <= 7;


        console.log("PAYMENT CHECK:", {
            id: payment.id,
            amount: payment.amount,
            booking_id: payment.booking_id,
            bill_id: payment.bill_id,
            booking_days: payment.booking_days,
            notes: payment.notes,
            isBookingPayment,
            isFullPayment
        });


        const confirmed =
            window.confirm(
                `Verifikasi pembayaran ${payment.tenant_name || ""
                } sebesar ${formatRupiah(payment.amount)
                }?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setVerifyingId(
                payment.id
            );

            setError("");


            // =================================================
            // PILIH ENDPOINT SESUAI JENIS PEMBAYARAN
            // =================================================

            let response;

            if (isFullPayment) {

                console.log(
                    "VERIFY FULL PAYMENT:",
                    payment.id
                );

                response =
                    await verifyFullPayment(
                        payment.id
                    );

            } else if (isBookingPayment) {

                console.log(
                    "VERIFY BOOKING PAYMENT:",
                    payment.id
                );

                response =
                    await verifyBookingPayment(
                        payment.id
                    );

            } else {

                console.log(
                    "VERIFY BILL PAYMENT:",
                    payment.id
                );

                response =
                    await verifyPayment(
                        payment.id
                    );

            }


            // =================================================
            // RESPONSE ERROR
            // =================================================

            if (!response?.success) {

                setError(
                    response?.message ||
                    "Gagal memverifikasi pembayaran."
                );

                return;

            }


            // =================================================
            // SUCCESS
            // =================================================

            alert(
                response?.message ||
                "Pembayaran berhasil diverifikasi."
            );


            // =================================================
            // REFRESH DATA
            // =================================================

            await fetchData();


        } catch (err) {

            console.error(
                "VERIFY PAYMENT ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Gagal memverifikasi pembayaran."
            );


        } finally {

            setVerifyingId(
                null
            );

        }

    };


    // =====================================================
    // BUKA MODAL REJECT
    // =====================================================

    const openReject = (payment) => {

        setPaymentToReject(
            payment
        );

        setRejectReason("");

        setError("");

        setShowRejectModal(
            true
        );
    };


    // =====================================================
    // TUTUP MODAL REJECT
    // =====================================================

    const closeReject = () => {

        if (rejectingId) {
            return;
        }

        setShowRejectModal(
            false
        );

        setPaymentToReject(
            null
        );

        setRejectReason("");

    };


    // =====================================================
    // REJECT PEMBAYARAN
    // =====================================================

    const handleReject = async () => {

        if (!paymentToReject) {
            return;
        }

        if (!rejectReason.trim()) {

            setError(
                "Alasan penolakan wajib diisi."
            );

            return;
        }

        try {

            setRejectingId(
                paymentToReject.id
            );

            setError("");

            const response =
                await rejectPayment(
                    paymentToReject.id,
                    rejectReason.trim()
                );

            if (!response.success) {

                setError(
                    response.message ||
                    "Gagal menolak pembayaran."
                );

                return;
            }

            setShowRejectModal(
                false
            );

            setPaymentToReject(
                null
            );

            setRejectReason("");

            alert(
                response.message ||
                "Pembayaran berhasil ditolak."
            );

            await fetchData();

        } catch (err) {

            console.error(
                "REJECT PAYMENT ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Gagal menolak pembayaran."
            );

        } finally {

            setRejectingId(null);

        }
    };


    // =====================================================
    // PAGINATION DATA
    // =====================================================

    const totalPages =
        Math.max(
            Math.ceil(
                filteredPayments.length /
                itemsPerPage
            ),
            1
        );


    const paginatedPayments =
        filteredPayments.slice(
            (currentPage - 1) *
            itemsPerPage,

            currentPage *
            itemsPerPage
        );


    // =====================================================
    // RESET PAGE KETIKA FILTER BERUBAH
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        filterMonth,
        filterYear
    ]);


    // =====================================================
    // TOTAL REKAP
    // =====================================================

    const recapData =
        useMemo(() => {

            // Rekap uang hanya menghitung pembayaran VERIFIED.
            // Pending/rejected tidak boleh dianggap sebagai uang
            // yang sudah diterima oleh ADELINA KOST.
            const verifiedPayments =
                filteredPayments.filter(
                    payment =>
                        String(payment.status || "").toLowerCase() ===
                        "verified"
                );


            const total =
                verifiedPayments.reduce(
                    (
                        sum,
                        payment
                    ) =>
                        sum +
                        Number(
                            payment.amount || 0
                        ),
                    0
                );


            const cash =
                verifiedPayments.reduce(
                    (
                        sum,
                        payment
                    ) =>
                        String(payment.payment_method || "").toLowerCase() ===
                            "cash"
                            ? sum +
                            Number(
                                payment.amount ||
                                0
                            )
                            : sum,
                    0
                );


            const transfer =
                verifiedPayments.reduce(
                    (
                        sum,
                        payment
                    ) =>
                        String(payment.payment_method || "").toLowerCase() ===
                            "transfer"
                            ? sum +
                            Number(
                                payment.amount ||
                                0
                            )
                            : sum,
                    0
                );


            const paidCount =
                verifiedPayments.length;

            const pendingCount =
                filteredPayments.filter(
                    payment =>
                        String(payment.status || "").toLowerCase() ===
                        "pending"
                ).length;


            const unpaidCount =
                verifiedPayments.filter(
                    payment =>
                        payment.bill_status !==
                        "paid"
                ).length;


            return {

                transactionCount:
                    filteredPayments.length,

                total,

                cash,

                transfer,

                paidCount,

                pendingCount,

                unpaidCount

            };

        }, [
            filteredPayments
        ]);


    // =====================================================
    // RESET FILTER
    // =====================================================

    const resetFilter = () => {

        setSearch("");

        setFilterMonth(currentMonth);

        setFilterYear(currentYear);

        setCurrentPage(1);

    };


    // =====================================================
    // OPEN RECEIPT
    // =====================================================

    const openReceipt = async (payment) => {

        try {

            setError("");


            const response =
                await getPaymentById(
                    payment.id
                );


            if (response.success) {

                setSelectedPayment(
                    response.data
                );

                setShowReceiptModal(
                    true
                );

            }

        } catch (err) {

            console.error(
                "Receipt Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Gagal mengambil data bukti pembayaran"
            );

        }

    };


    // =====================================================
    // DOWNLOAD RECEIPT PDF
    // =====================================================

    // =====================================================
    // DOWNLOAD RECEIPT PDF
    // =====================================================

    const downloadReceipt = async () => {

        // =================================================
        // CEK DATA
        // =================================================

        if (!selectedPayment) {

            setError(
                "Data pembayaran tidak ditemukan."
            );

            return;
        }


        try {

            // =================================================
            // AMBIL ELEMENT RECEIPT
            // =================================================

            const receiptElement =
                document.getElementById(
                    "payment-receipt"
                );


            if (!receiptElement) {

                setError(
                    "Template bukti pembayaran tidak ditemukan."
                );

                return;
            }


            // =================================================
            // CLONE RECEIPT
            // =================================================

            const clonedReceipt =
                receiptElement.cloneNode(true);


            // =================================================
            // BERSIHKAN CLASS TAILWIND
            // UNTUK MENGHINDARI OKLCH
            // =================================================

            clonedReceipt.className = "";


            // =================================================
            // BUAT CONTAINER SEMENTARA
            // =================================================

            const tempContainer =
                document.createElement("div");


            tempContainer.style.position =
                "fixed";

            tempContainer.style.left =
                "-10000px";

            tempContainer.style.top =
                "0";

            tempContainer.style.width =
                `${receiptElement.offsetWidth}px`;

            tempContainer.style.background =
                "#ffffff";

            tempContainer.style.padding =
                "0";

            tempContainer.style.margin =
                "0";

            tempContainer.style.zIndex =
                "-1";


            tempContainer.appendChild(
                clonedReceipt
            );


            document.body.appendChild(
                tempContainer
            );


            // =================================================
            // KONVERSI HTML → CANVAS
            // =================================================

            const canvas =
                await html2canvas(
                    clonedReceipt,
                    {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: "#ffffff",

                        // =================================================
                        // JANGAN PAKAI CSS FILTER / MODERN COLOR
                        // =================================================

                        onclone: (clonedDocument) => {

                            const clonedElement =
                                clonedDocument.getElementById(
                                    "payment-receipt"
                                );


                            if (!clonedElement) {
                                return;
                            }


                            // Hapus class Tailwind
                            clonedElement.className = "";


                            // Pastikan background putih
                            clonedElement.style.backgroundColor =
                                "#ffffff";


                            // Pastikan warna dasar
                            clonedElement.style.color =
                                "#1f2937";


                            // =================================================
                            // NORMALISASI SEMUA ELEMENT
                            // =================================================

                            const allElements =
                                clonedElement.querySelectorAll("*");


                            allElements.forEach(
                                (element) => {

                                    // Hapus class Tailwind
                                    element.className = "";


                                    // Hapus filter modern
                                    element.style.filter =
                                        "none";

                                    element.style.webkitFilter =
                                        "none";


                                    // Hapus background image
                                    element.style.backgroundImage =
                                        "none";

                                }
                            );

                        }
                    }
                );


            // =================================================
            // HAPUS CONTAINER SEMENTARA
            // =================================================

            document.body.removeChild(
                tempContainer
            );


            // =================================================
            // BUAT PDF A4
            // =================================================

            const pdf =
                new jsPDF(
                    "p",
                    "mm",
                    "a4"
                );


            const pageWidth =
                pdf.internal.pageSize.getWidth();


            const pageHeight =
                pdf.internal.pageSize.getHeight();


            // =================================================
            // UKURAN CANVAS
            // =================================================

            const canvasWidth =
                canvas.width;


            const canvasHeight =
                canvas.height;


            // =================================================
            // MARGIN PDF
            // =================================================

            const margin =
                15;


            const availableWidth =
                pageWidth -
                (margin * 2);


            const imageHeight =
                (
                    canvasHeight /
                    canvasWidth
                ) *
                availableWidth;


            // =================================================
            // JIKA LEBIH TINGGI DARI 1 HALAMAN
            // =================================================

            if (
                imageHeight <=
                pageHeight - (margin * 2)
            ) {

                pdf.addImage(
                    canvas,
                    "PNG",
                    margin,
                    margin,
                    availableWidth,
                    imageHeight
                );

            } else {

                // =================================================
                // SKALA AGAR MUAT 1 HALAMAN A4
                // =================================================

                const maxHeight =
                    pageHeight -
                    (margin * 2);


                const scale =
                    maxHeight /
                    imageHeight;


                const finalWidth =
                    availableWidth *
                    scale;


                const finalHeight =
                    imageHeight *
                    scale;


                const x =
                    (
                        pageWidth -
                        finalWidth
                    ) / 2;


                const y =
                    (
                        pageHeight -
                        finalHeight
                    ) / 2;


                pdf.addImage(
                    canvas,
                    "PNG",
                    x,
                    y,
                    finalWidth,
                    finalHeight
                );

            }


            // =================================================
            // NAMA FILE
            // =================================================

            const tenantName =
                selectedPayment.tenant_name ||
                "penghuni";


            const safeTenantName =
                String(
                    tenantName
                )
                    .trim()
                    .replace(
                        /[\\/:*?"<>|]/g,
                        "-"
                    )
                    .replace(
                        /\s+/g,
                        "-"
                    );


            const fileName =
                `bukti-pembayaran-${safeTenantName || "penghuni"}.pdf`;


            // =================================================
            // DOWNLOAD
            // =================================================

            pdf.save(
                fileName
            );


        } catch (err) {

            console.error(
                "Download Receipt Error:",
                err
            );


            setError(
                "Gagal membuat PDF bukti pembayaran."
            );

        }

    };


    // =====================================================
    // PRINT RECEIPT
    // =====================================================

    // ============================================================
    // PRINT RECEIPT
    // ============================================================

    const printReceipt = () => {

        // ========================================================
        // VALIDASI
        // ========================================================

        if (!selectedPayment) {

            setError(
                "Data pembayaran tidak ditemukan."
            );

            return;

        }


        // ========================================================
        // BUKA PRINT WINDOW
        // ========================================================

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=900,height=900"
            );


        if (!printWindow) {

            setError(
                "Popup diblokir browser. Izinkan popup untuk mencetak."
            );

            return;

        }


        try {

            // ====================================================
            // DATA PEMBAYARAN
            // ====================================================

            const tenantName =
                selectedPayment.tenant_name ||
                "-";


            const roomNumber =
                selectedPayment.room_number ||
                "-";


            const billingMonth =
                selectedPayment.billing_month ||
                "-";


            const billingYear =
                selectedPayment.billing_year ||
                "-";


            const paymentDate =
                selectedPayment.payment_date
                    ? formatDate(
                        selectedPayment.payment_date
                    )
                    : "-";


            const paymentMethod =
                selectedPayment.payment_method
                    ? String(
                        selectedPayment.payment_method
                    )
                        .charAt(0)
                        .toUpperCase() +
                    String(
                        selectedPayment.payment_method
                    ).slice(1)
                    : "-";


            const notes =
                selectedPayment.notes ||
                "-";


            // ====================================================
            // NOMOR PEMBAYARAN
            // ====================================================

            const paymentNumber =
                selectedPayment.payment_number ||
                selectedPayment.payment_code ||
                selectedPayment.code ||
                (
                    selectedPayment.id
                        ? `PAY-${String(
                            selectedPayment.id
                        ).padStart(6, "0")}`
                        : "-"
                );


            // ====================================================
            // NOMINAL
            // ====================================================

            const amount =
                Number(
                    selectedPayment.amount || 0
                );


            const formattedAmount =
                new Intl.NumberFormat(
                    "id-ID",
                    {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0
                    }
                ).format(
                    amount
                );


            // ====================================================
            // TERBILANG
            // ====================================================

            const numberToWords = (number) => {

                const words = [
                    "NOL",
                    "SATU",
                    "DUA",
                    "TIGA",
                    "EMPAT",
                    "LIMA",
                    "ENAM",
                    "TUJUH",
                    "DELAPAN",
                    "SEMBILAN",
                    "SEPULUH",
                    "SEBELAS"
                ];


                number = Math.floor(
                    Math.abs(number)
                );


                if (number < 12) {

                    return words[number];

                }


                if (number < 20) {

                    return (
                        numberToWords(
                            number - 10
                        ) +
                        " BELAS"
                    );

                }


                if (number < 100) {

                    return (
                        numberToWords(
                            Math.floor(
                                number / 10
                            )
                        ) +
                        " PULUH " +
                        numberToWords(
                            number % 10
                        )
                    );

                }


                if (number < 200) {

                    return (
                        "SERATUS " +
                        numberToWords(
                            number - 100
                        )
                    );

                }


                if (number < 1000) {

                    return (
                        numberToWords(
                            Math.floor(
                                number / 100
                            )
                        ) +
                        " RATUS " +
                        numberToWords(
                            number % 100
                        )
                    );

                }


                if (number < 2000) {

                    return (
                        "SERIBU " +
                        numberToWords(
                            number - 1000
                        )
                    );

                }


                if (number < 1000000) {

                    return (
                        numberToWords(
                            Math.floor(
                                number / 1000
                            )
                        ) +
                        " RIBU " +
                        numberToWords(
                            number % 1000
                        )
                    );

                }


                if (number < 1000000000) {

                    return (
                        numberToWords(
                            Math.floor(
                                number / 1000000
                            )
                        ) +
                        " JUTA " +
                        numberToWords(
                            number % 1000000
                        )
                    );

                }


                if (number < 1000000000000) {

                    return (
                        numberToWords(
                            Math.floor(
                                number / 1000000000
                            )
                        ) +
                        " MILIAR " +
                        numberToWords(
                            number % 1000000000
                        )
                    );

                }


                return "";

            };


            const amountInWords =
                amount > 0
                    ? numberToWords(amount) +
                    " RUPIAH"
                    : "NOL RUPIAH";


            // ====================================================
            // TUJUAN PEMBAYARAN
            // ====================================================

            const paymentPurpose =
                `Sewa kamar kost nomor ${roomNumber} untuk periode ${billingMonth}/${billingYear}.`;


            // ====================================================
            // ESCAPE HTML
            // ====================================================

            const escapeHtml = (value) => {

                return String(value)
                    .replace(
                        /&/g,
                        "&amp;"
                    )
                    .replace(
                        /</g,
                        "&lt;"
                    )
                    .replace(
                        />/g,
                        "&gt;"
                    )
                    .replace(
                        /"/g,
                        "&quot;"
                    )
                    .replace(
                        /'/g,
                        "&#039;"
                    );

            };


            // ====================================================
            // DATA AMAN
            // ====================================================

            const safeTenantName =
                escapeHtml(
                    tenantName
                );


            const safeRoomNumber =
                escapeHtml(
                    roomNumber
                );


            const safeBillingMonth =
                escapeHtml(
                    billingMonth
                );


            const safeBillingYear =
                escapeHtml(
                    billingYear
                );


            const safePaymentDate =
                escapeHtml(
                    paymentDate
                );


            const safePaymentMethod =
                escapeHtml(
                    paymentMethod
                );


            const safeNotes =
                escapeHtml(
                    notes
                );


            const safePaymentNumber =
                escapeHtml(
                    paymentNumber
                );


            const safeAmountInWords =
                escapeHtml(
                    amountInWords
                );


            const safePaymentPurpose =
                escapeHtml(
                    paymentPurpose
                );


            // ====================================================
            // HTML CETAK
            // ====================================================

            printWindow.document.write(`
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>
        Bukti Pembayaran - ${safeTenantName}
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        html,
        body {
            margin: 0;
            padding: 0;
            background: #ffffff;
        }


        body {

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            color: #172033;

        }


        /* ==================================================
           RECEIPT
        ================================================== */

        .receipt {

            width: 190mm;

            min-height: 250mm;

            margin: 0 auto;

            padding: 16mm 17mm;

            background: #ffffff;

        }


        /* ==================================================
           HEADER
        ================================================== */

        .header {

            display: flex;

            justify-content:
                space-between;

            align-items: flex-start;

            padding-bottom: 15px;

            border-bottom:
                3px solid #2563eb;

        }


        .brand {

            font-size: 25px;

            font-weight: 800;

            letter-spacing: 0.5px;

            color: #172033;

        }


        .brand-subtitle {

            margin-top: 4px;

            font-size: 11px;

            color: #64748b;

            letter-spacing: 0.5px;

        }


        .header-right {

            text-align: right;

        }


        .receipt-title {

            font-size: 15px;

            font-weight: 800;

            color: #2563eb;

            text-transform:
                uppercase;

            letter-spacing: 0.8px;

        }


        .receipt-number {

            margin-top: 5px;

            font-size: 11px;

            color: #64748b;

        }


        /* ==================================================
           RECEIVED FROM
        ================================================== */

        .received {

            margin-top: 28px;

        }


        .received-label {

            font-size: 11px;

            color: #64748b;

            text-transform:
                uppercase;

            letter-spacing: 0.8px;

        }


        .received-name {

            margin-top: 8px;

            font-size: 22px;

            font-weight: 800;

            color: #172033;

        }


        /* ==================================================
           INFO
        ================================================== */

        .info {

            margin-top: 22px;

            padding-top: 17px;

            border-top:
                1px solid #e2e8f0;

        }


        .info-row {

            display: grid;

            grid-template-columns:
                145px 1fr;

            padding: 8px 0;

            font-size: 14px;

        }


        .info-label {

            color: #64748b;

        }


        .info-value {

            font-weight: 700;

            color: #172033;

        }


        /* ==================================================
           PAYMENT PURPOSE
        ================================================== */

        .purpose {

            margin-top: 18px;

            padding-top: 18px;

            border-top:
                1px solid #e2e8f0;

        }


        .purpose-label {

            font-size: 11px;

            color: #64748b;

            text-transform:
                uppercase;

            letter-spacing: 0.8px;

            margin-bottom: 8px;

        }


        .purpose-text {

            font-size: 15px;

            line-height: 1.6;

            color: #334155;

        }


        /* ==================================================
           AMOUNT
        ================================================== */

        .amount {

            margin-top: 25px;

            padding: 17px 0;

            border-top:
                2px solid #172033;

            border-bottom:
                2px solid #172033;

        }


        .amount-row {

            display: flex;

            justify-content:
                space-between;

            align-items: center;

            gap: 20px;

        }


        .amount-label {

            font-size: 16px;

            font-weight: 800;

            color: #172033;

        }


        .amount-value {

            font-size: 27px;

            font-weight: 800;

            color: #2563eb;

            white-space: nowrap;

        }


        .amount-words {

            margin-top: 9px;

            font-size: 11px;

            font-style: italic;

            color: #64748b;

        }


        /* ==================================================
           NOTES
        ================================================== */

        .notes {

            margin-top: 23px;

        }


        .notes-label {

            font-size: 11px;

            font-weight: 700;

            color: #64748b;

            text-transform:
                uppercase;

            letter-spacing: 0.7px;

        }


        .notes-value {

            margin-top: 8px;

            font-size: 13px;

            color: #475569;

            min-height: 25px;

            white-space: pre-wrap;

        }


        /* ==================================================
           BOTTOM
        ================================================== */

        .bottom {

            margin-top: 38px;

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 50px;

            align-items: end;

        }


        /* ==================================================
           STATUS PEMBAYARAN LUNAS
        ================================================== */

        .status-wrapper {

            display: flex;

            align-items: center;

            justify-content: flex-start;

        }


        .status-box {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 7px;

            min-width: 135px;

            padding: 8px 18px;

            border:
                1px solid #86efac;

            border-radius: 6px;

            background: #f0fdf4;

            color: #15803d;

            text-align: center;

            white-space: nowrap;

        }


        .status-check {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            width: 15px;

            height: 15px;

            flex-shrink: 0;

            border-radius: 50%;

            background: #22c55e;

            color: #ffffff;

            font-size: 9px;

            font-weight: 700;

            line-height: 1;

        }


        .status-text {

            margin: 0;

            font-size: 10px;

            font-weight: 700;

            color: #15803d;

            text-transform: uppercase;

            letter-spacing: 0.5px;

            line-height: 1;

        }


        /* ==================================================
           SIGNATURE
        ================================================== */

        .signature {

            text-align: center;

        }


        .signature-date {

            font-size: 12px;

            color: #64748b;

            margin-bottom: 45px;

        }


        .signature-line {

            border-top:
                1px solid #94a3b8;

            padding-top: 9px;

            font-size: 14px;

            font-weight: 800;

            color: #172033;

        }


        .signature-role {

            margin-top: 3px;

            font-size: 11px;

            color: #64748b;

        }


        /* ==================================================
           FOOTER
        ================================================== */

        .footer {

            margin-top: 45px;

            padding-top: 15px;

            border-top:
                1px solid #e2e8f0;

            text-align: center;

        }


        .footer-main {

            font-size: 11px;

            font-weight: 700;

            color: #475569;

        }


        .footer-sub {

            margin-top: 4px;

            font-size: 9px;

            color: #94a3b8;

        }


        /* ==================================================
           PRINT
        ================================================== */

        @page {

            size: A4;

            margin: 0;

        }


        @media print {

            html,
            body {

                width: 210mm;

                min-height: 297mm;

                margin: 0;

            }


            .receipt {

                width: 210mm;

                min-height: 297mm;

                padding:
                    18mm 18mm;

                margin: 0;

            }

        }

    </style>

</head>


<body>


    <div class="receipt">


        <!-- =============================================
             HEADER
        ============================================== -->

        <div class="header">

            <div>

                <div class="brand">
                    ADELINA KOST
                </div>

                <div class="brand-subtitle">
                    
                </div>

            </div>


            <div class="header-right">

                <div class="receipt-title">
                    Bukti Pembayaran
                </div>

                <div class="receipt-number">
                    No. ${safePaymentNumber}
                </div>

            </div>

        </div>


        <!-- =============================================
             RECEIVED FROM
        ============================================== -->

        <div class="received">

            <div class="received-label">
                Sudah Terima Dari
            </div>

            <div class="received-name">
                ${safeTenantName}
            </div>

        </div>


        <!-- =============================================
             PAYMENT INFO
        ============================================== -->

        <div class="info">


            <div class="info-row">

                <div class="info-label">
                    Nomor Pembayaran
                </div>

                <div class="info-value">
                    ${safePaymentNumber}
                </div>

            </div>


            <div class="info-row">

                <div class="info-label">
                    Kamar
                </div>

                <div class="info-value">
                    Kamar ${safeRoomNumber}
                </div>

            </div>


            <div class="info-row">

                <div class="info-label">
                    Periode
                </div>

                <div class="info-value">
                    ${safeBillingMonth}/${safeBillingYear}
                </div>

            </div>


            <div class="info-row">

                <div class="info-label">
                    Tanggal Pembayaran
                </div>

                <div class="info-value">
                    ${safePaymentDate}
                </div>

            </div>


            <div class="info-row">

                <div class="info-label">
                    Metode Pembayaran
                </div>

                <div class="info-value">
                    ${safePaymentMethod}
                </div>

            </div>


        </div>


        <!-- =============================================
             PURPOSE
        ============================================== -->

        <div class="purpose">

            <div class="purpose-label">
                Untuk Pembayaran
            </div>

            <div class="purpose-text">
                ${safePaymentPurpose}
            </div>

        </div>


        <!-- =============================================
             AMOUNT
        ============================================== -->

        <div class="amount">

            <div class="amount-row">

                <div class="amount-label">
                    Jumlah Pembayaran
                </div>

                <div class="amount-value">
                    ${formattedAmount}
                </div>

            </div>


            <div class="amount-words">
                ${safeAmountInWords}
            </div>

        </div>


        <!-- =============================================
             NOTES
        ============================================== -->

        <div class="notes">

            <div class="notes-label">
                Catatan
            </div>

            <div class="notes-value">
                ${safeNotes}
            </div>

        </div>


        <!-- =============================================
             STATUS + SIGNATURE
        ============================================== -->

        <div class="bottom">


            <div class="status-wrapper">

                <div class="status-box">

                    <span class="status-check">
                        ✓
                    </span>

                    <span class="status-text">
                        PEMBAYARAN LUNAS
                    </span>

                </div>

            </div>


            <div class="signature">

                <div class="signature-date">
                    Pekanbaru, ${safePaymentDate}
                </div>

                <div class="signature-line">
                    ADELINA KOST
                </div>

                <div class="signature-role">
                    Pengelola
                </div>

            </div>


        </div>


        <!-- =============================================
             FOOTER
        ============================================== -->

        <div class="footer">

            <div class="footer-main">
                Terima kasih atas pembayaran Anda.
            </div>

            <div class="footer-sub">
                ADELINA KOST - Management System
            </div>

        </div>


    </div>


</body>

</html>
        `);


            // ====================================================
            // SELESAIKAN DOCUMENT
            // ====================================================

            printWindow.document.close();


            // ====================================================
            // PRINT
            // ====================================================

            printWindow.onload = () => {

                printWindow.focus();

                setTimeout(() => {

                    printWindow.print();

                }, 300);

            };


        } catch (error) {

            console.error(
                "Print Receipt Error:",
                error
            );


            try {

                printWindow.close();

            } catch (closeError) {

                console.error(
                    "Close Print Window Error:",
                    closeError
                );

            }


            setError(
                "Gagal membuka halaman cetak bukti pembayaran."
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="p-6">

                <p>
                    Memuat data pembayaran...
                </p>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="p-6">

            {/* =================================================
                HEADER
                ================================================= */}

            <div className="mb-6 flex items-start justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Pembayaran
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola pembayaran penghuni ADELINA KOST
                    </p>

                </div>


                <button
                    onClick={openModal}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    + Tambah Pembayaran
                </button>

            </div>


            {/* =================================================
                ERROR
                ================================================= */}

            {error &&
                !showModal &&
                !showEditModal &&
                !showDetailModal &&
                !showDeleteModal &&
                !showReceiptModal && (

                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">

                        {error}

                    </div>

                )}


            {/* =================================================
                REKAP PEMBAYARAN
                ================================================= */}

            <div className="mb-6 overflow-hidden rounded-xl bg-white shadow">

                <button
                    type="button"
                    onClick={() =>
                        setShowRecap(
                            previous =>
                                !previous
                        )
                    }
                    className="flex w-full items-center justify-between border-b px-5 py-4 text-left hover:bg-gray-50"
                >

                    <div>

                        <h2 className="font-semibold text-gray-800">
                            Rekap Pembayaran
                        </h2>


                    </div>


                    <span className="text-gray-500">
                        {showRecap
                            ? "▲"
                            : "▼"}
                    </span>

                </button>


                {showRecap && (

                    <div className="p-5">

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                            {/* TOTAL */}

                            <div className="rounded-xl bg-blue-50 p-4">

                                <p className="text-xs font-medium text-blue-600">
                                    Total Pembayaran
                                </p>

                                <p className="mt-2 text-lg font-bold text-blue-800">
                                    {formatRupiah(
                                        recapData.total
                                    )}
                                </p>

                            </div>


                            {/* TRANSAKSI */}

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs font-medium text-gray-600">
                                    Transaksi
                                </p>

                                <p className="mt-2 text-lg font-bold text-gray-800">
                                    {recapData.transactionCount}
                                </p>

                            </div>


                            {/* CASH */}

                            <div className="rounded-xl bg-green-50 p-4">

                                <p className="text-xs font-medium text-green-600">
                                    Cash
                                </p>

                                <p className="mt-2 text-lg font-bold text-green-800">
                                    {formatRupiah(
                                        recapData.cash
                                    )}
                                </p>

                            </div>


                            {/* TRANSFER */}

                            <div className="rounded-xl bg-purple-50 p-4">

                                <p className="text-xs font-medium text-purple-600">
                                    Transfer
                                </p>

                                <p className="mt-2 text-lg font-bold text-purple-800">
                                    {formatRupiah(
                                        recapData.transfer
                                    )}
                                </p>

                            </div>


                            {/* LUNAS */}

                            <div className="rounded-xl bg-emerald-50 p-4">

                                <p className="text-xs font-medium text-emerald-600">
                                    Lunas
                                </p>

                                <p className="mt-2 text-lg font-bold text-emerald-800">
                                    {recapData.paidCount}
                                </p>

                            </div>

                            <div className="rounded-xl bg-amber-50 p-4">
                                <p className="text-xs font-medium text-amber-600">
                                    Menunggu Verifikasi
                                </p>
                                <p className="mt-2 text-lg font-bold text-amber-800">
                                    {recapData.pendingCount}
                                </p>
                            </div>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================================
                SEARCH + FILTER
                ================================================= */}

            <div className="mb-6 rounded-xl bg-white p-5 shadow">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                    {/* SEARCH */}

                    <div className="md:col-span-2">

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Cari Pembayaran
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Cari penghuni, kamar, bulan, tahun..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* BULAN */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Bulan
                        </label>

                        <select
                            value={filterMonth}
                            onChange={(e) =>
                                setFilterMonth(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            <option value="">
                                Semua Bulan
                            </option>

                            <option value="1">
                                Januari
                            </option>

                            <option value="2">
                                Februari
                            </option>

                            <option value="3">
                                Maret
                            </option>

                            <option value="4">
                                April
                            </option>

                            <option value="5">
                                Mei
                            </option>

                            <option value="6">
                                Juni
                            </option>

                            <option value="7">
                                Juli
                            </option>

                            <option value="8">
                                Agustus
                            </option>

                            <option value="9">
                                September
                            </option>

                            <option value="10">
                                Oktober
                            </option>

                            <option value="11">
                                November
                            </option>

                            <option value="12">
                                Desember
                            </option>

                        </select>

                    </div>


                    {/* TAHUN */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Tahun
                        </label>

                        <select
                            value={filterYear}
                            onChange={(e) =>
                                setFilterYear(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            <option value="">
                                Semua Tahun
                            </option>

                            {[
                                ...new Set([
                                    currentYear,
                                    ...payments.map(
                                        payment => {
                                            const date = payment.payment_date
                                                ? new Date(payment.payment_date)
                                                : null;

                                            return date && !Number.isNaN(date.getTime())
                                                ? String(date.getFullYear())
                                                : String(payment.billing_year || "");
                                        }
                                    )
                                ])
                            ]
                                .sort(
                                    (a, b) =>
                                        Number(b) -
                                        Number(a)
                                )
                                .map(
                                    year => (

                                        <option
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </option>

                                    )
                                )}

                        </select>

                    </div>

                </div>


                <div className="mt-4 flex items-center justify-between">

                    <p className="text-sm text-gray-500">

                        Menampilkan{" "}
                        <span className="font-semibold text-gray-700">
                            {filteredPayments.length}
                        </span>{" "}
                        pembayaran

                    </p>


                    <button
                        type="button"
                        onClick={resetFilter}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Reset Filter
                    </button>

                </div>

            </div>


            {/* =================================================
                TABLE
                ================================================= */}

            <div className="overflow-hidden rounded-xl bg-white shadow">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    No
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Penghuni
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Kamar
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Bulan
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Tanggal
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Jumlah
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Metode
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>

                                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                    Aksi
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {paginatedPayments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        Tidak ada data pembayaran.
                                    </td>

                                </tr>

                            ) : (

                                paginatedPayments.map(
                                    (
                                        payment,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                payment.id
                                            }
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="px-4 py-4 text-sm">

                                                {(
                                                    currentPage -
                                                    1
                                                ) *
                                                    itemsPerPage +
                                                    index +
                                                    1}

                                            </td>


                                            <td className="px-4 py-4 text-sm font-medium">

                                                {payment.tenant_name ||
                                                    "-"}

                                            </td>


                                            <td className="px-4 py-4 text-sm">

                                                {payment.room_number ||
                                                    "-"}

                                            </td>


                                            <td className="px-4 py-4 text-sm">

                                                {payment.billing_month}/
                                                {payment.billing_year}

                                            </td>


                                            <td className="px-4 py-4 text-sm">

                                                {formatDate(
                                                    payment.payment_date
                                                )}

                                            </td>


                                            <td className="px-4 py-4 text-sm font-semibold">

                                                {formatRupiah(
                                                    payment.amount
                                                )}

                                            </td>


                                            <td className="px-4 py-4 text-sm capitalize">

                                                {payment.payment_method ||
                                                    "-"}

                                            </td>


                                            <td className="px-4 py-4">

                                                {(() => {

                                                    const paymentStatus =
                                                        String(payment.status || "")
                                                            .toLowerCase();

                                                    const isPending =
                                                        paymentStatus === "pending";

                                                    const isRejected =
                                                        paymentStatus === "rejected";

                                                    const isVerified =
                                                        paymentStatus === "verified";

                                                    const statusClass =
                                                        isPending
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : isRejected
                                                                ? "bg-red-100 text-red-700"
                                                                : isVerified && payment.bill_status === "paid"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-blue-100 text-blue-700";

                                                    const statusLabel =
                                                        isPending
                                                            ? "Menunggu Verifikasi"
                                                            : isRejected
                                                                ? "Ditolak"
                                                                : isVerified
                                                                    ? "Lunas"
                                                                    : "Belum Diproses";

                                                    return (
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                                                        >
                                                            {statusLabel}
                                                        </span>
                                                    );

                                                })()}

                                            </td>


                                            {/* AKSI */}

                                            <td className="px-4 py-4">

                                                <div className="flex flex-wrap gap-2">

                                                    {/* =================================================
            VERIFIKASI PEMBAYARAN

            HANYA MUNCUL JIKA STATUS = pending
            ================================================= */}

                                                    {String(
                                                        payment.status || ""
                                                    ).trim().toLowerCase() === "pending" && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleVerify(
                                                                        payment
                                                                    )
                                                                }
                                                                disabled={
                                                                    verifyingId === payment.id ||
                                                                    rejectingId === payment.id
                                                                }
                                                                className="
                    rounded-lg
                    bg-emerald-100
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-emerald-700
                    hover:bg-emerald-200
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                                                            >

                                                                {verifyingId === payment.id
                                                                    ? "Memverifikasi..."
                                                                    : "Verifikasi"}

                                                            </button>

                                                        )}


                                                    {/* =================================================
            TOLAK PEMBAYARAN

            HANYA MUNCUL JIKA STATUS = pending
            ================================================= */}

                                                    {String(
                                                        payment.status || ""
                                                    ).trim().toLowerCase() === "pending" && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openReject(
                                                                        payment
                                                                    )
                                                                }
                                                                disabled={
                                                                    verifyingId === payment.id ||
                                                                    rejectingId === payment.id
                                                                }
                                                                className="
                    rounded-lg
                    bg-red-100
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-red-700
                    hover:bg-red-200
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                                                            >

                                                                Tolak

                                                            </button>

                                                        )}


                                                    {/* =================================================
            DETAIL
            ================================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDetail(
                                                                payment
                                                            )
                                                        }
                                                        className="
                rounded-lg
                bg-blue-100
                px-3
                py-1.5
                text-xs
                font-semibold
                text-blue-700
                hover:bg-blue-200
            "
                                                    >

                                                        Detail

                                                    </button>


                                                    {/* =================================================
            EDIT
            ================================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                payment
                                                            )
                                                        }
                                                        className="
                rounded-lg
                bg-yellow-100
                px-3
                py-1.5
                text-xs
                font-semibold
                text-yellow-700
                hover:bg-yellow-200
            "
                                                    >

                                                        Edit

                                                    </button>


                                                    {/* =================================================
            STRUK
            ================================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openReceipt(
                                                                payment
                                                            )
                                                        }
                                                        className="
                rounded-lg
                bg-green-100
                px-3
                py-1.5
                text-xs
                font-semibold
                text-green-700
                hover:bg-green-200
            "
                                                    >

                                                        Struk

                                                    </button>


                                                    {/* =================================================
            HAPUS
            ================================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDelete(
                                                                payment
                                                            )
                                                        }
                                                        className="
                rounded-lg
                bg-red-100
                px-3
                py-1.5
                text-xs
                font-semibold
                text-red-700
                hover:bg-red-200
            "
                                                    >

                                                        Hapus

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    PAGINATION
                    ================================================= */}

                {filteredPayments.length > 0 && (

                    <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-gray-500">

                            Halaman{" "}
                            <span className="font-semibold text-gray-700">
                                {currentPage}
                            </span>{" "}
                            dari{" "}
                            <span className="font-semibold text-gray-700">
                                {totalPages}
                            </span>

                        </p>


                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        previous =>
                                            Math.max(
                                                previous -
                                                1,
                                                1
                                            )
                                    )
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ← Sebelumnya
                            </button>


                            {Array.from(
                                {
                                    length:
                                        totalPages
                                },
                                (
                                    _,
                                    index
                                ) =>
                                    index + 1
                            )
                                .slice(
                                    0,
                                    5
                                )
                                .map(
                                    page => (

                                        <button
                                            key={
                                                page
                                            }
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage(
                                                    page
                                                )
                                            }
                                            className={`rounded-lg px-3 py-2 text-sm font-medium ${currentPage ===
                                                page
                                                ? "bg-blue-600 text-white"
                                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>

                                    )
                                )}


                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        previous =>
                                            Math.min(
                                                previous +
                                                1,
                                                totalPages
                                            )
                                    )
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Berikutnya →
                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================================
                MODAL TAMBAH
                ================================================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">

                        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">

                            <div>

                                <h2 className="text-lg font-bold text-gray-800">
                                    Tambah Pembayaran
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Catat pembayaran penghuni
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-4 overflow-y-auto p-6"
                        >

                            {error && (

                                <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                                    {error}
                                </div>

                            )}


                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Tagihan
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>


                                <select
                                    name="bill_id"
                                    value={
                                        form.bill_id
                                    }
                                    onChange={
                                        handleBillChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                >

                                    <option value="">
                                        -- Pilih Tagihan --
                                    </option>


                                    {bills
                                        .filter(
                                            bill =>
                                                bill.status !==
                                                "paid" &&
                                                getRemainingAmount(
                                                    bill
                                                ) >
                                                0
                                        )
                                        .map(
                                            bill => (

                                                <option
                                                    key={
                                                        bill.id
                                                    }
                                                    value={
                                                        bill.id
                                                    }
                                                >

                                                    {
                                                        bill.tenant_name
                                                    }
                                                    {" - "}
                                                    Kamar{" "}
                                                    {
                                                        bill.room_number
                                                    }
                                                    {" - "}
                                                    {
                                                        bill.billing_month
                                                    }
                                                    /
                                                    {
                                                        bill.billing_year
                                                    }
                                                    {" - "}
                                                    {formatRupiah(
                                                        getRemainingAmount(
                                                            bill
                                                        )
                                                    )}

                                                </option>

                                            )
                                        )}

                                </select>

                            </div>


                            {selectedBill && (

                                <div className="rounded-lg bg-blue-50 p-4">

                                    <div className="grid grid-cols-2 gap-3 text-sm">

                                        <div>

                                            <p className="text-gray-500">
                                                Penghuni
                                            </p>

                                            <p className="font-semibold">
                                                {
                                                    selectedBill.tenant_name
                                                }
                                            </p>

                                        </div>


                                        <div>

                                            <p className="text-gray-500">
                                                Kamar
                                            </p>

                                            <p className="font-semibold">
                                                {
                                                    selectedBill.room_number
                                                }
                                            </p>

                                        </div>


                                        <div>

                                            <p className="text-gray-500">
                                                Total Tagihan
                                            </p>

                                            <p className="font-semibold">
                                                {formatRupiah(
                                                    selectedBill.amount
                                                )}
                                            </p>

                                        </div>


                                        <div>

                                            <p className="text-gray-500">
                                                Sisa Tagihan
                                            </p>

                                            <p className="font-semibold text-red-600">
                                                {formatRupiah(
                                                    getRemainingAmount(
                                                        selectedBill
                                                    )
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}


                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Tanggal Pembayaran
                                </label>

                                <input
                                    type="date"
                                    name="payment_date"
                                    value={
                                        form.payment_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Jumlah Pembayaran
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={
                                        form.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    min="1"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Metode Pembayaran
                                </label>

                                <select
                                    name="payment_method"
                                    value={
                                        form.payment_method
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                >

                                    <option value="cash">
                                        Cash
                                    </option>

                                    <option value="transfer">
                                        Transfer
                                    </option>

                                </select>

                            </div>


                            {form.payment_method === "transfer" && (

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Rekening Tujuan
                                    </label>

                                    <select
                                        name="bank_account_id"
                                        value={form.bank_account_id}
                                        onChange={handleChange}
                                        disabled={saving}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                    >
                                        <option value="">Pilih rekening</option>
                                        {bankAccounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.bank_name || account.bank || "Bank"} - {account.account_number || account.account_no || ""}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                            )}


                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Catatan
                                </label>

                                <textarea
                                    name="notes"
                                    value={
                                        form.notes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    rows="3"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                />

                            </div>


                            <div className="flex justify-end gap-3 border-t pt-4">

                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="rounded-lg border px-4 py-2.5 text-sm"
                                >
                                    Batal
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : "Simpan Pembayaran"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                MODAL DETAIL
                ================================================= */}

            {showDetailModal &&
                selectedPayment && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                            <div className="flex items-center justify-between border-b px-6 py-4">

                                <div>

                                    <h2 className="text-lg font-bold text-gray-800">
                                        Detail Pembayaran
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Informasi pembayaran
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDetailModal(
                                            false
                                        )
                                    }
                                    className="text-2xl text-gray-400"
                                >
                                    ×
                                </button>

                            </div>


                            <div className="space-y-4 p-6">

                                <div className="grid grid-cols-2 gap-4">

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Penghuni
                                        </p>

                                        <p className="font-semibold">
                                            {
                                                selectedPayment.tenant_name ||
                                                "-"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Kamar
                                        </p>

                                        <p className="font-semibold">
                                            {
                                                selectedPayment.room_number ||
                                                "-"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Periode
                                        </p>

                                        <p className="font-semibold">
                                            {
                                                selectedPayment.billing_month
                                            }
                                            /
                                            {
                                                selectedPayment.billing_year
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Tanggal
                                        </p>

                                        <p className="font-semibold">
                                            {formatDate(
                                                selectedPayment.payment_date
                                            )}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Jumlah
                                        </p>

                                        <p className="font-semibold text-blue-600">
                                            {formatRupiah(
                                                selectedPayment.amount
                                            )}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Metode
                                        </p>

                                        <p className="font-semibold capitalize">
                                            {
                                                selectedPayment.payment_method ||
                                                "-"
                                            }
                                        </p>

                                    </div>

                                </div>


                                <div>

                                    <p className="text-xs text-gray-500">
                                        Catatan
                                    </p>

                                    <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm">
                                        {
                                            selectedPayment.notes ||
                                            "-"
                                        }
                                    </p>

                                </div>

                                {/* BUKTI PEMBAYARAN */}
                                <div>

                                    <p className="text-xs text-gray-500">
                                        Bukti Pembayaran
                                    </p>

                                    {selectedPayment.proof_file ? (

                                        <div className="mt-2 overflow-hidden rounded-lg border bg-gray-50">

                                            <img
                                                src={`http://localhost:5000/uploads/payment-proofs/${selectedPayment.proof_file}`}
                                                alt="Bukti pembayaran"
                                                className="max-h-96 w-full object-contain"
                                            />

                                        </div>

                                    ) : (

                                        <div className="mt-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                                            Tidak ada bukti pembayaran.
                                        </div>

                                    )}

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDetailModal(
                                            false
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50"
                                >
                                    Tutup
                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {/* =================================================
                MODAL EDIT
                ================================================= */}

            {showEditModal &&
                selectedPayment && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                        <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">

                            <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">

                                <div>

                                    <h2 className="text-lg font-bold text-gray-800">
                                        Edit Pembayaran
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Perbarui data pembayaran
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        !saving &&
                                        setShowEditModal(
                                            false
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="text-2xl text-gray-400"
                                >
                                    ×
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleUpdate
                                }
                                className="space-y-4 overflow-y-auto p-6"
                            >

                                {error && (

                                    <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                                        {error}
                                    </div>

                                )}


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Tagihan
                                    </label>

                                    <select
                                        name="bill_id"
                                        value={
                                            editForm.bill_id
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                    >

                                        {bills.map(
                                            bill => (

                                                <option
                                                    key={
                                                        bill.id
                                                    }
                                                    value={
                                                        bill.id
                                                    }
                                                >

                                                    {
                                                        bill.tenant_name
                                                    }
                                                    {" - "}
                                                    Kamar{" "}
                                                    {
                                                        bill.room_number
                                                    }
                                                    {" - "}
                                                    {
                                                        bill.billing_month
                                                    }
                                                    /
                                                    {
                                                        bill.billing_year
                                                    }
                                                    {" - "}
                                                    {formatRupiah(
                                                        bill.amount
                                                    )}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Tanggal Pembayaran
                                    </label>

                                    <input
                                        type="date"
                                        name="payment_date"
                                        value={
                                            editForm.payment_date
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Jumlah Pembayaran
                                    </label>

                                    <input
                                        type="number"
                                        name="amount"
                                        value={
                                            editForm.amount
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        disabled={
                                            saving
                                        }
                                        min="1"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Metode Pembayaran
                                    </label>

                                    <select
                                        name="payment_method"
                                        value={
                                            editForm.payment_method
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                    >

                                        <option value="cash">
                                            Cash
                                        </option>

                                        <option value="transfer">
                                            Transfer
                                        </option>

                                    </select>

                                </div>


                                {editForm.payment_method === "transfer" && (

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Rekening Tujuan
                                        </label>

                                        <select
                                            name="bank_account_id"
                                            value={editForm.bank_account_id}
                                            onChange={handleEditChange}
                                            disabled={saving}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        >
                                            <option value="">Pilih rekening</option>
                                            {bankAccounts.map((account) => (
                                                <option key={account.id} value={account.id}>
                                                    {account.bank_name || account.bank || "Bank"} - {account.account_number || account.account_no || ""}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                )}


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Catatan
                                    </label>

                                    <textarea
                                        name="notes"
                                        value={
                                            editForm.notes
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        disabled={
                                            saving
                                        }
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                    />

                                </div>


                                <div className="flex justify-end gap-3 border-t pt-4">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEditModal(
                                                false
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                    >
                                        Batal
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={
                                            saving
                                        }
                                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                                    >
                                        {saving
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


            {/* =================================================
                MODAL DELETE
                ================================================= */}

            {showDeleteModal &&
                selectedPayment && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                            <h2 className="text-lg font-bold text-gray-800">
                                Hapus Pembayaran?
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">

                                Yakin ingin menghapus pembayaran
                                {" "}
                                <span className="font-semibold text-gray-700">
                                    {
                                        selectedPayment.tenant_name
                                    }
                                </span>
                                {" "}
                                sebesar
                                {" "}
                                <span className="font-semibold text-gray-700">
                                    {formatRupiah(
                                        selectedPayment.amount
                                    )}
                                </span>
                                ?

                            </p>


                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeleteModal(
                                            false
                                        )
                                    }
                                    disabled={
                                        deleting
                                    }
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                >
                                    Batal
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {deleting
                                        ? "Menghapus..."
                                        : "Ya, Hapus"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {/* =================================================
                MODAL STRUK
                ================================================= */}

            {showReceiptModal &&
                selectedPayment && (

                    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">

                        {/* ============================================================
        MODAL CONTAINER
        ============================================================ */}

                        <div className="my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                            {/* ========================================================
            MODAL HEADER
            ======================================================== */}

                            <div className="flex flex-shrink-0 items-center justify-between border-b bg-white px-5 py-4">

                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Bukti Pembayaran
                                    </h2>

                                    <p className="text-xs text-gray-500">
                                        ADELINA KOST
                                    </p>
                                </div>

                                {/* TOMBOL CLOSE */}

                                <button
                                    type="button"
                                    onClick={() => setShowReceiptModal(false)}
                                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl font-medium leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                                    aria-label="Tutup"
                                >
                                    ×
                                </button>

                            </div>


                            {/* ============================================================
            MODAL CONTENT - SCROLL
            ============================================================ */}

                            <div className="min-h-0 flex-1 overflow-y-auto">

                                <div className="p-5">

                                    {/* ====================================================
                    PAYMENT RECEIPT
                    ==================================================== */}

                                    <div
                                        id="payment-receipt"
                                        className="mx-auto w-full bg-white text-gray-800"
                                        style={{
                                            fontFamily:
                                                "Arial, Helvetica, sans-serif",
                                            padding: "28px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "6px",
                                            boxSizing: "border-box",
                                        }}
                                    >

                                        {/* =================================================
                        HEADER STRUK
                        ================================================= */}

                                        <div
                                            style={{
                                                borderBottom:
                                                    "2px solid #1d4ed8",
                                                paddingBottom: "14px",
                                                marginBottom: "20px",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "flex-start",
                                                    gap: "16px",
                                                }}
                                            >

                                                {/* BRAND */}

                                                <div>

                                                    <h1
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "22px",
                                                            fontWeight: "700",
                                                            letterSpacing:
                                                                "0.4px",
                                                            color: "#111827",
                                                        }}
                                                    >
                                                        ADELINA KOST
                                                    </h1>

                                                    <p
                                                        style={{
                                                            margin:
                                                                "3px 0 0",
                                                            fontSize: "11px",
                                                            color: "#6b7280",
                                                        }}
                                                    >
                                                        Management System
                                                    </p>

                                                </div>


                                                {/* TITLE */}

                                                <div
                                                    style={{
                                                        textAlign: "right",
                                                    }}
                                                >

                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "700",
                                                            color: "#1d4ed8",
                                                            textTransform:
                                                                "uppercase",
                                                            letterSpacing:
                                                                "0.5px",
                                                        }}
                                                    >
                                                        Bukti Pembayaran
                                                    </p>

                                                    <p
                                                        style={{
                                                            margin:
                                                                "3px 0 0",
                                                            fontSize: "9px",
                                                            color: "#9ca3af",
                                                        }}
                                                    >
                                                        PAYMENT RECEIPT
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================================
                        INFORMASI PENERIMA
                        ================================================= */}

                                        <div
                                            style={{
                                                marginBottom: "18px",
                                            }}
                                        >

                                            <p
                                                style={{
                                                    margin:
                                                        "0 0 4px",
                                                    fontSize: "9px",
                                                    color: "#6b7280",
                                                    textTransform:
                                                        "uppercase",
                                                    letterSpacing:
                                                        "0.6px",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Sudah Terima Dari
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "17px",
                                                    fontWeight: "700",
                                                    color: "#111827",
                                                }}
                                            >
                                                {selectedPayment.tenant_name || "-"}
                                            </p>

                                        </div>


                                        {/* =================================================
                        DETAIL PEMBAYARAN
                        ================================================= */}

                                        <div
                                            style={{
                                                borderTop:
                                                    "1px solid #e5e7eb",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                padding: "14px 0",
                                                marginBottom: "18px",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "145px 1fr",
                                                    rowGap: "10px",
                                                    fontSize: "12px",
                                                }}
                                            >

                                                {/* NOMOR */}

                                                <span
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Nomor Pembayaran
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {`PAY-${String(
                                                        selectedPayment.id
                                                    ).padStart(6, "0")}`}
                                                </span>


                                                {/* KAMAR */}

                                                <span
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Kamar
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#111827",
                                                    }}
                                                >
                                                    Kamar{" "}
                                                    {selectedPayment.room_number ||
                                                        "-"}
                                                </span>


                                                {/* PERIODE */}

                                                <span
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Periode Tagihan
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {selectedPayment.billing_month ||
                                                        "-"}
                                                    /
                                                    {selectedPayment.billing_year ||
                                                        "-"}
                                                </span>


                                                {/* TANGGAL */}

                                                <span
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Tanggal Pembayaran
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {formatDate(
                                                        selectedPayment.payment_date
                                                    )}
                                                </span>


                                                {/* METODE */}

                                                <span
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Metode Pembayaran
                                                </span>

                                                <span
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#111827",
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
                                                    {selectedPayment.payment_method ||
                                                        "-"}
                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================================
                        UNTUK PEMBAYARAN
                        ================================================= */}

                                        <div
                                            style={{
                                                marginBottom: "18px",
                                            }}
                                        >

                                            <p
                                                style={{
                                                    margin:
                                                        "0 0 5px",
                                                    fontSize: "9px",
                                                    color: "#6b7280",
                                                    textTransform:
                                                        "uppercase",
                                                    letterSpacing:
                                                        "0.6px",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Untuk Pembayaran
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "12px",
                                                    lineHeight: "1.5",
                                                    color: "#374151",
                                                }}
                                            >
                                                Sewa kamar kost nomor{" "}
                                                {selectedPayment.room_number ||
                                                    "-"}{" "}
                                                untuk periode{" "}
                                                {selectedPayment.billing_month ||
                                                    "-"}
                                                /
                                                {selectedPayment.billing_year ||
                                                    "-"}.
                                            </p>

                                        </div>


                                        {/* =================================================
                        TOTAL PEMBAYARAN
                        ================================================= */}

                                        <div
                                            style={{
                                                borderTop:
                                                    "2px solid #111827",
                                                borderBottom:
                                                    "2px solid #111827",
                                                padding: "13px 0",
                                                marginBottom: "16px",
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems: "center",
                                                gap: "15px",
                                            }}
                                        >

                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: "#111827",
                                                }}
                                            >
                                                Jumlah Pembayaran
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: "19px",
                                                    fontWeight: "800",
                                                    color: "#1d4ed8",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {formatRupiah(
                                                    selectedPayment.amount
                                                )}
                                            </span>

                                        </div>


                                        {/* =================================================
                        STATUS
                        ================================================= */}

                                        {/* =========================================
    STATUS PEMBAYARAN
========================================= */}

                                        {/* =========================================
    STATUS PEMBAYARAN
========================================= */}

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                width: "100%",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "8px",

                                                    border: "1px solid #86efac",
                                                    backgroundColor: "#f0fdf4",
                                                    color: "#15803d",

                                                    borderRadius: "6px",
                                                    padding: "8px 18px",

                                                    fontSize: "10px",
                                                    fontWeight: "700",

                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",

                                                    lineHeight: "1",
                                                    boxSizing: "border-box",

                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {/* CIRCLE CHECK */}
                                                <span
                                                    style={{
                                                        position: "relative",

                                                        display: "inline-block",

                                                        width: "16px",
                                                        height: "16px",

                                                        minWidth: "16px",
                                                        minHeight: "16px",

                                                        borderRadius: "50%",
                                                        backgroundColor: "#22c55e",

                                                        boxSizing: "border-box",
                                                    }}
                                                >
                                                    {/* CHECK MARK */}
                                                    <span
                                                        style={{
                                                            position: "absolute",

                                                            left: "5px",
                                                            top: "3px",

                                                            width: "4px",
                                                            height: "7px",

                                                            borderRight: "2px solid #ffffff",
                                                            borderBottom: "2px solid #ffffff",

                                                            transform: "rotate(45deg)",

                                                            boxSizing: "border-box",
                                                        }}
                                                    />
                                                </span>

                                                {/* TEXT */}
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        lineHeight: "16px",
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    PEMBAYARAN LUNAS
                                                </span>
                                            </div>
                                        </div>


                                        {/* =================================================
                        TANDA TANGAN
                        ================================================= */}

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-end",
                                                gap: "30px",
                                                marginTop: "12px",
                                            }}
                                        >

                                            {/* KIRI */}

                                            <div
                                                style={{
                                                    flex: 1,
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "10px",
                                                        color: "#6b7280",
                                                        lineHeight: "1.5",
                                                    }}
                                                >
                                                    Terima kasih atas pembayaran Anda.
                                                </p>

                                            </div>


                                            {/* KANAN */}

                                            <div
                                                style={{
                                                    width: "155px",
                                                    textAlign: "center",
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "10px",
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Pekanbaru,{" "}
                                                    {formatDate(
                                                        selectedPayment.payment_date
                                                    )}
                                                </p>


                                                {/* RUANG TANDA TANGAN */}

                                                <div
                                                    style={{
                                                        height: "42px",
                                                    }}
                                                />


                                                <div
                                                    style={{
                                                        borderTop:
                                                            "1px solid #9ca3af",
                                                        paddingTop: "5px",
                                                    }}
                                                >

                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "11px",
                                                            fontWeight:
                                                                "700",
                                                            color:
                                                                "#111827",
                                                        }}
                                                    >
                                                        ADELINA KOST
                                                    </p>

                                                    <p
                                                        style={{
                                                            margin:
                                                                "2px 0 0",
                                                            fontSize: "9px",
                                                            color:
                                                                "#6b7280",
                                                        }}
                                                    >
                                                        Pengelola
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================================
                        FOOTER SYSTEM
                        ================================================= */}

                                        <div
                                            style={{
                                                borderTop:
                                                    "1px solid #e5e7eb",
                                                marginTop: "22px",
                                                paddingTop: "9px",
                                                textAlign: "center",
                                            }}
                                        >

                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "8px",
                                                    color: "#9ca3af",
                                                }}
                                            >
                                                ADELINA KOST — Management System
                                            </p>

                                            <p
                                                style={{
                                                    margin:
                                                        "2px 0 0",
                                                    fontSize: "8px",
                                                    color: "#9ca3af",
                                                }}
                                            >
                                                Dokumen ini merupakan bukti pembayaran yang sah.
                                            </p>

                                        </div>

                                    </div>


                                    {/* ====================================================
                    BUTTON RECEIPT
                    ==================================================== */}

                                    <div className="mt-5 grid grid-cols-2 gap-3">

                                        <button
                                            type="button"
                                            onClick={printReceipt}
                                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                        >
                                            🖨️ Cetak
                                        </button>


                                        <button
                                            type="button"
                                            onClick={downloadReceipt}
                                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            ⬇️ Download PDF
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                )}
            {/* MODAL TOLAK PEMBAYARAN */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                        <h2 className="text-lg font-bold text-gray-800">
                            Tolak Pembayaran
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Masukkan alasan penolakan pembayaran.
                        </p>

                        <textarea
                            value={rejectReason}
                            onChange={(e) =>
                                setRejectReason(e.target.value)
                            }
                            placeholder="Contoh: Bukti pembayaran tidak sesuai."
                            rows={4}
                            className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500"
                        />

                        {error && (
                            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="mt-5 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setPaymentToReject(null);
                                    setRejectReason("");
                                    setError("");
                                }}
                                disabled={rejectingId !== null}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={
                                    rejectingId === paymentToReject?.id
                                }
                                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                {rejectingId === paymentToReject?.id
                                    ? "Menolak..."
                                    : "Tolak Pembayaran"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>

    );

};

export default Payments;