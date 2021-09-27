import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import ReviewContext from './review-context';
import RestContext from './rest-context';

const ReviewProvider = (props) => {
  const restCtx = useContext(RestContext);

  const [reviewState, setReviewState] = useState({
    reviewsArray: [],
    currentUserReview: {},
  });
  useEffect(() => {
    const reviewHandler = async () => {
      const restId = findRestaurant();
      if (restId) {
        await fetchReviews(restId);
      }
    };
    reviewHandler();
  }, [restCtx.currentRestaurant._id]);

  const fetchReviews = async (id) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/restaurants/${id}/reviews`,
      });

      const { reviews } = response.data.data;
      handleReviews(reviews);
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleReviews = async (reviewsArr) => {
    const loggedInUser = localStorage.getItem('user');
    let review = {};
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      review = reviewsArr.find(
        (reviewEl) => reviewEl.user._id === foundUser._id
      );
    }
    setReviewState({
      reviewsArray: reviewsArr,
      currentUserReview: review,
    });
  };
  const postReviewHandler = async (review, rating) => {
    const restId = findRestaurant();
    try {
      await axios({
        method: 'POST',
        url: `/api/v1/restaurants/${restId}/reviews`,
        data: {
          review: review.current.value,
          rating,
        },
      });
      await fetchReviews(restId);
      updateRestHandler(restId);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const findRestaurant = () => {
    const foundRestaurant = localStorage.getItem('current-rest');
    if (foundRestaurant) {
      const currentRestaurant = JSON.parse(foundRestaurant);
      return currentRestaurant._id;
    }
  };

  const updateReviewHandler = async (review, rating) => {
    const restId = findRestaurant();
    try {
      await axios({
        method: 'PATCH',
        url: `/api/v1/restaurants/${restId}/reviews/${reviewState.currentUserReview._id}`,
        data: {
          review: review.current.value,
          rating,
        },
      });
      await fetchReviews(restId);
      updateRestHandler(restId);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const updateRestHandler = async (restId) => {
    const loggedInUser = localStorage.getItem('user');
    let lat,
      lng = '';
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      [lng, lat] = foundUser.deliveryAddress.coordinates;
    }
    await restCtx.updateCurrentRestaurant(restId, lat, lng);
  };
  const deleteReviewHandler = async () => {
    const restId = findRestaurant();
    try {
      await axios({
        method: 'DELETE',
        url: `/api/v1/restaurants/${restId}/reviews/${reviewState.currentUserReview._id}`,
      });
      await fetchReviews(restId);
      updateRestHandler(restId);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const getLatestHandler = () => {
    const topReviews = reviewState.reviewsArray.filter((el) => el.rating === 5);
    const topFiveLatest = topReviews
      .slice(Math.max(topReviews.length - 4, 0))
      .reverse();
    return topFiveLatest;
  };

  const reviewContext = {
    reviews: reviewState.reviewsArray,
    currentUserReview: reviewState.currentUserReview,
    postReview: postReviewHandler,
    updateReview: updateReviewHandler,
    deleteReview: deleteReviewHandler,
    getLatest: getLatestHandler,
  };

  return (
    <ReviewContext.Provider value={reviewContext}>
      {props.children}
    </ReviewContext.Provider>
  );
};

export default ReviewProvider;
