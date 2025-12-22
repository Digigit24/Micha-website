// File: src/api/endpoints.js

/**
 * Endpoints builder
 * - Functions to build URLs
 * - Keeps services clean and consistent
 */

export const endpoints = {
  appointments: () => `/api/appointments/`,
  appointmentById: (id) => `/api/appointments/${id}/`,

  appointmentCheckIn: (id) => `/api/appointments/${id}/check_in/`,
  appointmentStart: (id) => `/api/appointments/${id}/start/`,
  appointmentComplete: (id) => `/api/appointments/${id}/complete/`,

  appointmentStatistics: () => `/api/appointments/statistics/`,
  appointmentsToday: () => `/api/appointments/today/`,
  appointmentsUpcoming: () => `/api/appointments/upcoming/`,
};
