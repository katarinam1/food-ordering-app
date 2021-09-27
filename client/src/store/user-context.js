import React from "react";

const UserContext = React.createContext({
  name: "",
  photo: "",
  email: "",
  _id: "",
  deliveryAddress: {},
  phoneNumber: "",
  role: "",
  favorites: [],
  getUsers: async () => {},
  login: async (email, password) => {},
  updateFavorites: async (favorite) => {},
  signup: async (
    email,
    password,
    passwordConfirm,
    username,
    coords,
    address
  ) => {},
  logout: async () => {},
  update: async () => {},
  updatePassword: async (currentPassword, password, passwordConfirm) => {},
});

export default UserContext;
