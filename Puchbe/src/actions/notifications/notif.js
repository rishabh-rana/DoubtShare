export const handleForegroundNotif = data => {
  return dispatch => {
    console.log(data);
    dispatch({ type: "handleForegroundNotif", payload: data });
  };
};
