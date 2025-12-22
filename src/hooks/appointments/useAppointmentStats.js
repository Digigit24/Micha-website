// File: src/hooks/appointments/useAppointmentStats.js

import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useAppointmentStats() {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentStats,
    queryFn: () => appointmentsService.statistics(),
    staleTime: 60 * 1000,
  });
}
