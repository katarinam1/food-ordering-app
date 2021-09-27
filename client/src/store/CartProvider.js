import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import CartContext from './cart-context';
import UserContext from './user-context';

const CartProvider = (props) => {
  const userCtx = useContext(UserContext);
  const [cartState, setCartState] = useState({
    meals: [],
    price: 0,
    status: '',
    _id: '',
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const existingCart = localStorage.getItem('cart');
    let foundUser;
    if (existingCart) {
      //cart waiting in localStorage
      const foundCart = JSON.parse(existingCart);
      if (loggedInUser) {
        foundUser = JSON.parse(loggedInUser);
      }
      if (
        foundUser &&
        foundUser.role !== 'admin' &&
        foundCart.status === 'new'
      ) {
        updateCartHandler('accepted', foundUser._id, foundCart._id);
      } else {
        fetchCartHandler(foundCart._id);
      }
    } else {
      createCart();
    }
  }, [userCtx._id]);

  const deleteCartHandler = async (id) => {
    try {
      await axios({
        method: 'DELETE',
        url: `/api/v1/carts/${id}`,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchCartHandler = async (id) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/carts/${id}`,
      });

      const { cart } = response.data.data;
      const { meals, price, _id, status } = cart;
      localStorage.setItem(
        'cart',
        JSON.stringify({ meals, price, _id, status })
      );

      setCartState({
        meals,
        price,
        _id,
        status,
      });
    } catch (error) {
      createCart();
    }
  };

  const createCart = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `/api/v1/carts`,
        data: {
          meals: [],
        },
      });

      const { cart } = response.data.data;
      const { meals, price, _id, status } = cart;

      localStorage.setItem(
        'cart',
        JSON.stringify({ meals, price, _id, status })
      );
      console.log('cart created');
      setCartState({
        meals,
        price,
        _id,
        status,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const calcMealsAmountHandler = () => {
    if (!cartContext.meals.length) return 0;
    const quantityArray = cartContext.meals.map((meal) => meal.quantity);
    const sum = quantityArray.reduce((acc, val) => acc + val, 0);
    return sum;
  };

  const addMealToCartHandler = async (id, quantity) => {
    //patch request, insertMeal
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/carts/${cartContext._id}/insertMeal`,
        data: {
          meal: id,
          quantity,
        },
      });
      const { cart } = response.data.data;
      const { meals, price, _id, status } = cart;
      setCartState({
        meals,
        price,
        _id,
        status,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const removeMealFromCartHandler = async (id) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/carts/${cartContext._id}/removeMeal`,
        data: {
          meal: id,
        },
      });
      const { cart } = response.data.data;
      const { meals, price, _id, status } = cart;
      localStorage.setItem(
        'cart',
        JSON.stringify({ meals, price, _id, status })
      );

      setCartState({
        meals,
        price,
        _id,
        status,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const orderHandler = async (stripePromise, distance) => {
    const stripe = await stripePromise;

    const response = await axios({
      method: 'POST',
      url: `/api/v1/carts/checkout-session/${cartContext._id}`,
      data: {
        distance,
      },
    });

    if (response.data.status === 'success') {
      await stripe.redirectToCheckout({
        sessionId: response.data.session.id,
      });
    }
  };

  const updateCartHandler = async (newStatus, userId, cartId) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/carts/${cartId}`,
        data: {
          user: userId,
          status: newStatus,
        },
      });
      const { cart } = response.data.data;
      const { meals, price, _id, status } = cart;
      setCartState({
        meals,
        price,
        _id,
        status,
      });

      localStorage.setItem(
        'cart',
        JSON.stringify({ meals, price, _id, status })
      );
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const getCartsHandler = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/carts/`,
      });
      const { carts } = response.data.data;

      return carts;
    } catch (error) {
      console.log(error.response);
    }
  };

  const deleteCompletedHandler = async () => {
    try {
      await axios({
        method: 'DELETE',
        url: `/api/v1/carts/deleteCompleted`,
      });
    } catch (error) {
      console.log(error.response);
    }
  };
  const deleteAbandonedHandler = async () => {
    try {
      await axios({
        method: 'DELETE',
        url: `/api/v1/carts/deleteAbandoned`,
      });
    } catch (error) {
      console.log(error.response);
    }
  };
  const cartContext = {
    meals: cartState.meals,
    price: cartState.price,
    _id: cartState._id,
    status: cartState.status,
    deleteCart: deleteCartHandler,
    deleteAbandoned: deleteAbandonedHandler,
    deleteCompleted: deleteCompletedHandler,
    getCarts: getCartsHandler,
    updateCart: cartState.updateCartHandler,
    mealsAmount: calcMealsAmountHandler,
    addMeal: addMealToCartHandler,
    removeMeal: removeMealFromCartHandler,
    fetchCart: fetchCartHandler,
    launchOrder: orderHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
