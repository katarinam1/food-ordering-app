import { useContext, useEffect, useState, Fragment, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import classes from './Header.module.css';
import CartIcon from '../cart/CartIcon';
import RestContext from './../../store/rest-context';
import ReviewContext from './../../store/review-context';
import UserContext from '../../store/user-context';
import UserFavoritesIcon from '../user/UserFavoritesIcon';

const Header = (props) => {
  const restCtx = useContext(RestContext);
  const reviewCtx = useContext(ReviewContext);
  const userCtx = useContext(UserContext);
  const [favorite, setFavorite] = useState({
    status: false,
    pathExtracted: '',
  });

  useEffect(() => {
    let cancelled = false;
    let status;
    if (!cancelled) {
      status =
        userCtx && userCtx.favorites
          ? userCtx.favorites.some((el) => {
              console.log(el);
              return el._id === restCtx.currentRestaurant._id;
            })
          : false;
      let path = document.getElementById('heart');

      if (status) {
        const emptyPath = path.getAttribute('d');
        const fillPath = emptyPath.split(/\s{2}/);
        path.setAttribute('d', fillPath[0]);
        setFavorite({
          status: true,
          pathExtracted: fillPath[1],
        });
      }
    }
    return () => {
      cancelled = true;
    };
  }, [restCtx.currentRestaurant._id]);

  const favoriteHandler = async () => {
    let path = document.getElementById('heart');

    if (!favorite.status) {
      const emptyPath = path.getAttribute('d');
      const fillPath = emptyPath.split(/\s{2}/);
      path.setAttribute('d', fillPath[0]);
      setFavorite({
        status: true,
        pathExtracted: fillPath[1],
      });
    }
    if (favorite.status) {
      const fillPath = path.getAttribute('d');
      const emptyPath = fillPath.concat(`  ${favorite.pathExtracted}`);
      path.setAttribute('d', emptyPath);
      setFavorite({ status: false, pathExtracted: '' });
    }

    await userCtx.updateFavorites(restCtx.currentRestaurant);
  };

  return (
    <Fragment>
      <div className={classes.cart}>
        {userCtx._id && (
          <div onClick={favoriteHandler} className={classes.heart}>
            <UserFavoritesIcon />
          </div>
        )}
        <CartIcon />
      </div>
      <div className={classes.border}>
        <header
          className={`${classes.header} ${classes['fade-in']}  `}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08)),  url(/restaurants/restoran44.jpg)`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className={classes.content}>
            <NavLink to="/home" className={classes.link}>
              Home
            </NavLink>
            <div className={classes.title}></div>
          </div>
          <div onClick={props.onMenu} className={classes.menu}>
            Menu
          </div>
          <div className={classes['reviews-left']}>
            {reviewCtx.getLatest().map((el) => (
              <p key={el._id} className={classes.reviews}>
                "{el.review}"
              </p>
            ))}
          </div>
          <div className={classes['reviews-right']}>
            <p className={classes['rating-title']}>rating:</p>
            <div className={classes.stars}>
              {[...Array(5)].map((_star, index) => {
                index += 0.5;
                return index <= restCtx.currentRestaurant.ratingsAverage ? (
                  <i
                    key={Math.random()}
                    className={`fa fa-star ${classes.star}`}
                    aria-hidden="true"
                  />
                ) : (
                  <i
                    key={Math.random()}
                    className={`fa fa-star-o ${classes.star}`}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
          </div>
        </header>
      </div>
    </Fragment>
  );
};

export default Header;
