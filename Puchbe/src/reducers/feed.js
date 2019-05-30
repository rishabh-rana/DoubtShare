const reducer = (
  state = {
    data: [],
    paginate: {
      lastDoc: null,
      filter: null,
      feedDone: false
    },
    searchFilter: null
  },
  action
) => {
  //do something
  if (action.type === "getContinuedFeed") {
    return { ...state, data: [...state.data, ...action.payload, "askCard"] };
  }
  if (action.type === "paginateDoc") {
    return { ...state, paginate: action.payload };
  }
  if (action.type === "getNewFeed") {
    if (action.payload.length > 0) {
      return { ...state, data: [...action.payload, "askCard"] };
    } else {
      return { ...state, data: [...action.payload] };
    }
  }
  if (action.type === "setFilter") {
    return { ...state, searchFilter: action.payload };
  }
  return state;
};

export default reducer;
