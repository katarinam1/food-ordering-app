import { Fragment, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import RestContext from '../../store/rest-context';
import classes from './AdminMeals.module.css';

const AdminMeals = () => {
  const restCtx = useContext(RestContext);
  const history = useHistory();
  const name = useRef([]);
  const price = useRef([]);
  const specialOffer = useRef([]);
  const description = useRef([]);
  const ingredients = useRef([]);
  const tag = useRef([]);
  const photo = useRef([]);

  const updateMealHandler = async (i, id) => {
    const ingredientsArray = ingredients.current[i].value.split(',');
    const tagsArray = tag.current[i].value.split(',');

    const form = new FormData();

    ingredientsArray.forEach((ing) => {
      form.append('ingredients', ing.trim());
    });

    tagsArray.forEach((tag) => {
      form.append('tag', tag.trim());
    });

    form.append('name', name.current[i].value);
    form.append('price', +price.current[i].value);
    form.append('specialOffer', +specialOffer.current[i].value);
    form.append('description', description.current[i].value);
    form.append('photo', photo.current[i].files[0]);

    await restCtx.updateMeal(id, form);
    // history.go(0);
  };

  const deleteMealHandler = async (id) => {
    await restCtx.deleteMeal(id);
    history.go(0);
  };

  return (
    <Fragment>
      <div className={classes.container}>
        {restCtx.meals.map((meal, i) => (
          <div className={classes.card}>
            <form>
              <img
                className={classes['item-img']}
                src={`/meals/${meal.image}`}
                alt="food"
              ></img>

              <input
                className={classes.input}
                type="text"
                defaultValue={meal.name}
                ref={(el) => {
                  name.current.push(el);
                }}
              />
              <div className={classes.wrapper}>
                <p className={classes['p-card']}>price:</p>
                <input
                  className={classes['input-price']}
                  type="text"
                  defaultValue={meal.price}
                  ref={(el) => {
                    price.current.push(el);
                  }}
                />
                <span>$</span>
              </div>
              <p className={classes['p-card']}>specialOffer:</p>
              <input
                className={classes['input-price']}
                type="text"
                ref={(el) => {
                  specialOffer.current.push(el);
                }}
                defaultValue={meal.specialOffer ? meal.specialOffer : ''}
              />
              <span>$</span>
              <br></br>
              <p className={classes['p-card']}>ingredients:</p>
              <input
                className={classes['input-ing']}
                type="text"
                ref={(el) => {
                  ingredients.current.push(el);
                }}
                defaultValue={meal.ingredients.map((ing, i) => ` ${ing}`)}
              />
              <br></br>
              <input
                className={classes.input}
                type="file"
                name="photo"
                id="photo"
                ref={(el) => {
                  photo.current.push(el);
                }}
              />
              <p className={classes['tags']}>tags:</p>
              <input
                className={classes['input-ing']}
                type="text"
                ref={(el) => {
                  tag.current.push(el);
                }}
                defaultValue={meal.tag.map((tag, i) => ` ${tag}`)}
              />
              <br></br>
              <p className={classes['p-card-descrpition']}>description:</p>
              <textarea
                className={classes['input-des']}
                id="review"
                name="review"
                maxLength="150"
                rows="2"
                cols="50"
                style={{ fontFamily: 'Roboto' }}
                ref={(el) => {
                  description.current.push(el);
                }}
                defaultValue={meal.description}
              />
              <div className={classes.buttons}>
                <button
                  onClick={async (event) => {
                    event.preventDefault();
                    updateMealHandler(i, meal._id);
                  }}
                  className={classes.button}
                >
                  Update meal
                </button>
                <button
                  onClick={async (event) => {
                    event.preventDefault();
                    deleteMealHandler(meal._id);
                  }}
                  className={classes.button}
                >
                  Delete meal
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default AdminMeals;
