import { combineReducers } from "redux";

import test from "./test";
import error from "./error";
import auth from "./auth";
import feed from "./feed";
import ask from "./ask";

export default combineReducers({
  test: test,
  error: error,
  auth: auth,
  feed: feed,
  ask: ask
});
