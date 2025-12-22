// File: src/hooks/appointments/useCreateAppointment.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useCreateAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => appointmentsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.todayAppointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.upcomingAppointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointmentStats });
      console.log("[Appointments] Created successfully");
    },
    onError: (err) => {
      console.error("[Appointments] Create failed:", err?.response?.data || err);
    },
  });
}
