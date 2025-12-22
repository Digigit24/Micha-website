import { dummyProducts } from "./dummyProducts";

const simulateNetwork = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 500);
    });
};

export const productsService = {
    list: async () => {
        return simulateNetwork(dummyProducts);
    },

    details: async (id) => {
        const product = dummyProducts.find((p) => p.id === id);
        return simulateNetwork(product);
    },

    create: async (payload) => {
        const newId = String(Date.now());
        const newProduct = { ...payload, id: newId, image: "https://via.placeholder.com/300" };
        dummyProducts.push(newProduct);
        return simulateNetwork(newProduct);
    },

    update: async ({ id, payload }) => {
        const index = dummyProducts.findIndex((p) => p.id === id);
        if (index !== -1) {
            dummyProducts[index] = { ...dummyProducts[index], ...payload };
            return simulateNetwork(dummyProducts[index]);
        }
        return simulateNetwork(null);
    },

    delete: async (id) => {
        const index = dummyProducts.findIndex((p) => p.id === id);
        if (index !== -1) {
            dummyProducts.splice(index, 1);
        }
        return simulateNetwork({ success: true, id });
    },
};
