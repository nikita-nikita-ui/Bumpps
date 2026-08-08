import api from "../Interceptor/api";

export const registerAdmin = async (data) => {
  const { data: response } = await api.post("/admin/register", data);
  return response;
};

export const loginAdmin = async (data) => {
  const { data: response } = await api.post("/admin/login", data);

  if (response.token) {
    localStorage.setItem("adminToken", response.token);
  }

  if (response.admin) {
    localStorage.setItem("admin", JSON.stringify(response.admin));
  }

  return response;
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};