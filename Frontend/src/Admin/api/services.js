import { USE_MOCK_API, simulateDelay, httpClient } from "./client.js";
import { MOCK_SERVICES } from "../mocks/mockData.js";

const STORAGE_KEY = "clingene_admin_services_mock_data";

function loadStoredServices() {
  if (typeof window === "undefined") return MOCK_SERVICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_SERVICES));
      return MOCK_SERVICES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_SERVICES));
    return MOCK_SERVICES;
  } catch {
    return MOCK_SERVICES;
  }
}

function saveStoredServices(list) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Could not save services mock data to localStorage", e);
    }
  }
}

let mockServicesStore = loadStoredServices();

export async function getServices(filters = {}) {
  if (!USE_MOCK_API) {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category && filters.category !== "All Categories") params.append("category", filters.category);
    if (filters.status && filters.status !== "All") params.append("status", filters.status);
    const qs = params.toString();
    return httpClient(`services${qs ? `?${qs}` : ""}`);
  }

  // Ensure mock store is fresh
  if (!mockServicesStore || mockServicesStore.length === 0) {
    mockServicesStore = loadStoredServices();
  }
  let list = [...mockServicesStore];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.tagline && s.tagline.toLowerCase().includes(q)) ||
        (s.sampleType && s.sampleType.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== "All Categories") {
    list = list.filter((s) => s.category === filters.category);
  }

  if (filters.status && filters.status !== "All") {
    list = list.filter((s) => s.status === filters.status);
  }

  return list;
}

export async function getServiceById(id) {
  if (!USE_MOCK_API) {
    return httpClient(`services/${id}`);
  }

  await simulateDelay(150);
  const found = mockServicesStore.find((s) => String(s.id) === String(id));
  if (!found) throw new Error("Service not found");
  return found;
}

export async function createService(data) {
  if (!USE_MOCK_API) {
    return httpClient("services", { method: "POST", body: data });
  }

  await simulateDelay(250);
  const newService = {
    ...data,
    id: `srv-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  mockServicesStore = [newService, ...mockServicesStore];
  saveStoredServices(mockServicesStore);
  return newService;
}

export async function updateService(id, data) {
  if (!USE_MOCK_API) {
    return httpClient(`services/${id}`, { method: "PUT", body: data });
  }

  await simulateDelay(250);
  const idx = mockServicesStore.findIndex((s) => String(s.id) === String(id));
  if (idx === -1) throw new Error("Service not found");

  const updated = {
    ...mockServicesStore[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockServicesStore = [
    ...mockServicesStore.slice(0, idx),
    updated,
    ...mockServicesStore.slice(idx + 1),
  ];
  saveStoredServices(mockServicesStore);
  return updated;
}

export async function deleteService(id) {
  if (!USE_MOCK_API) {
    return httpClient(`services/${id}`, { method: "DELETE" });
  }

  await simulateDelay(200);
  mockServicesStore = mockServicesStore.filter((s) => String(s.id) !== String(id));
  saveStoredServices(mockServicesStore);
  return { success: true };
}

/**
 * Uploads a requisition PDF (multipart/form-data)
 * In real API mode: sends to POST /api/uploads/requisition
 * Returns { url, name, size }
 */
export async function uploadRequisitionPdf(file) {
  if (!USE_MOCK_API) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/uploads/requisition", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload requisition PDF");
    return response.json();
  }

  await simulateDelay(350);
  return {
    url: `/forms/${file.name.replace(/\s+/g, "-").toLowerCase()}`,
    name: file.name,
    size: file.size,
  };
}

