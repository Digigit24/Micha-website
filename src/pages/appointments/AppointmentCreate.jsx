// File: src/pages/appointments/AppointmentCreate.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import { useCreateAppointment } from "../../hooks/appointments/useCreateAppointment";

export default function AppointmentCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateAppointment();

  const [form, setForm] = useState({
    patient_name: "",
    date: "",
    time: "",
    notes: "",
  });

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    // You can map this to your backend fields as needed.
    const payload = {
      patient_name: form.patient_name,
      date: form.date,
      time: form.time,
      notes: form.notes,
    };

    try {
      const created = await createMutation.mutateAsync(payload);
      const id = created?.id ?? created?._id;

      // If API returns id, jump to details; otherwise go list
      if (id) navigate(`/appointments/${id}`);
      else navigate("/appointments");
    } catch {
      // errors already logged in hook
    }
  };

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Create appointment</h2>
        <Link to="/appointments"><button>Back</button></Link>
      </div>

      <form onSubmit={onSubmit} className="card" style={{ marginTop: 12, maxWidth: 520 }}>
        <label className="label">Patient name</label>
        <input value={form.patient_name} onChange={onChange("patient_name")} placeholder="John Doe" />

        <label className="label">Date</label>
        <input value={form.date} onChange={onChange("date")} type="date" />

        <label className="label">Time</label>
        <input value={form.time} onChange={onChange("time")} type="time" />

        <label className="label">Notes</label>
        <textarea value={form.notes} onChange={onChange("notes")} placeholder="Optional notes..." />

        <div className="row" style={{ marginTop: 12 }}>
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>

        {createMutation.isPending ? (
          <div style={{ marginTop: 10 }}><Loading label="Creating appointment..." /></div>
        ) : null}

        {createMutation.isError ? (
          <div style={{ marginTop: 10 }}>
            <ErrorState title="Create failed" error={createMutation.error} />
          </div>
        ) : null}
      </form>
    </div>
  );
}
