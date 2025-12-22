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

    const payload = {
      patient_name: form.patient_name,
      date: form.date,
      time: form.time,
      notes: form.notes,
    };

    try {
      const created = await createMutation.mutateAsync(payload);
      const id = created?.id ?? created?._id;
      if (id) navigate(`/appointments/${id}`);
      else navigate("/appointments");
    } catch {}
  };

  return (
    <div className="page">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl">Create appointment</h2>
        <Link to="/appointments" className="button-ghost">Back</Link>
      </div>

      <form onSubmit={onSubmit} className="card mt-4 max-w-xl">
        <label className="text-sm font-semibold">Patient name</label>
        <input className="input mt-2" value={form.patient_name} onChange={onChange("patient_name")} placeholder="John Doe" />

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Date</label>
            <input className="input mt-2" value={form.date} onChange={onChange("date")} type="date" />
          </div>

          <div>
            <label className="text-sm font-semibold">Time</label>
            <input className="input mt-2" value={form.time} onChange={onChange("time")} type="time" />
          </div>
        </div>

        <label className="mt-4 block text-sm font-semibold">Notes</label>
        <textarea className="textarea mt-2" value={form.notes} onChange={onChange("notes")} placeholder="Optional notes..." />

        <div className="mt-4 flex gap-2">
          <button className="button-primary" type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create"}
          </button>
          <Link to="/appointments" className="button-ghost">Cancel</Link>
        </div>

        {createMutation.isPending ? (
          <div className="mt-3"><Loading label="Creating appointment..." /></div>
        ) : null}

        {createMutation.isError ? (
          <div className="mt-3"><ErrorState title="Create failed" error={createMutation.error} /></div>
        ) : null}
      </form>
    </div>
  );
}
