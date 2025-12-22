import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/storage";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onLogin = (e) => {
        e.preventDefault();
        // No checks as requested
        // Set a dummy token to satisfy the ProtectedRoute check
        setToken("dummy-auth-token");
        navigate("/admin");
    };

    return (
        <div className="page">
            <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="text-2xl font-bold">Admin Login</h2>
                <button className="button-ghost" onClick={() => navigate("/")}>
                    Back to Store
                </button>
            </div>

            <div className="card max-w-sm mx-auto mt-10 p-8">
                <form onSubmit={onLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold block mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="input"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold block mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="input"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button className="button-primary mt-2 w-full" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
