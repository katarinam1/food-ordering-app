import classes from "./UserFavorites.module.css";
import UserContext from "./../../store/user-context";
import { Fragment, useContext, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import RestContext from "../../store/rest-context";

const UserFavorites = (props) => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const restCtx = useContext(RestContext);

  return (
    <div className={classes.container}>
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Restaurant</th>
            <th>Address</th>
          </tr>
          {userCtx.favorites &&
            userCtx.favorites.map((fav) => {
              return (
                <tr>
                  <td>
                    <Fragment>
                      <button
                        className={classes.link}
                        onClick={async () => {
                          const [lng, lat] =
                            userCtx.deliveryAddress.coordinates;
                          await restCtx.updateCurrentRestaurant(
                            fav.id,
                            lat,
                            lng
                          );
                          history.push(`/restaurants/${fav.id}/meals`);
                        }}
                      >
                        {fav.name}
                      </button>
                      <img
                        className={classes["item-img"]}
                        src={`/restaurants/${fav.imageCover}`}
                        alt="food"
                      ></img>
                    </Fragment>
                  </td>
                  <td>{fav.location.address}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default UserFavorites;
