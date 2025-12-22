// File: src/services/appointments/appointments.service.js

import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../api/endpoints";

/**
 * Services:
 * - Only network calls
 * - Return response.data
 * - No UI logic, no react-query here
 */

export const appointmentsService = {
  // Lists
  list: async (params = {}) => {
    const res = await axiosClient.get(endpoints.appointments(), { params });
    return res.data;
  },

  today: async () => {
    const res = await axiosClient.get(endpoints.appointmentsToday());
    return res.data;
  },

  upcoming: async () => {
    const res = await axiosClient.get(endpoints.appointmentsUpcoming());
    return res.data;
  },

  statistics: async () => {
    const res = await axiosClient.get(endpoints.appointmentStatistics());
    return res.data;
  },

  // Details
  details: async (id) => {
    const res = await axiosClient.get(endpoints.appointmentById(id));
    return res.data;
  },

  // Create
  create: async (payload) => {
    const res = await axiosClient.post(endpoints.appointments(), payload);
    return res.data;
  },

  // Update
  update: async ({ id, payload }) => {
    const res = await axiosClient.put(endpoints.appointmentById(id), payload);
    return res.data;
  },

  partialUpdate: async ({ id, payload }) => {
    const res = await axiosClient.patch(endpoints.appointmentById(id), payload);
    return res.data;
  },

  // Cancel
  cancel: async (id) => {
    const res = await axiosClient.delete(endpoints.appointmentById(id));
    return res.data;
  },

  // Actions
  checkIn: async (id) => {
    const res = await axiosClient.post(endpoints.appointmentCheckIn(id));
    return res.data;
  },

  start: async (id) => {
    const res = await axiosClient.post(endpoints.appointmentStart(id));
    return res.data;
  },

  complete: async (id) => {
    const res = await axiosClient.post(endpoints.appointmentComplete(id));
    return res.data;
  },
};
