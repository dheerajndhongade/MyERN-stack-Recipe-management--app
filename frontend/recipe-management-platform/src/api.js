// src/api.js

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    authorization: token || "", // Add token directly if you don't want to use "Bearer"
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};
