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
import { useEffect, useState } from "react";

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

  if (detailsQuery.isError) {
    return (
      <div className="page">
        <ErrorState
          title="Failed to load appointment"
          error={detailsQuery.error}
          onRetry={() => detailsQuery.refetch()}
        />
      </div>
    );
  }

  const a = detailsQuery.data || {};
  const apptId = a?.id ?? a?._id ?? id;

  const onSavePut = async () => {
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
    const payload = { notes: edit.notes };
    try {
      await updateMutation.mutateAsync({ id: apptId, payload, mode: "patch" });
      alert("Saved (PATCH).");
    } catch {}
  };

  return (
    <div className="page">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl">Appointment details</h2>
        <Link to="/appointments" className="button-ghost">Back</Link>
      </div>

      <div className="card mt-4">
        <div className="grid gap-2 md:grid-cols-2">
          <div><span className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>ID</span><div className="mt-1 font-semibold">{safeText(apptId)}</div></div>
          <div><span className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Patient</span><div className="mt-1 font-semibold">{safeText(a?.patient_name || a?.patient || a?.name)}</div></div>
          <div><span className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Date</span><div className="mt-1">{formatDate(a?.date || a?.scheduled_at || a?.created_at)}</div></div>
          <div><span className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Status</span><div className="mt-1">{safeText(a?.status)}</div></div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
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

          <button className="button-ghost" onClick={() => detailsQuery.refetch()} disabled={isBusy}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card mt-4 max-w-3xl">
        <div className="font-semibold">Quick edit</div>

        <div className="mt-3 grid gap-3">
          <div>
            <label className="text-sm font-semibold">Patient name</label>
            <input className="input mt-2" value={edit.patient_name} onChange={(e) => setEdit((p) => ({ ...p, patient_name: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-semibold">Status</label>
            <input className="input mt-2" value={edit.status} onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value }))} placeholder="scheduled / in_progress / completed" />
          </div>

          <div>
            <label className="text-sm font-semibold">Notes</label>
            <textarea className="textarea mt-2" value={edit.notes} onChange={(e) => setEdit((p) => ({ ...p, notes: e.target.value }))} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="button-primary" onClick={onSavePut} disabled={isBusy}>
              {updateMutation.isPending ? "Saving..." : "Save (PUT)"}
            </button>

            <button className="button-ghost" onClick={onSavePatch} disabled={isBusy}>
              {updateMutation.isPending ? "Saving..." : "Save notes (PATCH)"}
            </button>
          </div>

          {updateMutation.isError ? <ErrorState title="Update failed" error={updateMutation.error} /> : null}
        </div>
      </div>

      <div className="card mt-4">
        <div className="font-semibold">Raw JSON</div>
        <pre className="mt-3 text-xs whitespace-pre-wrap">{safeText(a)}</pre>
      </div>
    </div>
  );
}
