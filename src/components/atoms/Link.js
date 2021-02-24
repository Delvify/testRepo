import React from 'react';
import PropTypes from 'prop-types';
import { Link as LinkRouter } from 'react-router-dom';

const Link = ({ to, ...props }) => {
    return /^https?:\/\//.test(to) ?
      <a
        href={to}
        target={props.target || '_blank'}
        {...props}
      />
      :
      <LinkRouter to={to} {...props} />;
};

Link.propTypes = {
  to: PropTypes.string,
};

export default Link;
