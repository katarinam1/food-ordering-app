import React from "react";

const CartContext = React.createContext({
  meals: [],
  price: 0,
  _id: "",
  status: "",
  deleteCart: async (id) => {},
  getCarts: async () => {},
  deleteCompleted: async () => {},
  deleteAbandoned: async () => {},
  updateCart: async () => {},
  mealsAmount: () => {},
  addMeal: async (meal, quantity) => {},
  removeMeal: async (id) => {},
  fetchCart: async (cartId) => {},
  launchOrder: async () => {},
}); //fill up context with default data, will not be used, only for auto completion

export default CartContext;
