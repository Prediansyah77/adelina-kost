import api from "./api";

// ============================================================
// GET KTP
// ============================================================

export const getKtp = async (tenantId) => {

    const response = await api.get(
        `/tenant-documents/${tenantId}/ktp`
    );

    return response.data;
};


// ============================================================
// UPLOAD / REPLACE KTP
// ============================================================

export const uploadKtp = async (
    tenantId,
    file
) => {

    const formData = new FormData();

    formData.append(
        "ktp",
        file
    );

    const response = await api.post(
        `/tenant-documents/${tenantId}/ktp`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};


// ============================================================
// DELETE KTP
// ============================================================

export const deleteKtp = async (
    tenantId
) => {

    const response = await api.delete(
        `/tenant-documents/${tenantId}/ktp`
    );

    return response.data;
};