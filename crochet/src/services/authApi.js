import api from "./api";

export const registerUser = (user) => {
  return api.post("/users", user);
};

export const getUsers = () => {
  return api.get("/users");
};

export const updateUser = (id, user) => {
  return api.patch(`/users/${id}`, user);
};

