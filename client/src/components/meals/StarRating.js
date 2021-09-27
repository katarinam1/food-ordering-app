import { useState } from "react";
import classes from "./StarRating.module.css";

const StarRating = (props) => {
  const [hover, setHover] = useState(0);

  return (
    <div className={classes["star-rating"]}>
      {[...Array(5)].map((_star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={
              index <= (hover || props.rating) ? classes.on : classes.off
            }
            onClick={() => props.onClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(props.rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
