// File: src/hooks/appointments/useTodayAppointments.js

import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useTodayAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.todayAppointments,
    queryFn: () => appointmentsService.today(),
    staleTime: 30 * 1000,
  });
}
