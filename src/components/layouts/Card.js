import * as React from 'react';
import styled from '@emotion/styled';
import Proptypes from 'prop-types';
import { color } from '../../utils/styleVariables';

const StyledCard = styled.div`
  padding: 27px 3.3% 27px 3.3%;
  background-color: ${color.background.content};
  border-radius: 10px;
  margin-bottom: 50px;
`;

const Card = ({ children, className }) => <StyledCard className={className}>{children}</StyledCard>;

Card.propTypes  = {
  className: Proptypes.string
};

export default Card
