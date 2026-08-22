import API from "../Interceptor/api";

export const getAllPlans = () => {
  return API.get("/admin/plans-manage/plans");
};

export const getPlanById = (id) => {
  return API.get(`/admin/plans-manage/plans/${id}`);
};

export const createPlan = (data) => {
  return API.post("/admin/plans-manage/plans", data);
};

export const updatePlan = (id, data) => {
  return API.put(`/admin/plans-manage/plans/${id}`, data);
};

export const deletePlan = (id) => {
  return API.delete(`/admin/plans-manage/plans/${id}`);
};