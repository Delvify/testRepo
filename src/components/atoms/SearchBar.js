import React from 'react';
import styled from '@emotion/styled';
import searchIcon from '../../assets/img/search_icon.svg';

const StyledSearchBar = styled('div')({
  width: '42%',
  minWidth: '100px',
  maxWidth: '540px',
  height: '50px',
  paddingLeft: '16px',
  paddingRight: '16px',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #C4C4C4',
  background: '#FAFAFA',
  borderRadius: '5px',
  '&>img': {
    width : '30px'
  }
});

const SearchBar = ({ className }) => {
  return (
    <StyledSearchBar className={className}>
      <img src={searchIcon} />
    </StyledSearchBar>
  )
};

export default SearchBar;
