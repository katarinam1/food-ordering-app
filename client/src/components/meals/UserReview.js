import classes from "./UserReview.module.css";
import { useContext } from "react";
import ReviewContext from "./../../store/review-context";
import UserContext from "./../../store/user-context";

const UserReview = (props) => {
  const reviewCtx = useContext(ReviewContext);
  return (
    <div className={classes["review-sent"]}>
      <p className={classes.message}>Thank you!</p>
      <p className={classes.after}>Your review:</p>
      <p className={classes.review}>"{reviewCtx.currentUserReview.review}"</p>
      <div className={classes.rating}>
        {[...Array(5)].map((_star, index) => {
          index += 1;
          return (
            <span
              key={Math.random()}
              className={
                index <= reviewCtx.currentUserReview.rating
                  ? classes.on
                  : classes.off
              }
            >
              &#9733;
            </span>
          );
        })}
        <div className={classes.button}>
          <button onClick={props.onEdit} className={classes.myButton}>
            edit
          </button>
          <button onClick={props.onDelete} className={classes.myButton}>
            delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
