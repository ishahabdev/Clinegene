/**
 * API Client abstraction.
 * When VITE_USE_MOCK_API !== "false" (default), API functions return mock data
 * with simulated network latency. When switched to false, requests pass through
 * to the backend baseUrl (VITE_API_URL || "/api").
 */

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export function simulateDelay(ms = 280) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function httpClient(endpoint, { method = "GET", body, headers = {} } = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // ready for httpOnly cookies
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

