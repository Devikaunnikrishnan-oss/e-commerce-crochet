import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getUsers } from "../services/authApi";

import "./UserDetails.css";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await getUsers();

      const foundUser = response.data.find(
        (user) => user.id === id
      );

      if (!foundUser) {
        setError("User not found");
        return;
      }

      setUser(foundUser);
    } catch (error) {
      console.error(error);
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading user...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="user-details">

      <h1>User Details</h1>

      <div className="user-details-card">

        <h2>{user.name}</h2>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {user.isBlocked ? "Blocked" : "Active"}
        </p>

        <p>
          <strong>User ID:</strong> {user.id}
        </p>

        <button onClick={() => navigate("/admin/users")}>
          Back to Users
        </button>

      </div>

    </div>
  );
}

export default UserDetails;