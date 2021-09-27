import classes from "./About.module.css";
import RestContext from "./../../store/rest-context";
import { useContext } from "react";

const About = () => {
  const restCtx = useContext(RestContext);

  let shippingRate = "";
  let message = "";

  if (restCtx.currentRestaurant.distance < 1) {
    shippingRate = 0;
    message = "Delivery is free for distances less than 1km";
  }

  if (
    restCtx.currentRestaurant.distance >= 1 &&
    restCtx.currentRestaurant.distance < 2
  ) {
    shippingRate = 1;

    message = "Delivery costs 1$ for distances between 1km and 2km";
  }
  if (
    restCtx.currentRestaurant.distance >= 2 &&
    restCtx.currentRestaurant.distance < 3
  ) {
    shippingRate = 2;
    message = "Delivery costs 2$ for distances between 2km and 3km";
  }

  if (restCtx.currentRestaurant.distance >= 3) {
    shippingRate = 3;
    message = "Delivery costs 3$ for distances over 3km";
  }

  return (
    restCtx.currentRestaurant && (
      <div className={classes.about}>
        <p className={classes.h1}>{restCtx.currentRestaurant.name}</p>
        <div className={classes.description}>
          {restCtx.currentRestaurant.description}
        </div>
        <div className={classes.location}>
          <span className={classes.span}>Location</span>
          <p>{restCtx.currentRestaurant.location.address}</p>
        </div>
        <div className={classes.hours}>
          <span className={classes.span}>Open Today</span>
          <p>{restCtx.currentRestaurant.workingTimeToday}</p>
        </div>
        <div className={classes.hours}>
          <span className={classes.span}>Delivery time:</span>
          <p>
            {restCtx.currentRestaurant.deliveryTimeFrom}-
            {restCtx.currentRestaurant.deliveryTimeTo} min
          </p>
        </div>
        <div className={classes.hours}>
          <span className={classes.span}>Delivery fee:</span>
          <p>
            {shippingRate}$ ({message})
          </p>
        </div>
      </div>
    )
  );
};

export default About;
