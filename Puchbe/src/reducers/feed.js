const reducer = (
  state = {
    data: [],
    paginate: {
      lastDoc: null,
      filter: null
    },
    searchFilter: null
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
  if (action.type === "setFilter") {
    return { ...state, searchFilter: action.payload };
  }
  return state;
};

export default reducer;
