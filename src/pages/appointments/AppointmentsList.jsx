// File: src/pages/appointments/AppointmentsList.jsx

import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import ConfirmButton from "../../components/common/ConfirmButton";

import { useAppointments } from "../../hooks/appointments/useAppointments";
import { useCancelAppointment } from "../../hooks/appointments/useCancelAppointment";
import { useAppointmentActions } from "../../hooks/appointments/useAppointmentActions";
import { useAppointmentStats } from "../../hooks/appointments/useAppointmentStats";
import { useTodayAppointments } from "../../hooks/appointments/useTodayAppointments";
import { useUpcomingAppointments } from "../../hooks/appointments/useUpcomingAppointments";

import { safeText, formatDate } from "../../utils/formatters";

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

export default function AppointmentsList() {
  const navigate = useNavigate();

  const appointmentsQuery = useAppointments();
  const statsQuery = useAppointmentStats();
  const todayQuery = useTodayAppointments();
  const upcomingQuery = useUpcomingAppointments();

  const cancelMutation = useCancelAppointment();
  const actions = useAppointmentActions();

  const items = Array.isArray(appointmentsQuery.data)
    ? appointmentsQuery.data
    : appointmentsQuery.data?.results || [];

  const stats = statsQuery.data || null;

  const isBusy =
    cancelMutation.isPending ||
    actions.checkIn.isPending ||
    actions.start.isPending ||
    actions.complete.isPending;

  if (appointmentsQuery.isLoading) return <div className="page"><Loading label="Loading appointments..." /></div>;

  if (appointmentsQuery.isError) {
    return (
      <div className="page">
        <ErrorState
          title="Failed to load appointments"
          error={appointmentsQuery.error}
          onRetry={() => appointmentsQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl">Appointments</h2>
          <div className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Clean UI. Real actions. No drama.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/appointments/new" className="button-primary">Create</Link>
          <button className="button-ghost" onClick={() => navigate("/login")}>Login</button>
          <button className="button-ghost" onClick={toggleTheme}>Toggle theme</button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Statistics</div>
            <span className="chip">cached</span>
          </div>
          {statsQuery.isLoading ? (
            <div className="mt-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>Loading...</div>
          ) : statsQuery.isError ? (
            <div className="mt-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>Failed to load</div>
          ) : (
            <pre className="mt-3 text-xs whitespace-pre-wrap">{safeText(stats)}</pre>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Today</div>
            <span className="chip">quick view</span>
          </div>
          <div className="mt-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Count:{" "}
            {Array.isArray(todayQuery.data)
              ? todayQuery.data.length
              : todayQuery.data?.results?.length || 0}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Upcoming</div>
            <span className="chip">quick view</span>
          </div>
          <div className="mt-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Count:{" "}
            {Array.isArray(upcomingQuery.data)
              ? upcomingQuery.data.length
              : upcomingQuery.data?.results?.length || 0}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-semibold">All appointments</div>
          <button className="button-ghost" onClick={() => appointmentsQuery.refetch()}>
            Refresh
          </button>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
                <th className="w-[560px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    No appointments found.
                  </td>
                </tr>
              ) : (
                items.map((a) => {
                  const id = a?.id ?? a?._id ?? "";
                  return (
                    <tr key={String(id)}>
                      <td>{safeText(id)}</td>
                      <td>{safeText(a?.patient_name || a?.patient || a?.name)}</td>
                      <td>{formatDate(a?.date || a?.scheduled_at || a?.created_at)}</td>
                      <td>{safeText(a?.status)}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <Link className="button-ghost" to={`/appointments/${id}`}>View</Link>

                          <ConfirmButton
                            disabled={isBusy || !id}
                            confirmText="Cancel this appointment?"
                            onConfirm={() => cancelMutation.mutate(id)}
                          >
                            Cancel
                          </ConfirmButton>

                          <ConfirmButton
                            disabled={isBusy || !id}
                            confirmText="Check-in this appointment?"
                            onConfirm={() => actions.checkIn.mutate(id)}
                          >
                            Check-in
                          </ConfirmButton>

                          <ConfirmButton
                            disabled={isBusy || !id}
                            confirmText="Start consultation?"
                            onConfirm={() => actions.start.mutate(id)}
                          >
                            Start
                          </ConfirmButton>

                          <ConfirmButton
                            disabled={isBusy || !id}
                            confirmText="Complete consultation?"
                            onConfirm={() => actions.complete.mutate(id)}
                          >
                            Complete
                          </ConfirmButton>
                        </div>

                        {(cancelMutation.isError ||
                          actions.checkIn.isError ||
                          actions.start.isError ||
                          actions.complete.isError) ? (
                          <div className="mt-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            An action failed. Check console logs.
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
