// File: src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, clearToken, getToken } from "../utils/storage";

export default function Login() {
  const navigate = useNavigate();
  const [token, setTokenInput] = useState(getToken() || "");

  const onSave = (e) => {
    e.preventDefault();
    const t = token.trim();

    if (!t) {
      clearToken();
      alert("Token cleared. You'll be treated as logged out.");
      return;
    }

    setToken(t);
    alert("Token saved.");
    navigate("/appointments");
  };

  return (
    <div className="page">
      <h2>Login</h2>
      <p style={{ marginTop: 6, opacity: 0.8 }}>
        Paste your access token. If your backend supports unauthenticated access, you can leave it empty.
      </p>

      <form onSubmit={onSave} className="card" style={{ marginTop: 12 }}>
        <label style={{ display: "block", fontWeight: 600 }}>Access Token</label>
        <input
          value={token}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="access_token"
          style={{ width: "100%", marginTop: 8 }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => {
              clearToken();
              setTokenInput("");
              alert("Token removed.");
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
