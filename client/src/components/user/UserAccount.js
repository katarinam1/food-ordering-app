import classes from './UserAccount.module.css';
import picture from './../../assets/people.jpg';
import UserInfo from './UserInfo';
import UserOrders from './UserOrders';
import { useState } from 'react';
import UserFavorites from './UserFavorites';
const UserAccount = (props) => {
  const [showInfo, setShowInfo] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  return (
    <div className={classes.container}>
      <div className={classes.color}></div>
      <div className={classes.content}>
        <div className={classes.main}>
          <div className={classes['img-container']}>
            <img src={picture} alt="food" className={classes.img} />
          </div>
          <div className={classes.block}></div>
          <div className={classes.account}>
            <div className={classes.buttons}>
              <button
                onClick={() => {
                  setShowOrders(false);
                  setShowInfo(true);
                  setShowFavorites(false);
                }}
                className={classes.button}
              >
                Information
              </button>
              <button
                onClick={() => {
                  setShowOrders(true);
                  setShowInfo(false);
                  setShowFavorites(false);
                }}
                className={classes.button}
              >
                Orders
              </button>{' '}
              <button
                onClick={() => {
                  setShowFavorites(true);
                  setShowInfo(false);
                  setShowOrders(false);
                }}
                className={classes.button}
              >
                Favorites
              </button>
            </div>
            {showInfo && <UserInfo />}
            {showOrders && <UserOrders />}
            {showFavorites && <UserFavorites />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
