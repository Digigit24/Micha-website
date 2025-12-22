// File: src/hooks/appointments/useAppointments.js

import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments,
    queryFn: () => appointmentsService.list(),
    staleTime: 30 * 1000,
  });
}
