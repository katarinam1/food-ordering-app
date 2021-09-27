import { Fragment, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import RestContext from '../../store/rest-context';
import classes from './AdminAddMeal.module.css';
import axios from 'axios';

const AdminAddMeal = () => {
  const restCtx = useContext(RestContext);
  const history = useHistory();
  const name = useRef();
  const price = useRef();
  const specialOffer = useRef();
  const description = useRef();
  const ingredients = useRef();
  const tag = useRef();
  const photo = useRef();

  const createMealHandler = async (event) => {
    event.preventDefault();
    const ingredientsArray = ingredients.current.value.split(',');
    const tagsArray = tag.current.value.split(',');

    const form = new FormData();

    ingredientsArray.forEach((ing) => {
      form.append('ingredients', ing.trim());
    });

    tagsArray.forEach((tag) => {
      form.append('tag', tag.trim());
    });
    form.append('name', name.current.value);
    form.append('price', +price.current.value);
    form.append('specialOffer', +specialOffer.current.value);
    form.append('description', description.current.value);
    form.append('photo', photo.current.files[0]);

    await restCtx.createMeal(form);
    // history.go(0);
  };

  //   beef, onion, garlic, cheddar cheese, mustard, tomato sauce
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.card}>
          <form>
            <p className={classes['p-card']}>name:</p>
            <input
              className={classes.input}
              type="text"
              ref={name}
              maxLength="30"
            />
            <div className={classes.wrapper}>
              <p className={classes['p-card']}>price:</p>
              <input
                className={classes['input-price']}
                type="text"
                ref={price}
              />
              <span>$</span>
            </div>
            <p className={classes['p-card']}>specialOffer:</p>
            <input
              className={classes['input-price']}
              type="text"
              ref={specialOffer}
            />
            <span>$</span>
            <br></br>
            <p className={classes['p-card']}>ingredients:</p>
            <input
              className={classes['input-ing']}
              type="text"
              ref={ingredients}
            />
            <br></br>
            <p className={classes['p-card']}>picture:</p>
            <input
              className={classes.input}
              type="file"
              name="photo"
              id="photo"
              ref={photo}
            />
            <br></br>
            <p className={classes['p-card']}>tags:</p>
            <input className={classes['input-ing']} type="text" ref={tag} />
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
              ref={description}
            />
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                createMealHandler(event);
              }}
              className={classes.button}
            >
              Add meal
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminAddMeal;
