// File: src/hooks/appointments/useAppointmentActions.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useAppointmentActions() {
  const qc = useQueryClient();

  const invalidate = (id) => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.appointments });
    qc.invalidateQueries({ queryKey: QUERY_KEYS.appointmentDetails(id) });
    qc.invalidateQueries({ queryKey: QUERY_KEYS.todayAppointments });
    qc.invalidateQueries({ queryKey: QUERY_KEYS.upcomingAppointments });
    qc.invalidateQueries({ queryKey: QUERY_KEYS.appointmentStats });
  };

  const checkIn = useMutation({
    mutationFn: (id) => appointmentsService.checkIn(id),
    onSuccess: (_data, id) => {
      invalidate(id);
      console.log("[Appointments] Checked-in");
    },
    onError: (err) => console.error("[Appointments] Check-in failed:", err?.response?.data || err),
  });

  const start = useMutation({
    mutationFn: (id) => appointmentsService.start(id),
    onSuccess: (_data, id) => {
      invalidate(id);
      console.log("[Appointments] Started");
    },
    onError: (err) => console.error("[Appointments] Start failed:", err?.response?.data || err),
  });

  const complete = useMutation({
    mutationFn: (id) => appointmentsService.complete(id),
    onSuccess: (_data, id) => {
      invalidate(id);
      console.log("[Appointments] Completed");
    },
    onError: (err) => console.error("[Appointments] Complete failed:", err?.response?.data || err),
  });

  return { checkIn, start, complete };
}
