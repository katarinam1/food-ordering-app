import classes from "./UserFavoritesIcon.module.css";
import { ReactComponent as Logo } from "./../../assets/heart.svg";
import { useState, Fragment, useContext } from "react";
import UserContext from "../../store/user-context";
import { useHistory } from "react-router-dom";
const UserFavoritesIcon = (props) => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  return (
    <Fragment>
      <div className={classes.dropdown}>
        <div className={classes.user}>
          <Logo
            style={{ width: "50%" }}
            fill="white"
            className={classes["heart-icon"]}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default UserFavoritesIcon;
