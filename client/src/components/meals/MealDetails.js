// import Meals from "../../pages/Meals";
import classes from "./MealDetails.module.css";
const { useRef, useState, useEffect, Fragment } = require("react");

const MealDetails = (props) => {
  const cardReference = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(cardReference.current);
      }
    });
    observer.observe(cardReference.current);
  }, []);

  const viewHandler = () => {
    props.onView(props.id);
  };

  const classToUse = isVisible ? classes.visible : "";
  return (
    <div ref={cardReference} className={`${classes.card} ${classToUse} `}>
      <div className={classes["column-left"]}>
        <img
          className={classes.img}
          src={`/meals/${props.image}`}
          alt="pasta"
        />
        {props.specialOffer > 0 && (
          <Fragment>
            <div className={classes["offer-cont"]} />

            <div className={classes.offer}>
              Special offer - {props.specialOffer}$
            </div>
          </Fragment>
        )}
        <div className={classes.overlay}>
          <div className={classes.text}>
            <p className={classes.title}>{props.name}</p>
            <p className={classes.price}>{props.price}$</p>
            {/* <p onClick={viewHandler} className={classes.view}>
              View <br></br>more
            </p> */}
            <button onClick={viewHandler} className={classes.myButton}>
              view more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MealDetails;
