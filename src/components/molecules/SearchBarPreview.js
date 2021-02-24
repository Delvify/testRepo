import React, {useCallback, useRef} from 'react';
import styled from '@emotion/styled';
import propTypes from 'prop-types';
import SearchBar from "../atoms/SearchBar";
import Card from "../layouts/Card";

const StyledSearchBarPreview = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '&>img': {
    cursor: 'pointer',
    height : '30px',
    width : '30px',
    objectFit: 'contain',
  }
});

const StyledSearchBar = styled(SearchBar)({
  marginRight: '20px',
});

const SearchBarPreview = ({ className, icon, onFileUpload }) => {
  const uploadInput = useRef(null);

  const handleUploadButtonClick = useCallback(() => {
    uploadInput.current.click();
  }, [uploadInput]);

  const handleFileUpload = useCallback((e, r) => {
    const file = e.target.files[0];
    onFileUpload(file);
  }, []);

  return (
    <StyledSearchBarPreview className={className}>
      <StyledSearchBar />
      <img src={icon} onClick={onFileUpload ? handleUploadButtonClick : () => {}}/>
      <input type='file' accept="image/*" id="uploadInput" onChange={handleFileUpload} ref={uploadInput} hidden/>
    </StyledSearchBarPreview>
  )
};

SearchBarPreview.prototype = {
  icon: propTypes.string,
  onFileUpload: propTypes.func
};

SearchBarPreview.defaultProps = {
  icon: "https://delvify-recommendations-vendors.s3-ap-southeast-1.amazonaws.com/smart_vision_icon_1.svg",
  onFileUpload: () => {},
};

export default SearchBarPreview;
