import classes from "./PaymentMessage.module.css";
import { NavLink, useHistory } from "react-router-dom";

const PaymentMessage = () => {
  const history = useHistory();
  return (
    <div className={classes.message}>
      <div className={classes["message-content"]}>
        <span
          onClick={() => {
            const goBack = history.location.pathname.slice(0, -7);
            history.push(goBack);
          }}
          className={classes.close}
        >
          &times;
        </span>
        <p className={classes["message-title"]}>Success!</p>
        <p className={classes["message-type"]}>Order Placed</p>
        <p className={classes["message-description"]}>
          You can track your orders {"   "}
          <NavLink className={classes["order-link"]} to="/user/account">
            {" "}
            here
          </NavLink>
          .
        </p>
      </div>
    </div>
  );
};

export default PaymentMessage;
