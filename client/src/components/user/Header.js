import { Fragment, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Header.module.css';
import CartIcon from '../cart/CartIcon';
import UserContext from '../../store/user-context';
const Header = (props) => {
  const userCtx = useContext(UserContext);

  return (
    <Fragment>
      <div className={classes.cart}>
        <CartIcon onSignin={props.onSignin} />
      </div>
      <header className={`${classes.header} ${classes['fade-in']}  `}>
        <div className={classes.content}>
          <NavLink to="/home" className={classes.link}>
            Home
          </NavLink>

          {userCtx._id && (
            <NavLink
              to={`/restaurants/address/${userCtx.deliveryAddress.coordinates[1]}/${userCtx.deliveryAddress.coordinates[0]}`}
              className={classes.link}
            >
              Restaurants
            </NavLink>
          )}
          <div className={classes.title}>Hi, {userCtx.name}</div>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
