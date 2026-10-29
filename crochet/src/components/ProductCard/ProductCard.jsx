
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  loadWishlist,
} from "../../features/wishlistSlice";

import {
  getWishlist,
  saveWishlist,
} from "../../services/WishlistStorage";

import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [imageError, setImageError] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // Load the logged-in user's saved wishlist.
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedWishlist = getWishlist(user.id);
      dispatch(loadWishlist(savedWishlist));
    }
  }, [user, isAuthenticated, dispatch]);

  // Check whether this product is in the wishlist.
  const isWishlisted = wishlistItems.some(
    (item) => String(item.id) === String(product.id)
  );

  // Add or remove the product.
  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated || !user) {
      toast.error("Please login to use your wishlist.");
      navigate("/login");
      return;
    }

    const currentWishlist = getWishlist(user.id);

    const alreadyExists = currentWishlist.some(
      (item) => String(item.id) === String(product.id)
    );

    let updatedWishlist;

    if (alreadyExists) {
      updatedWishlist = currentWishlist.filter(
        (item) => String(item.id) !== String(product.id)
      );

      toast.success("Product removed from Wishlist!");
    } else {
      updatedWishlist = [
        ...currentWishlist,
        product,
      ];

      toast.success("Product added to Wishlist!");
    }

    // Save the updated wishlist for this user.
    saveWishlist(user.id, updatedWishlist);

    // Keep the complete Redux wishlist synchronized.
    dispatch(loadWishlist(updatedWishlist));
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-fallback">
            <span>Image unavailable</span>
            <small>{product.name}</small>
          </div>
        )}

        <button
          type="button"
          className={`wishlist-btn ${
            isWishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div className="product-card-content">
        <p className="product-category">
          {product.category}
        </p>

        <h3>{product.name}</h3>

        <p className="product-price">
          ₹{product.price}
        </p>

        <button
          type="button"
          className="view-product-btn"
          onClick={() =>
            navigate(`/products/${product.id}`)
          }
        >
          View Product
        </button>
      </div>
    </div>
  );
}

export default ProductCard;