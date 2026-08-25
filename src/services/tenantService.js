import api from "./api";

// GET semua penghuni
export const getTenants = async () => {
    const response = await api.get("/tenants");

    return response.data;
};

// GET penghuni berdasarkan ID
export const getTenantById = async (id) => {
    const response = await api.get(`/tenants/${id}`);

    return response.data;
};

// CREATE penghuni
export const createTenant = async (data) => {
    const response = await api.post("/tenants", data);

    return response.data;
};

// UPDATE penghuni
export const updateTenant = async (id, data) => {
    const response = await api.put(`/tenants/${id}`, data);

    return response.data;
};

// DELETE penghuni
export const deleteTenant = async (id) => {
    const response = await api.delete(`/tenants/${id}`);

    return response.data;
};