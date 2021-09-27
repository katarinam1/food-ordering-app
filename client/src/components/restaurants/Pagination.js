import classes from './Pagination.module.css';
import { Fragment, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import RestContext from '../../store/rest-context';

const Pagination = (props) => {
  const params = useParams();
  const restCtx = useContext(RestContext);
  const [currentPage, setCurrentPage] = useState('1');

  const pagePickerHandler = async (event) => {
    let page = event.target.textContent;
    if (event.target.innerHTML === '«') page = '1';
    if (event.target.innerHTML === '»') page = Math.ceil(restCtx.totalCount / 5).toString();

    if (params.lat && params.lng) {
      const { lat, lng } = params;
      await restCtx.getRestaurantsWithin(lat, lng, '', page);
    } else {
      await restCtx.getRestaurants('', page);
    }

    setCurrentPage(page);
  };
  return (
    <Fragment>
      {Math.ceil(restCtx.totalCount / 5) >= 1 && (
        <div onClick={pagePickerHandler} className={classes.pagination}>
          <div
            className={`${classes.number}  
          }`}
          >
            &laquo;
          </div>
          {[...Array(Math.ceil(restCtx.totalCount / 5))].map((_, i) => (
            <div
              key={Math.random()}
              className={`${classes.number}  ${currentPage === `${i + 1}` ? classes.active : ''}`}
            >
              {i + 1}
            </div>
          ))}

          <div
            className={`${classes.number}   
          }`}
          >
            &raquo;
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Pagination;
