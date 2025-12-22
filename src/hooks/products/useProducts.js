import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../../services/products/products.service";

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: productsService.list,
    });
}

export function useProductDetails(id) {
    return useQuery({
        queryKey: ["products", id],
        queryFn: () => productsService.details(id),
        enabled: !!id,
    });
}

export function useProductMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: productsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const update = useMutation({
        mutationFn: productsService.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products", data?.id] });
        },
    });

    const remove = useMutation({
        mutationFn: productsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return { create, update, remove };
}
