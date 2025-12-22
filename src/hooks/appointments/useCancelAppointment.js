// File: src/hooks/appointments/useCancelAppointment.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useCancelAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => appointmentsService.cancel(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointmentDetails(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.todayAppointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.upcomingAppointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointmentStats });
      console.log("[Appointments] Cancelled successfully");
    },
    onError: (err) => {
      console.error("[Appointments] Cancel failed:", err?.response?.data || err);
    },
  });
}
