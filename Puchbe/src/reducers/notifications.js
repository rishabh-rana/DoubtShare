const reducer = (
  state = {
    active: false,
    data: null
  },
  action
) => {
  //do something
  if (action.type === "handleForegroundNotif") {
    return { ...state, active: true, data: action.payload };
  }

  return state;
};

export default reducer;
