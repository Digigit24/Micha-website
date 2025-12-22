// File: src/components/common/ConfirmButton.jsx

export default function ConfirmButton({
  children,
  confirmText = "Are you sure?",
  onConfirm,
  disabled,
  style,
  title,
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        const ok = window.confirm(confirmText);
        if (ok) onConfirm?.();
      }}
      style={{
        padding: "7px 10px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
