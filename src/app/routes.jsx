import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import LandingPage from "../pages/shop/LandingPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductEditor from "../pages/admin/ProductEditor";
import { getToken } from "../utils/storage";
import { Navigate } from "react-router-dom";

// Simple Protected Route wrapper
const ProtectedRoute = ({ children }) => {
    const token = getToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <Login /> },

    // Admin Routes
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminDashboard />
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/products/new",
        element: (
            <ProtectedRoute>
                <ProductEditor />
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/products/:id",
        element: (
            <ProtectedRoute>
                <ProductEditor />
            </ProtectedRoute>
        )
    },
]);
