import axios from 'axios';
import { useEffect, useState } from 'react';
import RestContext from './rest-context';

const RestProvider = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState({});
  const [meals, setMeals] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const foundRestaurant = localStorage.getItem('current-rest');
    fetchTags();

    if (foundRestaurant) {
      const currentRestaurant = JSON.parse(foundRestaurant);
      fetchMealsHandler(currentRestaurant._id);
      setCurrentRestaurant(currentRestaurant);
    }
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/restaurants`,
      });
      const restaurants = response.data.data.data;
      const tags = [...new Set(restaurants.map((rest) => rest.tags).flat())];
      setTags(tags);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCurrentRestaurantHandler = async (id, lat = '', lng = '') => {
    if (lat && lng) {
      fetchRestaurantDistance(id, lat, lng);
    } else fetchRestaurant(id);
  };

  const fetchRestaurantDistance = async (id, lat, lng) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/restaurants/${id}/distance/${lat},${lng}`,
      });

      const restaurant = response.data.data.data;
      await fetchMealsHandler(id);
      setCurrentRestaurant(restaurant);
      localStorage.setItem('current-rest', JSON.stringify(restaurant));
      return response;
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const fetchRestaurant = async (id) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/restaurants/${id}`,
      });

      const restaurant = response.data.data.data;
      await fetchMealsHandler(id);
      setCurrentRestaurant(restaurant);
      localStorage.setItem('current-rest', JSON.stringify(restaurant));
      return response;
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const fetchRestaurants = async (tag, page = 1, limit = 5) => {
    const filter = tag ? `tags=${tag}` : '';
    try {
      let addLimit = '';
      if (limit) addLimit = `&limit=${limit}`;
      const response = await axios({
        method: 'GET',
        url: `/api/v1/restaurants?${filter}&page=${page}${addLimit}`,
      });
      const restaurants = response.data.data.data;
      const totalCount = response.data.results;
      setRestaurants(restaurants);
      setTotalCount(totalCount);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRestaurantsWithin = async (lat, lng, tag, page = 1, limit = 5) => {
    const filter = tag ? `tags=${tag}` : '';
    try {
      let addLimit = '';
      if (limit) addLimit = `&limit=${limit}`;
      const response = await axios({
        method: 'GET',
        url: `/api/v1/restaurants/distances/${lat},${lng}?${filter}&page=${page}${addLimit}`,
      });
      const restaurants = response.data.data.data;
      const totalCount = response.data.results;
      setRestaurants(restaurants);
      setTotalCount(totalCount);
      return response;
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const fetchMealsHandler = async (id) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/restaurants/${id}/meals`,
      });

      setMeals(response.data.data.meals);
      localStorage.setItem(
        'current-meals',
        JSON.stringify(response.data.data.meals)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateMealHandler = async (id, data) => {
    try {
      await axios({
        method: 'PATCH',
        url: `/api/v1/meals/${id}`,
        data,
      });
      fetchMealsHandler(currentRestaurant._id);
    } catch (error) {
      console.log(error);
    }
  };

  const createMealHandler = async (data) => {
    try {
      await axios({
        method: 'POST',
        url: `/api/v1/restaurants/${currentRestaurant._id}/meals`,
        data,
      });
      fetchMealsHandler(currentRestaurant._id);
    } catch (error) {
      console.log(error.response);
    }
  };

  const deleteMealHandler = async (id) => {
    try {
      await axios({
        method: 'DELETE',
        url: `/api/v1/restaurants/${currentRestaurant._id}/meals/${id}`,
      });
      fetchMealsHandler(currentRestaurant._id);
    } catch (error) {
      console.log(error.response);
    }
  };

  const createRestaurantHandler = async (data) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `/api/v1/restaurants`,
        data,
      });
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const updateRestaurantHandler = async (id, data) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/restaurants/${id}`,
        data,
      });
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const restContext = {
    restaurants: restaurants,
    meals: meals,
    totalCount: totalCount,
    currentRestaurant: currentRestaurant,
    tags: tags,
    deleteMeal: deleteMealHandler,
    getRestaurants: fetchRestaurants,
    getRestaurantsWithin: fetchRestaurantsWithin,
    updateRestaurant: updateRestaurantHandler,
    updateCurrentRestaurant: updateCurrentRestaurantHandler,
    createRestaurant: createRestaurantHandler,
    updateMeal: updateMealHandler,
    createMeal: createMealHandler,
  };

  return (
    <RestContext.Provider value={restContext}>
      {props.children}
    </RestContext.Provider>
  );
};

export default RestProvider;
