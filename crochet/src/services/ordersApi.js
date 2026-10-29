import api from "./api";

export const createOrder = (order) => {
  return api.post("/orders", order);
};

export const getOrders = () => {
  return api.get("/orders");
};

export const updateOrder = (id, order) => {
  return api.patch(`/orders/${id}`, order);
};