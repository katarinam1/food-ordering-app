import { useState, Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RestContext from "../../store/rest-context";
import AdminAddRestaurant from "./AdminAddRestaurant";
import AdminAllRest from "./AdminAllRest";
import classes from "./AdminRest.module.css";

const AdminRest = () => {
  const restCtx = useContext(RestContext);
  const history = useHistory();

  const [showRest, setShowRest] = useState(false);
  const [showAddRest, setShowAddRest] = useState(false);

  return (
    <Fragment>
      <div>
        <button
          onClick={() => {
            setShowAddRest(false);
            setShowRest((prevValue) => !prevValue);
          }}
          className={classes.button}
        >
          {showRest ? "Hide restaurants" : "Show restaurants"}
        </button>
        <button
          onClick={() => {
            setShowAddRest((prevValue) => !prevValue);
            setShowRest(false);
          }}
          className={classes.button}
        >
          {showAddRest ? "Hide Form" : "Add a Restaurant"}
        </button>
        {showRest && <AdminAllRest />}
        {showAddRest && <AdminAddRestaurant />}
      </div>
    </Fragment>
  );
};

export default AdminRest;
