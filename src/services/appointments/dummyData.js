export const dummyAppointments = [
    {
        id: "1",
        patient_name: "John Doe",
        date: new Date().toISOString(),
        status: "scheduled",
        notes: "Regular checkup",
        type: "Routine",
    },
    {
        id: "2",
        patient_name: "Jane Smith",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: "confirmed",
        notes: "Follow-up",
        type: "Follow-up",
    },
    {
        id: "3",
        patient_name: "Alice Johnson",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: "completed",
        notes: "Consultation",
        type: "Emergency",
    },
    {
        id: "4",
        patient_name: "Bob Brown",
        date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
        status: "scheduled",
        notes: "Dental cleaning",
        type: "Dental",
    },
    {
        id: "5",
        patient_name: "Charlie Davis",
        date: new Date().toISOString(),
        status: "in_progress",
        notes: "Therapy session",
        type: "Therapy",
    },
];

export const dummyStats = {
    total_appointments: 150,
    completed: 120,
    scheduled: 25,
    cancelled: 5,
    revenue: 5000,
};

export const dummyToday = dummyAppointments.filter((a) => {
    const d = new Date(a.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
});

export const dummyUpcoming = dummyAppointments.filter((a) => {
    const d = new Date(a.date);
    const today = new Date();
    return d > today;
});
