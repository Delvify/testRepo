import {
  SET_CURRENT_USER,
  LOG_OUT_USER,
  UPDATE_CLIENT, SET_TEMP_USER,
} from "./types";
import { Auth, API, graphqlOperation } from 'aws-amplify';

// import API, { graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../graphql/mutations";

export const setCurrentUser = (user) => async dispatch => {
  try {
    await API.graphql(graphqlOperation(mutations.updateUser, { input: { id: user.username, lastLogin: (new Date).toISOString() } }));
  } catch (e) {
    console.error('Store Error', e);
  }
  dispatch({
    type: SET_CURRENT_USER,
    payload: user,
  });
  return Promise.resolve();
};

export const setTempUser = (tempUser) => dispatch => {
  dispatch({
    type: SET_TEMP_USER,
    payload: tempUser,
  });
  return Promise.resolve();
};

export const logoutUser = () => async dispatch => {
  await Auth.signOut();
  await dispatch({
    type: LOG_OUT_USER,
  });
};

export const updateClient = () => dispatch => {
  localStorage.removeItem("jwtToken");
  dispatch({
    type: UPDATE_CLIENT,
  });
  return Promise.resolve();
};
