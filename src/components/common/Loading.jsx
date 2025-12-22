// File: src/components/common/Loading.jsx

export default function Loading({ label = "Loading..." }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div
          className="h-4 w-4 rounded-full"
          style={{ background: "var(--color-accent-primary)", boxShadow: "var(--shadow-sm)" }}
        />
        <div className="font-semibold">{label}</div>
      </div>
      <div className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Please wait a moment.
      </div>
    </div>
  );
}
