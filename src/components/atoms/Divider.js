import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

const Divider = (props) => {
  const { mh, mv, color, height, vertical, children } = props;
  const marginHorizontal = `ml-${mh} mr-${mh}`;
  const marginVertical = `mt-${mv} mb-${mv}`;
  const heightPx = vertical ? '100%' : `${height}px`;
  const width = vertical ? '1px' : null;
  return (
    children ?
      <div className="d-flex flex-row align-items-center">
        <div
          className={classNames(marginHorizontal, marginVertical)}
          style={{ height: heightPx, width, flex: 1, backgroundColor: color }}
        />
        <div className="mr-3 ml-3" style={{ color }}>
        { children }
        </div>
        <div
          className={classNames(marginHorizontal, marginVertical)}
          style={{ height: heightPx, width, flex: 1, backgroundColor: color }}
        />
      </div> :
      <div
        className={classNames(marginHorizontal, marginVertical)}
        style={{ height: heightPx, width, backgroundColor: color }}
      />
  )
};

Divider.defaultProps = {
  mh: 0,
  mv: 0,
  color: '#e4e7ea',
  height: 1,
  vertical: false,
};

Divider.propTypes = {
  mh: PropTypes.number,
  mv: PropTypes.number,
  color: PropTypes.string,
  height: PropTypes.number,
  vertical: PropTypes.bool,
};

export default Divider;
