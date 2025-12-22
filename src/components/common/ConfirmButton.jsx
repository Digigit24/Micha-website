// File: src/components/common/ConfirmButton.jsx

export default function ConfirmButton({
  children,
  confirmText = "Are you sure?",
  onConfirm,
  disabled,
  variant = "ghost", // "ghost" | "primary"
  title,
}) {
  const cls = variant === "primary" ? "button-primary" : "button-ghost";

  return (
    <button
      title={title}
      disabled={disabled}
      className={`${cls} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => {
        if (disabled) return;
        const ok = window.confirm(confirmText);
        if (ok) onConfirm?.();
      }}
    >
      {children}
    </button>
  );
}
