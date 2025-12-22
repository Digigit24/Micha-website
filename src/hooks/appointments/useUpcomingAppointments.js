// File: src/hooks/appointments/useUpcomingAppointments.js

import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useUpcomingAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.upcomingAppointments,
    queryFn: () => appointmentsService.upcoming(),
    staleTime: 30 * 1000,
  });
}
