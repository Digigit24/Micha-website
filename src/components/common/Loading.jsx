// File: src/components/common/Loading.jsx

export default function Loading({ label = "Loading..." }) {
  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
      <strong>{label}</strong>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
        Please wait a moment.
      </div>
    </div>
  );
}
