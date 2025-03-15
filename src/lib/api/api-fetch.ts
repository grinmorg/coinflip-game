import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401
    ) {
      // Вариант редиректа:
      // if (
      //   error.response.config.url !=
      //   "/account/profile"
      // ) {
      //   window.location.href =
      //     ROUTES.login;
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
