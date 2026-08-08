import API from "../Interceptor/api";

// Get All Plans
export const getAllPlans = () => {
  return API.get("/admin/plans-manage/plans");
};

// Get Plan By ID
export const getPlanById = (id) => {
  return API.get(`/admin/plans-manage/plans/${id}`);
};

// Create Plan
export const createPlan = (data) => {
  return API.post("/admin/plans-manage/plans", data);
};

// Update Plan
export const updatePlan = (id, data) => {
  return API.put(`/admin/plans-manage/plans/${id}`, data);
};

// Delete Plan
export const deletePlan = (id) => {
  return API.delete(`/admin/plans-manage/plans/${id}`);
};