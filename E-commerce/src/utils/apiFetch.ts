const API = import.meta.env.VITE_API_URL;

export const apiFetch = async (url: string, options: RequestInit = {}) => {

  let response = await fetch(`${API}${url}`, {
    ...options,
    credentials: "include",
  });

  // if access token expired
  if (response.status === 401) {

    const refresh = await fetch(`${API}/onboarding/user/refreshToken`, {
      method: "GET",
      credentials: "include",
    });

    if (refresh.ok) {

      // retry original request
      response = await fetch(`${API}${url}`, {
        ...options,
        credentials: "include",
      });

    } else {
      throw new Error("Session expired");
    }
  }

  return response;
};