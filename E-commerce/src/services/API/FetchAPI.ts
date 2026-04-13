
const API = import.meta.env.VITE_API_URL;

let isRefreshing = false;

export const FetchAPI = async<T> (url: string, options: RequestInit = {}):Promise<T> => {
    
  let response = await fetch(`${url}`, {
    ...options,
    credentials: "include",
  });
  // if access token expired
  // if (response.status === 401 && !isRefreshing) {
  //   isRefreshing = true;

  //   const refresh = await fetch(`${API}/onboarding/user/refreshToken`, {
  //     method: "POST",
  //     credentials: "include",
  //   });
  //   isRefreshing = false;
  //   if (refresh.ok) {

  //     // retry original request
  //     response = await fetch(`${API}${url}`, {
  //       ...options,
  //       credentials: "include",
  //     });

  //   } else {
  //     throw new Error("Session expired");
  //   }
  // }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }


  return data;
};