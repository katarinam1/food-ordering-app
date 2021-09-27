import axios from 'axios';
const { useState, useEffect } = require('react');
const { default: UserContext } = require('./user-context');

const UserProvider = (props) => {
  const [userState, setUserState] = useState({
    name: '',
    photo: '',
    email: '',
    _id: '',
    role: '',
    deliveryAddress: {},
    phoneNumber: '',
    favorites: [],
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUserState({
        name: foundUser.name,
        photo: foundUser.photo,
        _id: foundUser._id,
        role: foundUser.role,
        email: foundUser.email,
        deliveryAddress: foundUser.deliveryAddress,
        phoneNumber: foundUser.phoneNumber,
        favorites: foundUser.favorites,
      });
    }
  }, []);

  const updateUserHandler = async (
    newName,
    newCoordinates,
    newAddress,
    newEmail,
    newPhoneNumber
  ) => {
    const deliveryGeoJson = {};
    if (newCoordinates && newAddress) {
      deliveryGeoJson.type = 'Point';
      deliveryGeoJson.coordinates = newCoordinates;
      deliveryGeoJson.address = newAddress;
    }
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/users/${userState._id}`,
        data: {
          name: newName || userState.name,
          deliveryAddress:
            (Object.keys(deliveryGeoJson).length !== 0 && deliveryGeoJson) ||
            userState.deliveryAddress,
          email: newEmail || userState.email,
          phoneNumber: newPhoneNumber || userState.phoneNumber,
        },
      });

      const { user } = response.data.data;
      const {
        name,
        photo,
        email,
        _id,
        role,
        deliveryAddress,
        favorites,
        phoneNumber,
      } = user;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name,
          photo,
          email,
          _id,
          role,
          deliveryAddress,
          favorites,
          phoneNumber,
        })
      );
      setUserState({
        name,
        favorites,
        photo,
        email,
        _id,
        role,

        deliveryAddress,
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data.message;
    }
  };

  const signupHandler = async (
    emailAdr,
    password,
    passwordConfirm,
    username,
    coordinates,
    address,
    phone
  ) => {
    const deliveryGeoJson = {};
    deliveryGeoJson.type = 'Point';
    deliveryGeoJson.coordinates = coordinates;
    deliveryGeoJson.address = address;
    try {
      const response = await axios({
        method: 'POST',
        url: '/api/v1/users/signup',
        data: {
          email: emailAdr,
          password,
          passwordConfirm,
          name: username,
          deliveryAddress: deliveryGeoJson,
          phoneNumber: phone,
        },
      });

      const { user } = response.data.data;
      const {
        name,
        photo,
        email,
        _id,
        role,
        deliveryAddress,
        favorites,
        phoneNumber,
      } = user;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name,
          photo,
          email,
          _id,
          role,
          favorites,
          deliveryAddress,
          phoneNumber,
        })
      );
      setUserState({
        name,
        favorites,
        photo,
        email,
        _id,
        role,
        deliveryAddress,
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      return error.response.data.message;
    }
  };

  const loginHandler = async (emailAdr, password) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: {
          email: emailAdr,
          password,
        },
      });

      const { user } = response.data.data;
      const {
        name,
        photo,
        email,
        _id,
        role,
        deliveryAddress,
        favorites,
        phoneNumber,
      } = user;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name,
          photo,
          email,
          _id,
          role,
          deliveryAddress,
          favorites,
          phoneNumber,
        })
      );
      setUserState({
        name,
        favorites,
        photo,
        email,
        _id,
        role,
        deliveryAddress,
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      return error.response.data.message;
    }
  };

  const logoutHandler = async () => {
    try {
      const existingCart = localStorage.getItem('cart');
      const foundCart = JSON.parse(existingCart);
      if (userState.role !== 'admin') {
        await updateCartHandler(foundCart._id);
        localStorage.removeItem('cart');
      }
      await axios({
        method: 'GET',
        url: `/api/v1/users/logout`,
      });
      localStorage.removeItem('user');
      setUserState({});
    } catch (error) {
      console.log(error.response);
    }
  };

  const updateCartHandler = async (cartId) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/carts/${cartId}`,
        data: {
          user: userState._id,
          status: 'completed',
        },
      });

      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const getUsersHandler = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/users/`,
      });
      return response.data.data.data;
    } catch (error) {
      console.log(error.response);
    }
  };

  const updatePasswordHandler = async (
    passwordCurrent,
    password,
    passwordConfirm
  ) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/users/updatePassword`,
        data: {
          passwordCurrent,
          password,
          passwordConfirm,
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data.message;
    }
  };

  const updateFavoriteHandler = async (favorite) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/users/updateFavorites`,
        data: {
          favorite: favorite,
        },
      });

      const { user } = response.data.data;

      const {
        name,
        photo,
        email,
        _id,
        role,
        deliveryAddress,
        favorites,
        phoneNumber,
      } = user;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name,
          photo,
          email,
          _id,
          role,
          deliveryAddress,
          favorites,
          phoneNumber,
        })
      );
      setUserState({
        name,
        favorites,
        photo,
        email,
        _id,
        role,
        deliveryAddress,
        phoneNumber,
      });
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const userContext = {
    name: userState.name,
    photo: userState.photo,
    email: userState.email,
    _id: userState._id,
    favorites: userState.favorites,
    getUsers: getUsersHandler,
    updateFavorites: updateFavoriteHandler,
    updatePassword: updatePasswordHandler,
    deliveryAddress: userState.deliveryAddress,
    phoneNumber: userState.phoneNumber,
    login: loginHandler,
    signup: signupHandler,
    logout: logoutHandler,
    update: updateUserHandler,
  };

  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
