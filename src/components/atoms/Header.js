import * as React from 'react';
import styled from '@emotion/styled';
import Proptypes from 'prop-types';
import { color } from '../../utils/styleVariables';

const StyledHeader = styled.div({
    color: color.text.secondary,
    fontSize: '15px',
  },
  props => (
    props.type === 'main' ? {
      paddingLeft: '9px',
      paddingRight: '9px',
      marginBottom: '62px',
    }: {
      marginBottom: '20px',
    }),
);

const StyledTitleWrapper = styled.div(
  {
    fontWeight: 'bold',
  },
  props => ({
    marginBottom: props.type === 'main' ? '22px' : props.hasButton ? '7px' : '13px',
  }),
  props => (
    props.hasButton ? {
      display: 'flex',
      alignItems: 'center',
    } : {}),
);

const StyledTitle = styled.div(
  props => ({
    color: props.type === 'main' ? color.text.secondary : color.text.primary,
    fontSize: props.size === 'xl' ? '30px' : props.size === 'lg' ? '20px' : '15px'
  }),
  props => (
    props.hasButton ? {
      marginRight: '20px',
    } : {}),
);

const Description = styled.div`
  
`;

const Header = ({ type, size, title, Button, children, className }) =>
  <StyledHeader className={className} type={type}>
    <StyledTitleWrapper type={type} hasButton={!!Button}>
      <StyledTitle type={type} hasButton={!!Button} size={size}>{ title }</StyledTitle>
      { Button }
    </StyledTitleWrapper>
    <Description>{ children }</Description>
  </StyledHeader>;

Header.propTypes  = {
  className: Proptypes.string,
  title: Proptypes.string,
  description: Proptypes.string,
  type: Proptypes.oneOf(['main', 'default']),
  size: Proptypes.oneOf(['default', 'lg', 'xl']),
  Button: Proptypes.object,
};

Header.defaultProps  = {
  type: 'default',
  size: 'default',
};

export default Header
