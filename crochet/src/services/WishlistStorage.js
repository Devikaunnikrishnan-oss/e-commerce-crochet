export const getWishlist = (userId) => {
  const savedWishlist = localStorage.getItem(
    `wishlist_${userId}`
  );

  if (savedWishlist) {
    return JSON.parse(savedWishlist);
  }

  return [];
};

export const saveWishlist = (userId, wishlistItems) => {
  localStorage.setItem(
    `wishlist_${userId}`,
    JSON.stringify(wishlistItems)
  );
};

export const clearUserWishlist = (userId) => {
  localStorage.removeItem(`wishlist_${userId}`);
};
