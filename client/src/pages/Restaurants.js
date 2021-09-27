import { Fragment, useEffect, useState, useContext, useRef } from 'react';
import Section from '../components/restaurants/Section';
import Header from '../components/restaurants/Header';
import RestContext from './../store/rest-context';
import { useParams } from 'react-router-dom';
import MapModal from './../components/restaurants/MapModal';
import UserContext from '../store/user-context';
import { useHistory } from 'react-router';

const Restaurants = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [restaurantMap, setRestaurantMap] = useState({
    name: '',
    coordinates: [],
    distance: '',
  });
  const params = useParams();
  const restCtx = useContext(RestContext);
  const signin = useRef();
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const loginHandler = async (email, password) => {
    try {
      const result = await userCtx.login(email, password);
      if (result.status === 'success') {
        window.scrollTo(0, 0);
        const [lng, lat] = result.data.user.deliveryAddress.coordinates;
        history.push(`/restaurants/address/${lat}/${lng}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mapModalHandler = (name, coordinates, distance) => {
    setRestaurantMap({
      name,
      coordinates,
      distance: distance.toFixed(2),
    });
    setShowModal(true);
  };

  const modalCloseHandler = () => {
    setShowModal(false);
  };

  const signPageHandler = () => {
    signin.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const updateRestaurants = async () => {
      const loggedInUser = localStorage.getItem('user');
      setIsLoading(true);
      if (params.lat && params.lng) {
        const { lat, lng } = params;
        await restCtx.getRestaurantsWithin(lat, lng);
        setIsLoading(false);
      } else if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        const [lng, lat] = foundUser.deliveryAddress.coordinates;
        await restCtx.getRestaurantsWithin(lat, lng);
        setIsLoading(false);
      } else {
        const searchAddress = localStorage.getItem('search-address');
        if (searchAddress) localStorage.removeItem('search-address');
        await restCtx.getRestaurants();
        setIsLoading(false);
      }
    };
    updateRestaurants();
  }, []);

  return (
    <Fragment>
      {showModal && (
        <MapModal
          onClose={modalCloseHandler}
          name={restaurantMap.name}
          coordinates={restaurantMap.coordinates}
          distance={restaurantMap.distance}
          userCoordinates={[params.lng, params.lat]}
        />
      )}
      <Header onSignin={signPageHandler} />
      {!isLoading && (
        <Section
          onLogin={loginHandler}
          reference={signin}
          onViewMap={mapModalHandler}
        />
      )}
    </Fragment>
  );
};

export default Restaurants;
