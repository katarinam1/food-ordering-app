import React from "react";

const ReviewContext = React.createContext({
  reviews: [],
  currentUserReview: "",
  fetchReviews: async () => {},
  postReview: async () => {},
  updateReview: async () => {},
  deleteReview: async () => {},
  getLatest: () => {},
}); //fill up context with default data, will not be used, only for auto completion

export default ReviewContext;
