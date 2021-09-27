import { useContext, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Header.module.css';
import CartIcon from '../cart/CartIcon';
import UserContext from '../../store/user-context';

const Header = (props) => {
  const userCtx = useContext(UserContext);

  return (
    <header className={`${classes.header} ${classes['fade-in']} `}>
      <div className={classes.content}>
        <NavLink to="/home" className={classes.link}>
          Home
        </NavLink>
        {!userCtx._id && (
          <Fragment>
            <NavLink
              className={classes.link}
              activeClassName={classes.active}
              to="/login"
            >
              Log in
            </NavLink>
            <NavLink
              className={classes.link}
              activeClassName={classes.active}
              to="/signup"
            >
              Sign up
            </NavLink>
            <div className={classes.title}>Welcome</div>
          </Fragment>
        )}
        {userCtx._id && <div className={classes.title2}>Welcome</div>}
        <div className={classes.cart}>
          <CartIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
