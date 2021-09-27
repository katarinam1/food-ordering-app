import { Fragment, useRef, useState, useEffect, useContext } from "react";
import MealDetails from "./MealDetails";
import classes from "./MealContainer.module.css";
import LoginFormRest from "./../auth/LoginFormRest";
import MealModal from "./MealModal";
import UserContext from "./../../store/user-context";
import ReviewForm from "./ReviewForm";
import About from "./About";

const RestContainer = (props) => {
  const userCtx = useContext(UserContext);

  let tags = props.meals.map((meal) => meal.tag);
  tags = [...new Set(tags.flat(1))];

  const [openModal, setOpenModal] = useState(false);
  const [currentMeal, setCurrentMeal] = useState({});
  const tagRefs = useRef([]);
  const menuRef = useRef();
  const mealboxRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(mealboxRef.current);
      }
    });
    observer.observe(mealboxRef.current);
  }, []);

  const scrollToTag = (index) => {
    tagRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openModalHandler = (id) => {
    const [meal] = props.meals.filter((meal) => meal._id === id);
    setCurrentMeal(meal);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
  };

  const classToUse = isVisible ? classes["fade-in"] : "";

  return (
    <Fragment>
      <div className={`${classes.menu} ${classToUse}`}>
        <div className={classes.tags}></div>
        <ul className={classes.container} ref={menuRef}>
          <div className={classes.tagwrapper} ref={mealboxRef}>
            {tags.map((tag, i) => (
              <button
                onClick={() => {
                  scrollToTag(i);
                }}
                className={classes.tag}
              >
                {tag}
              </button>
            ))}
          </div>
          {tags.map((tag) => {
            const meals = props.meals.filter((meal) => meal.tag.includes(tag));
            return (
              <div
                ref={(el) => {
                  tagRefs.current.push(el);
                }}
                className={classes.mealbox}
              >
                <h1 className={classes.boxtitle}>{tag}</h1>
                <div className={classes["column-wrapper"]}>
                  {meals.map((meal) => (
                    <li className={classes.column}>
                      <MealDetails
                        id={meal._id}
                        key={meal._id}
                        description={meal.description}
                        name={meal.name}
                        price={meal.price}
                        image={meal.image}
                        specialOffer={meal.specialOffer}
                        onView={openModalHandler}
                      />
                    </li>
                  ))}
                </div>
              </div>
            );
          })}
        </ul>
        {openModal && (
          <MealModal meal={currentMeal} onClose={closeModalHandler} />
        )}
        <div className={classes.tags}></div>
      </div>

      <div
        ref={props.reference}
        className={classes.sign}
        // style={{
        //   backgroundImage:
        //     "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(/meals/cover.jpg)",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center",
        // }}
      >
        {!userCtx._id ? (
          <LoginFormRest onLogin={props.onLogin} />
        ) : (
          <div className={classes.bottom}>
            <div className={classes.about}>
              <About />
            </div>
            <div className={classes.review}>
              <ReviewForm />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default RestContainer;
