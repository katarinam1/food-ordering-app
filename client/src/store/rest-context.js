import React from "react";

const RestContext = React.createContext({
  restaurants: [],
  totalCount: 0,
  currentRestaurant: {},
  meals: [],
  tags: [],
  getTags: async () => {},
  getRestaurant: async (id) => {},
  deleteMeal: async (id) => {},
  createMeal: async (data) => {},
  updateMeal: async (id, data) => {},
  updateRestaurant: async (id, data) => {},
  createRestaurant: async (data) => {},
  getRestaurants: async (tags, page, limit) => {},
  getRestaurantsWithin: async (lat, lng, page, limit) => {},
  setCurrent: (id) => {},
});

export default RestContext;
