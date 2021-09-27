import classes from "./UserIcon.module.css";
import { ReactComponent as Logo } from "./../../assets/user.svg";
import { Fragment } from "react";
const UserIcon = (props) => {
  return (
    <Fragment>
      <div className={classes.dropdown}>
        <div className={classes.user}>
          <Logo
            style={{ width: "45%" }}
            fill={props.color}
            className={classes["home-icon"]}
          />
        </div>
        <div className={classes["dropdown-content"]}>
          <p onClick={props.onClick} className={classes.content}>
            Account
          </p>
          <p onClick={props.onClick} className={classes.content}>
            Log out
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default UserIcon;
