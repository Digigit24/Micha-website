import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ConfirmButton from "../../components/common/ConfirmButton";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import { useProducts, useProductMutations } from "../../hooks/products/useProducts";
import { clearToken } from "../../utils/storage";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { data: products, isLoading, isError, error, refetch } = useProducts();
    const { remove } = useProductMutations();

    const handleLogout = () => {
        clearToken();
        navigate("/login");
    };

    if (isLoading) return <div className="page"><Loading label="Loading inventory..." /></div>;
    if (isError) return <div className="page"><ErrorState title="Failed to load inventory" error={error} onRetry={refetch} /></div>;

    return (
        <div className="page">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        Manage store products and inventory.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/" className="button-ghost">View Store</Link>
                    <button onClick={handleLogout} className="button-ghost text-red-500">Logout</button>
                </div>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Products ({products?.length})</h2>
                    <Link to="/admin/products/new" className="button-primary">
                        + Add Product
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                                <th className="pb-3 pl-2">Product</th>
                                <th className="pb-3">Category</th>
                                <th className="pb-3">Price</th>
                                <th className="pb-3">Stock</th>
                                <th className="pb-3 pr-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((p) => (
                                <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-3 pl-2">
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</div>
                                    </td>
                                    <td className="py-3">{p.category}</td>
                                    <td className="py-3 font-mono">${p.price}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/products/${p.id}`} className="button-ghost text-xs">Edit</Link>
                                            <ConfirmButton
                                                confirmText="Delete this product?"
                                                onConfirm={() => remove.mutate(p.id)}
                                                disabled={remove.isPending}
                                                className="text-red-500"
                                            >
                                                Delete
                                            </ConfirmButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products?.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">No products found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
