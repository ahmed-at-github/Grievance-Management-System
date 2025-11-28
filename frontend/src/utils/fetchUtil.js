const refreshAccessToken = async () => {
  const res = await fetch("http://localhost:4000/api/v1/refresh", {
    method: "GET",
    credentials: "include", // send refresh token cookie
  });
  if (!res.ok) throw new Error("Unable to refresh token");
  const data = await res.json();

  return data.accessToken;
};

export const fetchWithRefresh = async (url, options = {}) => {
  let token = localStorage.getItem(`accessToken`);
  
  let headers = options.headers || {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    // Access token expired, try refresh
    try {
      const newToken = await refreshAccessToken();
      // set token in localstorage 
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers }); // retry original request
    } catch (err) {
      console.error("Refresh failed", err);
      throw err; // user must login again
    }
  }

  return response;
};
