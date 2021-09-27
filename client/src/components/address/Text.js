import classes from "./Text.module.css";
import { Fragment, useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../../store/user-context";

const Text = (props) => {
  const userCtx = useContext(UserContext);
  return (
    <Fragment>
      <div className={classes["inner-cell"]}>
        <h2 className={classes["heading-home"]}>Please enter your delivery address</h2>

        {props.children}
        <div style={{ marginTop: "40px", marginLeft: "90px" }}>
          <div className={classes.icon}>
            <i className="fas fa-arrow-right"></i>
          </div>

          {userCtx._id ? (
            <NavLink to={`/restaurants/address/${userCtx.deliveryAddress.coordinates[1] && userCtx.deliveryAddress.coordinates[0] ? `${userCtx.deliveryAddress.coordinates[1]}/${userCtx.deliveryAddress.coordinates[0]}` : ""}`} className={classes.go}>
              or discover our restaurants
            </NavLink>
          ) : (
            <NavLink to={`/restaurants/address/`} className={classes.go}>
              or discover our restaurants
            </NavLink>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Text;
