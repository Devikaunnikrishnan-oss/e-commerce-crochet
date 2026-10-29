import api from "./api";

export const getProducts = () => {
  return api.get("/products");
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const createProduct = (product) => {
  return api.post("/products", product);
};

export const updateProduct = (id, product) => {
  return api.patch(`/products/${id}`, product);
};