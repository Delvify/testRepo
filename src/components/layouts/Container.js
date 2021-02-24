import * as React from 'react';
import styled from '@emotion/styled';
import Proptypes from 'prop-types';

const StyledContainer = styled('div')(
  {
    width: '100%',
    height: '100%',
    paddingTop: '37px',
    paddingRight: '5.4%',
    paddingLeft: '5.4%',
  },
  ({ isHome }) => isHome ? { background: 'linear-gradient(89.92deg, #F3911A 51.59%, #F9CA24 99.96%)' } : {},
);

const Container = ({ children, className, isHome }) => {
  return (
    <StyledContainer className={className} isHome={isHome}>{children}</StyledContainer>
  );
};

Container.propTypes  = {
  className: Proptypes.string,
  onBoarding: Proptypes.bool,
};

export default Container
