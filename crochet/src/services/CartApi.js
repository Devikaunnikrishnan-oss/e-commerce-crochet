import api from "./api";


export const getUserCart = (userId) => {
  return api.get(`/carts?userId=${userId}`);
};


export const createCart = (cart) => {
  return api.post("/carts", cart);
};



export const updateCart = (cartId, cart) => {
  return api.patch(`/cart/${cartId}`, cart);
};



export const deleteCart = (cartId) => {
  return api.delete(`/carts/${cartId}`);
};