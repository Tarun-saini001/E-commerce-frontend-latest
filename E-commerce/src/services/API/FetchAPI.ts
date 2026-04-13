

export const FetchAPI = async<T> (url: string, options: RequestInit = {}):Promise<T> => {
    
  let response = await fetch(`${url}`, {
    ...options,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }


  return data;
};