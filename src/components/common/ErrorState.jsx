// File: src/components/common/ErrorState.jsx

export default function ErrorState({ title = "Something went wrong", error, onRetry }) {
  const message =
    error?.response?.data?.detail ||
    error?.message ||
    "An unexpected error occurred.";

  return (
    <div style={{ padding: 12, border: "1px solid #f3c", borderRadius: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.85 }}>{String(message)}</div>

      {onRetry ? (
        <button
          onClick={onRetry}
          style={{ marginTop: 10, padding: "8px 10px", cursor: "pointer" }}
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
