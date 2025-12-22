// File: src/hooks/appointments/useAppointmentDetails.js

import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointments/appointments.service";
import { QUERY_KEYS } from "../../api/apiConfig";

export function useAppointmentDetails(id) {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentDetails(id),
    queryFn: () => appointmentsService.details(id),
    enabled: !!id,
    staleTime: 15 * 1000,
  });
}
