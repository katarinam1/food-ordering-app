import classes from './CartIcon.module.css';
import { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import CartModal from '../../components/cart/CartModal';
import CartContext from '../../store/cart-context';
import { ReactComponent as Logo } from './../../assets/cart.svg';
import UserContext from '../../store/user-context';
import UserIcon from '../user/UserIcon';

const CartIcon = (props) => {
  const [showCart, setShowCart] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const colorIcon =
    !location.pathname.includes('address') &&
    !location.pathname.includes('user')
      ? 'white'
      : 'grey';
  const cartCtx = useContext(CartContext);
  const userCtx = useContext(UserContext);

  const showCartHandler = () => {
    setShowCart(true);
  };

  const notShowCartHandler = () => {
    setShowCart(false);
  };

  const logHandler = async (event) => {
    if (event.target.textContent === 'Sign in') {
      props.onSignin();
    } else if (event.target.textContent === 'Account') {
      history.push(`/user/account`);
    } else if (event.target.textContent === 'Log out') {
      await userCtx.logout();
      history.push('/home');
    }
  };

  return (
    <div className={classes['cart-search']}>
      <div
        className={classes['icon-wrapper']}
        onMouseEnter={showCartHandler}
        onMouseLeave={notShowCartHandler}
      >
        <div className={classes.icon}>
          <Logo
            stroke={colorIcon}
            fill={colorIcon}
            style={{ width: '90%' }}
          ></Logo>
        </div>
        <div className={classes.quantity}>
          <span>{cartCtx.mealsAmount()}</span>
          {showCart && <CartModal />}
        </div>
      </div>

      <div className={classes.log}>
        <button onClick={logHandler} className={classes['log-button']}>
          {userCtx._id ? (
            <UserIcon onClick={logHandler} color={colorIcon} />
          ) : (
            (location.pathname.includes('restaurant') ||
              location.pathname.includes('meals')) &&
            'Sign in'
          )}
        </button>
      </div>
    </div>
  );
};

export default CartIcon;
