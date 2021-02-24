import * as React from 'react';
import styled from '@emotion/styled';
import Proptypes from 'prop-types';
import { color } from '../../utils/styleVariables';

const StyledCardTitle = styled.div(
  {
    fontSize: '20px',
    lineHeight: '24px',
    color: color.text.primary,
    fontWeight: 'bold',
    marginBottom: '28px',
  },
  props => (
    props.hasButton ? {
      display: 'flex',
      alignItems: 'center',
    } : {}),
);

const StyledTitleWithButton = styled.div`
  margin-right: 18px
`;

const StyledTitleWithoutButton = styled.div`
  margin-top: 4px;
`;

const TitleWithButton = ({ children }) => <StyledTitleWithButton>{ children }</StyledTitleWithButton>;
const TitleWithoutButton = ({ children }) => <StyledTitleWithoutButton>{ children }</StyledTitleWithoutButton>;

const CardTitle = ({ Button, children, className }) =>
  <div>
    <StyledCardTitle hasButton={!!Button} className={className}>
      { Button ? <TitleWithButton>{ children }</TitleWithButton> : <TitleWithoutButton>{ children }</TitleWithoutButton> }
      { Button }
    </StyledCardTitle>
  </div>;

CardTitle.propTypes  = {
  className: Proptypes.string,
  Button: Proptypes.object
};

export default CardTitle
