import { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import classes from './Header.module.css';
import Tags from './Tags';
import CartIcon from '../cart/CartIcon';
import UserContext from '../../store/user-context';
import PlacesSearch from '../address/PlacesSearch';
import { useParams } from 'react-router';

const Header = (props) => {
  const [isShrunk, setShrunk] = useState(false);
  const history = useHistory();
  const [address, setAddress] = useState('delivery address');
  const userCtx = useContext(UserContext);
  const params = useParams();

  useEffect(() => {
    const checkAddressHandler = () => {
      const searchAddress = localStorage.getItem('search-address');
      if (!params.lat && !params.lng) {
        setAddress('delivery address');
      } else if (searchAddress) {
        const foundAddress = JSON.parse(searchAddress);
        setAddress(foundAddress.result);
      }
    };
    checkAddressHandler();

    window.addEventListener('scroll', shrunkHandler);
    return () => window.removeEventListener('scroll', shrunkHandler);
  }, [params.lat, params.lng]);

  const shrunkHandler = () => {
    setShrunk(() => {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      )
        return true;
      return false;
    });
  };

  const suggestionHandler = async (result, lat, lng, text) => {
    try {
      localStorage.setItem(
        'search-address',
        JSON.stringify({
          result,
        })
      );
      history.push(`/restaurants/address/${lat}/${lng}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header
      className={`${classes.header} ${classes['fade-in']} ${
        isShrunk && classes.shrunk
      }`}
    >
      <div className={classes.content}>
        <NavLink to="/home" className={classes.link}>
          Home
        </NavLink>
        <div className={classes.search}>
          <PlacesSearch
            onSearch={suggestionHandler}
            input={classes.input}
            placeholder={
              userCtx._id ? userCtx.deliveryAddress.address : address
            }
          />
        </div>
        <div className={classes.title}>Restaurants</div>{' '}
        <div className={classes.link}>
          <div className={classes.dropdown}>
            Categories
            <div className={classes['dropdown-content']}>
              <Tags />
            </div>
          </div>
        </div>
        <div className={classes.cart}>
          <CartIcon onSignin={props.onSignin} />
        </div>
      </div>
    </header>
  );
};

export default Header;
