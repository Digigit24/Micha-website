// File: src/pages/appointments/AppointmentDetails.jsx

import { Link, useParams } from "react-router-dom";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import ConfirmButton from "../../components/common/ConfirmButton";

import { useAppointmentDetails } from "../../hooks/appointments/useAppointmentDetails";
import { useUpdateAppointment } from "../../hooks/appointments/useUpdateAppointment";
import { useCancelAppointment } from "../../hooks/appointments/useCancelAppointment";
import { useAppointmentActions } from "../../hooks/appointments/useAppointmentActions";

import { safeText, formatDate } from "../../utils/formatters";
import { useState, useEffect } from "react";

export default function AppointmentDetails() {
  const { id } = useParams();

  const detailsQuery = useAppointmentDetails(id);
  const updateMutation = useUpdateAppointment();
  const cancelMutation = useCancelAppointment();
  const actions = useAppointmentActions();

  const [edit, setEdit] = useState({ patient_name: "", notes: "", status: "" });

  useEffect(() => {
    const a = detailsQuery.data;
    if (!a) return;

    setEdit({
      patient_name: a?.patient_name || a?.patient || a?.name || "",
      notes: a?.notes || "",
      status: a?.status || "",
    });
  }, [detailsQuery.data]);

  const isBusy =
    updateMutation.isPending ||
    cancelMutation.isPending ||
    actions.checkIn.isPending ||
    actions.start.isPending ||
    actions.complete.isPending;

  if (detailsQuery.isLoading) return <div className="page"><Loading label="Loading appointment..." /></div>;
  if (detailsQuery.isError)
    return (
      <div className="page">
        <ErrorState
          title="Failed to load appointment"
          error={detailsQuery.error}
          onRetry={() => detailsQuery.refetch()}
        />
      </div>
    );

  const a = detailsQuery.data || {};
  const apptId = a?.id ?? a?._id ?? id;

  const onSavePut = async () => {
    // PUT typically expects full payload. Adjust fields to your backend.
    const payload = {
      patient_name: edit.patient_name,
      notes: edit.notes,
      status: edit.status,
    };

    try {
      await updateMutation.mutateAsync({ id: apptId, payload, mode: "put" });
      alert("Saved (PUT).");
    } catch {}
  };

  const onSavePatch = async () => {
    // PATCH can send partial updates
    const payload = {
      notes: edit.notes,
    };

    try {
      await updateMutation.mutateAsync({ id: apptId, payload, mode: "patch" });
      alert("Saved (PATCH).");
    } catch {}
  };

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Appointment details</h2>
        <Link to="/appointments"><button>Back</button></Link>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div><strong>ID:</strong> {safeText(apptId)}</div>
          <div><strong>Patient:</strong> {safeText(a?.patient_name || a?.patient || a?.name)}</div>
          <div><strong>Date:</strong> {formatDate(a?.date || a?.scheduled_at || a?.created_at)}</div>
          <div><strong>Status:</strong> {safeText(a?.status)}</div>
        </div>

        <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
          <ConfirmButton disabled={isBusy} confirmText="Cancel this appointment?" onConfirm={() => cancelMutation.mutate(apptId)}>
            Cancel
          </ConfirmButton>

          <ConfirmButton disabled={isBusy} confirmText="Check-in this appointment?" onConfirm={() => actions.checkIn.mutate(apptId)}>
            Check-in
          </ConfirmButton>

          <ConfirmButton disabled={isBusy} confirmText="Start consultation?" onConfirm={() => actions.start.mutate(apptId)}>
            Start
          </ConfirmButton>

          <ConfirmButton disabled={isBusy} confirmText="Complete consultation?" onConfirm={() => actions.complete.mutate(apptId)}>
            Complete
          </ConfirmButton>

          <button onClick={() => detailsQuery.refetch()} disabled={isBusy}>
            Refresh
          </button>
        </div>

        {(cancelMutation.isError || actions.checkIn.isError || actions.start.isError || actions.complete.isError) ? (
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
            An action failed. Check console for details.
          </div>
        ) : null}
      </div>

      <div className="card" style={{ marginTop: 12, maxWidth: 680 }}>
        <div style={{ fontWeight: 700 }}>Quick edit</div>
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          <div>
            <label className="label">Patient name</label>
            <input
              value={edit.patient_name}
              onChange={(e) => setEdit((p) => ({ ...p, patient_name: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Status</label>
            <input
              value={edit.status}
              onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value }))}
              placeholder="e.g. scheduled / in_progress / completed"
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={edit.notes}
              onChange={(e) => setEdit((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div className="row" style={{ flexWrap: "wrap" }}>
            <button onClick={onSavePut} disabled={isBusy}>
              {updateMutation.isPending ? "Saving..." : "Save (PUT)"}
            </button>

            <button onClick={onSavePatch} disabled={isBusy}>
              {updateMutation.isPending ? "Saving..." : "Save notes (PATCH)"}
            </button>
          </div>

          {updateMutation.isError ? (
            <ErrorState title="Update failed" error={updateMutation.error} />
          ) : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 700 }}>Raw JSON</div>
        <pre style={{ marginTop: 8 }}>{safeText(a)}</pre>
      </div>
    </div>
  );
}
