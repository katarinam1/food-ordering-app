import { useContext, useRef, useState, Fragment, useEffect } from 'react';
import StarRating from './StarRating';
import classes from './ReviewForm.module.css';
import UserReview from './UserReview';
import ReviewContext from './../../store/review-context';

const ReviewForm = (props) => {
  const reviewCtx = useContext(ReviewContext);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const review = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const postReviewHandler = async () => {
    try {
      setIsLoading(true);
      await reviewCtx.postReview(review, rating);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const updateReviewHandler = async () => {
    try {
      setIsLoading(true);
      await reviewCtx.updateReview(review, rating);
      setShowUpdateForm(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const deleteReviewHandler = async () => {
    try {
      setIsLoading(true);
      await reviewCtx.deleteReview();
      setRating(0);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const showUpdateFormHandler = () => {
    setShowUpdateForm(true);
    setRating(reviewCtx.currentUserReview.rating);
  };

  return (
    <div className={classes.container}>
      {isLoading ? (
        <div className={classes.loader} />
      ) : !reviewCtx.currentUserReview ||
        Object.keys(reviewCtx.currentUserReview).length === 0 ||
        showUpdateForm ? (
        <Fragment>
          <p className={classes.text}>Leave us a comment.</p>

          <form className={classes.form}>
            <div className={classes['input-container']}>
              <p className={classes['p-review']}>Your impressions:</p>
              <textarea
                className={classes.textarea}
                id="review"
                name="review"
                maxLength="40"
                rows="4"
                cols="50"
                ref={review}
                defaultValue={
                  showUpdateForm ? reviewCtx.currentUserReview.review : ''
                }
              ></textarea>
            </div>
            <div className={classes['input-container']}>
              <p className={classes['p-rating']}>Give us a rating:</p>
              <StarRating
                rating={rating}
                onClick={(index) => setRating(index)}
              />
            </div>
            <button
              onClick={(event) => {
                event.preventDefault();
                if (showUpdateForm) updateReviewHandler();
                else postReviewHandler();
              }}
              className={classes.myButton}
            >
              POST
            </button>
          </form>
        </Fragment>
      ) : (
        <UserReview
          onEdit={showUpdateFormHandler}
          onDelete={deleteReviewHandler}
        />
      )}
    </div>
  );
};

export default ReviewForm;
