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

export default function AppointmentsList() {
  const navigate = useNavigate();

  const appointmentsQuery = useAppointments();
  const statsQuery = useAppointmentStats();
  const todayQuery = useTodayAppointments();
  const upcomingQuery = useUpcomingAppointments();

  const cancelMutation = useCancelAppointment();
  const actions = useAppointmentActions();

  const items = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data : (appointmentsQuery.data?.results || []);
  const stats = statsQuery.data || null;

  const isBusy =
    cancelMutation.isPending ||
    actions.checkIn.isPending ||
    actions.start.isPending ||
    actions.complete.isPending;

  if (appointmentsQuery.isLoading) return <div className="page"><Loading label="Loading appointments..." /></div>;
  if (appointmentsQuery.isError)
    return (
      <div className="page">
        <ErrorState
          title="Failed to load appointments"
          error={appointmentsQuery.error}
          onRetry={() => appointmentsQuery.refetch()}
        />
      </div>
    );

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Appointments</h2>
        <div className="row">
          <Link to="/appointments/new">
            <button>Create</button>
          </Link>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <div style={{ fontWeight: 700 }}>Statistics</div>
          {statsQuery.isLoading ? (
            <div style={{ marginTop: 8, opacity: 0.8 }}>Loading...</div>
          ) : statsQuery.isError ? (
            <div style={{ marginTop: 8, opacity: 0.8 }}>Failed to load</div>
          ) : (
            <pre style={{ marginTop: 8 }}>{safeText(stats)}</pre>
          )}
        </div>

        <div className="card">
          <div style={{ fontWeight: 700 }}>Today</div>
          {todayQuery.isLoading ? (
            <div style={{ marginTop: 8, opacity: 0.8 }}>Loading...</div>
          ) : todayQuery.isError ? (
            <div style={{ marginTop: 8, opacity: 0.8 }}>Failed to load</div>
          ) : (
            <div style={{ marginTop: 8, opacity: 0.85 }}>
              Count: {Array.isArray(todayQuery.data) ? todayQuery.data.length : (todayQuery.data?.results?.length || 0)}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontWeight: 700 }}>Upcoming</div>
          {upcomingQuery.isLoading ? (
            <div style={{ marginTop: 8, opacity: 0.8 }}>Loading...</div>
          ) : upcomingQuery.isError ? (
            <div style={{ marginTop: 8, opacity: 0.8 }}>Failed to load</div>
          ) : (
            <div style={{ marginTop: 8, opacity: 0.85 }}>
              Count: {Array.isArray(upcomingQuery.data) ? upcomingQuery.data.length : (upcomingQuery.data?.results?.length || 0)}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700 }}>All appointments</div>
          <button onClick={() => appointmentsQuery.refetch()}>Refresh</button>
        </div>

        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ width: 520 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ opacity: 0.7 }}>
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
                        <div className="row" style={{ flexWrap: "wrap" }}>
                          <Link to={`/appointments/${id}`}>
                            <button>View</button>
                          </Link>

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

                        {(cancelMutation.isError || actions.checkIn.isError || actions.start.isError || actions.complete.isError) ? (
                          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                            One of the actions failed. Check console for details.
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

        {cancelMutation.isPending ? <div style={{ marginTop: 10 }}>Cancelling...</div> : null}
      </div>
    </div>
  );
}
