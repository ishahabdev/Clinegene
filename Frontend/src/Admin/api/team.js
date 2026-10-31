import { USE_MOCK_API, simulateDelay, httpClient } from "./client.js";
import { initialMockTeamMembers } from "../mocks/mockTeam.js";

const STORAGE_KEY = "clingene_admin_team_mock_data";

function loadStoredTeam() {
  if (typeof window === "undefined") return initialMockTeamMembers;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockTeamMembers));
      return initialMockTeamMembers;
    }
    return JSON.parse(raw);
  } catch {
    return initialMockTeamMembers;
  }
}

function saveStoredTeam(list) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Could not save team mock data to localStorage", e);
    }
  }
}

let mockTeamStore = loadStoredTeam();

export async function getTeamMembers(filters = {}) {
  if (!USE_MOCK_API) {
    const params = new URLSearchParams(filters).toString();
    return httpClient(`admin/team${params ? `?${params}` : ""}`);
  }

  await simulateDelay(220);
  let list = [...mockTeamStore];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.qualification.toLowerCase().includes(q)
    );
  }

  if (filters.department && filters.department !== "All") {
    list = list.filter((m) => m.department === filters.department);
  }

  if (filters.status && filters.status !== "All") {
    list = list.filter((m) => m.status === filters.status);
  }

  list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
  return list;
}

export async function getTeamMemberById(id) {
  if (!USE_MOCK_API) {
    return httpClient(`admin/team/${id}`);
  }

  await simulateDelay(150);
  const found = mockTeamStore.find((m) => m.id === id);
  if (!found) throw new Error("Team member not found");
  return found;
}

export async function createTeamMember(data) {
  if (!USE_MOCK_API) {
    return httpClient("admin/team", { method: "POST", body: data });
  }

  await simulateDelay(250);
  const nextOrder = data.displayOrder ?? (mockTeamStore.length + 1);
  const newMember = {
    ...data,
    id: `tm-${Date.now().toString(36)}`,
    displayOrder: nextOrder,
    createdAt: new Date().toISOString(),
  };

  mockTeamStore = [...mockTeamStore, newMember];
  saveStoredTeam(mockTeamStore);
  return newMember;
}

export async function updateTeamMember(id, data) {
  if (!USE_MOCK_API) {
    return httpClient(`admin/team/${id}`, { method: "PUT", body: data });
  }

  await simulateDelay(250);
  const idx = mockTeamStore.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Team member not found");

  const updated = {
    ...mockTeamStore[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockTeamStore[idx] = updated;
  mockTeamStore = [...mockTeamStore];
  saveStoredTeam(mockTeamStore);
  return updated;
}

export async function deleteTeamMember(id) {
  if (!USE_MOCK_API) {
    return httpClient(`admin/team/${id}`, { method: "DELETE" });
  }

  await simulateDelay(200);
  mockTeamStore = mockTeamStore.filter((m) => m.id !== id);
  // Re-normalize orders
  mockTeamStore.forEach((m, i) => {
    m.displayOrder = i + 1;
  });
  saveStoredTeam(mockTeamStore);
  return { success: true, id };
}

export async function reorderTeamMembers(reorderedList) {
  if (!USE_MOCK_API) {
    return httpClient("admin/team/reorder", {
      method: "PATCH",
      body: { orderedIds: reorderedList.map((m) => m.id) },
    });
  }

  await simulateDelay(180);
  const updated = reorderedList.map((member, index) => ({
    ...member,
    displayOrder: index + 1,
  }));
  mockTeamStore = updated;
  saveStoredTeam(mockTeamStore);
  return updated;
}

