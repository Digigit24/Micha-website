// File: src/hooks/appointments/useUpdateAppointment.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useUpdateAppointment() {
  const qc = useQueryClient();

  return useMutation({
    // expects: { id, payload, mode?: "put" | "patch" }
    mutationFn: ({ id, payload, mode = "put" }) => {
      if (mode === "patch") return appointmentsService.partialUpdate({ id, payload });
      return appointmentsService.update({ id, payload });
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointmentDetails(variables.id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.todayAppointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.upcomingAppointments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.appointmentStats });
      console.log("[Appointments] Updated successfully");
    },
    onError: (err) => {
      console.error("[Appointments] Update failed:", err?.response?.data || err);
    },
  });
}
