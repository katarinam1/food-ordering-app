import { useRef, Fragment, useContext } from 'react';
import Header from '../components/meals/Header';
import PaymentMessage from '../components/meals/PaymentMessage';
import { useParams, Route } from 'react-router';
import MealContainer from '../components/meals/MealContainer';
import RestContext from '../store/rest-context';

const Meals = () => {
  const restCtx = useContext(RestContext);
  const params = useParams();
  const menu = useRef(null);
  const menuHandler = () => {
    menu.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Fragment>
        <Route path={`/restaurants/${params.restId}/meals/success`} exact>
          <PaymentMessage />
        </Route>
        <Header onMenu={menuHandler} />
        <div ref={menu}></div>
        <MealContainer meals={restCtx.meals} />
      </Fragment>
    </div>
  );
};

export default Meals;
