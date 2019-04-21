export const resolveError = () => {
  return dispatch => {
    console.log("resolved");
    dispatch({ type: "throwerror", payload: null });
  };
};

export const throwerror = errorBody => {
  return dispatch => {
    dispatch({ type: "throwerror", payload: errorBody });
  };
};
