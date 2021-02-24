import React from 'react';
import styled from '@emotion/styled';
import PropTypes from "prop-types";
import { color } from '../../utils/styleVariables';
import { Button as ReactStrapButton } from 'reactstrap';

const StyledButton = styled(ReactStrapButton)(
  props => {
    switch(props.type){
      case 'default':
      default:
        return {
          borderRadius: '16px',
          padding: '8px 19px 8px 19px',
          fontSize: '11.3px',
          lineHeight: '15px',
          textAlign: 'center',
          fontWeight: '500',
          border: 0,
        };
    }
  },
  props => {
    let backgroundColor, bodyColor, focusColor, shadowColor;
    switch(props.color) {
      case 'primary':
      default:
        backgroundColor = color.button.primary;
        bodyColor =  color.text.white;
        focusColor = color.button.focus.primary;
        shadowColor = color.button.shadow.primary;
        break;
      case 'success':
        backgroundColor = color.button.success;
        bodyColor =  color.text.white;
        focusColor = color.button.focus.success;
        shadowColor = color.button.shadow.success;
        break;
      case 'info':
        backgroundColor = color.button.info;
        bodyColor =  color.text.white;
        focusColor = color.button.focus.info;
        shadowColor = color.button.shadow.info;
        break;
    }
    return {
      backgroundColor: backgroundColor,
      color: bodyColor,
      '&:hover,&:disabled,&:disabled': {
        backgroundColor: backgroundColor,
        opacity: 0.7,
      },
      '&:focus,&.focus, &:not(:disabled):not(.disabled):active, &:not(:disabled):not(.disabled):active:focus': {
        backgroundColor: focusColor,
        boxShadow: `0 0 0 0.2rem ${shadowColor}`,
      }
    };
  }
);

const Button = (props) => {
  const { className, loading, disabled, children, shape, ...attributes } = props;

  return (
    <StyledButton disabled={loading || disabled} className={className} {...attributes}>
      {
        loading ?
          <i className="fa fa-circle-o-notch fa-spin" /> : children
      }
    </StyledButton>
  )
};

Button.defaultProps = {
  loading: false,
  shape: 'default',
  color: 'primary',
};

Button.propTypes = {
  loading: PropTypes.bool,
  shape: PropTypes.oneOf(['default']),
  color: PropTypes.string,
};

export default Button;
