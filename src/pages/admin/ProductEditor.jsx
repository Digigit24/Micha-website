import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import { useProductDetails, useProductMutations } from "../../hooks/products/useProducts";

export default function ProductEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const { data: product, isLoading: isLoadingDetails, isError } = useProductDetails(id);
    const { create, update } = useProductMutations();

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        stock: "",
        image: "",
    });

    useEffect(() => {
        if (product && !isNew) {
            setForm({
                name: product.name || "",
                price: product.price || "",
                category: product.category || "",
                description: product.description || "",
                stock: product.stock || 0,
                image: product.image || "",
            });
        }
    }, [product, isNew]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };

        try {
            if (isNew) {
                await create.mutateAsync(payload);
            } else {
                await update.mutateAsync({ id, payload });
            }
            navigate("/admin");
        } catch (err) {
            console.error(err);
        }
    };

    const isSaving = create.isPending || update.isPending;

    if (!isNew && isLoadingDetails) return <div className="page"><Loading label="Loading product..." /></div>;
    if (!isNew && isError) return <div className="page"><ErrorState title="Product not found" /></div>;

    return (
        <div className="page">
            <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="text-2xl font-bold">{isNew ? "Add Product" : "Edit Product"}</h2>
                <Link to="/admin" className="button-ghost">Back to Dashboard</Link>
            </div>

            <form onSubmit={handleSubmit} className="card max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Product Name</label>
                        <input
                            name="name"
                            className="input w-full"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Category</label>
                        <input
                            name="category"
                            className="input w-full"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g. Electronics"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Price ($)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            className="input w-full"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Stock Quantity</label>
                        <input
                            name="stock"
                            type="number"
                            className="input w-full"
                            value={form.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Image URL</label>
                    <input
                        name="image"
                        className="input w-full"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        className="textarea w-full"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Link to="/admin" className="button-ghost">Cancel</Link>
                    <button
                        type="submit"
                        className="button-primary"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
