import queryString from "querystring";

const updateQuery = (props, newQuery) => {
  const path = props.location.pathname;
  let query = queryString.parse(props.location.search.substring(1));
  query = { ...query, ...newQuery};
  const qs = queryString.stringify(query);
  props.history.push(`${path}?${qs}`);
};

const getQuery = (props) => {
  const query = queryString.parse(props.location.search.substring(1));
  return query;
};

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const inputPattern = {
  email: {
    value: /^\S+@\S+$/i,
    message: 'Invalid email address',
  },
  password: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message: '• Minimum 8 characters • Contains: Lowercase letter, Uppercase letter, Number',
  },
  code: {
    value: /^[0-9]+$/,
    message: 'Invalid verification code',
  },
};

const dateFormat = () => {
  return "DD MMM YYYY hh:mm:ss"
}

export {
  updateQuery,
  getQuery,
  validateEmail,
  inputPattern,
  dateFormat,
}
