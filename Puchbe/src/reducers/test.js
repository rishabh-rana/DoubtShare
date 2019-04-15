const reducer = (
  state = {
    trial: 0
  },
  action
) => {
  //do something
  if (action.type === "test") {
    return { ...state, trial: state.trial + 1 };
  }
  return state;
};

export default reducer;
