import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/products/useProducts";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";

export default function LandingPage() {
    const navigate = useNavigate();
    const { data: products, isLoading, isError, error, refetch } = useProducts();

    if (isLoading) return <div className="page"><Loading label="Loading store..." /></div>;
    if (isError) return <div className="page"><ErrorState title="Failed to load store" error={error} onRetry={refetch} /></div>;

    return (
        <div className="page">
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                        TechStuff Store
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                        Premium gadgets for modern life.
                    </p>
                </div>
                <div>
                    <button className="button-ghost" onClick={() => navigate("/login")}>
                        Admin Login
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                    <div key={product.id} className="card hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
                        <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">${product.price}</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 w-fit mb-2">
                            {product.category}
                        </span>
                        <p className="text-sm flex-grow mb-4" style={{ color: "var(--color-text-secondary)" }}>
                            {product.description}
                        </p>
                        <button className="button-primary w-full mt-auto">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
