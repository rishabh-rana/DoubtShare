const reducer = (
  state = {
    data: [],
    paginate: {
      lastDoc: null,
      filter: null
    }
  },
  action
) => {
  //do something
  if (action.type === "getContinuedFeed") {
    return { ...state, data: [...state.data, ...action.payload] };
  }
  if (action.type === "paginateDoc") {
    return { ...state, paginate: action.payload };
  }
  if (action.type === "getNewFeed") {
    return { ...state, data: action.payload };
  }
  return state;
};

export default reducer;
