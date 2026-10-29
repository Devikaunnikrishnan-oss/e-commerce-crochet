
export const getCart = (userId) => {
  const savedCart = localStorage.getItem(
    `cart_${userId}`
  );

  if (savedCart) {
    return JSON.parse(savedCart);
  }

  return [];
};



export const saveCart = (userId, cartItems) => {
  localStorage.setItem(
    `cart_${userId}`,
    JSON.stringify(cartItems)
  );
};



export const clearUserCart = (userId) => {
  localStorage.removeItem(
    `cart_${userId}`
  );
};