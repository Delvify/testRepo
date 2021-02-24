import {
  SET_CURRENT_USER,
  LOG_OUT_USER,
  UPDATE_CLIENT,
  SET_TEMP_USER,
} from "../actions/types";

const initialState = {
  user: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        user: payload,
      };
    case SET_TEMP_USER:
      return {
        ...state,
        tempUser: payload,
      };
    case LOG_OUT_USER:
      return {
        ...state,
        user: null,
      };
    case UPDATE_CLIENT:
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
}
