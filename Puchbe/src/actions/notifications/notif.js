export const handleForegroundNotif = data => {
  return dispatch => {
    console.log(data);
    dispatch({ type: "handleForegroundNotif", payload: data });
    dispatch({
      type: "throwerror",
      payload: {
        message: data.notification.body,
        color: "dodgerblue",
        duration: 6000,
        onClick: {
          action: "goToAnswer",
          id: data.data.questionId
        }
      }
    });
  };
};
