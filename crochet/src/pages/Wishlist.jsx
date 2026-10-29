import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  loadWishlist,
  removeFromWishlist
} from "../features/wishlistSlice";

import "./Wishlist.css";
import { getWishlist, saveWishlist } from "../services/WishlistStorage";

function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  
  useEffect(() => {
    if (!user) return;

    const savedWishlist = getWishlist(user.id);

    dispatch(loadWishlist(savedWishlist));
  }, [user, dispatch]);

  

  const handleRemove = (id) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => String(item.id) !== String(id)
    );


    saveWishlist(user.id, updatedWishlist);

   
    dispatch(removeFromWishlist(id));

    toast.success("Removed from wishlist");
  };

  
  const handleViewProduct = (id) => {
    navigate(`/products/${id}`);
  };

  

  return (
    <div className="wishlist-page">

      
      <div className="wishlist-header">

        <p className="wishlist-subtitle">
          YOUR FAVOURITES
        </p>

        <h1>
          My Wishlist
        </h1>

        <span>
          Products you've saved for later
        </span>

      </div>

     

      {wishlistItems.length === 0 ? (

        <div className="wishlist-empty">

          <div className="empty-heart">
            ♡
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save your favourite crochet creations
            here and find them easily later.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Explore Products
          </button>

        </div>

      ) : (

        <>
         

          <p className="wishlist-count">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1
              ? "product"
              : "products"}{" "}
            saved
          </p>

          

          <div className="wishlist-grid">

            {wishlistItems.map((product) => (

              <div
                className="wishlist-card"
                key={product.id}
              >

                

                <div className="wishlist-image-container">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  

                  <button
                    className="wishlist-remove"
                    onClick={() =>
                      handleRemove(product.id)
                    }
                    title="Remove from wishlist"
                  >
                    ♥
                  </button>

                </div>

                

                <div className="wishlist-card-content">

                  <p className="wishlist-category">
                    {product.category}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="wishlist-price">
                    ₹{product.price}
                  </p>

                  

                  <div className="wishlist-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleViewProduct(product.id)
                      }
                    >
                      View Product
                    </button>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        handleRemove(product.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        </>

      )}

    </div>
  );
}

export default Wishlist;