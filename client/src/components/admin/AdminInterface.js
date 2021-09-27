import classes from "./AdminInterface.module.css";
import { NavLink } from "react-router-dom";
const AdminInterface = (props) => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <NavLink
          activeClassName={classes.active}
          className={classes.link}
          to="/admin/orders"
        >
          Orders
        </NavLink>
        <NavLink
          activeClassName={classes.active}
          className={classes.link}
          to="/admin/carts"
        >
          Carts
        </NavLink>
        <NavLink
          activeClassName={classes.active}
          className={classes.link}
          to="/admin/coupons"
        >
          Coupons
        </NavLink>{" "}
        <NavLink
          activeClassName={classes.active}
          className={classes.link}
          to="/admin/restaurants"
        >
          Restaurants
        </NavLink>
        <NavLink
          activeClassName={classes.active}
          className={classes.link}
          to="/admin/users"
        >
          Users
        </NavLink>
      </div>
      <div className={classes.right}>{props.children}</div>
    </div>
  );
};

export default AdminInterface;
