// File: src/services/appointments/appointments.service.js

// import axiosClient from "../../api/axiosClient";
// import { endpoints } from "../../api/endpoints";
import { dummyAppointments, dummyStats, dummyToday, dummyUpcoming } from "./dummyData";

/**
 * Services:
 * - Only network calls
 * - Return response.data
 * - No UI logic, no react-query here
 */

const simulateNetwork = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 600); // Simulate network latency
    });
};

export const appointmentsService = {
    // Lists
    list: async (params = {}) => {
        // const res = await axiosClient.get(endpoints.appointments(), { params });
        // return res.data;
        return simulateNetwork({ results: dummyAppointments });
    },

    today: async () => {
        // const res = await axiosClient.get(endpoints.appointmentsToday());
        // return res.data;
        return simulateNetwork(dummyToday);
    },

    upcoming: async () => {
        // const res = await axiosClient.get(endpoints.appointmentsUpcoming());
        // return res.data;
        return simulateNetwork(dummyUpcoming);
    },

    statistics: async () => {
        // const res = await axiosClient.get(endpoints.appointmentStatistics());
        // return res.data;
        return simulateNetwork(dummyStats);
    },

    // Details
    details: async (id) => {
        // const res = await axiosClient.get(endpoints.appointmentById(id));
        // return res.data;
        const found = dummyAppointments.find((a) => a.id === id || a._id === id);
        // Return found item, or if not found, return the first one as a fallback for demo purposes, 
        // or just return null to show empty state/error if that's preferred. 
        // For "dummy data" allowing it to work with '1' is good.
        return simulateNetwork(found || dummyAppointments[0]);
    },

    // Create
    create: async (payload) => {
        // const res = await axiosClient.post(endpoints.appointments(), payload);
        // return res.data;
        const newId = String(dummyAppointments.length + 1);
        const newItem = { ...payload, id: newId, date: new Date().toISOString(), status: "scheduled" };
        dummyAppointments.push(newItem); // Simple in-memory mutation for the session
        return simulateNetwork(newItem);
    },

    // Update
    update: async ({ id, payload }) => {
        // const res = await axiosClient.put(endpoints.appointmentById(id), payload);
        // return res.data;
        const item = dummyAppointments.find((a) => a.id === id);
        if (item) {
            Object.assign(item, payload);
        }
        return simulateNetwork(item || payload);
    },

    partialUpdate: async ({ id, payload }) => {
        // const res = await axiosClient.patch(endpoints.appointmentById(id), payload);
        // return res.data;
        const item = dummyAppointments.find((a) => a.id === id);
        if (item) {
            Object.assign(item, payload);
        }
        return simulateNetwork(item || payload);
    },

    // Cancel
    cancel: async (id) => {
        // const res = await axiosClient.delete(endpoints.appointmentById(id));
        // return res.data;
        const item = dummyAppointments.find((a) => a.id === id);
        if (item) {
            item.status = "cancelled";
        }
        return simulateNetwork({ success: true, id });
    },

    // Actions
    checkIn: async (id) => {
        // const res = await axiosClient.post(endpoints.appointmentCheckIn(id));
        // return res.data;
        const item = dummyAppointments.find((a) => a.id === id);
        if (item) {
            item.status = "checked_in";
        }
        return simulateNetwork({ success: true, status: "checked_in" });
    },

    start: async (id) => {
        // const res = await axiosClient.post(endpoints.appointmentStart(id));
        // return res.data;
        const item = dummyAppointments.find((a) => a.id === id);
        if (item) {
            item.status = "in_progress";
        }
        return simulateNetwork({ success: true, status: "in_progress" });
    },

    complete: async (id) => {
        // const res = await axiosClient.post(endpoints.appointmentComplete(id));
        // return res.data;
        const item = dummyAppointments.find((a) => a.id === id);
        if (item) {
            item.status = "completed";
        }
        return simulateNetwork({ success: true, status: "completed" });
    },
};
