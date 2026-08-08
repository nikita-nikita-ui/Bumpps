import api from "../Interceptor/api";

export const getAllUsers = () => api.get("/admin/users");

export const getUserById = (id) =>
    api.get(`/admin/users/${id}`);

export const updateUser = (id, data) =>
    api.put(`/admin/users/${id}`, data);

export const deleteUser = (id) =>
    api.delete(`/admin/users/${id}`);

export const getAdminStats = () =>
    api.get("/admin/stats");


// ================= Notification =================

export const sendNotificationToAll = (data) =>
    api.post("/admin/notifications/send-all", data);

export const sendNotificationToUser = (data) =>
    api.post("/admin/notifications/send-single", data);


// Get Notification History
export const getNotificationHistory = () =>
    api.get("/admin/notifications/sent-history");


// Clear Notifications
export const clearNotifications = () =>
    api.delete("/notifications/clear");