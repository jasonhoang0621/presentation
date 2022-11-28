import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://group-user-server.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `${token}` || "";
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    const originalRequest = error.config;
    if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const result = await axiosClient.post("/refreshToken", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      if (result?.errorCode) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return;
      }
      localStorage.setItem("token", result?.data?.token);
      localStorage.setItem("refreshToken", result?.data?.refreshToken);
      axiosClient.defaults.headers.common["Authorization"] =
        result?.data?.token;
      return axiosClient(originalRequest);
    }
    if (error?.response?.status === 400) {
      return error?.response?.data;
    }
  }
);

export { axiosClient };
