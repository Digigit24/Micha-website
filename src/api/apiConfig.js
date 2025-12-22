// File: src/api/apiConfig.js

import { getToken, clearToken } from "../utils/storage";

/**
 * Centralized API configuration + helpers
 * - baseURL from Vite env
 * - auth token support
 * - consistent query keys
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const TOKEN_STORAGE_KEY = "access_token";

export function getAuthHeader() {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function handleUnauthorized() {
  // Single place to decide how you "logout"
  clearToken();

  // Hard redirect keeps it simple and works even outside React hooks
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

/**
 * React Query keys live here to keep consistency across hooks.
 */
export const QUERY_KEYS = {
  appointments: ["appointments"],
  appointmentDetails: (id) => ["appointments", "details", String(id)],
  appointmentStats: ["appointments", "statistics"],
  todayAppointments: ["appointments", "today"],
  upcomingAppointments: ["appointments", "upcoming"],
};
